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
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: UserProfile | null;
}) {
  const [user, setUser] = useState<UserProfile | null>(initialUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// "use client";

// import { createContext } from "react";
// import { UserProfile } from "@expressBackend/schema/user.schema";

// export const UserContext = createContext<Promise<UserProfile> | null>(null);

// export default function UserProvider({
//   children,
//   userPromise,
// }: {
//   children: React.ReactNode;
//   userPromise: Promise<UserProfile>;
// }) {
//   return <UserContext value={userPromise}>{children}</UserContext>;
// }
