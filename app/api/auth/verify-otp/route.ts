import { NextResponse } from "next/server";
import { verifyOtp } from "@/lib/auth/otp";
import { prisma } from "@/lib/db";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-me-in-production"
);

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json({ error: "Phone and OTP required" }, { status: 400 });
    }

    const verification = await verifyOtp(phone, otp);
    if (!verification.success) {
      return NextResponse.json({ error: verification.error }, { status: 401 });
    }

    // Check if farmer exists
    const farmer = await prisma.farmer.findUnique({
      where: { phone },
    });

    // Issue a 5-minute ticket proving OTP was verified for this phone
    const ticket = await new SignJWT({ phone, verified: true, purpose: "otp-verification" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("5m")
      .sign(JWT_SECRET);

    return NextResponse.json({
      verified: true,
      ticket, // <-- Send this to the client
      isNewUser: !farmer,
      hasPin: farmer ? true : false,
    });
  } catch (err) {
    console.error("verify-otp error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}