import { NextResponse } from "next/server";
import { createAndSendOtp } from "@/lib/auth/otp";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        { error: "Valid 10-digit Indian mobile number required" },
        { status: 400 }
      );
    }

    const result = await createAndSendOtp(phone);
    return NextResponse.json(result);
  } catch (err) {
    console.error("send-otp error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}