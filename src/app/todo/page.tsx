// Dummy imports
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
	FieldGroup,
	Field,
	FieldLabel,
	FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DatePicker } from "@/components/ui/todo/DatePicker";
import TodoForm from "@/components/ui/todo/TodoForm";
import { addTodo, getTodos } from "@/lib/todo";
import { cn } from "@/lib/utils";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@radix-ui/react-select";
import Form from "next/form";
import { redirect } from "next/navigation";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
// import { addTodo } from "@/lib/todo";

// import { Post } from '@/ui/todo'

export default async function Page() {
	const todos = await getTodos();
	// addTodo(title: string, tags: string[], dueDate?: Date)
	async function handleAddTodo(formData: FormData) {
		"use server";
		const title = formData.get("title") as string;
		const dueDateStr = formData.get("dueDate") as string;
		const tagsStr = formData.get("tags") as string;
		const tags = tagsStr ? tagsStr.split(",").map((t) => t.trim()) : [];
		const dueDate = dueDateStr ? new Date(dueDateStr) : undefined;
		await addTodo(title, tags, dueDate);
		redirect("/todo");
	}
	return (
		<>
			<Card>
				{/* <TodoForm></TodoForm> */}
				<CardHeader>
					<CardTitle>TO DO LIST</CardTitle>
					<CardDescription>
						keep track of your daily tasks
					</CardDescription>
					<CardAction>Add Tasks</CardAction>
				</CardHeader>
				<CardContent>
					<Form
						// onSubmit={addTodo()}
						className={cn(
							// "w-fit",
							// "w-full",
							// // "w-xl",
							// "h-fit",
							// "p-2",
							// "bg-neutral-200",
							// "flex flex-col",

							"",
							""
						)}
						action={handleAddTodo}
					>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="checkout-7j9-card-number-uw1">
									Task
								</FieldLabel>
								<Input
									// id="checkout-7j9-card-number-uw1"
									id="title"
									name="title"
									type="text"
									placeholder="title"
									required
								/>
							</Field>
							<Field>
								<FieldLabel htmlFor="checkout-exp-month-ts6">
									Due
								</FieldLabel>

								<DatePicker
									id="dueDate"
									name="dueDate"
									type="date"
									placeholder="due"
								/>
							</Field>
							<Field>
								<FieldLabel htmlFor="checkout-7j9-cvv">
									Tags
								</FieldLabel>
								<Input
									id="tags"
									name="tags"
									type="text"
									placeholder="add tags (seperate with comma)"
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
					</Form>
					{/* <p>Card Content</p> */}
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>To Do List</CardTitle>
					<CardDescription>Your current tasks</CardDescription>
					<CardAction>placehodler_current_period</CardAction>
				</CardHeader>
				<CardContent>
					<ScrollArea className="h-50 w-full rounded-md border p-4">
						<ul>
							{todos.map((todo) => (
								<li
									key={todo.id}
									className="grid grid-cols-[auto_3fr_1fr_1fr_auto] gap-5 justify-items-between"
								>
									<Checkbox />
									<div>{todo.title}</div>
									<div>
										{todo.dueDate ? (
											format(todo.dueDate, "PPP")
										) : (
											<span>Pick a date</span>
										)}
									</div>
									<div>
										{typeof todo.tags === "string"
											? todo.tags
													.split(",")
													.map(
														(
															tag: string,
															i: number
														) => (
															<Badge
																key={i}
																variant="secondary"
															>
																{tag}
															</Badge>
														)
													)
											: null}
									</div>
									<Button></Button>
								</li>
							))}
						</ul>
					</ScrollArea>
				</CardContent>
			</Card>
		</>
	);
}
