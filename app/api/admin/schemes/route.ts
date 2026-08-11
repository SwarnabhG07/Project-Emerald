import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    await requireAdmin();
    
    // Fetch schemes that are NOT active (pending approval)
    const pendingSchemes = await prisma.scheme.findMany({
      where: { isActive: false },
      include: {
        versions: {
          orderBy: { version: "desc" },
          take: 1,
        }
      },
      orderBy: { updatedAt: "desc" },
    });
    
    return NextResponse.json({ schemes: pendingSchemes });
  } catch (err: any) {
    const status = err.message === "Unauthorized" ? 401 : err.message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
