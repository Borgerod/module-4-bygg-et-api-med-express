"use client";
import Image from "next/image";

import { usePathname } from "next/navigation";

import {
  NavigationMenuLink,
  NavigationMenuList,
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
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { UserContext } from "@lib/userProvider";

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("useContext must be used within a UserProvider");
  }
  const { user, setUser } = userContext;

  const handleLogout = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    const url = `${process.env.NEXT_PUBLIC_EXPRESS_URL}/auth/logout`;

    const options: RequestInit = {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      credentials: "include" as RequestCredentials,
      body: JSON.stringify({ userId: user?.userId }),
    };

    try {
      const response = await fetch(url, options);
      if (response.status !== 204) {
        const data = await response.json();
        console.log(data);
      }
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <NavigationMenu>
      <NavigationMenuList
        className={cn(
          "flex",
          "p-2",
          "px-5",
          "w-full",
          "justify-between",
          "h-15",
          "overflow-x-auto",
          "",
          "",
        )}
      >
        <NavigationMenuLink
          id="profile-button"
          className={cn("contents", "", "")}
          href="/"
        >
          <Image
            src="/logo.png"
            alt="2Do logo"
            width={50}
            height={50}
            className={cn(
              "h-7 w-12",
              "dark:opacity-90",
              "dark:brightness-120",
              "dark:saturate-70",
              "",
              "",
            )}
          />
        </NavigationMenuLink>

        <div id="nav-buttons-row" className={cn("flex gap-2", "", "")}>
          {user ? (
            <div
              id="buttons-when-logged-in"
              className={cn("visible contents", "", "")}
            >
              <div
                id="user-diplay-row"
                className={cn("flex w-fit items-center gap-1 sm:gap-2", "", "")}
              >
                <span className="contents text-nowrap">
                  {user.firstname}, {user.middlename ? user.middlename : ""}{" "}
                  {user.lastname}
                </span>

                <NavigationMenuLink
                  id="profile-button"
                  href={`/user`}
                  className={cn("contents", "", "")}
                >
                  {/* <Image
                    src="/profile.png"
                    width={50}
                    height={50}
                    alt="user image"
                    className={cn(
                      "rounded-full bg-accent w-12 h-12 aspect-square",
                      "",
                      "",
                    )}
                  /> */}
                </NavigationMenuLink>
              </div>
              <NavigationMenuLink
                id="log-out-button"
                href="/"
                onClick={handleLogout}
                className={cn("hidden sm:contents", "", "")}
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

                  <DropdownMenuSeparator className="sm:hidden" />
                  <DropdownMenuItem className={cn("sm:hidden", "", "")}>
                    <NavigationMenuLink
                      href="/"
                      className={cn("contents", "", "")}
                    >
                      <Button
                        id="log-out-button"
                        onClick={handleLogout}
                        variant={"ghost"}
                        size={"lg"}
                        className="contents"
                      >
                        Log out
                      </Button>
                    </NavigationMenuLink>
                  </DropdownMenuItem>
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
                href={`/signup?from=${encodeURIComponent(pathname)}`}
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
