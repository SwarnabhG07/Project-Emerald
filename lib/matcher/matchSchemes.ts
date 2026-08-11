import { prisma } from "@/lib/db";
import { evaluateRule, type EvaluationResult } from "@/lib/rules/engine";
import { bm25Rank } from "./bm25";
import { buildActions } from "./actions";
import type { MatchResult, NearMissResult, MatchResponse } from "@/types";

export async function matchSchemesForFarmer(farmerId: string): Promise<MatchResponse> {
  const profile = await prisma.profile.findUnique({ where: { farmerId } });
  if (!profile) throw new Error("Farmer profile not found");

  const documents = await prisma.document.findMany({
    where: { farmerId },
    select: { type: true },
  });
  const uploadedDocTypes = new Set(documents.map((d) => d.type));

  const context = {
    state: profile.state,
    district: profile.district,
    category: profile.category,
    subCategory: profile.subCategory,
    gender: profile.gender,
    age: profile.age,
    landSizeAcres: profile.landSizeAcres,
    landOwnership: profile.landOwnership,
    khasraNumber: profile.khasraNumber,
    annualIncome: profile.annualIncome,
    bankAccount: profile.bankAccount,
    aadhaarLinked: profile.aadhaarLinked,
  };

  const schemes = await prisma.scheme.findMany({
    where: { isActive: true },
    include: { versions: { orderBy: { version: "desc" }, take: 1 } },
  });

  const eligible: MatchResult[] = [];
  const nearMiss: NearMissResult[] = [];

  for (const scheme of schemes) {
    const currentVersion = scheme.versions[0];
    if (!currentVersion) continue;
    if (scheme.state && profile.state && scheme.state !== profile.state) continue;

    const rules = JSON.parse(currentVersion.eligibilityRules);
    const docsNeeded: string[] = JSON.parse(currentVersion.documentsNeeded);
    const evaluation: EvaluationResult = rules
      ? evaluateRule(rules, context)
      : {
          eligible: true,
          failedConditions: [],
          passedConditions: ["No automated rules — manual verification required"],
          failures: [],
        };
    const baseResult = {
      schemeId: scheme.id,
      schemeName: scheme.name,
      ministry: scheme.ministry,
      state: scheme.state,
      benefit: currentVersion.benefit,
      benefitAmount: currentVersion.benefitAmount,
      deadline: currentVersion.deadline?.toISOString() || null,
      link: currentVersion.link,
      eligibilityVersion: currentVersion.version,
      requiredDocuments: docsNeeded,
      uploadedDocuments: docsNeeded.filter((d) => uploadedDocTypes.has(d)),
      missingDocuments: docsNeeded.filter((d) => !uploadedDocTypes.has(d)),
    };

    if (evaluation.eligible) {
      eligible.push(baseResult);
    } else {
      nearMiss.push({
        ...baseResult,
        failedConditions: evaluation.failedConditions,
        actions: buildActions(evaluation.failures, scheme.name, docsNeeded, uploadedDocTypes),
      });
    }
  }

  if (eligible.length > 0 && profile.state) {
    const farmerQuery = [
      profile.fullName, profile.state, profile.district, profile.category,
      `land ${profile.landSizeAcres} acres`,
    ].filter(Boolean).join(" ");
    const bm25Scores = bm25Rank(
      farmerQuery,
      eligible.map((e) => ({ id: e.schemeId, text: `${e.schemeName} ${e.benefit}` }))
    );
    const scoreMap = new Map(bm25Scores.map((s) => [s.id, s.score]));
    eligible.sort((a, b) => {
      const amtA = a.benefitAmount || 0;
      const amtB = b.benefitAmount || 0;
      if (amtA !== amtB) return amtB - amtA;
      const dlA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
      const dlB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
      if (dlA !== dlB) return dlA - dlB;
      return (scoreMap.get(b.schemeId) || 0) - (scoreMap.get(a.schemeId) || 0);
    });
  }

  return {
    eligible,
    nearMiss,
    evaluatedAt: new Date().toISOString(),
    totalSchemesEvaluated: schemes.length,
  };
}