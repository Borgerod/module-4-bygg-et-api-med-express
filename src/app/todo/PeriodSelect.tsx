"use client";

import { useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function PeriodSelect() {
	const [period, setPeriod] = useState("All");
	return (
		<div className="grid grid-cols-[1fr_auto] text-muted-foreground items-center ">
			<div className="flex flex-row w-fit items-center gap-2">
				{period === "All"
					? "Showing "
					: period === "today"
					? "Showing tasks for "
					: "Showing tasks for this "}

				<Select value={period} onValueChange={setPeriod}>
					<SelectTrigger className="w-fit">
						<SelectValue placeholder="Period" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="All">All</SelectItem>
						<SelectItem value="today">Today</SelectItem>
						<SelectItem value="week">Week</SelectItem>
						<SelectItem value="month">Month</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
