"use client";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") ?? "createdAt,asc";

  //handleChange
  function setSort(sortValue: string) {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("sort", sortValue);
    router.push(`?${params.toString()}`);
  }

  return (
    <Select value={sort} onValueChange={setSort}>
      <SelectTrigger>
        <SelectValue placeholder="Sort direction" />
      </SelectTrigger>
      <SelectContent position="popper" className="">
        <SelectGroup>
          <SelectLabel> Date created </SelectLabel>
          <SelectItem value="createdAt,asc">Newest</SelectItem>
          <SelectItem value="createdAt,dsc">Oldest</SelectItem>
          <SelectSeparator />
          <SelectLabel> Due date </SelectLabel>
          <SelectItem value="dueDate,asc">Soonest</SelectItem>
          <SelectItem value="dueDate,dsc">Latest</SelectItem>
          <SelectSeparator />
          <SelectLabel> Alphabetical </SelectLabel>
          <SelectItem value="title,az">A-Z</SelectItem>
          <SelectItem value="title,za">Z-A</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
