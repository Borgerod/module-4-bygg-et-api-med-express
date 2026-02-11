"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@lib/utils";
import Link from "next/link";
import { useState } from "react";
import * as React from "react";
import { Notification } from "@/components/ui/Notification";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { UserContext } from "@lib/userProvider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [buttonText, setButtonText] = useState("Login");
  const [notification, setNotification] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const router = useRouter();

  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("useContext must be used within a UserProvider");
  }
  const { setUser } = userContext;

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setButtonText("Logging in...");
    setNotification(false);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_EXPRESS_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password, rememberMe }),
        },
      );

      if (res.ok) {
        setNotification(false);

        const profileRes = await fetch("/api/user-profile", {
          credentials: "include",
        });

        if (profileRes.ok) {
          const userProfile = await profileRes.json();
          setUser(userProfile);
        }

        router.push(redirectTo);
        router.refresh();
      } else {
        const data = await res.json();
        setMessage(data.message || "Login failed");
        setNotification(true);
        setButtonText("Login");
      }
    } catch (error) {
      setMessage("Network error");
      console.error("Network error: ", error);
      setNotification(true);
      setButtonText("Login");
    }
  }
  return (
    <div
      className={cn(
        "flex-1",
        "flex",
        "flex-col",
        "h-full",
        "justify-around",
        "sm:justify-center",
        "justify-self-center",
        "self-center",
        "place-self-center",
        "gap-10",
        "py-5",
        "max-w-4xl",
        "sm:pb-30",
        "pb-30",
        "",
        "",
      )}
    >
      <Card
        className={cn("min-w-87.5", "max-w-full", "mx-auto", "p-0", "", "")}
      >
        <form onSubmit={handleLogin}>
          <FieldSet className={cn("p-5 w-full", "", "")}>
            <h1 className="text-2xl mb-4">Login</h1>
            {notification && <Notification message={message} type="warning" />}

            <Field className={cn("w-full", "", "")}>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className={cn("min-h-10 resize-none w-full", "", "")}
              />
            </Field>
            <Field className={cn("w-full", "", "")}>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="off"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                className={cn("w-full", "", "")}
              />
            </Field>
            <FieldGroup
              id="field-subgroup"
              className={cn(
                "w-full h-fit flex flex-col gap-y-2 items-stretch justify-center",
                "",
                "",
              )}
            >
              <span className="flex justify-between items-center">
                <span className="flex gap-2 items-center text-xs">
                  <Checkbox
                    checked={rememberMe}
                    onCheckedChange={(checked: boolean) =>
                      setRememberMe(checked === true)
                    }
                  />
                  <span className="text-nowrap">remember me</span>
                </span>
                <Button className="px-0 text-xs" type="button" variant={"link"}>
                  <Link href={"/reset-password"}>Forgot password?</Link>
                </Button>
              </span>
              <Button type="submit" className="w-full">
                {buttonText ? buttonText : "Log in"}
              </Button>

              <Button className="text-xs" type="button" variant={"outline"}>
                <Link href={"/signup"}>Signup</Link>
              </Button>
            </FieldGroup>
          </FieldSet>
        </form>
      </Card>
    </div>
  );
}
