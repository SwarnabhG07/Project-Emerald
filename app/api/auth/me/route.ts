import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/get-current-user";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({
    authenticated: true,
    farmer: {
      id: user.id,
      phone: user.phone,
      name: user.profile?.fullName || user.name,
      kisanId: user.kisanId,
      profile: user.profile,
      profileComplete: user.profile?.isComplete || false,
    },
  });
}