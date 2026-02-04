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
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/user-profile");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
