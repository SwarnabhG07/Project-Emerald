import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/db";
import { wrapKey } from "@/lib/crypto/keys";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), ".uploads");

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string | null;
    const dekBase64 = formData.get("dek") as string | null;
    const ivBase64 = formData.get("iv") as string | null;

    if (!file || !type || !dekBase64 || !ivBase64) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const allowedTypes = ["aadhaar", "category_cert", "land_record", "bank_passbook", "photo"];
    if (!allowedTypes.includes(type)) {
      return NextResponse.json({ error: "Invalid document type" }, { status: 400 });
    }

    // Wrap the DEK with master key
    const { wrapped: wrappedDek } = wrapKey(dekBase64);

    // Save encrypted file to disk (in production, use S3/Supabase Storage)
    await mkdir(UPLOAD_DIR, { recursive: true });
    const userDir = path.join(UPLOAD_DIR, user.id);
    await mkdir(userDir, { recursive: true });

    const filename = `${type}-${Date.now()}.enc`;
    const filepath = path.join(userDir, filename);
    const bytes = new Uint8Array(await file.arrayBuffer());
    await writeFile(filepath, bytes);

    const storageKey = `${user.id}/${filename}`;

    const doc = await prisma.document.create({
      data: {
        farmerId: user.id,
        type,
        filename: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        storageKey,
        dekWrapped: wrappedDek,
        iv: ivBase64,
      },
    });

    await prisma.auditLog.create({
      data: {
        farmerId: user.id,
        action: "document_upload",
        details: JSON.stringify({ type, filename: file.name }),
      },
    });

    return NextResponse.json({ success: true, document: doc });
  } catch (err: any) {
    console.error("document upload error:", err);
    const status = err.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}