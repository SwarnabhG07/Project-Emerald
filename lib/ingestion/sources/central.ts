import type { SchemeSourceAdapter } from "./base";
import type { RawScheme } from "../types";

/**
 * Mirrors the shape of myScheme / central portal API responses.
 * Swap the simulated fetch for a real HTTP call when credentials exist.
 */
const CENTRAL_SCHEMES: RawScheme[] = [
  {
    externalId: "myscheme:central:pm-kisan",
    name: "PM-KISAN Samman Nidhi",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    state: null,
    category: "Income Support",
    description: "Direct income support of ₹6,000 per year to farmer families across India.",
    benefit: "₹6,000 per year in three instalments of ₹2,000",
    benefitAmount: 6000,
    eligibilityText: "All landholding farmer families with cultivable land. Institutional landholders, income-tax payers and serving/retired government employees are excluded.",
    eligibilityRules: {
      and: [
        { in: [{ var: "landOwnership" }, ["Owner", "Tenant", "Sharecropper"]] },
        { "!=": [{ var: "landSizeAcres" }, null] },
        { "<": [{ var: "annualIncome" }, 500000] },
      ],
    },
    documents: ["Aadhaar Card", "Land Record (Khasra/Khatauni)", "Bank Passbook"],
    link: "https://pmkisan.gov.in/",
    deadline: "2026-12-31",
    lastUpdated: "2025-07-15",
  },
  {
    externalId: "myscheme:central:pmfby",
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    state: null,
    category: "Insurance",
    description: "Crop insurance against yield losses from natural calamities, pests and diseases.",
    benefit: "Insurance coverage for notified crops at subsidised premium",
    eligibilityText: "All farmers including sharecroppers and tenant farmers growing notified crops in notified areas.",
    eligibilityRules: {
      and: [
        { in: [{ var: "landOwnership" }, ["Owner", "Tenant", "Sharecropper"]] },
        { ">=": [{ var: "landSizeAcres" }, 0.1] },
      ],
    },
    documents: ["Aadhaar Card", "Khasra/Khatauni", "Bank Passbook"],
    link: "https://pmfby.gov.in/",
    deadline: "2026-09-30",
    lastUpdated: "2025-08-02",
  },
  {
    externalId: "myscheme:central:kcc",
    name: "Kisan Credit Card (KCC)",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    state: null,
    category: "Credit",
    description: "Short-term credit for farming needs at subsidised interest.",
    benefit: "Credit up to ₹3 lakh at 4% interest",
    benefitAmount: 300000,
    eligibilityText: "All farmers — owner, tenant or sharecropper — aged 18 to 75 with a bank account and Aadhaar-linked account.",
    eligibilityRules: {
      and: [
        { in: [{ var: "landOwnership" }, ["Owner", "Tenant", "Sharecropper"]] },
        { ">=": [{ var: "age" }, 18] },
        { "<=": [{ var: "age" }, 75] },
        { "==": [{ var: "bankAccount" }, true] },
        { "==": [{ var: "aadhaarLinked" }, true] },
      ],
    },
    documents: ["Aadhaar", "Land Record", "Bank Passbook", "Passport Photo"],
    link: "https://www.pmkisan.gov.in/kisan-credit-card",
    deadline: null,
    lastUpdated: "2025-06-20",
  },
  {
    externalId: "myscheme:central:soil-health-card",
    name: "Soil Health Card Scheme",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    state: null,
    category: "Input Subsidy",
    description: "Free soil testing with personalised fertilizer recommendations.",
    benefit: "Free soil testing and fertilizer recommendation report",
    eligibilityText: "Any farmer with cultivable land.",
    eligibilityRules: { and: [{ in: [{ var: "landOwnership" }, ["Owner", "Tenant", "Sharecropper"]] }] },
    documents: ["Aadhaar Card", "Land record"],
    link: "https://soilhealth.dac.gov.in/",
    deadline: null,
    lastUpdated: "2025-05-11",
  },
  {
    externalId: "myscheme:central:aif",
    name: "Agriculture Infrastructure Fund",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    state: null,
    category: "Infrastructure",
    description: "Financing for post-harvest management infrastructure and community farming assets.",
    benefit: "Interest subvention of 3% on loans up to ₹2 crore",
    benefitAmount: 2000000,
    eligibilityText: "Farmers, FPOs and agri-entrepreneurs with a bank account building post-harvest infrastructure.",
    eligibilityRules: { and: [{ "==": [{ var: "bankAccount" }, true] }] },
    documents: ["Aadhaar", "Bank account details"],
    link: "https://aif.dac.gov.in/",
    deadline: "2027-03-31",
    lastUpdated: "2025-07-30",
  },
  {
    externalId: "myscheme:central:pmksy",
    name: "PM Krishi Sinchayee Yojana (Micro Irrigation)",
    ministry: "Ministry of Jal Shakti",
    state: null,
    category: "Irrigation",
    description: "Subsidy for drip and sprinkler irrigation systems.",
    benefit: "Up to 55% subsidy on drip and sprinkler irrigation",
    eligibilityText: "Farmers with at least 0.5 acre of cultivable land.",
    eligibilityRules: {
      and: [
        { in: [{ var: "landOwnership" }, ["Owner", "Tenant", "Sharecropper"]] },
        { ">=": [{ var: "landSizeAcres" }, 0.5] },
      ],
    },
    documents: ["Aadhaar Card", "Khasra/Khatauni"],
    link: "https://pmksy.gov.in/",
    deadline: "2026-10-15",
    lastUpdated: "2025-06-05",
  },
  {
    externalId: "myscheme:central:nfsm",
    name: "National Food Security Mission",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    state: null,
    category: "Input Subsidy",
    description: "Assistance on certified seeds of rice, wheat and pulses.",
    benefit: "Subsidy on certified seeds and micronutrients",
    eligibilityText: "Farmers growing notified food crops in identified districts.",
    eligibilityRules: { and: [{ in: [{ var: "landOwnership" }, ["Owner", "Tenant", "Sharecropper"]] }] },
    documents: ["Aadhaar", "Land Record"],
    link: "https://www.nfsm.gov.in/",
    deadline: "2026-08-15",
    lastUpdated: "2025-04-18",
  },
];

export const centralSchemesSource: SchemeSourceAdapter = {
  id: "myscheme-central",
  name: "myScheme Central API (mirror)",
  async fetch() {
    // Simulated API latency; replace with real fetch when API keys exist
    await new Promise((r) => setTimeout(r, 100));
    return CENTRAL_SCHEMES;
  },
};