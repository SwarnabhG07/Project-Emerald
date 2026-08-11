/**
 * Simple BM25 implementation for ranking schemes against farmer profiles.
 */

const K1 = 1.5;
const B = 0.75;

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

export function bm25Rank(
  query: string,
  documents: { id: string; text: string }[]
): { id: string; score: number }[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) {
    return documents.map((d) => ({ id: d.id, score: 0 }));
  }

  const N = documents.length;
  const tokenizedDocs = documents.map((d) => tokenize(d.text));
  const docLengths = tokenizedDocs.map((t) => t.length);
  const avgDl = docLengths.reduce((a, b) => a + b, 0) / N;

  // Document frequency per query term
  const df: Record<string, number> = {};
  for (const q of queryTokens) {
    df[q] = tokenizedDocs.filter((tokens) => tokens.includes(q)).length;
  }

  const scores = documents.map((doc, idx) => {
    const tokens = tokenizedDocs[idx];
    const dl = docLengths[idx];
    let score = 0;

    for (const q of queryTokens) {
      const tf = tokens.filter((t) => t === q).length;
      if (tf === 0) continue;
      const idf = Math.log((N - df[q] + 0.5) / (df[q] + 0.5) + 1);
      const tfNorm = (tf * (K1 + 1)) / (tf + K1 * (1 - B + B * (dl / avgDl)));
      score += idf * tfNorm;
    }

    return { id: doc.id, score };
  });

  return scores.sort((a, b) => b.score - a.score);
}