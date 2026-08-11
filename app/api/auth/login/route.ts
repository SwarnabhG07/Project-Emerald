import { NextResponse } from "next/server";
import { verifyPin } from "@/lib/auth/hash";
import { createSession } from "@/lib/auth/session";
import {
  checkPinAttempt,
  recordPinFailure,
  resetPinAttempts,
} from "@/lib/auth/pin-guard";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { phone, pin } = await req.json();
    if (!phone || !pin) {
      return NextResponse.json({ error: "Phone and PIN required" }, { status: 400 });
    }

    // Brute-force guard: 4-digit PIN = 10k combinations
    const gate = checkPinAttempt(phone);
    if (!gate.allowed) {
      const minutes = Math.max(1, Math.ceil(gate.retryAfterMs / 60000));
      return NextResponse.json(
        {
          error: `Too many failed attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
        },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil(gate.retryAfterMs / 1000)) },
        }
      );
    }

    const farmer = await prisma.farmer.findUnique({ where: { phone } });
    if (!farmer) {
      recordPinFailure(phone);
      return NextResponse.json({ error: "No account found" }, { status: 401 });
    }

    const valid = await verifyPin(pin, phone, farmer.pinHash);
    if (!valid) {
      recordPinFailure(phone);
      return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
    }

    resetPinAttempts(phone);
    await createSession(farmer.id, farmer.phone);

    await prisma.auditLog.create({
      data: {
        farmerId: farmer.id,
        action: "login",
        ip: req.headers.get("x-forwarded-for") || "unknown",
      },
    });

    const profile = await prisma.profile.findUnique({ where: { farmerId: farmer.id } });
    return NextResponse.json({
      success: true,
      farmerId: farmer.id,
      needsProfile: !profile || !profile.isComplete,
    });
  } catch (err) {
    console.error("login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}