import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashPin(pin: string, phone: string): Promise<string> {
  // Pepper the PIN with phone number to prevent rainbow tables
  const pepper = process.env.PIN_PEPPER || "default-pepper";
  const salted = `${phone}:${pin}:${pepper}`;
  return bcrypt.hash(salted, SALT_ROUNDS);
}

export async function verifyPin(
  pin: string,
  phone: string,
  hash: string
): Promise<boolean> {
  const pepper = process.env.PIN_PEPPER || "default-pepper";
  const salted = `${phone}:${pin}:${pepper}`;
  return bcrypt.compare(salted, hash);
}