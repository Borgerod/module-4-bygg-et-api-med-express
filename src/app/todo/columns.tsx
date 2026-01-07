"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Todo } from "./types";
import { useTodos } from "./todo-context";

function DoneCell({
	row,
}: {
	row: { original: Todo; getValue: (key: string) => unknown };
}) {
	const { toggleDone, isPending } = useTodos();
	const done = row.getValue("done") as boolean;
	const id = row.original.id;

	return (
		<Checkbox
			checked={done}
			disabled={isPending}
			onCheckedChange={(checked) => {
				toggleDone(id, Boolean(checked));
			}}
		/>
	);
}

function ActionsCell({ row }: { row: { original: Todo } }) {
	const { removeTodo, duplicateTodo } = useTodos();
	const todo = row.original;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-8 w-8 p-0">
					<span className="sr-only">Open menu</span>
					<MoreHorizontal />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Actions</DropdownMenuLabel>
				<DropdownMenuItem onClick={() => duplicateTodo(todo)}>
					Duplicate
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => removeTodo(todo.id)}>
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export const columns: ColumnDef<Todo>[] = [
	{
		accessorKey: "done",
		header: "Status",
		cell: ({ row }) => <DoneCell row={row} />,
		enableSorting: true,
		enableHiding: false,
	},
	{
		accessorKey: "title",
		header: "Task",
		cell: ({ row }) => <div>{row.getValue("title")}</div>,
	},
	{
		accessorKey: "dueDate",
		header: "Due Date",
		cell: ({ row }) => {
			const date = row.original.dueDate;
			if (!date) {
				return <span className="text-muted-foreground">No date</span>;
			}
			return <span>{format(parseISO(date), "PPP")}</span>;
		},
	},
	{
		accessorKey: "createdAt",
		header: "Created at",
		cell: ({ row }) => {
			const createdAt = row.original.createdAt;
			return <span>{format(parseISO(createdAt), "PPP")}</span>;
		},
	},
	{
		accessorKey: "tags",
		header: "Tags",
		cell: ({ row }) => {
			const tags = row.original.tags;
			if (!tags.length) return null;
			return (
				<div className="flex gap-1">
					{tags.map((tag, i) => (
						<Badge key={i} variant="secondary">
							{tag}
						</Badge>
					))}
				</div>
			);
		},
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => <ActionsCell row={row} />,
	},
];
