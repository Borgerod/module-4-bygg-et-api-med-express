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
import { useEffect, useState } from "react";
import { useUser } from "@/app/providers";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const { user, refreshUser, loading } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  // if (loading) return null; // Or a spinner if you want

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
      <NavigationMenuList className="flex p-2 px-5 w-full justify-between">
        <NavigationMenuLink
          id="profile-button"
          className="hover:bg-transparent active:bg-transparent rounded-xl"
          href="/"
        >
          <Image src="/logo.png" alt="2Do logo" width={50} height={50} />
        </NavigationMenuLink>

        <div id="nav-buttons-row" className="flex gap-2">
          {loading ? (
            <div className={cn("flex items-center", "", "")}>
              {/* You can use a spinner, skeleton, or just keep space */}
              <span className={cn("w-32 h-12", "", "")}></span>
            </div>
          ) : !user ? (
            <div
              id="buttons-when-logged-out"
              className={cn("visible contents", "", "")}
            >
              <NavigationMenuLink
                id="log-in-button"
                className={cn(
                  "cursor-pointer",
                  "shadow-md hover:shadow-xs hover:bg flex h-12 items-center justify-center rounded-xl border border-solid px-5 transition-colors hover:border-transparent dark:border-white/[.145] dark:hover:bg-[#1a1a1a] hover:bg-stone-200 border-stone-300/90",
                  "w-full sm:w-fit",
                  "text-nowrap",
                  "border-none",
                  "shadow-none",
                  "",
                )}
                href={`/login?from=${encodeURIComponent(pathname)}`}
              >
                Log in
              </NavigationMenuLink>

              <NavigationMenuLink
                id="sign-up-button"
                className={cn(
                  "cursor-pointer",
                  "shadow-md hover:shadow-xs hover:bg flex h-12 items-center justify-center rounded-xl border border-solid px-5 transition-colors hover:border-transparent dark:border-white/[.145] dark:hover:bg-[#1a1a1a] hover:bg-stone-200 border-stone-300/90",
                  "w-full sm:w-fit",
                  "text-nowrap",
                  "border-none",
                  "shadow-none",
                  "",
                )}
                href={`/login?from=${encodeURIComponent(pathname)}`}
              >
                Sign up
              </NavigationMenuLink>
            </div>
          ) : (
            <div
              id="buttons-when-logged-in"
              className={cn("visible contents", "", "")}
            >
              <div id="user-diplay-row" className="flex items-center gap-2">
                Hello Aleksander
                <NavigationMenuLink
                  id="profile-button"
                  href={`/user`}
                  className="contents"
                >
                  <Image
                    src="/profile.png"
                    width={50}
                    height={50}
                    alt="user image"
                    className="rounded-full bg-accent w-12 h-12 aspect-square"
                  />
                </NavigationMenuLink>
              </div>
              <NavigationMenuLink
                id="log-out-button"
                className={cn(
                  "cursor-pointer",
                  "shadow-md hover:shadow-xs hover:bg flex h-12 items-center justify-center rounded-xl border border-solid px-5 transition-colors hover:border-transparent dark:border-white/[.145] dark:hover:bg-[#1a1a1a] hover:bg-stone-200 border-stone-300/90",
                  "w-full sm:w-fit",
                  "text-nowrap",
                  "border-none",
                  "shadow-none",
                  "",
                )}
                href="/"
                onClick={handleLogout}
              >
                Log out
              </NavigationMenuLink>
              {/* <NavigationMenuItem
                id="log-out-button"
                className={cn(
                  "cursor-pointer",
                  "h-12",
                  "rounded-full",
                  "rounded-xl",
                  "hover:shadow-xs   transition-colors ",
                  "dark:hover:bg-[#1a1a1a] hover:bg-stone-200",
                  "",
                )}
              >
                <Button
                  type="button"
                  className="contents text-primary"
                  onClick={handleLogout}
                >
                  Log out
                </Button>
              </NavigationMenuItem> */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    id="menu-dropdown-button"
                    className={cn(
                      "cursor-pointer",
                      "h-12 w-12",
                      "rounded-full",
                      "rounded-xl",
                      "hover:shadow-xs   transition-colors ",
                      "dark:hover:bg-[#1a1a1a] hover:bg-stone-200",
                      "",
                    )}
                    size={"icon"}
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
          )}
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
