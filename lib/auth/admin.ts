import { requireUser } from "./get-current-user";

export async function requireAdmin() {
  const user = await requireUser();
  const adminPhones = (process.env.ADMIN_PHONES || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (adminPhones.length === 0) {
    // Fail CLOSED in production: an unset ADMIN_PHONES must not grant
    // admin to every authenticated farmer. Dev-only convenience otherwise.
    if (process.env.NODE_ENV === "production") {
      throw new Error("Forbidden");
    }
    return user;
  }

  if (!adminPhones.includes(user.phone)) {
    throw new Error("Forbidden");
  }
  return user;
}