import { Button } from "@/components/ui/button";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DatePicker } from "@/components/ui/todo/DatePicker";
import { addTodo, deleteTodo, getTodos, updateTodo } from "@/lib/todo";
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
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TodoCheckbox } from "@/components/ui/todo/TodoCheckbox";

import { LuX } from "react-icons/lu";
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from "@/components/ui/table";

export default async function Page() {
	const todos = await getTodos();
	async function handleAddTodo(formData: FormData) {
		"use server";
		const title = formData.get("title")?.toString().trim() || "";
		if (!title) throw new Error("Title is required");
		await addTodo(
			title,
			formData
				.get("tags")
				?.toString()
				.split(",")
				.map((t) => t.trim())
				.filter(Boolean) || [],
			formData.get("dueDate")
				? new Date(formData.get("dueDate") as string)
				: undefined
		);
		redirect("/todo");
	}

	async function handleDeleteTodo(formData: FormData) {
		"use server";
		const id = formData.get("id") as string;
		if (id) {
			await deleteTodo(id);
		}
		redirect("/todo");
	}

	async function handleToggleTodo(prevState: any, formData: FormData) {
		"use server";
		const id = formData.get("id") as string;
		const done = formData.get("done") === "on";
		await updateTodo(id, { done });
		redirect("/todo");
	}

	return (
		<>
			<Card id="form-card">
				<CardHeader>
					<CardTitle>TO DO LIST</CardTitle>
					<CardDescription>
						keep track of your daily tasks
					</CardDescription>
					<CardAction>Add Tasks</CardAction>
				</CardHeader>
				<CardContent>
					<Form className={cn("", "")} action={handleAddTodo}>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="checkout-7j9-card-number-uw1">
									Task
								</FieldLabel>
								<Input
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
					</Form>
				</CardContent>
			</Card>
			{/* _______________________________________________ */}
			<Card
				id="table-card"
				className={cn(
					"h-fit max-h-200 w-full ",

					"",
					""
				)}
			>
				<CardHeader>
					<CardTitle>To Do List</CardTitle>
					<CardDescription>Your current tasks</CardDescription>
					<CardAction>placehodler_current_period</CardAction>
				</CardHeader>
				<CardContent>
					<ScrollArea className="h-100">
						<Table>
							<TableHeader>
								<TableRow className="text-left text-sm font-medium text-muted-foreground">
									{[
										"Done",
										"Task",
										"Due",
										"Tags",
										"Created",
										"",
									].map((h, i) => (
										<TableHead
											key={`h-${i}`}
											className={
												i === 1 ? "w-full" : "w-28"
											}
										>
											{h}
										</TableHead>
									))}
								</TableRow>
							</TableHeader>
							<TableBody className="divide-y">
								{todos.map((todo) => (
									<TableRow
										key={todo.id}
										className="align-top"
									>
										<TableCell className="py-2">
											<TodoCheckbox
												todoId={todo.id}
												done={todo.done}
												onToggle={handleToggleTodo}
											/>
										</TableCell>
										<TableCell className="py-2">
											{todo.title}
										</TableCell>
										<TableCell className="py-2">
											{todo.dueDate ? (
												new Date(
													todo.dueDate
												).toLocaleDateString("nb-NO", {
													dateStyle: "short",
												})
											) : (
												<span>-</span>
											)}
										</TableCell>
										<TableCell className="py-2">
											{typeof todo.tags === "string" &&
											todo.tags.trim() !== ""
												? todo.tags
														.split(",")
														.filter(
															(tag: string) =>
																tag.trim() !==
																	"untagged" &&
																tag.trim() !==
																	""
														)
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
										</TableCell>
										<TableCell className="py-2">
											{todo.createdAt
												? new Date(
														todo.createdAt
												  ).toLocaleDateString(
														"nb-NO",
														{
															dateStyle: "short",
														}
												  )
												: "N/A"}
										</TableCell>
										<TableCell className="py-2">
											<Form
												action={handleDeleteTodo}
												style={{
													display: "inline",
												}}
											>
												<input
													type="hidden"
													name="id"
													value={todo.id}
												/>
												<Button
													type="submit"
													variant="ghost"
													aria-label="Delete todo"
												>
													<LuX />
												</Button>
											</Form>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</ScrollArea>
				</CardContent>
			</Card>
		</>
	);
}
