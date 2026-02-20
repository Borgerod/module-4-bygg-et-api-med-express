"use client";

import {
  createContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { UserProfile } from "@expressBackend/schema/user.schema";

type UserContextType = {
  user: UserProfile | null;
  setUser: Dispatch<SetStateAction<UserProfile | null>>;
  refreshUser: () => Promise<void>;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

async function fetchUserProfile(): Promise<UserProfile | null> {
  const refreshRes = await fetch(
    `${process.env.NEXT_PUBLIC_EXPRESS_URL}/auth/refresh`,
    {
      credentials: "include",
    },
  );
  if (!refreshRes.ok) return null;
  const refreshData = await refreshRes.json();
  const user = refreshData?.user;
  if (!user?.id) return null;

  const [userRes, employeeRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_EXPRESS_URL}/users/${user.id}`, {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${refreshData.accessToken}`,
      },
    }),
    fetch(
      `${process.env.NEXT_PUBLIC_EXPRESS_URL}/employees/by-user/${user.id}`,
      {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${refreshData.accessToken}`,
        },
      },
    ),
  ]);

  if (!userRes.ok || !employeeRes.ok) return null;
  const userJson = await userRes.json();
  const employeeJson = await employeeRes.json();
  return { ...userJson, ...employeeJson };
}

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    setLoading(true);
    const profile = await fetchUserProfile();
    setUser(profile);
    setLoading(false);
  };

  useEffect(() => {
    const fetchAndSetUser = async () => {
      setLoading(true);
      const profile = await fetchUserProfile();
      setUser(profile);
      setLoading(false);
    };
    fetchAndSetUser();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}
