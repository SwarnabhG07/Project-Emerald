import { getSession } from "./session";
import { prisma } from "@/lib/db";

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  const farmer = await prisma.farmer.findUnique({
    where: { id: session.farmerId },
    include: { profile: true },
  });

  return farmer;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}