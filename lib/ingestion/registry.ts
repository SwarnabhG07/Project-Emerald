import type { SchemeSourceAdapter } from "./sources/base";
import { centralSchemesSource } from "./sources/central";
import { maharashtraSource } from "./sources/maharashtra";
import { createRestSource } from "./sources/rest";

export function getSources(filter?: string[]): SchemeSourceAdapter[] {
  const sources: SchemeSourceAdapter[] = [centralSchemesSource, maharashtraSource];

  // Optional real external API via env
  const url = process.env.SCHEME_API_URL;
  if (url) {
    sources.push(
      createRestSource({
        id: "external-api",
        name: "External Scheme API",
        url,
        apiKey: process.env.SCHEME_API_KEY,
        schemesPath: process.env.SCHEME_API_PATH || undefined,
      })
    );
  }

  if (filter && filter.length > 0) {
    return sources.filter((s) => filter.includes(s.id));
  }
  return sources;
}