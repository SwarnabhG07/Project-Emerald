/**
 * Server-side key wrapping.
 * Wraps farmer DEKs with a master KEK so only the server can decrypt.
 * Wrapped blob layout: iv(12) || ciphertext || authTag(16), base64-encoded.
 */
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGO = "aes-256-gcm";
const IV_LEN = 12;
const TAG_LEN = 16;

function getKek(): Buffer {
  const masterKey = process.env.DOCUMENT_MASTER_KEY;
  if (!masterKey) {
    throw new Error("DOCUMENT_MASTER_KEY env var not set");
  }
  return Buffer.from(masterKey, "base64");
}

export function wrapKey(dekBase64: string): { wrapped: string } {
  const kek = getKek();
  const iv = randomBytes(IV_LEN);
  const dekBuffer = Buffer.from(dekBase64, "base64");
  const cipher = createCipheriv(ALGO, kek, iv);
  const encrypted = Buffer.concat([cipher.update(dekBuffer), cipher.final()]);
  const combined = Buffer.concat([iv, encrypted, cipher.getAuthTag()]);
  return { wrapped: combined.toString("base64") };
}

export function unwrapKey(wrappedBase64: string): string {
  const kek = getKek();
  const combined = Buffer.from(wrappedBase64, "base64");
  if (combined.length < IV_LEN + TAG_LEN) {
    throw new Error("Invalid wrapped key");
  }
  const iv = combined.subarray(0, IV_LEN);
  const authTag = combined.subarray(combined.length - TAG_LEN);
  const encrypted = combined.subarray(IV_LEN, combined.length - TAG_LEN);
  const decipher = createDecipheriv(ALGO, kek, iv);
  decipher.setAuthTag(authTag);
  const dekBuffer = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return dekBuffer.toString("base64");
}

/**
 * Decrypts a file encrypted client-side with AES-256-GCM
 * (Web Crypto appends the 16-byte auth tag to the ciphertext).
 */
export function decryptFileBytes(
  ciphertext: Buffer,
  dekBase64: string,
  ivBase64: string
): Buffer {
  if (ciphertext.length < TAG_LEN) throw new Error("Invalid ciphertext");
  const data = ciphertext.subarray(0, ciphertext.length - TAG_LEN);
  const authTag = ciphertext.subarray(ciphertext.length - TAG_LEN);
  const decipher = createDecipheriv(
    ALGO,
    Buffer.from(dekBase64, "base64"),
    Buffer.from(ivBase64, "base64")
  );
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(data), decipher.final()]);
}