export const STATE_ALIASES: Record<string, string> = {
  maharashtra: "Maharashtra", maha: "Maharashtra", mh: "Maharashtra", maharastra: "Maharashtra",
  karnataka: "Karnataka", "uttar pradesh": "Uttar Pradesh", up: "Uttar Pradesh",
  "madhya pradesh": "Madhya Pradesh", mp: "Madhya Pradesh", "tamil nadu": "Tamil Nadu",
  gujarat: "Gujarat", "andhra pradesh": "Andhra Pradesh", telangana: "Telangana",
  "west bengal": "West Bengal", rajasthan: "Rajasthan", punjab: "Punjab", haryana: "Haryana",
  bihar: "Bihar", odisha: "Odisha", assam: "Assam", kerala: "Kerala", jharkhand: "Jharkhand",
  chhattisgarh: "Chhattisgarh",
};

export const CANONICAL_CATEGORIES = [
  "Income Support", "Insurance", "Credit", "Input Subsidy", "Equipment & Machinery",
  "Irrigation", "Infrastructure", "Training & Education", "Welfare", "Other",
];

const CATEGORY_KEYWORDS: [string, RegExp][] = [
  ["Insurance", /insurance|bima|fasal|yield loss/i],
  ["Income Support", /income support|samman|niddhi|cash transfer|pension/i],
  ["Credit", /credit|loan|kcc|kisan credit|working capital|interest subvention/i],
  ["Equipment & Machinery", /tractor|machinery|equipment|drone|mechaniz/i],
  ["Irrigation", /irrigation|drip|sprinkler|sinchai|water harvest/i],
  ["Infrastructure", /infrastructure|warehouse|storage|godown|post harvest|marketing/i],
  ["Training & Education", /training|skill|education|krishi vigyan/i],
  ["Welfare", /welfare|relief|compensation|accident/i],
  ["Input Subsidy", /seed|fertilizer|subsidy|input/i],
];

const DOC_PATTERNS: [string, RegExp][] = [
  ["aadhaar", /aadhaar|adhaar|uid/i],
  ["category_cert", /category|caste|sc cert|st cert|obc|ews|non.?creamy/i],
  ["land_record", /land record|khasra|khatauni|7.?12|saat bara|mutation|8.?a/i],
  ["bank_passbook", /bank|passbook|account|ifsc/i],
  ["photo", /photo|photograph/i],
];

export const CANONICAL_DOC_TYPES = ["aadhaar", "category_cert", "land_record", "bank_passbook", "photo"];

export function cleanText(s?: string | null): string {
  return (s || "").replace(/[\u200b-\u200d\ufeff]/g, "").replace(/\s+/g, " ").trim();
}

export function normalizeState(input?: string | null): string | null {
  const s = cleanText(input || "");
  if (!s) return null;
  if (/^(central|all india|pan india|national)$/i.test(s)) return null;
  const aliased = STATE_ALIASES[s.toLowerCase()];
  if (aliased) return aliased;
  return s.split(/\s+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

export function normalizeCategory(input: string | null | undefined, haystack: string): string {
  const t = cleanText(input || "");
  const exact = CANONICAL_CATEGORIES.find((c) => c.toLowerCase() === t.toLowerCase());
  if (exact) return exact;
  const search = `${t} ${haystack}`;
  for (const [cat, re] of CATEGORY_KEYWORDS) {
    if (re.test(search)) return cat;
  }
  return "Other";
}

export function normalizeDocuments(docs: unknown): string[] {
  if (!Array.isArray(docs)) return [];
  const out = new Set<string>();
  for (const d of docs) {
    if (typeof d !== "string") continue;
    const s = d.trim();
    if (!s) continue;
    if (CANONICAL_DOC_TYPES.includes(s.toLowerCase())) {
      out.add(s.toLowerCase());
      continue;
    }
    for (const [canonical, re] of DOC_PATTERNS) {
      if (re.test(s)) { out.add(canonical); break; }
    }
  }
  return [...out];
}

/** Parses "₹6,000", "Rs 3 lakh", "₹2 crore" etc. into a number */
export function parseAmount(text?: string | null): number | null {
  if (!text) return null;
  const m = text.replace(/,/g, "").match(/(?:₹|rs\.?|inr)\s?(\d+(?:\.\d+)?)\s*(crore|lakh|lac|k)?/i);
  if (!m) return null;
  let n = parseFloat(m[1]);
  const unit = (m[2] || "").toLowerCase();
  if (unit === "crore") n *= 1e7;
  else if (unit === "lakh" || unit === "lac") n *= 1e5;
  else if (unit === "k") n *= 1e3;
  return Math.round(n);
}

export function parseDateSafe(v: unknown): Date | null {
  if (v == null) return null;
  const d = v instanceof Date ? v : new Date(v as any);
  return isNaN(d.getTime()) ? null : d;
}

export function normalizeUrl(u?: string | null): string | null {
  if (!u) return null;
  try { return new URL(u).href; } catch { return null; }
}

export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}