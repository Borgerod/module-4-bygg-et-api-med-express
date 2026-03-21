import { randomUUID } from "crypto";

export interface TodoProps {
  id: string;
  done: boolean;
  title: string;
  dueDate: Date | null;
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
  dueDate: Date | null;

  constructor(body: Partial<TodoProps>) {
    this.id = body.id ?? randomUUID();
    this.title = body.title || "";
    this.done = body.done ?? false;
    this.dueDate = body.dueDate
      ? new Date(body.dueDate)
      : new Date("3000-01-01T00:00:00Z");
    this.tags = body.tags || "";
    this.createdAt = body.createdAt ? new Date(body.createdAt) : new Date();
  }
}
