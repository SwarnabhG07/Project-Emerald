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
  let user = await getCurrentUser();
  if (!user) {
    // For demo purposes (since we bypassed login and use localStorage), 
    // just pick the first farmer in the DB if there is one.
    let firstFarmer = await prisma.farmer.findFirst({
      include: { profile: true },
    });
    if (!firstFarmer) {
      // Create a dummy farmer if DB is completely empty
      firstFarmer = await prisma.farmer.create({
        data: {
          phone: "9999999999",
          pinHash: "dummy",
          name: "Demo Farmer",
          profile: {
            create: {
              isComplete: true,
              state: "Maharashtra",
              landSizeAcres: 5,
              landOwnership: "Owner",
            }
          }
        },
        include: { profile: true },
      });
    }
    user = firstFarmer;
  }
  return user;
}