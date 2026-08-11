import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/db";
import { unwrapKey, decryptFileBytes } from "@/lib/crypto/keys";
import { readFile } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.resolve(process.cwd(), ".uploads");

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const doc = await prisma.document.findUnique({ where: { id } });
    if (!doc || doc.farmerId !== user.id) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const filepath = path.resolve(UPLOAD_DIR, doc.storageKey);
    if (!filepath.startsWith(UPLOAD_DIR + path.sep)) {
      return NextResponse.json({ error: "Invalid storage key" }, { status: 400 });
    }

    const encrypted = await readFile(filepath);
    const dekBase64 = unwrapKey(doc.dekWrapped);
    const plaintext = decryptFileBytes(encrypted, dekBase64, doc.iv);

    await prisma.auditLog.create({
      data: {
        farmerId: user.id,
        action: "document_download",
        details: JSON.stringify({ type: doc.type, filename: doc.filename }),
      },
    });

    const safeName = doc.filename.replace(/[^\w.\- ]+/g, "_");
    return new NextResponse(new Uint8Array(plaintext), {
      headers: {
        "Content-Type": doc.mimeType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${safeName}"`,
        "Content-Length": String(plaintext.byteLength),
      },
    });
  } catch (err: any) {
    console.error("document download error:", err);
    const status = err.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}