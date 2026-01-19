"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HiOutlinePlusSm } from "react-icons/hi";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
import { cn } from "@lib/utils";

import { DatePicker } from "@/components/ui/todo/DatePicker";

type TodoInputProps = {
  onAdd: (todo: { title: string; tags: string; dueDate: string }) => void;
};
export default function TodoInput({ onAdd }: TodoInputProps) {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [dueDate, setDueDate] = useState("");
  async function handleSubmit(formData: FormData) {
    setTitle(formData.get("title") as string);
    setTags(formData.get("tags") as string);
    setDueDate(formData.get("dueDate") as string);
    console.log({ title, tags, dueDate });

    onAdd({
      title,
      tags,
      dueDate,
    });
  }

  return (
    <Card id="form-card">
      <form action={handleSubmit} className="contents">
        <CardHeader>
          <CardTitle>Add new</CardTitle>

          <CardAction>
            <Button
              variant="outline"
              type="submit"
              className={cn(
                "flex items-center justify-center text-center place-items-center",
                "data-[empty=true]:text-muted-foreground font-normal",
                "text-3xl text-muted-foreground",
                "",
                "",
              )}
            >
              <HiOutlinePlusSm />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <FieldSet className="flex gap-5 w-full">
            <Field className="flex-1 min-w-0">
              <Input
                id="task"
                name="title"
                autoComplete="off"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Describe task.."
                required
                className={cn("min-h-10", "resize-none", "", "")}
              />
            </Field>

            <FieldGroup
              id="field-subgroup"
              className={cn(
                "flex flex-row",
                "grid",
                "grid-cols-[1fr_auto]",
                "grid-cols-[auto_1fr]",
                "gap-5",
                "h-fit",
                "h-full",
                "",
                "",
              )}
            >
              <Field
                className={cn(
                  "md:w-fit",
                  "",

                  "",
                  "",
                )}
              >
                <DatePicker
                  id="dueDate"
                  name="dueDate"
                  value={dueDate}
                  onSelect={(v: string) => setDueDate(v)}
                />
              </Field>
              <Field className="w-full">
                <Input
                  id="tags"
                  name="tags"
                  type="text"
                  autoComplete="off"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Add tags (separate with comma)"
                />
              </Field>
            </FieldGroup>
          </FieldSet>
        </CardContent>
      </form>
    </Card>
  );
}
