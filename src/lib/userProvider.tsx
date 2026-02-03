"use client";

import { createContext, useState, Dispatch, SetStateAction } from "react";
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

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
