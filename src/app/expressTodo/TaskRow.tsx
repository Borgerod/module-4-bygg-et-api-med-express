import React, { useState, useEffect, useRef, useMemo } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { LuX } from "react-icons/lu";
import { cn } from "@lib/utils";
import { Todo } from "@types";
import TodoPropsUtils from "@/lib/TodoUtils";
import { FilterType } from "./TodoFilters";

interface TaskCardProps {
  todo: Todo;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  onDelete: (id: string) => Promise<void>;
  onToggle: (id: string, currentDone: boolean) => Promise<void>;
  setFilter?: React.Dispatch<React.SetStateAction<FilterType>>;
}

export default function TaskRow({
  todo,
  todos,
  setTodos,
  onDelete,
  onToggle,
  setFilter,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newText, setNewText] = useState<string>(todo.title || "");
  const [visibleTagCount, setVisibleTagCount] = useState<number | null>(null);
  const tagsContainerRef = useRef<HTMLDivElement>(null);
  const [showMore, setShowMore] = useState<boolean>(false);
  const { editTask } = TodoPropsUtils(todos, setTodos);
  const isOverdue: boolean =
    !todo.done && !!todo.dueDate && new Date(todo.dueDate) < new Date();
  const isToday =
    !!todo.dueDate &&
    new Date(todo.dueDate).toDateString() === new Date().toDateString();

  // Parse tags
  const tags = useMemo((): string[] => {
    if (typeof todo.tags === "string" && todo.tags.trim() !== "") {
      return todo.tags
        .split(",")
        .filter((tag: string) => tag.trim() !== "untagged" && tag.trim() !== "")
        .sort((a: string, b: string) => {
          if (a.trim() === "urgent") return -1;
          if (b.trim() === "urgent") return 1;
          return 0;
        });
    }
    return [];
  }, [todo.tags]);

  // Calculate visible tags based on container overflow
  useEffect(() => {
    if (!tagsContainerRef.current || tags.length === 0) return;

    const container = tagsContainerRef.current;
    const badges = Array.from(container.children) as HTMLElement[];

    // Reset to show all badges first
    badges.forEach((badge) => {
      badge.style.display = "";
    });

    const containerWidth = container.offsetWidth;
    let currentWidth = 0;
    let visibleCount = 0;
    const gap = 4; // gap-1 = 4px
    const moreButtonWidth = 80; // Approximate width for "+N more" badge

    for (let i = 0; i < badges.length; i++) {
      const badgeWidth = badges[i].offsetWidth;
      const neededWidth = currentWidth + badgeWidth + (i > 0 ? gap : 0);

      // Check if we need to reserve space for the "more" button
      const hasMoreTags = i < badges.length - 1;
      const totalNeededWidth = hasMoreTags
        ? neededWidth + gap + moreButtonWidth
        : neededWidth;

      if (totalNeededWidth <= containerWidth) {
        visibleCount++;
        currentWidth = neededWidth;
      } else {
        break;
      }
    }

    setVisibleTagCount(visibleCount);
  }, [tags, todo.tags]);

  const onSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (newText.trim()) {
      await editTask(todo.id, newText.trim());
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <TableRow>
        <TableCell colSpan={6}>
          <form
            onSubmit={onSubmit}
            className={cn("flex w-full items-center gap-2", "", "")}
          >
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className={cn("flex-1 bg-transparent", "", "")}
              aria-label={`Edit ${todo.title}`}
            />
            <Button type="submit" size="sm">
              Save
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                setNewText(todo.title);
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
          </form>
        </TableCell>
      </TableRow>
    );
  }

  const totalTags = (isOverdue ? 1 : 0) + tags.length;
  const displayedTags = visibleTagCount !== null ? visibleTagCount : totalTags;
  const overflowCount = totalTags - displayedTags;

  return (
    <TableRow key={todo.id} className={cn("align-top", "", "")}>
      <TableCell
        id="checkbox is-done done"
        className={cn("py-2 w-fit", "", "")}
      >
        <Checkbox
          checked={Boolean(todo.done)}
          onCheckedChange={() => onToggle(todo.id, Boolean(todo.done))}
        />
      </TableCell>

      <TableCell
        id="title task-field"
        className={cn("py-2 wrap-break-word min-w-50 max-w-75", "", "")}
      >
        <p
          className={cn(
            "h-full w-full text-wrap",
            { "font-semibold": isToday },
            "",
            "",
          )}
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.title}
        </p>
      </TableCell>

      <TableCell className={cn("py-2 whitespace-nowrap w-fit", "", "")}>
        <span
          className={cn(
            {
              "text-primary":
                todo.dueDate && new Date(todo.dueDate) > new Date(),
              "text-warning": isOverdue,
              "text-success": isToday,
            },
            "",
            "",
          )}
        >
          {(() => {
            if (!todo.dueDate) return "-";
            const dateStr: string =
              todo.dueDate instanceof Date
                ? todo.dueDate.toISOString()
                : String(todo.dueDate);

            return dateStr === "3000-01-01T00:00:00.000Z"
              ? "-"
              : new Date(dateStr).toLocaleDateString("nb-NO", {
                  dateStyle: "medium",
                });
          })()}
        </span>
      </TableCell>

      <TableCell id="tags" className={cn("py-2 ", "")}>
        <div
          ref={tagsContainerRef}
          className={cn(
            "w-fit",
            "w-full",
            "max-w-70",
            "flex gap-1",
            showMore ? "flex-wrap" : "flex-nowrap",
            "flex-row",
            "",
            "",
          )}
        >
          <Badge
            className={cn(
              isOverdue ? "block" : "hidden",
              "bg-warning-border text-primary",
              "dark:bg-warning-bg dark:text-warning-text dark:border dark:border-warning-border",
              "",
            )}
          >
            overdue
          </Badge>
          {tags.map((tag: string, i: number) => (
            <Badge
              id="tag tag-badge"
              key={i}
              variant="secondary"
              className={cn(
                "text-xs break-all",
                "cursor-pointer",
                tag.trim() === "urgent"
                  ? "bg-issue-border text-primary dark:bg-issue-bg dark:text-issue-text dark:border dark:border-issue-border"
                  : "",

                visibleTagCount !== null &&
                  !showMore &&
                  i >= visibleTagCount - (isOverdue ? 1 : 0)
                  ? "hidden"
                  : "",
                "",
              )}
              onClick={() => {
                if (setFilter) {
                  setFilter((prev) => ({
                    ...prev,
                    includeTags: prev.includeTags.includes(tag)
                      ? prev.includeTags
                      : [...prev.includeTags, tag],
                  }));
                }
              }}
              role={setFilter ? "button" : undefined}
              tabIndex={setFilter ? 0 : undefined}
            >
              {tag}
            </Badge>
          ))}
          {overflowCount > 0 && !showMore && (
            <Button
              id="show-more-button"
              onClick={() => setShowMore(true)}
              className="contents"
            >
              <Badge
                variant="secondary"
                className={cn("text-xs whitespace-nowrap", "", "")}
              >
                {`+${overflowCount} more`}
              </Badge>
            </Button>
          )}
          {showMore && (
            <Button
              id="show-less-button"
              onClick={() => setShowMore(false)}
              className="contents"
            >
              <Badge
                variant="secondary"
                className={cn("text-xs whitespace-nowrap", "", "")}
              >
                show less
              </Badge>
            </Button>
          )}
        </div>
      </TableCell>

      <TableCell
        id="created createdAt"
        className={cn(
          "py-2 whitespace-nowrap w-fit",
          "text-muted-foreground",
          "",
        )}
      >
        {todo.createdAt
          ? new Date(todo.createdAt).toLocaleDateString("nb-NO", {
              dateStyle: "medium",
            })
          : "N/A"}
      </TableCell>

      <TableCell className={cn("py-2 w-fit", "", "")}>
        <Button
          id="delete-button close-button"
          type="button"
          variant="ghost"
          size="sm"
          aria-label="Delete todo"
          onClick={() => onDelete(todo.id)}
        >
          <LuX />
        </Button>
      </TableCell>
    </TableRow>
  );
}
