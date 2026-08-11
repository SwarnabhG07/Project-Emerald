import { prisma } from "@/lib/db";
import { evaluateRule, type EvaluationResult } from "@/lib/rules/engine";
import { buildActions } from "@/lib/matcher/actions";
import { hybridRank } from "./hybrid";
import type { MatchResult, NearMissResult, HybridMatchResponse } from "@/types";
import type { Profile } from "@prisma/client";

const MAX_CANDIDATES = 100;

/**
 * Hybrid RAG matching pipeline:
 *  Stage 1 — structural pre-filter (state jurisdiction)
 *  Stage 2 — recall: hybrid retrieval (BM25 + semantic + document readiness)
 *  Stage 3 — precision: JSON-Logic rule evaluation on top candidates
 *  Stage 4 — explainable ranking
 */
export async function hybridMatchForFarmer(farmerId: string): Promise<HybridMatchResponse> {
  const profile = await prisma.profile.findUnique({ where: { farmerId } });
  if (!profile) throw new Error("Farmer profile not found");

  const documents = await prisma.document.findMany({
    where: { farmerId },
    select: { type: true },
  });
  const uploadedDocTypes = new Set(documents.map((d) => d.type));

  // Stage 1 — load active schemes (latest version + stored embeddings), filter by state
  const schemes = await prisma.scheme.findMany({
    where: { isActive: true },
    include: { versions: { orderBy: { version: "desc" }, take: 1 }, embeddings: true },
  });
  const inState = schemes.filter((s) => !s.state || !profile.state || s.state === profile.state);

  // Stage 2 — hybrid retrieval
  const queryText = buildFarmerQueryText(profile);
  const storedEmbeddings = new Map<string, number[]>();
  for (const s of inState) {
    const v = s.versions[0];
    if (!v) continue;
    const emb = s.embeddings.find((e) => e.version === v.version);
    if (emb) {
      try { storedEmbeddings.set(s.id, JSON.parse(emb.vector)); } catch { /* stale vector */ }
    }
  }

  const ranked = await hybridRank({
    queryText,
    schemes: inState.map((s) => ({
      id: s.id,
      searchText: s.searchText || fallbackText(s.name, s.description, s.versions[0]),
      requiredDocs: s.versions[0] ? safeJsonArray(s.versions[0].documentsNeeded) : [],
    })),
    uploadedDocs: uploadedDocTypes,
    storedEmbeddings,
  });
  const scoreMap = new Map(ranked.map((r) => [r.schemeId, r]));

  // Stage 3 — rule evaluation on top candidates
  const topIds = new Set(ranked.slice(0, MAX_CANDIDATES).map((r) => r.schemeId));
  const context = buildContext(profile);
  const eligible: MatchResult[] = [];
  const nearMiss: NearMissResult[] = [];

  for (const scheme of inState) {
    if (!topIds.has(scheme.id)) continue;
    const v = scheme.versions[0];
    if (!v) continue;

        const rules = safeJsonParse(v.eligibilityRules);
    const evaluation: EvaluationResult = rules
      ? evaluateRule(rules, context)
      : {
          eligible: true,
          failedConditions: [],
          passedConditions: ["No automated rules — manual verification required"],
          failures: [],
        };
    const docsNeeded: string[] = safeJsonArray(v.documentsNeeded);
    const ranking = scoreMap.get(scheme.id);

    const base: MatchResult = {
      schemeId: scheme.id,
      schemeName: scheme.name,
      ministry: scheme.ministry,
      state: scheme.state,
      benefit: v.benefit,
      benefitAmount: v.benefitAmount,
      deadline: v.deadline?.toISOString() || null,
      link: v.link,
      eligibilityVersion: v.version,
      requiredDocuments: docsNeeded,
      uploadedDocuments: docsNeeded.filter((d) => uploadedDocTypes.has(d)),
      missingDocuments: docsNeeded.filter((d) => !uploadedDocTypes.has(d)),
      matchScore: ranking?.score ?? 0,
      signals: ranking?.signals ?? null,
    };

    if (evaluation.eligible) {
      eligible.push(base);
    } else {
      nearMiss.push({
        ...base,
        failedConditions: evaluation.failedConditions,
        actions: buildActions(evaluation.failures, scheme.name, docsNeeded, uploadedDocTypes),      
      });
    }
  }

  // Stage 4 — final ordering (hybrid score, then benefit, then deadline)
  const orderByHybridThenBenefit = (a: MatchResult, b: MatchResult) => {
    const sA = scoreMap.get(a.schemeId)?.score ?? 0;
    const sB = scoreMap.get(b.schemeId)?.score ?? 0;
    if (Math.abs(sA - sB) > 0.05) return sB - sA;
    const amtA = a.benefitAmount || 0;
    const amtB = b.benefitAmount || 0;
    if (amtA !== amtB) return amtB - amtA;
    const dlA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
    const dlB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
    return dlA - dlB;
  };
  eligible.sort(orderByHybridThenBenefit);
  nearMiss.sort(orderByHybridThenBenefit);

  return {
    eligible,
    nearMiss,
    evaluatedAt: new Date().toISOString(),
    totalSchemesEvaluated: schemes.length,
    method: "hybrid-rag",
    queryText,
  };
}

function buildContext(profile: Profile) {
  return {
    state: profile.state,
    district: profile.district,
    category: profile.category,
    subCategory: profile.subCategory,
    gender: profile.gender,
    age: profile.age,
    landSizeAcres: profile.landSizeAcres,
    landOwnership: profile.landOwnership,
    khasraNumber: profile.khasraNumber,
    annualIncome: profile.annualIncome,
    bankAccount: profile.bankAccount,
    aadhaarLinked: profile.aadhaarLinked,
  };
}

/** Converts the structured farmer profile into a rich text query for retrieval */
function buildFarmerQueryText(p: Profile): string {
  const parts: string[] = [];
  if (p.state) parts.push(p.state);
  if (p.district) parts.push(p.district);
  if (p.category && p.category !== "General") parts.push(`${p.category} category farmer`);
  if (p.category === "EWS") parts.push("economically weaker section");

  if (p.landOwnership === "Landless") parts.push("landless agricultural labourer");
  else if (p.landOwnership) parts.push(`${p.landOwnership.toLowerCase()} farmer`);

  if (typeof p.landSizeAcres === "number") {
    parts.push(`${p.landSizeAcres} acres land`);
    if (p.landSizeAcres <= 2.5) parts.push("marginal farmer");
    else if (p.landSizeAcres <= 5) parts.push("small farmer");
    else if (p.landSizeAcres <= 10) parts.push("medium farmer");
    else parts.push("large farmer");
  }

  if (typeof p.annualIncome === "number") {
    parts.push(`annual income ${p.annualIncome} rupees`);
    if (p.annualIncome <= 100000) parts.push("low income");
  }
  if (p.bankAccount) parts.push("has bank account");
  if (p.aadhaarLinked) parts.push("aadhaar linked bank account");
  if (p.gender === "Female") parts.push("women farmer");
  parts.push("agriculture farming scheme subsidy");
  return parts.join(". ");
}

function safeJsonParse(s: string): any {
  try { return JSON.parse(s); } catch { return null; }
}

function safeJsonArray(s: string): string[] {
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function fallbackText(
  name: string,
  description: string | null,
  v: { benefit: string; eligibilityText: string } | undefined
): string {
  return [name, description || "", v?.benefit || "", v?.eligibilityText || ""].filter(Boolean).join(". ");
}