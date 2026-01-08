// "use client";

// import * as React from "react";
// import { ChevronDownIcon } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import { Label } from "@/components/ui/label";
// import {
// 	Popover,
// 	PopoverContent,
// 	PopoverTrigger,
// } from "@/components/ui/popover";

// export function Calendar22() {
// 	const [open, setOpen] = React.useState(false);
// 	const [date, setDate] = React.useState<Date | undefined>(undefined);

// 	return (
// 		<div className="flex flex-col gap-3">
// 			<Label htmlFor="date" className="px-1">
// 				Date of birth
// 			</Label>
// 			<Popover open={open} onOpenChange={setOpen}>
// 				<PopoverTrigger asChild>
// 					<Button
// 						variant="outline"
// 						id="date"
// 						className="w-48 justify-between font-normal"
// 					>
// 						{date ? date.toLocaleDateString() : "Select date"}
// 						<ChevronDownIcon />
// 					</Button>
// 				</PopoverTrigger>
// 				<PopoverContent
// 					className="w-auto overflow-hidden p-0"
// 					align="start"
// 				>
// 					<Calendar
// 						mode="single"
// 						selected={date}
// 						captionLayout="dropdown"
// 						onSelect={(
// 							date: React.SetStateAction<Date | undefined>
// 						) => {
// 							setDate(date);
// 							setOpen(false);
// 						}}
// 					/>
// 				</PopoverContent>
// 			</Popover>
// 		</div>
// 	);
// }
"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

// Accept props as a single object
export function DatePicker(props: {
	id?: string;
	name?: string;
	type?: string;
	placeholder?: string;
	value?: string;
	className?: string;
}) {
	const [date, setDate] = React.useState<Date>();

	return (
		<>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						data-empty={!date}
						id={props.id}
						name={props.name}
						className={cn(
							"data-[empty=true]:text-muted-foreground justify-start text-left font-normal",
							props.className ? props.className : "",
							" w-70 ",
							"",
							"",
							""
						)}
					>
						<CalendarIcon />
						{date ? (
							format(date, "PPP")
						) : (
							<span>{props.placeholder || "Pick a date"}</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0">
					<Calendar
						mode="single"
						selected={date}
						onSelect={setDate}
					/>
				</PopoverContent>
			</Popover>
			{/* Hidden input for form submission */}
			<input
				type="hidden"
				id={props.id}
				name={props.name}
				value={date ? format(date, "yyyy-MM-dd") : ""}
			/>
		</>
	);
}
