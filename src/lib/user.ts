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
    } else {
      const { id } = getUserIdFromVerifiedToken(accessToken);

      const userJson = await fetch(
        `${process.env.NEXT_PUBLIC_EXPRESS_URL}/users/${id}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ).json();
      const employeeJson = await fetch(
        `${process.env.NEXT_PUBLIC_EXPRESS_URL}/employees/${id}`,
        {
          method: "GET",
          credentials: "include",
        },
      ).json();
      const UserProfile = { ...userJson, ...employeeJson };
      return UserProfile;
    }
  },
);

// export const getEmployee = cache(async (user: UserProfile) => {
//   /* side-note:  employee["user_account"] = employee["id"] */

//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_EXPRESS_URL}/employees/${user.userAccount}`,
//     {
//       method: "GET",
//       credentials: "include",
//     },
//   );

//   if (!res.ok) {
//     console.error("getUser - fetch failed:", res.status, await res.text());
//     return null;
//   }

//   return res.json();
// });
