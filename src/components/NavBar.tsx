"use client";
import Image from "next/image";

import Link from "next/link";
import { redirect, usePathname } from "next/navigation";

import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { RxHamburgerMenu } from "react-icons/rx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { NavigationMenu } from "@radix-ui/react-navigation-menu";
import { cn } from "@lib/utils";
import { Button } from "./ui/button";
import { useUser } from "@/app/providers";
import { useRouter } from "next/navigation";
import { Employee } from "@expressBackend/schema/employee.schema";
import { User } from "@expressBackend/schema/user.schema";
import { da } from "date-fns/locale";

export default function NavBar() {
  const { user, employee, refreshUser } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  console.log("=== NavBar Debug ===");
  console.log("user:", user);
  console.log("employee:", employee);
  console.log("employee?.firstname:", employee?.firstname);
  console.log("user.email:", user?.email);
  console.log("==================");

  const handleLogout = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (!user?.id) {
      console.warn("No userId available for logout.");
      return;
    }
    const url = `${process.env.NEXT_PUBLIC_EXPRESS_URL}/auth/logout`;

    const options: RequestInit = {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      credentials: "include" as RequestCredentials,
      body: JSON.stringify({ userId: user.id }),
    };

    try {
      const response = await fetch(url, options);
      if (response.status !== 204) {
        const data = await response.json();
        console.log(data);
      }
      await refreshUser();
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <NavigationMenu>
      <NavigationMenuList className={cn("flex p-2 px-5 w-full justify-between", "", "")}>
        <NavigationMenuLink
          id="profile-button"
          className={cn("hover:bg-transparent active:bg-transparent rounded-xl", "", "")}
          href="/"
        >
          <Image src="/logo.png" alt="2Do logo" width={50} height={50} />
        </NavigationMenuLink>

        <div id="nav-buttons-row" className={cn("flex gap-2", "", "")}>
          {user ? (
            <div
              id="buttons-when-logged-in"
              className={cn("visible contents", "", "")}
            >
              <div id="user-diplay-row" className={cn("flex items-center gap-2", "", "")}>
                <span>Hello {user.email}</span>
                {employee?.firstname && <span>Hello {employee.firstname}</span>}
                <NavigationMenuLink
                  id="profile-button"
                  href={`/user`}
                  className={cn("contents", "", "")}
                >
                  <Image
                    src="/profile.png"
                    width={50}
                    height={50}
                    alt="user image"
                    className={cn("rounded-full bg-accent w-12 h-12 aspect-square", "", "")}
                  />
                </NavigationMenuLink>
              </div>
              <NavigationMenuLink
                id="log-out-button"
                href="/"
                onClick={handleLogout}
                className={cn("contents", "", "")}
              >
                <Button variant={"ghost"} size={"lg"}>
                  Log out
                </Button>
              </NavigationMenuLink>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    id="menu-dropdown-button"
                    size={"icon-lg"}
                    type={"button"}
                    variant={"ghost"}
                  >
                    <RxHamburgerMenu />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>GitHub</DropdownMenuItem>
                  <DropdownMenuItem>Support</DropdownMenuItem>
                  <DropdownMenuItem disabled>API</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div
              id="buttons-when-logged-out"
              className={cn("visible contents", "", "")}
            >
              <NavigationMenuLink
                id="log-in-button"
                href={`/login?from=${encodeURIComponent(pathname)}`}
                className={cn("contents", "", "")}
              >
                <Button variant={"ghost"} size={"lg"}>
                  Log in
                </Button>
              </NavigationMenuLink>

              <NavigationMenuLink
                id="sign-up-button"
                href={`/login?from=${encodeURIComponent(pathname)}`}
                className={cn("contents", "", "")}
              >
                <Button variant={"ghost"} size={"lg"}>
                  Sign up
                </Button>
              </NavigationMenuLink>
            </div>
          )}
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
