// Dummy imports
import { addTodo, getTodos } from "@/lib/todo";
import { cn } from "@/lib/utils";
import Form from "next/form";
// import { Post } from '@/ui/todo'

export default async function Page() {
	const todos = await getTodos();
	// addTodo(title: string, tags: string[], dueDate?: Date)
	return (
		<>
			<Form
				// onSubmit={addTodo()}
				className={cn(
					"w-fit",
					"h-fit",
					"p-2",
					"bg-neutral-200",
					"flex flex-col",

					"",
					""
				)}
				action={addTodo()}
			>
				<input
					className={cn("w-full rounded-lg bg-neutral-300", "", "")}
					id="title"
					type="text"
					placeholder="title"
				/>
				<input
					className={cn("w-full rounded-lg  bg-neutral-300", "", "")}
					id="dueDate"
					type="date"
					placeholder="due"
				/>
				<input
					className={cn("w-full rounded-lg  bg-neutral-300", "", "")}
					id="tags"
					type="text"
					placeholder="tags"
				/>

				<button
					className={cn(
						"w-full p-2 px-5 rounded-xl bg-blue-300",
						"",
						""
					)}
					type="submit"
				>
					submit
				</button>
			</Form>
			<ul>
				{todos.map((todo) => (
					<div key={todo.id}>{todo.title}</div>
				))}
			</ul>
		</>
	);
}
