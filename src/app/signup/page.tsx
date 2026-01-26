"use client";
// import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
// import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
// import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/todo/DatePicker";
import { cn } from "@lib/utils";
import Link from "next/link";
import { title } from "process";
import { useState } from "react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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

    // TODO add functionality to use expressBackend API
  }
  return (
    // <Card className={cn("min-w-87.5 max-w-full mx-auto", "p-0", "")}>
    //   <form action={handleSubmit} className={cn("w-full", "", "")}>
    //     <FieldSet className={cn("p-5 w-full", "", "")}>
    //       <h1> Login </h1>
    //       <Field className={cn("w-full", "", "")}>
    //         <Input
    //           id="email"
    //           name="email"
    //           type="email"
    //           autoComplete="off"
    //           value={email}
    //           onChange={(e) => setEmail(e.target.value)}
    //           placeholder="Email"
    //           required
    //           className={cn("min-h-10 resize-none w-full", "", "")}
    //         />
    //       </Field>
    //       <Field className={cn("w-full", "", "")}>
    //         <Input
    //           id="password"
    //           name="password"
    //           type="password"
    //           autoComplete="off"
    //           value={password}
    //           onChange={(e) => setPassword(e.target.value)}
    //           placeholder="password"
    //           className={cn("w-full", "", "")}
    //         />
    //       </Field>
    //       <FieldGroup
    //         id="field-subgroup"
    //         className={cn(
    //           "w-full h-fit flex flex-col gap-y-2 items-stretch justify-center",
    //           "",
    //           "",
    //         )}
    //       >
    //         <span className="flex justify-between items-center">
    //           <span className="flex gap-2 items-center text-xs">
    //             <Checkbox
    //               checked={rememberMe}
    //               onCheckedChange={(checked: boolean) =>
    //                 setRememberMe(checked === true)
    //               }
    //             />
    //             <span className="text-nowrap">remember me</span>
    //           </span>
    //           <Button className="px-0 text-xs" type="button" variant={"link"}>
    //             <Link href={"/reset-password"}>Forgot password?</Link>
    //           </Button>
    //         </span>
    //         <Button type="submit" className={cn("w-full px-8", "", "")}>
    //           login
    //         </Button>
    //         <Button className="text-xs" type="button" variant={"outline"}>
    //           <Link href={"/signup"}>Signup</Link>
    //         </Button>
    //         {/* <span className="flex text-xs flex-row text-nowrap items-center w-full justify-center gap-1">
    //           Don&apos;t have an account yet?
    //           <Button className="text-xs" type="button" variant={"link"}>
    //             <Link href={"/signup"}>Signup</Link>
    //           </Button>
    //         </span> */}
    //       </FieldGroup>
    //     </FieldSet>
    //   </form>
    // </Card>

    <Card className="min-w-lg max-w-full mx-auto p-10">
      <form>
        <FieldSet className="flex flex-col">
          <FieldLegend>Profile</FieldLegend>
          <FieldDescription>Fill in your profile information.</FieldDescription>
          <FieldGroup className="mx-auto w-full">
            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <FieldDescription>
                  Provide your full name for identification
                </FieldDescription>
              </FieldContent>
              <Input id="firstname" placeholder="first name" required />
              <Input id="middlename" placeholder="middle name" />
              <Input id="lastname" placeholder="last name" required />
            </Field>

            <Field orientation="responsive">
              <FieldContent>
                {/* TODO: have this in a seperate card at the top: this is for admins. to insert their key to be permitted usage. then also admin activity is also logged with unique keys to prevent sneaky admins making a ruckus */}
                <FieldLabel htmlFor="admissionkey">Admission Key</FieldLabel>
                <FieldDescription>
                  insert admission key provided by admin to create an account*
                </FieldDescription>
              </FieldContent>
              <Input
                id="admissionkey"
                placeholder="74a8a150-0b8a-4005-afde-bbd02dbb4886"
                required
              />
            </Field>

            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="phone">Phone number</FieldLabel>
                <FieldDescription>
                  insert admission key provided by admin to create an account*
                </FieldDescription>
                <span className="flex flex-row gap-2 ">
                  <Input
                    id="countrycode"
                    type="tel"
                    placeholder="+47"
                    required
                    className="w-20"
                  />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="993 37 661"
                    required
                  />
                </span>
              </FieldContent>
            </Field>

            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor=""></FieldLabel>
                <FieldDescription></FieldDescription>
              </FieldContent>
              <Input id="" placeholder="" required />
            </Field>

            <Field orientation="responsive">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <FieldDescription>
                Must be at least 8 characters long, and contain atleast 1 small
                letter big letter and special character.
              </FieldDescription>
              <Input
                id="password"
                type="password"
                placeholder="Create password"
              />
              <Input
                id="password"
                type="password"
                placeholder="Verify password"
              />
            </Field>
          </FieldGroup>

          <FieldGroup className="mx-auto w-full">
            <Field orientation="horizontal" data-invalid>
              <Checkbox
                id="terms-checkbox-invalid"
                name="terms-checkbox-invalid"
                aria-invalid
              />
              <FieldLabel htmlFor="terms-checkbox-invalid">
                Accept terms and conditions
              </FieldLabel>
            </Field>
          </FieldGroup>
          <FieldGroup className="mx-auto w-full">
            <Field orientation="responsive">
              <Button type="submit">Submit</Button>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
    </Card>
  );
}
