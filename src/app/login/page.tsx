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
import { useState } from "react";
import * as React from "react";

export default function Page() {
  //   const data = await fetch("");
  //   const posts = await data.json();
  const [rememberMe, setRememberMe] = React.useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  async function handleSubmit(formData: FormData) {
    setEmail(formData.get("email") as string);
    setPassword(formData.get("password") as string);
    console.log({ email, password });

    // onAdd({
    //   email,
    //   password,
    // });
  }
  return (
    <Card className={cn("min-w-87.5 max-w-full mx-auto", "p-0", "")}>
      <form action={handleSubmit} className={cn("w-full", "", "")}>
        <FieldSet className={cn("p-5 w-full", "", "")}>
          <h1> Login </h1>
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
            <Button type="submit" className={cn("w-full px-8", "", "")}>
              login
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
