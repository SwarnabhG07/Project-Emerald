import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const user = await requireUser();
    const documents = await prisma.document.findMany({
      where: { farmerId: user.id },
      orderBy: { uploadedAt: "desc" },
      select: {
        id: true,
        type: true,
        filename: true,
        sizeBytes: true,
        verified: true,
        uploadedAt: true,
      },
    });
    return NextResponse.json({ documents });
  } catch (err: any) {
    const status = err.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}