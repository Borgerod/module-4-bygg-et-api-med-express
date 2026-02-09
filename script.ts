import { prisma } from "@lib/prisma";

type TodoCreateInput = {
  title: string;
  done?: boolean;
  dueDate?: Date;
  tags: string;
};

async function main() {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);

  const tomorrow = new Date(currentDate);
  tomorrow.setDate(currentDate.getDate() + 1);

  const nextWeek1 = new Date(currentDate);
  nextWeek1.setDate(currentDate.getDate() + 7);

  const nextWeek2 = new Date(currentDate);
  nextWeek2.setDate(currentDate.getDate() + 8);

  const nextMonth = new Date(currentDate);
  nextMonth.setMonth(currentDate.getMonth() + 1);

  const currentYear = new Date(currentDate);
  currentYear.setFullYear(currentDate.getFullYear() + 1);

  const futureDate = new Date("2050-01-01");
  const pastDate = new Date("2026-01-01");

  const todos: TodoCreateInput[] = [
    {
      title: "Change to summer tires",
      tags: "car",
      done: true,
      dueDate: pastDate,
    },
    {
      title: "EU controll",
      tags: "car",
      done: true,
      dueDate: new Date(pastDate.setHours(12, 15, 0, 0)),
    },
    {
      title: "Pick up kids from school",
      tags: "family, errands",
      done: true,
      dueDate: new Date(yesterday.setHours(15, 30, 0, 0)),
    },
    {
      title: "Call doctor about rash",
      tags: "healthcare,meeting,doctor",
      dueDate: pastDate,
    },
    {
      title: "Read a book",
      tags: "leisure",
    },
    {
      title: "Pick up kids from schoool",
      tags: "family, errands",
      dueDate: new Date(currentDate.setHours(15, 30, 0, 0)),
    },
    {
      title: "Buy groceries",
      tags: "shopping,errands",
      dueDate: new Date(currentDate),
    },
    {
      title: "Check plane tickets",
      tags: "travel,shopping",
      dueDate: new Date(currentDate),
    },
    {
      title: "Pack suit case",
      tags: "travel,errands",
      dueDate: tomorrow,
    },
    {
      title: "Leave 'buying milk' note to family",
      tags: "family,shopping,errands",
      dueDate: tomorrow,
    },
    {
      title: "Start new life with lover",
      tags: "family,leisure,lifestyle",
      dueDate: tomorrow,
    },
    {
      title: "Fight with lover",
      tags: "family,social",
      dueDate: nextWeek1,
    },
    {
      title: "Miss kids",
      tags: "family, mental health",
      dueDate: nextWeek2,
    },
    {
      title: "Reflect on life choices",
      tags: "mental health",
      dueDate: nextWeek2,
    },
    {
      title: "Finish project",
      tags: "work,urgent",
      dueDate: new Date(nextWeek2.setHours(9, 0, 0, 0)),
    },
    {
      title: "Go back home, with lots of milk",
      tags: "travel,errands",
      dueDate: nextMonth,
    },
    {
      title: "Make up milk-story",
      tags: "cover-up,errands,urgent",
      dueDate: nextMonth,
    },
    {
      title: "Reavaluate situasion",
      tags: "family",
      dueDate: currentYear,
    },
    {
      title: "Try out being gay?",
      tags: "leisure",
      dueDate: futureDate,
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
