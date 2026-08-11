import { prisma } from "@/lib/db";
import { embedText, EMBEDDING_MODEL, quickHash } from "./embeddings";

export async function rebuildEmbeddings(schemeIds?: string[]): Promise<number> {
  const schemes = await prisma.scheme.findMany({
    where: { isActive: true, ...(schemeIds?.length ? { id: { in: schemeIds } } : {}) },
    include: { versions: { orderBy: { version: "desc" }, take: 1 } },
  });

  let count = 0;
  for (const scheme of schemes) {
    const v = scheme.versions[0];
    if (!v) continue;
    const text =
      scheme.searchText ||
      `${scheme.name}. ${scheme.description || ""}. ${v.benefit}. ${v.eligibilityText}`;
    const vector = await embedText(text);
    const hash = quickHash(text);

    await prisma.schemeEmbedding.upsert({
      where: { schemeId_version: { schemeId: scheme.id, version: v.version } },
      update: { vector: JSON.stringify(vector), model: EMBEDDING_MODEL, textHash: hash },
      create: {
        schemeId: scheme.id, version: v.version,
        vector: JSON.stringify(vector), model: EMBEDDING_MODEL, textHash: hash,
      },
    });
    count++;
  }
  return count;
}