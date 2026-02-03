import "server-only";
import { UserProfile } from "@expressBackend/schema/user.schema";
import { cookies } from "next/headers";
import { cache } from "react";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "@expressBackend/config/env.config";

export function getUserIdFromVerifiedToken(token: string): {
  id: string;
} {
  const payload = jwt.verify(token, config.jwt.secret) as JwtPayload;

  if (!payload.sub) {
    throw new Error("Token has no subject");
  }

  return { id: payload.sub };
}

export const getUserProfileFromDb = cache(
  async (): Promise<UserProfile | null> => {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) {
      return null;
    }

    const { id } = getUserIdFromVerifiedToken(accessToken);

    const userResponse = await fetch(
      `${process.env.NEXT_PUBLIC_EXPRESS_URL}/users/${id}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const employeeResponse = await fetch(
      `${process.env.NEXT_PUBLIC_EXPRESS_URL}/employees/by-user/${id}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const userJson = await userResponse.json();
    const employeeJson = await employeeResponse.json();
    console.log(employeeJson);

    return { ...userJson, ...employeeJson };
  },
);
