// "use server";

// import { cookies } from "next/headers";
// import { User } from "@expressBackend/models";
// // interface User {
// //     userId: string;
// //     emial: string;
// //     role: string;
// // }

// interface CreateData {
//   user: User;
// }

// export async function create(data: CreateData): Promise<string> {
//   //   let userData;
//   const cookieStore = await cookies();
//   console.log("getUserId - userData: ", data);
//   console.log("getUserId - userId: ", data.user.id);
//   console.log("End of getUserId.\n\n");

//   cookieStore.set("id", data.user.id);
//   cookieStore.set("email", data.user.email);
//   cookieStore.set("role", data.user.role);
//   return data.user.id;
// }
// //   else {
// //     console.error("getUserId - auth ERROR 500");
// //     cookieStore.set("id", "");
// //     cookieStore.set("email", "");
// //     cookieStore.set("role", "");
// //   }
// //   return null;
// // }
