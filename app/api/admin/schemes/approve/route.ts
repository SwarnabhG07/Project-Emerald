import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const user = await requireAdmin();
    const body = await req.json().catch(() => ({}));
    const { schemeId } = body;

    if (!schemeId) {
      return NextResponse.json({ error: "schemeId is required" }, { status: 400 });
    }

    const updated = await prisma.scheme.update({
      where: { id: schemeId },
      data: { isActive: true },
    });

    await prisma.auditLog.create({
      data: {
        farmerId: user.id,
        action: "scheme_approve",
        details: JSON.stringify({ schemeId, name: updated.name }),
      },
    });

    return NextResponse.json({ success: true, scheme: updated });
  } catch (err: any) {
    const status = err.message === "Unauthorized" ? 401 : err.message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
