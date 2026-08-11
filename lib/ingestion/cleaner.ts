import type { RawScheme, CleanedScheme } from "./types";
import {
  cleanText, normalizeState, normalizeCategory, normalizeDocuments,
  parseAmount, parseDateSafe, normalizeUrl, slugify,
} from "./normalize";

export function cleanScheme(raw: RawScheme, sourceId: string): CleanedScheme | null {
  const name = cleanText(raw.name || "");
  if (!name) return null; // unusable record

  const description = cleanText(raw.description || "");
  const benefits = cleanText(raw.benefit || "") || description || "See scheme details";
  const eligibility = cleanText(raw.eligibilityText || "") || "No eligibility details published";
  const ministry = cleanText(raw.ministry || "") || "Unknown Ministry";
  const state = normalizeState(raw.state);
  const category = normalizeCategory(raw.category, `${name} ${description} ${benefits}`);
  const benefitAmount = typeof raw.benefitAmount === "number" ? raw.benefitAmount : parseAmount(benefits);
  const documentsRequired = normalizeDocuments(raw.documents);
  const sourceLink = normalizeUrl(raw.link);
  const lastUpdated = parseDateSafe(raw.lastUpdated) ?? new Date();
  const deadline = parseDateSafe(raw.deadline);
  const eligibilityRules = sanitizeRules(raw.eligibilityRules);
  const externalId = raw.externalId ? String(raw.externalId) : `${sourceId}:${slugify(name)}`;

  return {
    externalId,
    name,
    ministry,
    state,
    category,
    benefits,
    benefitAmount,
    eligibility,
    eligibilityRules,
    text: buildSearchText({ name, ministry, state, category, description, benefits, eligibility, documentsRequired }),
    documentsRequired,
    sourceLink,
    lastUpdated,
    deadline,
    description,
  };
}

function sanitizeRules(rules: unknown): unknown {
  if (rules && typeof rules === "object") return rules;
  return null;
}

export function buildSearchText(p: {
  name: string; ministry: string; state: string | null; category: string;
  description: string; benefits: string; eligibility: string; documentsRequired: string[];
}): string {
  return [
    p.name,
    p.ministry,
    p.state ? `${p.state} state scheme` : "central government scheme",
    `category ${p.category}`,
    p.description,
    `benefits ${p.benefits}`,
    `eligibility ${p.eligibility}`,
    p.documentsRequired.length ? `documents ${p.documentsRequired.join(" ")}` : "",
  ].filter(Boolean).join(". ");
}