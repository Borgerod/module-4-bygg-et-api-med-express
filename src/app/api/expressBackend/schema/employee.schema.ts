import { z } from "zod";
import {
  departments,
  positions,
  roles,
} from "@/app/api/expressBackend/constants/employee.contants";

export const EmployeeSchemaBase = z.object({
  // id: z.uuid(), // System UUID (primary key)
  id: z.uuidv4(),
  userId: z.uuidv4(), // prob needs chanign

  employeeId: z.string().length(16), // Human-friendly ID for cards (auto-generated)
  firstname: z
    .string()
    .min(2, "First name must be at least 2 characters long")
    .max(50, "First name must be at most 50 characters long")
    .regex(
      /^[a-zA-ZæøåÆØÅ\s'-]+$/,
      "First name can only contain letters, spaces, hyphens, and apostrophes",
    ),
  middlename: z
    .string()
    .min(2, "First name must be at least 2 characters long")
    .max(50, "First name must be at most 50 characters long")
    .regex(
      /^[a-zA-ZæøåÆØÅ\s'-]+$/,
      "Middle name can only contain letters, spaces, hyphens, and apostrophes",
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
    .min(6, "Phone number is required")
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

export const EmployeeSchemaCreate = EmployeeSchemaBase.omit({
  id: true,
  userId: true,
  employeeId: true,
  email: true,
  isActive: true,
  isOnline: true,
  createdAt: true,
  updatedAt: true,
  lastLoggedIn: true,
}).strict();

// export const EmployeeSchemaCreate = z.object({
//   firstname: z.string().min(1),
//   lastname: z.string().min(1),
//   countryCode: z.string().min(1),
//   phone: z.string().min(6),
//   department: z.enum(departments as [string, ...string[]]),
//   position: z.enum(positions as [string, ...string[]]),
//   role: z.enum(roles as [string, ...string[]]).default("employee"),
//   isActive: z.boolean(),
// });

// export const EmployeeSchemaUpdate = EmployeeSchemaBase.pick({
//   firstname: true,
//   lastname: true,
//   countryCode: true,
//   phone: true,
//   department: true,
//   position: true,
//   isActive: true,
// })
//   .partial()
//   .strict();

export const EmployeeSchemaUpdate = EmployeeSchemaBase.omit({
  lastLoggedIn: true,
  id: true,
  userId: true,
  email: true,
  employeeId: true,
  isActive: true,
  isOnline: true,
  createdAt: true,
  updatedAt: true,
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

// Department code mapping
export const departmentCodes: Record<string, string> = {
  Executive: "EX",
  Management: "MG",
  Administration: "AD",
  FinanceAndAccounting: "FA",
  HumanResources: "HR",
  SalesAndMarketing: "SM",
  OperationsAndProduction: "OP",
  InformationTechnology: "IT",
  CustomerService: "CS",
  LegalAndCompliance: "LC",
};

// Example: employee.controller.ts
// import { generateCompanyEmail } from "@expressBackend/schema/employee.schema";
// import { EmployeeCreate } from "@expressBackend/schema/employee.schema";

// const validated = EmployeeSchemaCreate.parse(req.body);
// const email = generateCompanyEmail(validated.firstname, validated.lastname, "yourcompany.com");

// const employeeToSave: EmployeeCreate & { email: string } = {
//   ...validated,
//   email,
// };

// Save employeeToSave to DB
