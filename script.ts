import { prisma } from "@lib/prisma";

type TodoCreateInput = {
  title: string;
  done?: boolean;
  dueDate?: Date;
  tags: string;
};

type UserCreateInput = {
  username: string;
  email: string;
  passwordHash: string;
};

async function main() {
  // Create two users
  const user1: UserCreateInput = {
    username: "alice",
    email: "alice@example.com",
    passwordHash: "hashedpassword1",
  };
  const user2: UserCreateInput = {
    username: "bob",
    email: "bob@example.com",
    passwordHash: "hashedpassword2",
  };

  const createdUser1 = await prisma.user.create({ data: user1 });
  const createdUser2 = await prisma.user.create({ data: user2 });

  // Create a list of todos
  const todos: TodoCreateInput[] = [
    {
      title: "Buy groceries",
      tags: "shopping,errands",
      dueDate: new Date("2026-01-20"),
    },
    {
      title: "Finish project",
      tags: "work,urgent",
      dueDate: new Date("2026-01-25"),
    },
    {
      title: "Read a book",
      tags: "leisure",
    },
  ];

  const createdTodos = await Promise.all(
    todos.map((todo) => prisma.todo.create({ data: todo }))
  );

  console.log("Created users:", createdUser1, createdUser2);
  console.log("Created todos:", createdTodos);
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
