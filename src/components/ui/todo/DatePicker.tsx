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
// "use client";

// import * as React from "react";
// import { format } from "date-fns";
// import { Calendar as CalendarIcon } from "lucide-react";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";

// // Accept props as a single object
// export function DatePicker(props: {
//   id?: string;
//   name?: string;
//   type?: string;
//   placeholder?: string;
//   value?: string;
//   className?: string;
// }) {
//   const [date, setDate] = React.useState<Date>();

//   return (
//     <>
//       <Popover>
//         <PopoverTrigger asChild>
//           <Button
//             variant="outline"
//             data-empty={!date}
//             id={props.id}
//             name={props.name}
//             className={cn(
//               "data-[empty=true]:text-muted-foreground justify-start text-left font-normal",
//               props.className ? props.className : "",
//               " w-70 ",
//               "",
//               "",
//               ""
//             )}
//           >
//             <CalendarIcon />
//             {date ? (
//               format(date, "PPP")
//             ) : (
//               <span>{props.placeholder || "Pick a date"}</span>
//             )}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-auto p-0">
//           <Calendar mode="single" selected={date} onSelect={setDate} />
//         </PopoverContent>
//       </Popover>
//       {/* Hidden input for form submission */}
//       <input
//         type="hidden"
//         id={props.id}
//         name={props.name}
//         value={date ? format(date, "yyyy-MM-dd") : ""}
//       />
//     </>
//   );
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
import { Input } from "../input";

// context7
// #next-devtools

function isValidDate(date: Date | undefined): boolean {
  if (!date) return false;
  return !isNaN(date.getTime());
}
function formatDate(date: Date | undefined): string {
  if (!date) return "";
  return date.toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export type DatePickerProps = {
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string; // yyyy-MM-dd
  className?: string;
  onSelect?: (value: string) => void;
};

export function DatePicker({
  id,
  name,
  placeholder,
  value,
  className,
  onSelect,
}: DatePickerProps) {
  const initialDate =
    value && isValidDate(new Date(value)) ? new Date(value) : undefined;
  const [open, setOpen] = React.useState<boolean>(false);
  const [date, setDate] = React.useState<Date | undefined>(initialDate);
  const [month, setMonth] = React.useState<Date | undefined>(initialDate);
  const [inputValue, setInputValue] = React.useState<string>(
    formatDate(initialDate),
  );

  // Keep everything in sync without useEffect
  const handleSelect = (d?: Date) => {
    setDate(d);
    setMonth(d);
    const formatted = d ? formatDate(d) : "";
    setInputValue(formatted);
    onSelect?.(d ? format(d, "yyyy-MM-dd") : "");
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    const d = new Date(e.target.value);
    if (isValidDate(d)) {
      setDate(d);
      setMonth(d);
      onSelect?.(format(d, "yyyy-MM-dd"));
    } else {
      setDate(undefined);
      setMonth(undefined);
      onSelect?.("");
    }
  };

  return (
    <div className={cn("flex flex-col gap-3", "", "")}>
      <div className={cn("relative flex gap-2", "", "")}>
        <Input
          id={id}
          name={name}
          value={inputValue}
          placeholder={placeholder ?? "Due date"}
          className={cn("bg-background pr-10", "", "")}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className={cn(
                "absolute top-1/2 right-2 size-6 -translate-y-1/2",
                "",
                "",
              )}
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className={cn("w-auto overflow-hidden p-0", "", "")}
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={handleSelect}
            />
          </PopoverContent>
        </Popover>
        {/* Hidden input for form submission */}
        <input
          type="hidden"
          id={id}
          name={name}
          value={date ? format(date, "yyyy-MM-dd") : ""}
          readOnly
        />
      </div>
    </div>
  );
}
