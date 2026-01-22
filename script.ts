import { prisma } from "@lib/prisma";

type TodoCreateInput = {
  title: string;
  done?: boolean;
  dueDate?: Date;
  tags: string;
};

async function main() {
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
    todos.map((todo) => prisma.todo.create({ data: todo })),
  );

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
