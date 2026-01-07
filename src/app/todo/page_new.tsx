// Dummy imports
import { Button } from "@/components/ui/button";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/todo/DatePicker";
import { getTodos } from "@/lib/todo";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { cn } from "@/lib/utils";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { handleAddTodo } from "@/app/todo/actions";
import { TodoProvider } from "./todo-context";
import { Todo } from "./types";
import { ColumnDef } from "@tanstack/react-table";

export default async function Page() {
	const todos = await getTodos();

	return (
		<TodoProvider initialTodos={todos}>
			<Card>
				<CardHeader>
					<CardTitle>TO DO LIST</CardTitle>
					<CardDescription>
						keep track of your daily tasks
					</CardDescription>
					<CardAction>Add Tasks</CardAction>
				</CardHeader>
				<CardContent>
					<form className={cn("", "")} action={handleAddTodo}>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="title">Task</FieldLabel>
								<Input
									id="title"
									name="title"
									type="text"
									placeholder="title"
									required
								/>
							</Field>
							<Field>
								<FieldLabel htmlFor="dueDate">Due</FieldLabel>
								<DatePicker
									id="dueDate"
									name="dueDate"
									type="date"
									placeholder="due"
								/>
							</Field>
							<Field>
								<FieldLabel htmlFor="tags">Tags</FieldLabel>
								<Input
									id="tags"
									name="tags"
									type="text"
									placeholder="add tags (separate with comma)"
								/>
							</Field>
							<Button
								variant="outline"
								type="submit"
								className="data-[empty=true]:text-muted-foreground w-70 justify-start text-left font-normal"
							>
								Add Task
							</Button>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>To Do List</CardTitle>
					<CardDescription>
						Monitor, edit and manage your tasks
					</CardDescription>
					<CardAction>placehodler_current_period</CardAction>
				</CardHeader>
				<CardContent>
					<DataTable
						columns={columns as ColumnDef<unknown, unknown>[]}
					/>
				</CardContent>
			</Card>
		</TodoProvider>
	);
}
