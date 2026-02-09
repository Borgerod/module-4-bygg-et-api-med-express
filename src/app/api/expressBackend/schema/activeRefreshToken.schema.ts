import * as z from "zod";

export const ActiveRefreshToken = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  token: z.string(),
  loginAt: z.date(),
  logoutAt: z.date().optional(),
  sessionId: z.string(),
  rememberMe: z.boolean(),
});
