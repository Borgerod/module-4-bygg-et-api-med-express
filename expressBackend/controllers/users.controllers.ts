import { v4 as uuidv4 } from "uuid";
// import { pool } from "@/app/expressTodo/server";
import { User, UserCreation, UserUpdate } from "@expressBackend/routers/index";

export const getUsers = async () => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] }, // Never return passwords
    });

    console.log(users);

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
};

// // Fetch all users from the database
// export async function getUsers() {
//   const query = 'SELECT * FROM "User"';
//   const result = await pool.query(query);
//   return result.rows;
// }

// export async function getUserById(id: UserType["id"]) {
//   const query = 'SELECT * FROM "User" WHERE id = $1';
//   const result = await pool.query(query, [id]);
//   return result.rows[0]; // returns the user object or undefined if not found
// }

// export async function createUser(userData: {
//   username: string;
//   email: string;
//   isActive: boolean;
//   passwordHash: string;
// }) {
//   if (await uniqueUserData(userData.username, userData.email)) {
//     const id = uuidv4();
//     // Validate with User.parse, including id
//     const parsed = User.parse({ ...userData, id });
//     const result = await pool.query(
//       `INSERT INTO "User" (id, username, email, "passwordHash", "isActive")
//       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
//       [id, parsed.username, parsed.email, parsed.passwordHash, parsed.isActive],
//     );
//     return result.rows[0];
//   } else {
//     throw new Error("Username or email already exists");
//   }
// }

// export async function deleteUserById(id: UserType["id"]) {
//   const result = await pool.query(`DELETE FROM "User" WHERE id = $1`, [id]);
//   return result;
// }

// //* new method
// async function uniqueUserData(
//   username: UserType["username"],
//   email: UserType["email"],
// ): Promise<boolean> {
//   /*instead of fetching all and matching just look for single user by the params, if something returns it is false*/
//   const query =
//     'SELECT 1 FROM "User" WHERE username = $1 OR email = $2 LIMIT 1';
//   const result = await pool.query(query, [username, email]);
//   return result.rows.length === 0;
// }
// //! old method
// // async function uniqueUserData(
// //   username: UserType["username"],
// //   email: UserType["email"]
// // ): Promise<boolean> {
// //   const query = 'SELECT email, username FROM "User"';
// //   const result = await pool.query(query);
// //   // todo potential time to shine here by using some algo skills, make it simple for now
// //   //? this might be something sql deals with

// //   return result.rows.every(
// //     (taken) => taken.email !== email && taken.username !== username
// //   );
// // }
