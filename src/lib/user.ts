import { UserProfile } from "@expressBackend/schema/user.schema";
import { cookies } from "next/headers";
import { cache } from "react";

export const getUser = cache(async (): Promise<UserProfile | null> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const id = cookieStore.get("id")?.value;

  if (!accessToken || !id) {
    return null;
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_EXPRESS_URL}/users/${id}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  if (!res.ok) {
    return null;
  }
  const userJson = await res.json();
  const employeeJson = await getEmployee(userJson);
  const UserProfile = { ...userJson, ...employeeJson };
  return UserProfile;
});

export const getEmployee = cache(async (user: UserProfile) => {
  /* side-note:  employee["user_account"] = employee["id"] */

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_EXPRESS_URL}/employees/${user.userAccount}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!res.ok) {
    console.error("getUser - fetch failed:", res.status, await res.text());
    return null;
  }

  return res.json();
});
