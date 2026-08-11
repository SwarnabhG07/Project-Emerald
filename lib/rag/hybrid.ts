import { bm25Rank } from "@/lib/matcher/bm25";
import { embedText, cosine } from "./embeddings";

export interface HybridSignals {
  keyword: number;
  semantic: number;
  documentReadiness: number;
}

export interface HybridCandidate {
  schemeId: string;
  score: number;
  signals: HybridSignals;
}

export const HYBRID_WEIGHTS = { keyword: 0.35, semantic: 0.4, documentReadiness: 0.25 };

/** Fuses BM25 keyword search + vector similarity + document readiness */
export async function hybridRank(opts: {
  queryText: string;
  schemes: { id: string; searchText: string; requiredDocs: string[] }[];
  uploadedDocs: Set<string>;
  storedEmbeddings?: Map<string, number[]>;
}): Promise<HybridCandidate[]> {
  const { queryText, schemes, uploadedDocs, storedEmbeddings } = opts;
  if (schemes.length === 0) return [];

  // Signal 1 — keyword (BM25)
  const bm25 = bm25Rank(queryText, schemes.map((s) => ({ id: s.id, text: s.searchText })));
  const bm25Map = new Map(bm25.map((r) => [r.id, r.score]));

  // Signal 2 — semantic (cosine over embeddings)
  const qVec = await embedText(queryText);
  const cosMap = new Map<string, number>();
  for (const s of schemes) {
    const vec = storedEmbeddings?.get(s.id) ?? (await embedText(s.searchText));
    cosMap.set(s.id, cosine(qVec, vec));
  }

  // Signal 3 — document readiness (how ready is the farmer to apply)
  const readiness = new Map<string, number>(
    schemes.map((s) => {
      if (s.requiredDocs.length === 0) return [s.id, 1];
      const have = s.requiredDocs.filter((d) => uploadedDocs.has(d)).length;
      return [s.id, have / s.requiredDocs.length];
    })
  );

  const normBm25 = normalize(bm25Map);
  const normCos = normalize(cosMap);

  return schemes
    .map((s) => {
      const signals: HybridSignals = {
        keyword: normBm25.get(s.id) ?? 0,
        semantic: normCos.get(s.id) ?? 0,
        documentReadiness: readiness.get(s.id) ?? 0,
      };
      const score =
        signals.keyword * HYBRID_WEIGHTS.keyword +
        signals.semantic * HYBRID_WEIGHTS.semantic +
        signals.documentReadiness * HYBRID_WEIGHTS.documentReadiness;
      return { schemeId: s.id, score: Math.round(score * 1000) / 1000, signals };
    })
    .sort((a, b) => b.score - a.score);
}

function normalize(m: Map<string, number>): Map<string, number> {
  const vals = [...m.values()];
  if (vals.length === 0) return m;
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = max - min;
  const out = new Map<string, number>();
  for (const [k, v] of m) out.set(k, span === 0 ? (v > 0 ? 1 : 0) : (v - min) / span);
  return out;
}