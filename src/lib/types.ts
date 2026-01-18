import { randomUUID } from "crypto";

// types.ts
export interface TodoProps {
  id: string;
  done: boolean;
  title: string;
  dueDate: Date;
  tags: string;
  createdAt: Date;
}

export type TodoType = TodoProps & {};

export class Todo implements TodoProps {
  id: string;
  done: boolean;
  title: string;
  tags: string;
  createdAt: Date;
  dueDate: Date;

  constructor(body: Partial<TodoProps>) {
    // TODO (scheduled for 2999-01-01T00:00:00Z) - set new value for dueDate
    this.id = randomUUID();
    this.title = body.title || "";
    this.done = body.done ?? false;
    this.dueDate = body.dueDate
      ? new Date(body.dueDate)
      : new Date("3000-01-01T00:00:00Z"); //instead of undefined its easier to set it as a reaally big number and convert it to "empty" in UI
    this.tags = body.tags || "";
    this.createdAt = new Date();
  }
}
