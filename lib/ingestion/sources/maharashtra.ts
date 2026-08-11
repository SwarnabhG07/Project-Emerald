import type { SchemeSourceAdapter } from "./base";
import type { RawScheme } from "../types";

const MAHARASHTRA_SCHEMES: RawScheme[] = [
  {
    externalId: "mahadbt:seed-subsidy",
    name: "Maharashtra State Seed Subsidy Scheme",
    ministry: "State Dept. of Agriculture",
    state: "Maharashtra",
    category: "Input Subsidy",
    description: "50% subsidy on certified seeds for small and marginal farmers in Maharashtra.",
    benefit: "50% subsidy on certified seeds",
    eligibilityText: "Small and marginal farmers in Maharashtra with landholding up to 5 acres. SC/ST/OBC farmers get additional 10% subsidy.",
    eligibilityRules: {
      and: [
        { "==": [{ var: "state" }, "Maharashtra"] },
        { "<=": [{ var: "landSizeAcres" }, 5] },
        { in: [{ var: "landOwnership" }, ["Owner", "Tenant", "Sharecropper"]] },
      ],
    },
    documents: ["Aadhaar", "Khasra/Khatauni", "Category Certificate"],
    link: "https://maharashtra.gov.in/",
    deadline: "2026-08-30",
    lastUpdated: "2025-07-01",
  },
  {
    externalId: "mahadbt:ebc-tractor",
    name: "EBC (Economically Backward Class) Tractor Subsidy",
    ministry: "State Dept. of Agriculture",
    state: "Maharashtra",
    category: "Equipment & Machinery",
    description: "Up to ₹1,00,000 subsidy on tractor purchase for farmers with 4+ acres.",
    benefit: "Up to ₹1,00,000 subsidy on tractor purchase",
    benefitAmount: 100000,
    eligibilityText: "Maharashtra farmers owning minimum 4 acres with SC/ST/OBC category certificate.",
    eligibilityRules: {
      and: [
        { "==": [{ var: "state" }, "Maharashtra"] },
        { ">=": [{ var: "landSizeAcres" }, 4] },
        { "==": [{ var: "landOwnership" }, "Owner"] },
        { in: [{ var: "category" }, ["SC", "ST", "OBC"]] },
      ],
    },
    documents: ["Aadhaar", "Land Record", "Caste Certificate", "Bank Passbook"],
    link: "https://maharashtra.gov.in/",
    deadline: "2026-11-15",
    lastUpdated: "2025-08-10",
  },
  {
    externalId: "mahadbt:misdc-drip",
    name: "Maharashtra Drip Irrigation Subsidy (MISDC)",
    ministry: "State Dept. of Water Resources",
    state: "Maharashtra",
    category: "Irrigation",
    description: "High subsidy on drip irrigation systems for small farmers in Maharashtra.",
    benefit: "80% subsidy on drip irrigation for small farmers",
    eligibilityText: "Maharashtra farmers with landholding up to 5 acres.",
    eligibilityRules: {
      and: [
        { "==": [{ var: "state" }, "Maharashtra"] },
        { "<=": [{ var: "landSizeAcres" }, 5] },
        { in: [{ var: "landOwnership" }, ["Owner", "Tenant", "Sharecropper"]] },
      ],
    },
    documents: ["Aadhaar", "7/12 extract (land record)", "Bank Passbook"],
    link: "https://misdc.in/",
    deadline: "2026-09-15",
    lastUpdated: "2025-07-22",
  },
  {
    externalId: "mahadbt:munde-accident",
    name: "Gopinath Munde Farmer Accident Insurance Scheme",
    ministry: "State Dept. of Agriculture",
    state: "Maharashtra",
    category: "Welfare",
    description: "Insurance cover for farmers against accidental death and disability.",
    benefit: "₹2 lakh insurance cover",
    benefitAmount: 200000,
    eligibilityText: "All farmers of Maharashtra aged 18–70.",
    eligibilityRules: {
      and: [
        { "==": [{ var: "state" }, "Maharashtra"] },
        { ">=": [{ var: "age" }, 18] },
        { "<=": [{ var: "age" }, 70] },
      ],
    },
    documents: ["Aadhaar Card", "Bank Passbook"],
    link: "https://maharashtra.gov.in/",
    deadline: null,
    lastUpdated: "2025-05-30",
  },
];

export const maharashtraSource: SchemeSourceAdapter = {
  id: "mahadbt",
  name: "MahaDBT State Portal API (mirror)",
  async fetch() {
    await new Promise((r) => setTimeout(r, 100));
    return MAHARASHTRA_SCHEMES;
  },
};