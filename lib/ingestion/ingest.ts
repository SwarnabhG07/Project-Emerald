import { prisma } from "@/lib/db";
import { getSources } from "./registry";
import { cleanScheme } from "./cleaner";
import type { CleanedScheme, RawScheme } from "./types";
import { slugify } from "./normalize";
import { rebuildEmbeddings } from "@/lib/rag/embed-store";
import type { SchemeVersion } from "@prisma/client";

export interface IngestionSummary {
  runId: string;
  status: "completed" | "failed";
  stats: { fetched: number; created: number; updated: number; skipped: number; failed: number };
  details: string[];
  embedded?: number;
}

/** Run-local duplicate index — built once, O(1) lookups per record */
interface SchemeLookup {
  byExternalId: Map<string, string>;
  bySlug: Map<string, string>;
}

async function buildSchemeLookup(): Promise<SchemeLookup> {
  const all = await prisma.scheme.findMany({
    select: { id: true, name: true, externalId: true },
  });
  return {
    byExternalId: new Map(
      all.filter((s) => s.externalId).map((s) => [s.externalId as string, s.id])
    ),
    bySlug: new Map(all.map((s) => [slugify(s.name), s.id])),
  };
}

export async function runIngestion(
  opts: { sources?: string[]; reembed?: boolean } = {}
): Promise<IngestionSummary> {
  const run = await prisma.ingestionRun.create({
    data: { sources: (opts.sources?.length ? opts.sources : ["all"]).join(",") },
  });
  const stats = { fetched: 0, created: 0, updated: 0, skipped: 0, failed: 0 };
  const details: string[] = [];
  const touched = new Set<string>();
  let status: "completed" | "failed" = "completed";

  try {
    const adapters = getSources(opts.sources);
    if (adapters.length === 0) details.push("No sources matched the filter");

    const lookup = await buildSchemeLookup();

    for (const adapter of adapters) {
      let raws: RawScheme[] = [];
      try {
        raws = await adapter.fetch();
      } catch (e) {
        details.push(`${adapter.id}: fetch failed — ${(e as Error).message}`);
        continue;
      }

      for (const raw of raws) {
        stats.fetched++;
        try {
          const cleaned = cleanScheme(raw, adapter.id);
          if (!cleaned) { stats.skipped++; continue; }
          const { schemeId, action } = await upsertCleanedScheme(cleaned, adapter.id, lookup);
          stats[action]++;
          if (action !== "skipped") touched.add(schemeId);
        } catch (e) {
          stats.failed++;
          details.push(`${adapter.id}: upsert failed for "${raw.name || "unknown"}" — ${(e as Error).message}`);
        }
      }
    }
  } catch (e) {
    status = "failed";
    details.push((e as Error).message);
  }

  let embedded: number | undefined;
  if (opts.reembed !== false && touched.size > 0) {
    try {
      embedded = await rebuildEmbeddings([...touched]);
    } catch (e) {
      details.push(`embedding rebuild failed: ${(e as Error).message}`);
    }
  }

  await prisma.ingestionRun.update({
    where: { id: run.id },
    data: { status, ...stats, error: details.join(" | ") || null, finishedAt: new Date() },
  });

  return { runId: run.id, status, stats, details, embedded };
}

async function upsertCleanedScheme(
  c: CleanedScheme,
  sourceId: string,
  lookup: SchemeLookup
): Promise<{ schemeId: string; action: "created" | "updated" | "skipped" }> {
  const existingId =
    (c.externalId ? lookup.byExternalId.get(c.externalId) : undefined) ||
    lookup.bySlug.get(slugify(c.name)) ||
    null;
  const existing = existingId
    ? await prisma.scheme.findUnique({ where: { id: existingId } })
    : null;
  if (!existing) {
    const scheme = await prisma.scheme.create({
      data: {
        externalId: c.externalId,
        name: c.name,
        ministry: c.ministry,
        state: c.state,
        category: c.category,
        description: c.description,
        source: sourceId,
        sourceUrl: c.sourceLink,
        sourceLastUpdated: c.lastUpdated,
        searchText: c.text,
        isActive: false, // Set to false to require admin approval
        versions: { create: versionData(c, 1, "pipeline") },
      },
    });
    // keep the run-local index in sync
    lookup.bySlug.set(slugify(c.name), scheme.id);
    if (c.externalId) lookup.byExternalId.set(c.externalId, scheme.id);
    return { schemeId: scheme.id, action: "created" };
  }
  const latest = await prisma.schemeVersion.findFirst({
    where: { schemeId: existing.id },
    orderBy: { version: "desc" },
  });
  const changed = !latest || versionChanged(latest, c);
  const nextVersion = (latest?.version || 0) + 1;
  await prisma.scheme.update({
    where: { id: existing.id },
    data: {
      name: c.name,
      ministry: c.ministry,
      state: c.state,
      category: c.category,
      description: c.description,
      source: sourceId,
      sourceUrl: c.sourceLink,
      sourceLastUpdated: c.lastUpdated,
      searchText: c.text,
      lastConfirmed: new Date(),
      // Don't change isActive on updates — already-approved schemes stay approved
      ...(changed
        ? { currentVersion: nextVersion, externalId: c.externalId ?? existing.externalId }
        : {}),
    },
  });
  if (changed) {
    await prisma.schemeVersion.create({
      data: { schemeId: existing.id, ...versionData(c, nextVersion, "pipeline") },
    });
    lookup.bySlug.set(slugify(c.name), existing.id);
    if (c.externalId) lookup.byExternalId.set(c.externalId, existing.id);
  }
  return { schemeId: existing.id, action: changed ? "updated" : "skipped" };
}

function versionData(c: CleanedScheme, version: number, changedBy: string) {
  return {
    version,
    benefit: c.benefits,
    benefitAmount: c.benefitAmount,
    eligibilityText: c.eligibility,
    eligibilityRules: JSON.stringify(c.eligibilityRules ?? null),
    documentsNeeded: JSON.stringify(c.documentsRequired),
    deadline: c.deadline,
    link: c.sourceLink,
    changedBy,
  };
}

function versionChanged(latest: SchemeVersion, c: CleanedScheme): boolean {
  return (
    latest.benefit !== c.benefits ||
    latest.benefitAmount !== c.benefitAmount ||
    latest.eligibilityText !== c.eligibility ||
    latest.eligibilityRules !== JSON.stringify(c.eligibilityRules ?? null) ||
    latest.documentsNeeded !== JSON.stringify(c.documentsRequired) ||
    (latest.deadline?.toISOString() || null) !== (c.deadline?.toISOString() || null) ||
    (latest.link || null) !== (c.sourceLink || null)
  );
}