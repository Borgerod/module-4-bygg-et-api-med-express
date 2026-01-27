// // Type definitions for extended Express Request with user authentication

// import { Request } from "express";
// import { UserAttributes } from "@expressBackend/models/user.model";

// // Extend Express Request to include authenticated user
// export interface AuthenticatedRequest extends Request {
//   user?: Omit<UserAttributes, "password">;
// }

// // Type for allowed roles
// export type UserRole = "user" | "admin";
// export type AuthRole = UserRole | "self";

// // Type for success response
// export interface SuccessResponse<T = unknown> {
//   success: true;
//   data: T;
// }

// // Type for error response
// export interface ErrorResponse {
//   success: false;
//   error: string;
//   details?: unknown;
// }

// // Type for API response
// export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

// // Type for delete success response
// export interface DeleteSuccessResponse {
//   success: boolean;
//   message: string;
// }
