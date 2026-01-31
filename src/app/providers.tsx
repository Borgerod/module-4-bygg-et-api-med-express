"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type User = { id: string };
type UserContextType = {
  user: User | null;
  refreshUser: () => Promise<void>;
  loading: boolean;
};

const UserContext = createContext<UserContextType>({
  user: null,
  refreshUser: async () => {},
  loading: true,
});

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: User | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_EXPRESS_URL}/auth/refresh`;
      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user?.id) {
          setUser({ id: data.user.id });
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
    setLoading(false);
  };

  return (
    <UserContext.Provider value={{ user, refreshUser: fetchUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}
