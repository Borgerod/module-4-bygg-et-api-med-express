import * as z from "zod";
// user schema with password hashing
// Registration input validation

export const UserRegistration = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(30, "Username must be at most 30 characters long")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password must be at most 100 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
  isActive: z.boolean().default(true),
});

//! Since you are supposed to NEVER store passwords in db, it needs to be hashed.
// Database user schema
// export const User = z.object({
//   id: z.uuidv4(),
//   username: z.string(),
//   email: z.string(),
//   passwordHash: z.string(),
//   createdAt: z.date().optional(),
//   updatedAt: z.date().optional(),
//   isActive: z.boolean().default(true),
// });

// user for handling of user except for updating and creating user, aka USAGE for example logins
export const UserSchemaBase = z.object({
  id: z.uuidv4(),
  username: z.string(),
  email: z.string(),
  passwordHash: z.string(),
  role: z.enum(["user", "admin"]).default("user"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  isActive: z.boolean().default(true),
  isOnline: z.boolean().default(false), //only true when user logs in (will happen with a redirect upon signup)
  lastLoggedIn: z.number().min(Date.now()).nullable().default(null),
});

// used for usercreation where we dont allow changes to lastLoggedIn
export const UserSchemaCreate = UserSchemaBase.omit({
  lastLoggedIn: true,
  // id: true,
  // role: true,
  // createdAt: true,
  // updatedAt: true,
  // isOnline: true,
  // lastLoggedIn: true,
  // passwordHash: true, // You probably want to accept 'password' instead, then hash it
}).strict();

// used for updating the user
export const UserSchemaUpdate = UserSchemaBase.omit({
  lastLoggedIn: true,
  id: true,
  role: true,
  // id: true,
  // role: true,
  // createdAt: true,
  // updatedAt: true,
  // lastLoggedIn: true,
  // isOnline: true,
  // passwordHash: true,
})
  .partial()
  .strict();

// export type UserType = z.infer<typeof UserSchemaBase>;
export type User = z.infer<typeof UserSchemaBase>;
export type UserCreation = z.infer<typeof UserSchemaCreate>;
export type UserUpdate = z.infer<typeof UserSchemaUpdate>;
