/**
 * Brute-force protection for PIN login.
 * A 4-digit PIN has only 10,000 combinations, so failures are limited
 * per phone number with escalating lockouts.
 * (In-memory like the OTP store; use Redis for multi-instance deployments.)
 */
const MAX_ATTEMPTS = 5;
const LOCKOUT_ESCALATION_MS = [
  15 * 60 * 1000,       // 15 minutes
  60 * 60 * 1000,       // 1 hour
  24 * 60 * 60 * 1000,  // 24 hours
];

interface PinAttemptEntry {
  failures: number;
  lockouts: number;
  lockedUntil: number; // 0 = not locked
}

const store = new Map<string, PinAttemptEntry>();

export function checkPinAttempt(
  phone: string
): { allowed: boolean; retryAfterMs: number } {
  const entry = store.get(phone);
  if (!entry) return { allowed: true, retryAfterMs: 0 };

  if (entry.lockedUntil > Date.now()) {
    return { allowed: false, retryAfterMs: entry.lockedUntil - Date.now() };
  }

  // Lockout expired — keep the escalation counter, reset failure count
  if (entry.lockedUntil) {
    store.set(phone, { failures: 0, lockouts: entry.lockouts, lockedUntil: 0 });
  }
  return { allowed: true, retryAfterMs: 0 };
}

export function recordPinFailure(phone: string): void {
  const entry = store.get(phone) ?? { failures: 0, lockouts: 0, lockedUntil: 0 };
  entry.failures += 1;
  if (entry.failures >= MAX_ATTEMPTS) {
    const lockoutMs =
      LOCKOUT_ESCALATION_MS[Math.min(entry.lockouts, LOCKOUT_ESCALATION_MS.length - 1)];
    entry.lockedUntil = Date.now() + lockoutMs;
    entry.lockouts += 1;
    entry.failures = 0;
  }
  store.set(phone, entry);
}

export function resetPinAttempts(phone: string): void {
  store.delete(phone);
}