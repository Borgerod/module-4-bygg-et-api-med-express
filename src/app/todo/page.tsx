// Dummy imports
import { getTodos } from "@/lib/todo";
// import { Post } from '@/ui/todo'

export default async function Page() {
	const todos = await getTodos();

	return (
		<ul>
			{todos.map((todo) => (
				<div key={todo.id}>{todo.title}</div>
			))}
		</ul>
	);
}
