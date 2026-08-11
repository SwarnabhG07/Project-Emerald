import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { runIngestion } from "@/lib/ingestion/ingest";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const user = await requireAdmin();
    const body = await req.json().catch(() => ({}));
    const summary = await runIngestion({
      sources: body.sources,
      reembed: body.reembed !== false,
    });
    await prisma.auditLog.create({
      data: {
        farmerId: user.id,
        action: "schemes_ingest",
        details: JSON.stringify(summary.stats),
      },
    });
    return NextResponse.json({ success: true, ...summary });
  } catch (err: any) {
    const status =
      err.message === "Unauthorized" ? 401 : err.message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}

export async function GET() {
  try {
    await requireAdmin();
    const runs = await prisma.ingestionRun.findMany({
      orderBy: { startedAt: "desc" },
      take: 10,
    });
    return NextResponse.json({ runs });
  } catch (err: any) {
    const status =
      err.message === "Unauthorized" ? 401 : err.message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}