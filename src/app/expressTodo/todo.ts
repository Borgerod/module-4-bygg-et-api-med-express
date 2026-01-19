// import { randomUUID } from "crypto";
// /* * Todo constructor + types */

// // types.ts
// export interface TodoProps {
//   //todo: dont use outdated interface, use types
//   id: string;
//   done: boolean;
//   title: string;
//   dueDate?: Date;
//   tags: string;
//   createdAt: Date;
// }

// export type TodoType = TodoProps & {};

// export class Todo implements TodoProps {
//   id: string;
//   done: boolean;
//   title: string;
//   dueDate?: Date;
//   tags: string;
//   createdAt: Date;

//   constructor(body: Partial<TodoProps>) {
//     this.id = randomUUID();
//     this.title = body.title || "";
//     this.done = body.done ?? false;
//     this.dueDate = body.dueDate ? new Date(body.dueDate) : undefined;
//     this.tags = body.tags || "";
//     this.createdAt = new Date();
//   }
// }
