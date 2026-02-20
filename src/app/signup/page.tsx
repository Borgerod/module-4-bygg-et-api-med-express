// TODO: make sure this works
// todo: implement this: new employe fills in form and submits which will then be assigned to an admin (by a filled field or through other means) then the admin will fill in the rest if the information before submitting, => finilazing the user creation process.

"use client";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/todo/DatePicker";
import { cn } from "@lib/utils";
import Link from "next/link";
import { title } from "process";
import { useState } from "react";
import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  departments,
  positions,
  roles,
} from "@/app/api/expressBackend/constants/employee.contants";
import { PhoneInput } from "@/components/ui/signup/phone-input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
export default function Page() {
  //   const data = await fetch("");
  //   const posts = await data.json();
  const [rememberMe, setRememberMe] = React.useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date>();
  const [firstname, setFirstname] = useState<string>("");
  const [middlename, setMiddlename] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [fullname, setFullname] = useState<string>(
    `${firstname}${middlename ? middlename : ""} ${lastname}`,
  );
  const [phone, setPhone] = useState<string>(""); // add this state
  const [position, setPosition] = useState<string>(""); // add this state
  const [role, setRole] = useState<string>(""); // add this state
  const [department, setDepartment] = useState<string>(""); // add this state

  // TODO: implement third-party sign-in options: Google, LinkedIn, BankID, Vipps.

  async function handleSubmit(formData: FormData) {
    setEmail(formData.get("email") as string);
    setPassword(formData.get("password") as string);
    console.log({ email, password });

    // TODO add functionality to use expressBackend API
  }

  function formatToDisplayText(fieldName: string): React.ReactNode {
    /* SQL fieldnames to readable text: "FinanceAndAccounting" -> "Finance And Accounting" */
    return fieldName.replace(/([A-Z])(?=[a-z])/g, " $1").trim();
  }

  function getOptions(positions: string[]): React.ReactNode {
    return (
      <SelectGroup>
        {positions.map((position, i) => (
          <SelectItem key={i} value={position}>
            {formatToDisplayText(position)}
          </SelectItem>
        ))}
      </SelectGroup>
    );
  }

  function getEmployeeId(): undefined {
    // throw new Error("Function not implemented.");
    // TODO - ref: (employee-id-issue)
  }

  // TODO: refactor - i feel like this should be split up into two forms. one issued to the new employee and one issued to the employer to finish complete the form.
  // which would be linked with the addmission key for saftey (and relation)
  return (
    <div className="flex flex-col gap-5 w-full mb-10">
      <h1 className="text-xl "> Employee Registration </h1>
      <Tabs defaultValue="employee-form" className="">
        <TabsList>
          <TabsTrigger value="employee-form">employee</TabsTrigger>
          <TabsTrigger value="employer-form">employer</TabsTrigger>
        </TabsList>

        <TabsContent value="employee-form">
          <Card className="min-w-lg max-w-full mx-auto p-10">
            <form id="employee-registration-form-for-employee employee-form">
              <FieldSet id="for-employee" className="flex flex-col">
                <div id="form-header">
                  <FieldLegend className="flex w-full justify-between">
                    <h1>Profile</h1>

                    <h2
                      className={cn(
                        "m-0",
                        "p-0",
                        "text-sm",
                        "text-muted-foreground",
                        "",
                        "",
                      )}
                    >
                      Employee&apos;s form
                    </h2>
                  </FieldLegend>
                  <div
                    id="description seperator"
                    className="flex flex-col justify-start "
                  >
                    <FieldDescription>
                      Fill in your profile information.
                    </FieldDescription>
                    <Separator title="For Employer" />
                  </div>
                </div>

                <FieldSet
                  id="form-content employee-form"
                  className="mx-auto w-full"
                >
                  <FieldLegend>Personal Information</FieldLegend>
                  <FieldDescription>
                    Fill in your Personal information.
                  </FieldDescription>

                  <Field id="name-field" orientation="responsive">
                    <FieldLabel htmlFor="name">Name</FieldLabel>

                    <FieldContent className="flex flex-row justify-between">
                      <Input id="firstname" placeholder="First name" required />
                      <Input id="middlename" placeholder="Middle name" />
                      <Input id="lastname" placeholder="Last name" required />
                    </FieldContent>
                  </Field>

                  <Field id="date-of-birth" orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="birthdate">Date of birth</FieldLabel>
                    </FieldContent>
                    <DatePicker
                      id="date-of-birth"
                      name="date-of-birth"
                      placeholder="07. jan. 2026"
                      value={
                        dateOfBirth
                          ? dateOfBirth.toISOString().slice(0, 10)
                          : undefined
                      }
                      onSelect={(v: string) =>
                        setDateOfBirth(v ? new Date(v) : undefined)
                      }
                    />
                  </Field>

                  <Field id="phone-number-field" orientation="responsive">
                    {/* TODO: implement two-factor phone verification */}
                    <FieldContent>
                      <FieldLabel htmlFor="phone">Phone number</FieldLabel>
                      <span className="flex flex-row gap-2 ">
                        <PhoneInput
                          value={phone}
                          onChange={setPhone}
                          className={cn("w-full", "", "")}
                          defaultCountry="NO"
                          placeholder="Enter your phone number"
                        />
                      </span>
                    </FieldContent>
                  </Field>
                </FieldSet>
                <FieldSet
                  id="form-content employee-form"
                  className="mx-auto w-full"
                >
                  <FieldLegend>Set Password</FieldLegend>
                  <FieldDescription>
                    Must be at least 8 characters long, and contain atleast 1
                    small letter big letter and special character.
                  </FieldDescription>

                  <Field
                    id="password-field"
                    orientation="responsive"
                    className="flex flex-row justify-between"
                  >
                    {/* <FieldLabel htmlFor="password">Password</FieldLabel> */}
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
                </FieldSet>
                <Separator />
                <FieldSet
                  id="address-information-fields"
                  className="w-full max-w-sm"
                >
                  <FieldLegend>Address Information</FieldLegend>
                  <FieldDescription>
                    {/* Fill in the employee&apos;s address for billing purposes. */}
                    Fill in your address for billing purposes.
                  </FieldDescription>
                  <FieldGroup id="address-information">
                    <Field>
                      <FieldLabel htmlFor="street">Street Address</FieldLabel>
                      <Input
                        id="street"
                        type="text"
                        placeholder="Håkonsgaten 36b"
                      />
                    </Field>
                    <div className="grid grid-cols-3 gap-4">
                      <Field>
                        <FieldLabel htmlFor="city">Country</FieldLabel>
                        <Input id="city" type="text" placeholder="Norway" />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="city">City</FieldLabel>
                        <Input id="city" type="text" placeholder="Bergen" />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="zip">Postal Code</FieldLabel>
                        <Input id="zip" type="text" placeholder="5008" />
                      </Field>
                    </div>
                  </FieldGroup>
                </FieldSet>
                <Separator />

                <FieldSet id="agreement-fields" className="w-full max-w-sm">
                  <FieldLegend>Agreements</FieldLegend>
                  <FieldDescription>
                    {/* Fill in the employee&apos;s address for billing purposes. */}
                    Click the links provided and read the agreements before you
                    can proceed.
                  </FieldDescription>
                  {/* Button group maybe? maybe we can add some contracts like employement contract, NBA, etc to be signed before submitting  */}
                  <Field
                    id="terms-and-conditions"
                    orientation="horizontal"
                    data-invalid
                  >
                    <Checkbox
                      id="terms-checkbox-invalid"
                      name="terms-checkbox-invalid"
                      aria-invalid
                    />
                    <FieldLabel htmlFor="terms-checkbox-invalid">
                      <span className="font-light">
                        I have read and accept{" "}
                        <Link
                          href={`docs/agreements/terms-and-condition || ""}`}
                          className={cn(
                            "align-baseline hover:underline",
                            "",
                            "",
                          )}
                        >
                          <span className="font-normal">
                            terms and conditions*
                          </span>
                        </Link>
                      </span>
                    </FieldLabel>
                  </Field>

                  {/* Button group maybe? maybe we can add some contracts like employement contract, NBA, etc to be signed before submitting  */}
                  <Field
                    id="job-description"
                    orientation="horizontal"
                    className="items-start"
                    data-invalid
                  >
                    <Checkbox
                      id="terms-checkbox-invalid"
                      name="terms-checkbox-invalid"
                      aria-invalid
                    />
                    <FieldLabel htmlFor="terms-checkbox-invalid">
                      <span className={cn("font-light", "")}>
                        I have read and accept my position&apos;s{" "}
                        <Link
                          href={`docs/agreements/${position || ""}`}
                          className={cn(
                            "align-baseline hover:underline",
                            "",
                            "",
                          )}
                        >
                          <span className="font-normal">Work Description</span>
                        </Link>{" "}
                      </span>
                    </FieldLabel>
                  </Field>

                  {/* Button group maybe? maybe we can add some contracts like employement contract, NBA, etc to be signed before submitting  */}
                  <Field
                    id="non-disclosure-agreement"
                    orientation="horizontal"
                    className="items-start"
                    data-invalid
                  >
                    <Checkbox
                      id="non-disclosure-agreement-checkbox-invalid"
                      name="non-disclosure-agreement-checkbox-invalid"
                      aria-invalid
                      // ? idk what invalid means in this context
                    />
                    <FieldLabel htmlFor="terms-checkbox-invalid">
                      <span className={cn("font-light", "")}>
                        I have read and signed the{" "}
                        <Link
                          href={`docs/agreements/non-disclosure-agreement}`}
                          className={cn(
                            "align-baseline hover:underline",
                            "",
                            "",
                          )}
                        >
                          <span className="font-normal">
                            Non-Disclosure Agreement*
                          </span>
                        </Link>{" "}
                      </span>
                    </FieldLabel>
                  </Field>

                  {/* Button group maybe? maybe we can add some contracts like employement contract, NBA, etc to be signed before submitting  */}
                  <Field
                    id="contract-of-employment"
                    orientation="horizontal"
                    className="items-start"
                    data-invalid
                  >
                    <Checkbox
                      id="contract-of-employment-checkbox-invalid"
                      name="contract-of-employment-checkbox-invalid"
                      aria-invalid
                      // ? idk what invalid means in this context
                    />
                    <FieldLabel htmlFor="terms-checkbox-invalid">
                      <span className={cn("font-light", "")}>
                        I have read and signed the{" "}
                        <Link
                          //? maybe this should be handles differently. some contracts are reformed to a speciffic person.
                          href={`docs/agreements/${position || ""}/contract-of-employment`}
                          className={cn(
                            "align-baseline hover:underline",
                            "",
                            "",
                          )}
                        >
                          <span className="font-normal">
                            Contract Of Employment*
                          </span>
                        </Link>{" "}
                      </span>
                    </FieldLabel>
                  </Field>
                </FieldSet>
                <Separator />
              </FieldSet>
              <FieldSet
                id="form-actions-field employees-form"
                className="mx-auto w-full mt-5"
              >
                <Field orientation="responsive">
                  <Button id="employee-registration-form-button" type="submit">
                    Submit
                  </Button>
                  <Button type="button" variant="outline">
                    <Link href={"/"}>Cancel</Link>
                  </Button>
                </Field>
              </FieldSet>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="employer-form">
          <Card className="min-w-lg max-w-full mx-auto p-10">
            {/* TODO: hidden by default, if logged in user===admin unhide */}
            <form id="employee-registration-form-for-employer employer-form">
              <FieldSet id="for-employer" className="flex flex-col">
                {/* "TODO: refactor needed. fieldset inside fieldset will prob get messy" */}
                <div id="form-header">
                  <FieldLegend className="flex w-full justify-between">
                    <h1>Profile</h1>

                    <h2
                      className={cn(
                        "m-0",
                        "p-0",
                        "text-sm",
                        "text-muted-foreground",
                        "",
                        "",
                      )}
                    >
                      Employer&apos;s form
                    </h2>
                  </FieldLegend>
                  <div
                    id="description seperator"
                    className="flex flex-col justify-start "
                  >
                    <FieldDescription>
                      Fill in employee&apos;s profile information.
                    </FieldDescription>
                    <Separator title="For Employer" />
                  </div>
                </div>

                <FieldSet id="key-fields" className="w-full max-w-sm">
                  <Field id="employee-id-ref-field" orientation="responsive">
                    {/* TODO: have this in a seperate card at the top: this is for admins. to insert their key to be permitted usage. then also admin activity is also logged with unique keys to prevent sneaky admins making a ruckus */}
                    <FieldContent>
                      <FieldLabel htmlFor="employee-id-ref">
                        Employee ID reference
                      </FieldLabel>
                      <FieldDescription>
                        Will need the employee&apos;s ID number in order to
                        patch the correct employee
                      </FieldDescription>
                    </FieldContent>
                    <Input
                      id="employee-id-ref"
                      placeholder="EMP-MG-000000221"
                      //todo [optional]: for extra saftey i could add a checker the verifies that MG matches the filled 'position' field
                      required
                    />
                  </Field>

                  <Field id="admissionkey" orientation="responsive">
                    {/* TODO: have this in a seperate card at the top: this is for admins. to insert their key to be permitted usage. then also admin activity is also logged with unique keys to prevent sneaky admins making a ruckus */}
                    <FieldContent>
                      <FieldLabel htmlFor="admissionkey">
                        Admission Key
                      </FieldLabel>
                      <FieldDescription>
                        insert admission key provided by admin to create an
                        account*
                      </FieldDescription>
                    </FieldContent>
                    <Input
                      id="admissionkey"
                      placeholder="74a8a150-0b8a-4005-afde-bbd02dbb4886"
                      required
                    />
                  </Field>
                </FieldSet>
                <Separator />

                <FieldSet id="bank-information-group">
                  <FieldLegend>Bank Information</FieldLegend>
                  <FieldDescription>
                    Fill in the bank information for where you wish to recieve
                    your salary
                  </FieldDescription>
                  <FieldGroup>
                    <Field
                      id="bank-account-holder-name-field"
                      className="hidden"
                    >
                      {/* invisible field, will just inherit the employees name*/}
                      <FieldLabel htmlFor="bank-account-holder-name">
                        Account holder name
                      </FieldLabel>
                      <Input
                        id="bank-account-holder-name"
                        type="string"
                        placeholder="Man McManson"
                        required
                        defaultValue={fullname}
                      />
                    </Field>

                    <Field id="bank-name-field">
                      {/* this should prob be a search but making a search for all possible banks would be annoying */}
                      <FieldLabel htmlFor="bank-name">Bank name</FieldLabel>
                      <Input
                        id="bank-name"
                        type="string"
                        placeholder=""
                        required
                      />
                    </Field>

                    <Field id="bank-account-number-field">
                      <FieldLabel htmlFor="bank-account-number">
                        Bank Account
                      </FieldLabel>
                      <Input
                        id="bank-account-number"
                        type="number"
                        placeholder=""
                        required
                      />
                      <FieldDescription>
                        (11 digits, common Norwegian format)
                      </FieldDescription>
                    </Field>
                    {/* ? NOT SURE I NEED THIS, MAYBE FOR FOREIGN BANKS */}
                    {/* <Field id="bank-id-number-field">
                  <FieldLabel htmlFor="bank-id-number">
                    Bank ID number (national)
                  </FieldLabel>
                  <Input
                    id="bank-id-number"
                    type="number"
                    placeholder=""
                    required
                  />
                </Field> */}
                    <div className="flex gap-4">
                      <Field id="bank-IBAN-field">
                        <FieldLabel htmlFor="bank-IBAN">IBAN</FieldLabel>
                        <Input
                          id="bank-IBAN"
                          placeholder="NO93 8601 1117 947"
                          required
                        />
                        <FieldDescription className="text-xs text-nowrap">
                          (Norwegian IBAN starts with NO + 13 digits)
                        </FieldDescription>
                      </Field>

                      <Field id="bank-swift-code-field">
                        <FieldLabel htmlFor="bank-swift-code">
                          BIC / SWIFT
                        </FieldLabel>
                        <Input
                          id="bank-swift-code"
                          placeholder="DNBANOKK"
                          required
                        />
                      </Field>
                    </div>
                    <Field id="bank-employee-id-field">
                      <div className="flex gap-4 ">
                        <FieldLabel htmlFor="bank-employee-id">
                          Employee ID
                        </FieldLabel>

                        <FieldDescription className="italic">
                          Should be automatically fetched (employee-id-issue)
                        </FieldDescription>
                      </div>
                      <Input
                        hidden
                        id="bank-employee-id"
                        placeholder="EMP-MG-000000002"
                        required
                        defaultValue={getEmployeeId()}
                        /*
                    TODO: (employee-id-issue) figure out how to solve this: it needs to fetch employeeId, BUT, employeeId is generated upon registration (after this)
                    should this be a seperate form? or maybe employee will be 
                    generated after the employee finished the form (POST) then the employer finished the form through (PATCH) then employeeId will be fetchable. 
                    this require some refactoring of employee model (yey...)
                    */
                      />
                    </Field>

                    <Field id="bank-tax-card-field">
                      <div className="flex gap-4 ">
                        <FieldLabel htmlFor="bank-tax-card">
                          Tax Card
                        </FieldLabel>
                        <FieldDescription className="italic">
                          Handled thorugh Skatteetaten.no (see: tax-card-issue)
                        </FieldDescription>
                        {/* ? (tax-card-issue) apparently tax-card information is not something we should manually input ourselved but is handles though skatteetaten, look into this further.  */}
                      </div>
                      <Input
                        hidden
                        id="bank-tax-card"
                        placeholder="???"
                        // required
                        // defaultValue={}
                      />
                    </Field>
                  </FieldGroup>
                  {/* </FieldSet> */}
                </FieldSet>
                <Separator />

                {/* <Separator /> */}
                <FieldSet
                  id="job-position-information-group"
                  className="w-full max-w-sm"
                >
                  <FieldLegend>Job position Information</FieldLegend>
                  <FieldDescription>
                    Select the employee&apos;s department or area of work and
                    their respective position.
                  </FieldDescription>

                  <FieldGroup
                    id="job-position-information-group"
                    className="grid grid-cols-2 gap-4"
                  >
                    {/* TODO: make validation for which position belogs to which department */}
                    {/* ? might be a better solution for this */}
                    <Field className="w-full max-w-xs">
                      {/* <FieldLabel>Department</FieldLabel> */}
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Department" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          {getOptions(departments)}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field className="w-full max-w-xs">
                      {/* <FieldLabel>Position</FieldLabel> */}
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Position" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          {getOptions(positions)}
                        </SelectContent>
                      </Select>
                    </Field>
                  </FieldGroup>
                </FieldSet>

                <Field id="platform-role" className="w-full max-w-sm">
                  <FieldLabel>Role / Security level</FieldLabel>
                  {/* TODO: make validation for which position belogs to which department */}
                  {/* TODO: then - add mismatch warning (which can be overridden) f.ex. maybe the CEO is impulsive and not tech savvy and needs special restrictions */}

                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectContent position="popper">
                        {getOptions(roles)}
                      </SelectContent>
                    </SelectContent>
                  </Select>
                  {/* todo: maybe make the important roles such as admin and superadmin to be colored red*/}
                  {/* todo: maybe add a "are you sure" warning if a VIP-role like this is selected. */}
                  {/* todo: and maybe make VIP-options deactivated based on the person registering the new employee's own security lvl (a regular supervisor should not be able to add someone as a superadmin)  */}
                  <FieldDescription>
                    Select the employee&apos;s system related role, which
                    dictates what privilages the new employee should have.{" "}
                    <br />
                    In other words; what should the emplyee&apos;s role on this
                    platform be. (usually tied to position).
                    {/* TODO add tooltip to see department-position-role template */}
                  </FieldDescription>
                </Field>
                <Separator />

                <FieldGroup
                  id="form-actions-field employers-form"
                  className="mx-auto w-full"
                >
                  <Field orientation="responsive">
                    <Button
                      id="employee-registration-form-for-employer-button"
                      type="submit"
                    >
                      Submit
                    </Button>
                    <Button type="button" variant="outline">
                      <Link href={"/"}>Cancel</Link>
                    </Button>
                  </Field>
                </FieldGroup>
              </FieldSet>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
