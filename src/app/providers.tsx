"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { User } from "@expressBackend/schema/user.schema";
import { Employee } from "@expressBackend/schema/employee.schema";

type UserContextType = {
  user: User | null;
  employee: Employee | null;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
};

const UserContext = createContext<UserContextType>({
  user: null,
  employee: null,
  refreshUser: async () => {},
  isLoading: false,
});

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({
  children,
  initialUser,
  initialEmployee,
}: {
  children: ReactNode;
  initialUser: User | null;
  initialEmployee?: Employee | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [employee, setEmployee] = useState<Employee | null>(
    initialEmployee ?? null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const refreshRes = await fetch(
        `${process.env.NEXT_PUBLIC_EXPRESS_URL}/auth/refresh`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!refreshRes.ok) {
        setUser(null);
        setEmployee(null);
        return;
      }

      const refreshData = await refreshRes.json();
      const userId = refreshData?.user?.id;

      if (!userId) {
        setUser(null);
        setEmployee(null);
        return;
      }

      const userRes = await fetch(
        `${process.env.NEXT_PUBLIC_EXPRESS_URL}/users/${userId}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!userRes.ok) {
        setUser(null);
        setEmployee(null);
        return;
      }

      const fullUser: User = await userRes.json();
      setUser(fullUser);

      if (fullUser?.userAccount) {
        const empRes = await fetch(
          `${process.env.NEXT_PUBLIC_EXPRESS_URL}/employees/${fullUser.userAccount}`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (empRes.ok) {
          const empData = await empRes.json();
          setEmployee(empData);
        } else {
          setEmployee(null);
        }
      } else {
        setEmployee(null);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
      setUser(null);
      setEmployee(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        employee,
        refreshUser,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
