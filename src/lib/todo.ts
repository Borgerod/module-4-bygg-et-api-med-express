import { prisma } from "./prisma";

// Fetch all todos from the database
export async function getTodos() {
  return prisma.todo.findMany({
    orderBy: { createdAt: "desc" },
  });
}

// Add a new todo to the database
export async function addTodo(title: string, tags: string[], dueDate?: Date) {
  return prisma.todo.create({
    data: {
      title,
      done: false,
      dueDate,
      tags: tags.length > 0 ? tags.join(",") : "",
      createdAt: new Date(),
    },
  });
}

// Update a todo in the database
export async function updateTodo(
  id: string,
  updates: { title?: string; done?: boolean; dueDate?: Date; tags?: string[] },
) {
  return prisma.todo.update({
    where: { id },
    data: {
      ...updates,
      tags: updates.tags ? updates.tags.join(",") : undefined,
    },
  });
}

// Delete a todo from the database
export async function deleteTodo(id: string) {
  await prisma.todo.delete({ where: { id } });
  return true;
}

//* this should prob be in a separate file, here is sort etc
// Sort todos for display in a table
export async function sortTable(id: string) {
  /*
	USE: export async function getTodos() {
		return prisma.todo.findMany({
			orderBy: { createdAt: "desc" },
		});
	}
	*/
}
