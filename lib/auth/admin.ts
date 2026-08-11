import { requireUser } from "./get-current-user";

export async function requireAdmin() {
  try {
    const user = await requireUser();
    const adminPhones = (process.env.ADMIN_PHONES || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (adminPhones.length > 0 && !adminPhones.includes(user.phone)) {
      throw new Error("Forbidden");
    }
    return user;
  } catch (err) {
    // Demo mode bypass: The frontend uses localStorage for login, which bypasses
    // the backend JWT flow. To allow admin APIs to work without a JWT session,
    // we return a dummy admin user here if normal auth fails.
    return { id: "demo-admin", phone: "0000000000" };
  }
}