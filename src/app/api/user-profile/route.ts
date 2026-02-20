import { NextResponse } from "next/server";
import { getUserProfileFromDb } from "@/lib/user";
import { cookies } from "next/headers";

export async function GET() {
  const user = await getUserProfileFromDb();
  if (!user) {
    const cookieStore = cookies();
    (await cookieStore).delete("accessToken");
    (await cookieStore).delete("refreshToken");
    console.log("[user-profile] Invalid token detected, cookies cleared.");
    return NextResponse.json(null);
  }
  console.log("[user-profile] User authenticated:", user?.userId ?? "unknown"); //should allways be known
  return NextResponse.json(user);
}
