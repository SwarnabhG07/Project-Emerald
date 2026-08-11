import { NextResponse } from "next/server";
import { hashPin } from "@/lib/auth/hash";
import { createSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-me-in-production"
);

export async function POST(req: Request) {
  try {
    const { phone, pin, ticket } = await req.json();

    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ error: "Valid phone required" }, { status: 400 });
    }
    if (!pin || !/^\d{4}$/.test(pin)) {
      return NextResponse.json({ error: "PIN must be 4 digits" }, { status: 400 });
    }

    // Verify the OTP ticket to prevent bypass
    if (!ticket) {
      return NextResponse.json({ error: "OTP verification ticket required" }, { status: 401 });
    }

          // Verify the OTP ticket to prevent bypass. Checking `phone` alone is
      // insufficient: session JWTs use the same secret and also carry `phone`,
      // so we must require the OTP-ticket-specific claims.
    try {
      const { payload } = await jwtVerify(ticket, JWT_SECRET);
      if (
        payload.purpose !== "otp-verification" ||
        payload.verified !== true ||
        payload.phone !== phone
      ) {
        return NextResponse.json(
          { error: "Invalid or expired OTP verification" },
          { status: 401 }
        );
      }
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid or expired OTP verification" },
        { status: 401 }
      );
    }

    const pinHash = await hashPin(pin, phone);

    // Upsert farmer
    const farmer = await prisma.farmer.upsert({
      where: { phone },
      update: { pinHash },
      create: { phone, pinHash },
    });

    await createSession(farmer.id, farmer.phone);

    return NextResponse.json({
      success: true,
      farmerId: farmer.id,
      needsProfile: true,
    });
  } catch (err) {
    console.error("set-pin error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}