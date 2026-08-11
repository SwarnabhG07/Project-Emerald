import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/get-current-user";
import { hybridMatchForFarmer } from "@/lib/rag/matchHybrid";
import { matchSchemesForFarmer } from "@/lib/matcher/matchSchemes";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const user = await requireUser();

    // if (!user.profile?.isComplete) {
    //   return NextResponse.json({
    //     eligible: [],
    //     nearMiss: [],
    //     evaluatedAt: new Date().toISOString(),
    //     totalSchemesEvaluated: 0,
    //     warning: "Complete your profile to see eligible schemes",
    //   });
    // }

    let result;
    try {
      result = await hybridMatchForFarmer(user.id);
    } catch (hybridErr) {
      console.warn("Hybrid matcher failed, falling back to rule-only matcher:", hybridErr);
      result = await matchSchemesForFarmer(user.id);
    }

    await prisma.auditLog.create({
      data: {
        farmerId: user.id,
        action: "match_query",
        details: JSON.stringify({
          method: (result as any).method || "rules",
          eligibleCount: result.eligible.length,
          nearMissCount: result.nearMiss.length,
        }),
      },
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("match error:", err);
    const status = err.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}