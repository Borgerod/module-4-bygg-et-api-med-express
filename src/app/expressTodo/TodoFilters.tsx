"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import {
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Sheet,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { FILTER } from "@lib/formConfig";
import { useTodos } from "./TodoContext";
import { Todo } from "@types";
import { Badge } from "@/components/ui/badge";

export type FilterType = {
  sortBy: string;
  selectPeriod: string;
  isDone: string;
  includeTags: string[];
};

type Props = {
  filter: FilterType;
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
};

const extractTodoTags = (tags?: Todo["tags"]): string[] => {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return tags.map((tag) => tag.trim()).filter(Boolean);
  }
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};

const getUniqueTags = (todos: Todo[]) =>
  Array.from(new Set(todos.flatMap((todo) => extractTodoTags(todo.tags))));

export default function TodoFilters({ filter, setFilter }: Props) {
  const { todos } = useTodos();

  const uniqueTags = getUniqueTags(todos);

  const toggleTag = (tag: string) => {
    setFilter((prev) => {
      const has = prev.includeTags.includes(tag);
      const includeTags = has
        ? prev.includeTags.filter((item) => item !== tag)
        : [...prev.includeTags, tag];
      return { ...prev, includeTags };
    });
  };

  return (
    <>
      <div id="open-filter-button">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant={"outline"} className="text-sm font-normal">
              Filter
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter your tasks</SheetTitle>
              <SheetDescription></SheetDescription>
            </SheetHeader>

            <div
              id="form-content"
              className={cn(
                "grid grid-cols-2 w-full px-10 items-center gap-y-5",
                "",
                "",
              )}
            >
              <span id="input-label">Completed</span>
              <Select
                value={filter.isDone || FILTER.done.all}
                onValueChange={(value: string) => {
                  setFilter({ ...filter, isDone: value });
                }}
              >
                <SelectTrigger className={cn("w-fit", "", "")}>
                  <SelectValue placeholder={FILTER.done.all} />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    <SelectLabel>Completed</SelectLabel>
                    {Object.values(FILTER.done).map((label: string) => (
                      <SelectItem key={label} value={label}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <span id="input-label">Period</span>
              <Select
                value={filter.selectPeriod || FILTER.period.all}
                onValueChange={(value: string) => {
                  setFilter({ ...filter, selectPeriod: value });
                }}
              >
                <SelectTrigger className={cn("w-fit", "", "")}>
                  <SelectValue placeholder={FILTER.period.all} />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    <SelectLabel>Period</SelectLabel>
                    {Object.values(FILTER.period).map((label: string) => (
                      <SelectItem key={label} value={label}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <div
                id="filter-by-tags"
                className={cn("col-span-2 flex flex-wrap gap-2", "", "")}
              >
                <span id="input-label">{FILTER.tags.label}</span>
                <div className={cn("flex flex-wrap gap-2", "", "")}>
                  {uniqueTags.length > 0 ? (
                    uniqueTags.map((tag) => {
                      const isActive = filter.includeTags.includes(tag);
                      return (
                        <Badge
                          key={tag}
                          role="checkbox"
                          variant="secondary"
                          aria-checked={isActive}
                          onClick={() => toggleTag(tag)}
                          className={cn(
                            "text-xs break-all",
                            "cursor-pointer",
                            "border-0 border-transparent",
                            "rounded-full px-3 py-1 transition-colors",
                            isActive
                              ? "bg-primary/90 text-primary-foreground border-muted hover:bg-primary/90"
                              : "border-border text-muted-foreground hover:border-primary hover:text-primary",
                            "",
                            "",
                          )}
                        >
                          {tag}
                        </Badge>
                      );
                    })
                  ) : (
                    <span
                      className={cn(
                        "text-xs text-muted-foreground uppercase",
                        "",
                        "",
                      )}
                    >
                      No tags yet
                    </span>
                  )}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
