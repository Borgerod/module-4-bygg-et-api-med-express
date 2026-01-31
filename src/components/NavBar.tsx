"use client";
import Image from "next/image";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
import { useState } from "react";
export default function NavBar() {
  const pathname = usePathname();
  const [isOnline, setIsOnline] = useState(true);
  return (
    <NavigationMenu
    // className="bg-amber-200"
    >
      <NavigationMenuList className="flex p-2 px-5 w-full justify-between">
        <NavigationMenuLink
          // TODO: pick one profile image button or burger menu
          id="profile-button"
          className="hover:bg-transparent active:bg-transparent rounded-xl"
          // href={{
          //   pathname: "/",
          // }}
          href="/"
        >
          2Do
        </NavigationMenuLink>

        <div id="nav-buttons-row" className="flex gap-2">
          <div
            id="buttons-when-logged-out"
            className={cn(isOnline ? "hidden" : "visible contents")}
          >
            <Button
              id="log-in-button"
              type={"button"}
              variant={"ghost"}
              className={cn(
                "cursor-pointer",
                "shadow-md hover:shadow-xs hover:bg flex h-12 items-center justify-center rounded-xl border border-solid px-5 transition-colors hover:border-transparent dark:border-white/[.145] dark:hover:bg-[#1a1a1a] hover:bg-stone-200 border-stone-300/90",
                "w-full sm:w-fit",
                "text-nowrap",
                "",
              )}
            >
              <NavigationMenuLink
                href={`/login?from=${encodeURIComponent(pathname)}`}
                // href={{
                //   pathname: "/login",
                //   query: { from: pathname },
                // }}
              >
                Log in
              </NavigationMenuLink>
            </Button>

            <Button
              id="sign-up-button"
              type={"button"}
              variant={"ghost"}
              className={cn(
                "cursor-pointer",
                "shadow-md hover:shadow-xs hover:bg flex h-12 items-center justify-center rounded-xl border border-solid px-5 transition-colors hover:border-transparent dark:border-white/[.145] dark:hover:bg-[#1a1a1a] hover:bg-stone-200 border-stone-300/90",
                "w-full sm:w-fit",
                "text-nowrap",
                "",
              )}
            >
              <NavigationMenuLink
                href={`/login?from=${encodeURIComponent(pathname)}`}

                // href={{
                //   pathname: "/signup",
                //   query: { from: pathname },
                // }}
              >
                Sign up
              </NavigationMenuLink>
            </Button>
          </div>

          <div
            id="buttons-when-logged-in"
            className={cn(isOnline ? "visible contents" : "hidden")}
          >
            <div id="user-diplay-row" className="flex items-center gap-2">
              {/* this is mostly to further prove that user is logged in */}
              Hello
              {/* {user.firstname}  */}
              {/* todo implement this */} Aleksander {/* placeholder */}
              <NavigationMenuLink
                // TODO: pick one profile image button or burger menu
                id="profile-button"
                href={`/user`}
                className="contents"
              >
                <Image
                  src="/profile.png"
                  // todo get user image if any add fallback
                  width={50}
                  height={50}
                  alt="user image"
                  className="rounded-full bg-accent w-12 h-12 aspect-square"
                />
              </NavigationMenuLink>
            </div>
            <Button
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
              variant={"ghost"}
              // onClick={handleLogout}
            >
              Log out
            </Button>
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
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
