// import { prisma } from "./prisma";
import { prisma } from "../src/lib/prisma";

// async function createTodo(todoElement) {}

const ToDoTemplate = [
  {
    id: "7f6d8b30-4c19-4c8f-9211-12e1b4e9c4d9",
    title: "table - add select for complete status",
    done: false,
    dueDate: "2026-01-09T00:00:00.000Z",
    tags: "dev,table,status",
    createdAt: "2026-01-07T09:16:44.947Z",
  },
  {
    id: "2a4f9d80-2eac-4a10-8c12-18c2b80c67d7",
    title: "table - add filter by tags and keyword",
    done: true,
    dueDate: "2026-01-08T00:00:00.000Z",
    tags: "dev,table,filter",
    createdAt: "2026-01-07T08:38:05.707Z",
  },
  {
    id: "3c5d8e90-968a-43c2-9cbb-26f3d1b9374a",
    title: "menu - replace details view with delete button",
    done: true,
    dueDate: "2026-01-11T10:33:55.000Z",
    tags: "dev,menu,delete",
    createdAt: "2026-01-10T10:33:40.000Z",
  },
  {
    id: "8b9e7c20-f0a7-4bef-a70d-d601c3bb4fcb",
    title: "column - add date added column",
    done: true,
    dueDate: "2026-01-07T00:00:00.000Z",
    tags: "dev,column,date",
    createdAt: "2026-01-07T08:33:33.000Z",
  },
  {
    id: "12a8b650-4bde-4a5a-91f0-2ed5c3a1f66a",
    title: "row - add checkbox functionality",
    done: false,
    dueDate: "2026-01-09T00:00:00.000Z",
    tags: "dev,row,checkbox",
    createdAt: "2026-01-07T08:33:23.010Z",
  },
];
const UserTemplate = [
  {
    id: "5d7f4c10-2a7f-4d09-a2b7-3a68102d0f22",
    username: "todoadmin",
    email: "todoadmin@example.com",
    passwordHash: "hashed-password-placeholder",
    createdAt: "2026-01-01T12:00:00.000Z",
    updatedAt: "2026-01-14T12:00:00.000Z",
    isActive: true,
  },
];
async function main() {
  // Create a new user with a post
  await Promise.all(
    ToDoTemplate.map((todo) =>
      prisma.todo.create({
        data: {
          id: todo.id,
          title: todo.title,
          done: todo.done,
          dueDate: new Date(todo.dueDate),
          tags: todo.tags,
          createdAt: new Date(todo.createdAt),
        },
      })
    )
  );
  console.log("All Todos:", JSON.stringify(ToDoTemplate, null, 2));
  await Promise.all(
    UserTemplate.map((UserTemplate) =>
      prisma.user.create({
        data: {
          id: UserTemplate.id,
          username: UserTemplate.username,
          email: UserTemplate.email,
          passwordHash: UserTemplate.passwordHash,
          createdAt: new Date(UserTemplate.createdAt),
          updatedAt: new Date(UserTemplate.updatedAt),
          isActive: UserTemplate.isActive,
        },
      })
    )
  );
  console.log("All Users:", JSON.stringify(UserTemplate, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
