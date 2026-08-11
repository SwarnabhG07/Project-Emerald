import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/db";
import { z } from "zod";

const profileSchema = z.object({
  fullName: z.string().trim().min(1).max(200).optional(),
  age: z.number().int().min(16).max(100).optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  state: z.string().trim().min(1).max(100).optional(),
  district: z.string().trim().min(1).max(100).optional(),
  village: z.string().trim().min(1).max(100).optional(),
  category: z.enum(["General", "SC", "ST", "OBC", "EWS"]).optional(),
  subCategory: z.string().trim().max(100).optional(),
  landSizeAcres: z.number().min(0).max(100000).optional(),
  landOwnership: z.enum(["Owner", "Tenant", "Sharecropper", "Landless"]).optional(),
  khasraNumber: z.string().trim().max(100).optional(),
  annualIncome: z.number().min(0).max(1000000000).optional(),
  bankAccount: z.boolean().optional(),
  aadhaarLinked: z.boolean().optional(),
  isComplete: z.boolean().optional(),
});

export async function GET() {
  try {
    const user = await requireUser();
    return NextResponse.json({ profile: user.profile });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await requireUser();

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    // Zod strips unknown keys, so arbitrary/extra fields can't reach Prisma
    const parsed = profileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid profile data", issues: parsed.error.issues },
        { status: 400 }
      );
    }
    const data = parsed.data;

    const profile = await prisma.profile.upsert({
      where: { farmerId: user.id },
      update: { ...data },
      create: { farmerId: user.id, ...data },
    });

    if (data.fullName) {
      await prisma.farmer.update({
        where: { id: user.id },
        data: { name: data.fullName },
      });
    }

    await prisma.auditLog.create({
      data: {
        farmerId: user.id,
        action: "profile_update",
        details: JSON.stringify(data),
      },
    });

    return NextResponse.json({ profile });
  } catch (err: any) {
    console.error("profile PUT error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: err.message === "Unauthorized" ? 401 : 500 }
    );
  }
}