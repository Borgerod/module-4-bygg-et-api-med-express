// import "server-only";
// import { cookies } from "next/headers";
// // import { decrypt } from "@/app/lib/session";
// import "server-only";
// import { SignJWT, jwtVerify } from "jose";
// // import { SessionPayload } from "@/";
// import RefreshToken from "@expressBackend/models/refresh-token.model";
// import { ActiveRefreshToken } from "@expressBackend/schema/activeRefreshToken.schema";
// import { z } from "zod";

// const secretKey = process.env.SESSION_SECRET;
// const encodedKey = new TextEncoder().encode(secretKey);
// // !NOTE: this might create complications due to next and express not being perfectly compatible.

// type ActiveRefreshTokenType = z.infer<typeof ActiveRefreshToken>;

// export async function encrypt(payload: ActiveRefreshTokenType) {
//   return new SignJWT(payload)
//     .setProtectedHeader({ alg: "HS256" })
//     .setIssuedAt()
//     .setExpirationTime("7d")
//     .sign(encodedKey);
// }

// export async function decrypt(session: string | undefined = "") {
//   try {
//     const { payload } = await jwtVerify(session, encodedKey, {
//       algorithms: ["HS256"],
//     });
//     return payload;
//   } catch (error) {
//     console.log("Failed to verify session: ", error);
//   }
// }

// export async function deleteSession() {
//   const cookieStore = await cookies();
//   cookieStore.delete("session");
// }
// export async function updateSession() {
//   const session = (await cookies()).get("session")?.value;
//   const payload = await decrypt(session);

//   if (!session || !payload) {
//     return null;
//   }

//   const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

//   const cookieStore = await cookies();
//   cookieStore.set("session", session, {
//     httpOnly: true,
//     secure: true,
//     expires: expires,
//     sameSite: "lax",
//     path: "/",
//   });
// }
