"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/todo/DatePicker";
import { cn } from "@lib/utils";
import Link from "next/link";
import { title } from "process";
import { useState, useEffect, useRef } from "react";
import * as React from "react";
import { Notification } from "@/components/ui/Notification";
// import { useRouter } from "next/router";
// import { useRouter, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [buttonText, setButtonText] = useState("Login");
  const [notification, setNotification] = useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const router = useRouter();
  // const searchParams = useSearchParams();
  // const pathname = usePathname();
  const referer = getReferer();

  // const [loginStatus, setLoginStatus] = useState(""); //related to UI messages "logging in.." "failed to login" etc. not related to tokens.

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setButtonText("Logging in...");
    setNotification(false);
    try {
      const url = "http://localhost:4000/auth/login";
      const options = {
        method: "POST",
        headers: {
          Accept: "*/*",
          "User-Agent": "Thunder Client (https://www.thunderclient.com)",
          "Content-Type": "application/json",
        },
        body: `{"email":"${email}","password":"${password}"}`,
      };
      const response = await fetch(url, options);
      const text = await response.text();
      let data: { error?: string } = {};
      try {
        data = JSON.parse(text);
      } catch {
        data.error = text;
      }

      //  const userAgent = headersList.get('user-agent')

      setButtonText("Logging in..");
      // test: go back if it takes you out of the website, then take to home.
      // http://localhost:3000/
      // router.back();

      // const prevPage = localStorage.getItem("prevPage");

      // you can now use prevPage as needed
      if (referer) {
        router.push(referer);
        // router.push("./todo");
        // now that i think about it it should inherit the desired destination from parent (could be todoexpress or prisma todo) fallback is home.
      } else {
        // router.back();
      }
      // if (!data.error) {
      //   router.push(referer);
      // }
    } catch (error) {
      setMessage(
        "✗ Error: " + (error instanceof Error ? error.name : "Failed"),
      );
      setNotification(true);
      setButtonText("Log in");
    }
  }
  return (
    <Card className={cn("min-w-87.5 max-w-full mx-auto", "p-0", "")}>
      <form onSubmit={handleSubmit}>
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
  );
}

function getReferer(): string {
  if (typeof document === "undefined") return "/";
  const match = document.cookie.match(/(?:^|; )referer=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : "/";
}
