import z from "zod";

const AuthSchemaLogin = z
  .object({
    email: z.email(),
    password: z.string().min(6),
  })
  .strict();

const AuthSchemaLogout = z
  .object({
    id: z.uuid(),
  })
  .strict();
export { AuthSchemaLogin, AuthSchemaLogout };
