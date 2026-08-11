import type { SchemeSourceAdapter } from "./base";
import type { RawScheme } from "../types";

export interface RestSourceConfig {
  id: string;
  name: string;
  url: string;
  apiKey?: string;
  schemesPath?: string; // dot path like "data.schemes"
  timeoutMs?: number;
}

/** Generic adapter: connect any real REST API that returns scheme JSON */
export function createRestSource(cfg: RestSourceConfig): SchemeSourceAdapter {
  return {
    id: cfg.id,
    name: cfg.name,
    async fetch() {
      const res = await fetch(cfg.url, {
        headers: cfg.apiKey ? { Authorization: `Bearer ${cfg.apiKey}` } : {},
        signal: AbortSignal.timeout(cfg.timeoutMs ?? 15000),
      });
      if (!res.ok) throw new Error(`Source ${cfg.id} returned HTTP ${res.status}`);
      const json = await res.json();
      const list = cfg.schemesPath
        ? cfg.schemesPath.split(".").reduce((o: any, k) => o?.[k], json)
        : Array.isArray(json) ? json : json?.schemes || json?.data || [];
      if (!Array.isArray(list)) throw new Error(`Source ${cfg.id}: could not locate schemes array`);
      return list.map(mapRestScheme);
    },
  };
}

function mapRestScheme(item: any): RawScheme {
  return {
    externalId: item.id || item.externalId || item.schemeId || null,
    name: item.name || item.schemeName,
    ministry: item.ministry || item.department,
    state: item.state,
    category: item.category,
    description: item.description,
    benefit: item.benefit || item.benefits,
    benefitAmount: item.benefitAmount ?? null,
    eligibilityText: item.eligibility || item.eligibilityText,
    eligibilityRules: item.eligibilityRules || item.rules || null,
    documents: item.documents || item.documentsRequired || item.documentsNeeded || [],
    link: item.link || item.sourceLink || item.url,
    deadline: item.deadline || item.applicationDeadline || null,
    lastUpdated: item.lastUpdated || item.updatedAt || null,
    raw: item,
  };
}