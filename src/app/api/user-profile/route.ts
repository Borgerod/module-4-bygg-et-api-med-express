import { getUserProfileFromDb } from "@lib/user";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getUserProfileFromDb();
    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return NextResponse.json(null, { status: 401 });
  }
}
