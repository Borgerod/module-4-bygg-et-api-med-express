import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TodoTypes } from "@types";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import Form from "next/form";
import { Badge } from "@/components/ui/badge";
import { LuX } from "react-icons/lu";
import { revalidatePath } from "next/cache";

async function fetchTodosFromServer(): Promise<TodoTypes[]> {
	const res = await fetch("http://localhost:4000/expressTodo", {
		cache: "no-store",
	});
	const data = await res.json();
	return data.data || data;
}

export default async function Page() {
	const todos = await fetchTodosFromServer();

	async function createTodo(formData: FormData) {
		"use server";
		const params = Object.fromEntries(formData as FormData);
		await fetch("http://localhost:4000/expressTodo", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(params),
		});
		revalidatePath("/expressTodo");
	}

	async function delTodo(formData: FormData) {
		"use server";
		const id = formData.get("id");
		if (!id) return;
		await fetch(`http://localhost:4000/expressTodo/${id}`, {
			method: "DELETE",
		});
		revalidatePath("/expressTodo");
	}

	async function putTodo(formData: FormData) {
		"use server";
		const id = formData.get("id");
		const doneRaw = formData.get("done");
		const done = doneRaw === "true" || doneRaw === "1";
		if (!id) return;
		await fetch(`http://localhost:4000/expressTodo/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ done }),
		});
		revalidatePath("/expressTodo");
	}

	return (
		<div className="p-8 space-y-4 h-full">
			<Card className="p-4">
				<h2 className="font-bold mb-2">Create Todo</h2>
				<Form action={createTodo}>
					<input
						type="text"
						name="title"
						placeholder="Title"
						className="border p-2 mr-2"
						required
					/>
					<input
						type="text"
						name="tags"
						placeholder="Tags"
						className="border p-2 mr-2"
					/>
					<input
						type="date"
						name="dueDate"
						className="border p-2 mr-2"
					/>
					<button
						type="submit"
						className="bg-blue-500 text-white px-4 py-2">
						Create
					</button>
				</Form>
			</Card>

			<Card className="p-4 h-full">
				<h2 className="font-bold mb-2">Todos ({todos.length})</h2>

				<Table>
					<TableHeader className="sticky top-0 bg-background z-10">
						<TableRow className="text-left text-sm font-medium text-muted-foreground">
							{["Done", "Task", "Due", "Tags", "Created", ""].map(
								(h, i) => (
									<TableHead key={`h-${i}`}>{h}</TableHead>
								)
							)}
						</TableRow>
					</TableHeader>
					<TableBody className="divide-y">
						{todos.map((todo) => (
							<TableRow key={todo.id} className="align-top">
								<TableCell className="py-2 w-16">
									<Form action={putTodo}>
										<input
											type="hidden"
											name="id"
											value={todo.id}
										/>
										<input
											type="hidden"
											name="done"
											value={
												!todo.done ? "true" : "false"
											}
										/>
										<Checkbox
											type="submit"
											checked={!!todo.done}
										/>

										{/* <Checkbox
											checked={!!todo.done}
											onCheckedChange={(val) =>
												putTodo(todo.id, !!val)
											}
											/> */}
									</Form>
								</TableCell>

								<TableCell className="py-2 wrap-break-word min-w-50 max-w-75 ">
									<p className="h-full w-full text-wrap">
										{todo.title}
									</p>
								</TableCell>

								<TableCell className="py-2 whitespace-nowrap w-24">
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

								<TableCell className="py-2 w-32">
									<div className="flex flex-wrap gap-1">
										{typeof todo.tags === "string" &&
										todo.tags.trim() !== ""
											? todo.tags
													.split(",")
													.filter(
														(tag: string) =>
															tag.trim() !==
																"untagged" &&
															tag.trim() !== ""
													)
													.map(
														(
															tag: string,
															i: number
														) => (
															<Badge
																key={i}
																variant="secondary"
																className="text-xs break-all">
																{tag}
															</Badge>
														)
													)
											: null}
									</div>
								</TableCell>

								<TableCell className="py-2 whitespace-nowrap w-24">
									{todo.createdAt
										? new Date(
												todo.createdAt
										  ).toLocaleDateString("nb-NO", {
												dateStyle: "short",
										  })
										: "N/A"}
								</TableCell>

								<TableCell className="py-2 w-16">
									<Form action={delTodo} className="inline">
										<input
											type="hidden"
											name="id"
											value={todo.id}
										/>
										<Button
											type="submit"
											variant="ghost"
											size="sm"
											aria-label="Delete todo">
											<LuX />
										</Button>
									</Form>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Card>
		</div>
	);
}
