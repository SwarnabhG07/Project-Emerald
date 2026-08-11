import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const seedSchemes = [
  {
    name: "PM-KISAN Samman Nidhi",
    ministry: "Ministry of Agriculture",
    state: null,
    category: "Income Support",
    source: "manual",
    description: "Direct income support of ₹6,000 per year to farmer families.",
    benefit: "₹6,000 per year in three installments",
    benefitAmount: 6000,
    eligibilityText: "All landholding farmer families. Excludes institutional land holders, current/former ministers, professionals who paid income tax in last assessment year.",
    eligibilityRules: JSON.stringify({
      and: [
        { in: [{ var: "landOwnership" }, ["Owner", "Tenant", "Sharecropper"]] },
        { "!=": [{ var: "landSizeAcres" }, null] },
        { "<": [{ var: "annualIncome" }, 500000] },
      ],
    }),
    documentsNeeded: JSON.stringify(["aadhaar", "land_record", "bank_passbook"]),
    deadline: new Date("2026-12-31"),
    link: "https://pmkisan.gov.in/",
  },
  {
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    ministry: "Ministry of Agriculture",
    state: null,
    category: "Insurance",
    source: "manual",
    description: "Crop insurance against yield losses from natural calamities, pests and diseases.",
    benefit: "Insurance coverage for notified crops",
    eligibilityText: "All farmers including sharecroppers and tenant farmers growing notified crops in notified areas.",
    eligibilityRules: JSON.stringify({
      and: [
        { in: [{ var: "landOwnership" }, ["Owner", "Tenant", "Sharecropper"]] },
        { ">=": [{ var: "landSizeAcres" }, 0.1] },
      ],
    }),
    documentsNeeded: JSON.stringify(["aadhaar", "land_record", "bank_passbook"]),
    deadline: new Date("2026-09-30"),
    link: "https://pmfby.gov.in/",
  },
  {
    name: "Maharashtra State Seed Subsidy Scheme",
    ministry: "State Dept. of Agriculture",
    state: "Maharashtra",
    category: "Input Subsidy",
    source: "manual",
    description: "50% subsidy on certified seeds for small and marginal farmers in Maharashtra.",
    benefit: "50% subsidy on certified seeds",
    eligibilityText: "Small and marginal farmers in Maharashtra with landholding up to 5 acres. SC/ST/OBC farmers get additional 10% subsidy.",
    eligibilityRules: JSON.stringify({
      and: [
        { "==": [{ var: "state" }, "Maharashtra"] },
        { "<=": [{ var: "landSizeAcres" }, 5] },
        { in: [{ var: "landOwnership" }, ["Owner", "Tenant", "Sharecropper"]] },
      ],
    }),
    documentsNeeded: JSON.stringify(["aadhaar", "land_record", "category_cert"]),
    deadline: new Date("2026-08-30"),
    link: "https://maharashtra.gov.in/",
  },
  {
    name: "EBC (Economically Backward Class) Tractor Subsidy",
    ministry: "State Dept. of Agriculture",
    state: "Maharashtra",
    category: "Equipment & Machinery",
    source: "manual",
    description: "Up to ₹1,00,000 subsidy on tractor purchase for farmers with 4+ acres of land.",
    benefit: "Up to ₹1,00,000 subsidy on tractor purchase",
    benefitAmount: 100000,
    eligibilityText: "Farmers in Maharashtra with minimum 4 acres of land. SC/ST/OBC category certificate required.",
    eligibilityRules: JSON.stringify({
      and: [
        { "==": [{ var: "state" }, "Maharashtra"] },
        { ">=": [{ var: "landSizeAcres" }, 4] },
        { "==": [{ var: "landOwnership" }, "Owner"] },
        { in: [{ var: "category" }, ["SC", "ST", "OBC"]] },
      ],
    }),
    documentsNeeded: JSON.stringify(["aadhaar", "land_record", "category_cert", "bank_passbook"]),
    deadline: new Date("2026-11-15"),
    link: "https://maharashtra.gov.in/",
  },
  {
    name: "Kisan Credit Card (KCC)",
    ministry: "Ministry of Agriculture",
    state: null,
    category: "Credit",
    source: "manual",
    description: "Short-term credit up to ₹3 lakhs at 4% interest for farming needs.",
    benefit: "Credit up to ₹3 lakhs at 4% interest",
    eligibilityText: "All farmers - individual or joint, owner or tenant, sharecroppers with valid land documents.",
    eligibilityRules: JSON.stringify({
      and: [
        { in: [{ var: "landOwnership" }, ["Owner", "Tenant", "Sharecropper"]] },
        { ">=": [{ var: "age" }, 18] },
        { "<=": [{ var: "age" }, 75] },
        { "==": [{ var: "aadhaarLinked" }, true] },
        { "==": [{ var: "bankAccount" }, true] },
      ],
    }),
    documentsNeeded: JSON.stringify(["aadhaar", "land_record", "bank_passbook", "photo"]),
    deadline: null,
    link: "https://www.pmkisan.gov.in/kisan-credit-card",
  },
];

function searchTextOf(s: (typeof seedSchemes)[number]): string {
  return [
    s.name,
    s.ministry,
    s.state ? `${s.state} state scheme` : "central government scheme",
    `category ${s.category}`,
    s.description,
    `benefits ${s.benefit}`,
    `eligibility ${s.eligibilityText}`,
  ].join(". ");
}

async function main() {
  console.log("🌱 Seeding database...");
  for (const s of seedSchemes) {
    const scheme = await prisma.scheme.create({
      data: {
        name: s.name,
        ministry: s.ministry,
        state: s.state,
        category: s.category,
        source: s.source,
        description: s.description,
        sourceUrl: s.link,
        searchText: searchTextOf(s),
        versions: {
          create: {
            version: 1,
            benefit: s.benefit,
            benefitAmount: s.benefitAmount ?? null,
            eligibilityText: s.eligibilityText,
            eligibilityRules: s.eligibilityRules,
            documentsNeeded: s.documentsNeeded,
            deadline: s.deadline,
            link: s.link,
            changedBy: "seed",
          },
        },
      },
    });
    console.log(`✅ Seeded scheme: ${scheme.name}`);
  }
  console.log("🎉 Seed complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });