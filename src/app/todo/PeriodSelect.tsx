"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function PeriodSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const period = searchParams.get("period") ?? "all";

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", value);
    router.replace(`?${params.toString()}`);
  }

  return (
    <div
      className={cn(
        "grid",
        "grid-cols-[1fr_auto]",
        "text-muted-foreground",
        "items-center",
        "",
        "",
      )}
    >
      <div
        className={cn(
          "flex",
          "flex-row",
          "w-fit",
          "items-center",
          "gap-2",
          "",
          "",
        )}
      >
        {period === "all" ? "Showing " : "Showing tasks for "}

        <Select value={period} onValueChange={handleChange}>
          <SelectTrigger className="w-fit">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="tomorrow">tomorrow</SelectItem>
            <SelectItem value="this_week">this Week</SelectItem>
            <SelectItem value="next_week">next Week</SelectItem>
            <SelectItem value="this_month">this Month</SelectItem>
            <SelectItem value="next_month">next Month</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
