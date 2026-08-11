import { randomInt } from "crypto";
import { prisma } from "@/lib/db";

// In-memory fallback when Redis isn't configured
const otpMemoryStore = new Map<
  string,
  { code: string; expiresAt: number; attempts: number }
>();

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 5;

function generateOtp(): string {
  return randomInt(100000, 999999).toString();
}

export async function createAndSendOtp(phone: string): Promise<{ success: boolean; message: string }> {
  const otp = generateOtp();
  const expiresAt = Date.now() + OTP_TTL_MS;

  otpMemoryStore.set(phone, { code: otp, expiresAt, attempts: 0 });

  // Log for development
  console.log(`📱 [DEV OTP] Phone: ${phone} | Code: ${otp}`);

  // Try Twilio if configured
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;
  if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER) {
    try {
      const twilio = await import("twilio");
      const client = twilio.default(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
      await client.messages.create({
        body: `Your Project Emerald OTP is: ${otp}. Valid for 5 minutes.`,
        from: TWILIO_PHONE_NUMBER,
        to: `+91${phone}`,
      });
      return { success: true, message: "OTP sent via SMS" };
    } catch (err) {
      console.error("Twilio failed, using console log:", err);
      return { success: true, message: "SMS failed, OTP logged to server console" };
    }
  }

  return { success: true, message: "OTP logged to server console (dev mode)" };
}

export async function verifyOtp(
  phone: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  const stored = otpMemoryStore.get(phone);
  if (!stored) {
    return { success: false, error: "No OTP requested for this number" };
  }

  if (Date.now() > stored.expiresAt) {
    otpMemoryStore.delete(phone);
    return { success: false, error: "OTP has expired" };
  }

  if (stored.attempts >= MAX_ATTEMPTS) {
    otpMemoryStore.delete(phone);
    return { success: false, error: "Too many failed attempts. Request a new OTP." };
  }

  stored.attempts += 1;

  if (stored.code !== code) {
    return { success: false, error: "Invalid OTP" };
  }

  // Success - clear OTP
  otpMemoryStore.delete(phone);
  return { success: true };
}