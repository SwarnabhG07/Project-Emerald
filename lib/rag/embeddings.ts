/**
 * Embedding provider for hybrid RAG.
 * Default: dependency-free local signed-feature-hashing embedder.
 * Upgrade path: any OpenAI-compatible embeddings API via env vars.
 */
import { tokenize } from "./tokenize";
import { expandSynonyms } from "./synonyms";

export const EMBEDDING_DIMS = 256;
export const EMBEDDING_MODEL = process.env.EMBEDDINGS_MODEL || "local-hash-v1";

export async function embedText(text: string): Promise<number[]> {
  const url = process.env.EMBEDDINGS_API_URL;
  if (url) {
    try {
      return await embedRemote(
        url,
        process.env.EMBEDDINGS_API_KEY,
        process.env.EMBEDDINGS_MODEL || "text-embedding-3-small",
        text
      );
    } catch (err) {
      console.warn("Remote embedding failed, falling back to local:", (err as Error).message);
    }
  }
  return embedLocal(text);
}

export function embedLocal(text: string): number[] {
  const tokens = tokenize(expandSynonyms(text));
  const grams: string[] = [...tokens];
  for (let i = 0; i < tokens.length - 1; i++) grams.push(`${tokens[i]}_${tokens[i + 1]}`);

  const vec = new Array<number>(EMBEDDING_DIMS).fill(0);
  if (grams.length === 0) return vec;

  const counts = new Map<string, number>();
  for (const g of grams) counts.set(g, (counts.get(g) || 0) + 1);

  for (const [g, tf] of counts) {
    const idx = fnv1a(g) % EMBEDDING_DIMS;
    const sign = (fnv1a(`${g}|sign`) & 1) === 0 ? 1 : -1;
    vec[idx] += sign * (1 + Math.log(tf));
  }
  return l2Normalize(vec);
}

export function cosine(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length);
  let dot = 0;
  for (let i = 0; i < n; i++) dot += a[i] * b[i];
  return dot; // vectors are L2-normalised at embed time
}

export function fnv1a(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

export function quickHash(str: string): string {
  return fnv1a(str).toString(16).padStart(8, "0");
}

function l2Normalize(vec: number[]): number[] {
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0));
  if (norm === 0) return vec;
  return vec.map((v) => v / norm);
}

async function embedRemote(
  url: string, key: string | undefined, model: string, text: string
): Promise<number[]> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(key ? { Authorization: `Bearer ${key}` } : {}) },
    body: JSON.stringify({ model, input: text }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`Embedding API returned ${res.status}`);
  const json: any = await res.json();
  const vec = json?.data?.[0]?.embedding;
  if (!Array.isArray(vec) || vec.length === 0) throw new Error("Unexpected embedding response shape");
  return l2Normalize(vec);
}