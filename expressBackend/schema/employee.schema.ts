import { z } from "zod";
import {
  departments,
  positions,
  roles,
} from "@expressBackend/models/employee.model";

export const EmployeeSchemaBase = z.object({
  id: z.uuid(), // System UUID (primary key)
  employeeId: z.number().int().positive(), // Human-friendly ID for cards (auto-generated)
  firstname: z
    .string()
    .min(2, "First name must be at least 2 characters long")
    .max(50, "First name must be at most 50 characters long")
    .regex(
      /^[a-zA-ZæøåÆØÅ\s'-]+$/,
      "First name can only contain letters, spaces, hyphens, and apostrophes",
    ),
  lastname: z
    .string()
    .min(2, "Last name must be at least 2 characters long")
    .max(50, "Last name must be at most 50 characters long")
    .regex(
      /^[a-zA-ZæøåÆØÅ\s'-]+$/,
      "Last name can only contain letters, spaces, hyphens, and apostrophes",
    ),

  email: z.email("Invalid email address"),
  countryCode: z
    .string()
    .regex(/^\+\d{1,4}$/, "Country code must start with + and have 1-4 digits")
    .default("+47"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[\d\s]+$/, "Phone number can only contain digits and spaces"),

  department: z.enum(departments as [string, ...string[]]), // should be wrong if empty
  position: z.enum(positions as [string, ...string[]]), // should be wrong if empty
  role: z.enum(roles as [string, ...string[]]).default("employee"),

  isActive: z.boolean().default(true),
  isOnline: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastLoggedIn: z.date().nullable().default(null),
});

export const EmployeeSchemaCreate = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  countryCode: z.string().min(1),
  phone: z.string().min(1),
  department: z.enum(departments as [string, ...string[]]),
  position: z.enum(positions as [string, ...string[]]),
  role: z.enum(roles as [string, ...string[]]).default("employee"),
  isActive: z.boolean(),
});

export const EmployeeSchemaUpdate = EmployeeSchemaBase.pick({
  firstname: true,
  lastname: true,
  countryCode: true,
  phone: true,
  department: true,
  position: true,
  isActive: true,
})
  .partial()
  .strict();

export const EmployeeSchemaLogin = z.object({
  isOnline: z.boolean(),
  lastLoggedIn: z.date(),
});

export type EmployeeType = z.infer<typeof EmployeeSchemaBase>;
export type Employee = z.infer<typeof EmployeeSchemaBase>;
export type EmployeeCreation = z.infer<typeof EmployeeSchemaCreate>;
export type EmployeeUpdate = z.infer<typeof EmployeeSchemaUpdate>;
export type EmployeeLogin = z.infer<typeof EmployeeSchemaLogin>;

// Format employee ID for display
export function formatEmployeeId(employeeId: number): string {
  return `EMP-${employeeId.toString().padStart(5, "0")}`;
}

// Generate company email
export function generateCompanyEmail(
  firstname: string,
  lastname: string,
): string {
  const cleanFirst = firstname.toLowerCase().replace(/[^a-z]/g, "");
  const cleanLast = lastname.toLowerCase().replace(/[^a-z]/g, "");
  return `${cleanFirst}.${cleanLast}@${process.env.DATABASE_URL}.${process.env.DOMAIN_EXTENTION}`;
}

// Normalize phone for storage (strips spaces)
export function normalizePhone(phone: string): string {
  return phone.replace(/\s/g, "");
}

// Format phone for display (adds spaces)
export function formatPhone(countryCode: string, phone: string): string {
  // Remove any existing spaces
  const cleaned = phone.replace(/\s/g, "");

  // Format based on length (Norwegian style: +47 999 99 999)
  if (cleaned.length === 8) {
    return `${countryCode} ${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5)}`;
  }

  // Default: space every 3 digits
  return `${countryCode} ${cleaned.match(/.{1,3}/g)?.join(" ") || cleaned}`;
}

// Example: employee.controller.ts
// import { generateCompanyEmail } from "../schema/employee.schema";
// import { EmployeeCreate } from "../schema/employee.schema";

// const validated = EmployeeSchemaCreate.parse(req.body);
// const email = generateCompanyEmail(validated.firstname, validated.lastname, "yourcompany.com");

// const employeeToSave: EmployeeCreate & { email: string } = {
//   ...validated,
//   email,
// };

// Save employeeToSave to DB
