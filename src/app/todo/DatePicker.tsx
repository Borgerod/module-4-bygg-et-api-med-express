"use client";
import { IoMdTime } from "react-icons/io";

import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@lib/utils";

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }

  return date.toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

export function Calendar28() {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>();
  const [month, setMonth] = React.useState<Date | undefined>(date);
  const [value, setValue] = React.useState(formatDate(date));
  const [time, setTime] = React.useState("");

  function getCombinedDateTime(): string {
    if (!date) return "";
    const [hours, minutes] = time.split(":").map(Number);
    const combined = new Date(date);
    combined.setHours(hours || 0, minutes || 0, 0);
    return combined.toISOString();
  }

  function setDateWithTime(newDate: Date | undefined, newTime: string) {
    if (!newDate) {
      setDate(undefined);
      setValue("");
      return;
    }
    const [hours, minutes] = newTime.split(":").map(Number);
    newDate.setHours(hours || 0, minutes || 0, 0);
    setDate(newDate);
    setValue(formatDate(newDate));
  }

  return (
    <div
      className={cn("flex flex-row gap-4 items-center max-w-xs mx-auto", "")}
    >
      <input type="hidden" name="dueDate" value={getCombinedDateTime()} />
      <div className={cn("flex flex-col gap-0", "")}>
        <div className={cn("relative flex gap-0", "")}>
          <Input
            id="dueDateDisplay"
            name="dueDateDisplay"
            value={value}
            placeholder="Due date"
            className={cn(" px-2 w-30", "")}
            onChange={(e) => {
              const newDate = new Date(e.target.value);
              setValue(e.target.value);
              if (isValidDate(newDate)) {
                setMonth(newDate);
                setDateWithTime(newDate, time);
              }
            }}
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
                )}
              >
                <CalendarIcon className={cn("size-3.5", "")} />
                <span className={cn("sr-only", "")}>Select date</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className={cn("w-auto overflow-hidden p-0", "")}
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
                onSelect={(selectedDate) => {
                  setMonth(selectedDate);
                  setDateWithTime(selectedDate, time);
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div
        tabIndex={0}
        className={cn(
          "flex flex-col gap-0 px-2 m-0 w-20",
          "border rounded-lg flex flex-row",
          "items-center",
          "justify-start",
          "focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:outline-none",
          "bg-accent",
          "",
          "",
          "",
        )}
      >
        <Input
          type="text"
          id="time-picker"
          value={time}
          placeholder="At"
          pattern="[0-2][0-9]:[0-5][0-9]"
          maxLength={5}
          onChange={(e) => {
            let val = e.target.value.replace(/[^0-9]/g, "");
            if (val.length >= 2) {
              val = val.slice(0, 2) + ":" + val.slice(2, 4);
            }
            setTime(val);
            if (date && /^[0-2][0-9]:[0-5][0-9]$/.test(val)) {
              setDateWithTime(new Date(date), val);
            }
          }}
          onBlur={(e) => {
            const match = e.target.value.match(/^(\d{1,2}):?(\d{0,2})$/);
            if (match) {
              const hours = Math.min(23, parseInt(match[1]) || 0);
              const minutes = Math.min(59, parseInt(match[2]) || 0);
              const formatted = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
              setTime(formatted);
              if (date) {
                setDateWithTime(new Date(date), formatted);
              }
            }
          }}
          className={cn(
            "font-mono px-0 py-1 text-sm w-15",
            "border-transparent",
            "bg-transparent!",
            "shadow-none",
            "focus:border-transparent",
            "focus:ring-0",
            "focus:ring-transparent",
            "focus:outline-none",
            "focus-visible:border-transparent",
            "focus-visible:ring-0",
            "focus-visible:ring-transparent",
            "focus-visible:outline-none",
            "",
            "",
          )}
        />
        <IoMdTime className={cn("m-0 p-0 h-6 w-6 text-xl ", "", "")} />
      </div>
    </div>
  );
}
