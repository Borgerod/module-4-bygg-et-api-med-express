import { Button } from "@/components/ui/button";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar28 as DatePicker } from "./DatePicker";
import { addTodo } from "@/lib/todo";
import { cn } from "@/lib/utils";

import Form from "next/form";
import { redirect } from "next/navigation";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import PeriodSelect from "./PeriodSelect";
import { cookies, headers } from "next/headers";
import TodoList from "./todoList";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("accessToken")?.value;
  if (!token) {
    const pathname = (await headers()).get("x-pathname") || "/todo";
    redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
  }

  async function handleAddTodo(formData: FormData) {
    "use server";
    const title = formData.get("title")?.toString().trim() || "";
    if (!title) throw new Error("Title is required");
    await addTodo(
      title,
      formData
        .get("tags")
        ?.toString()
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean) || [],
      formData.get("dueDate")
        ? new Date(formData.get("dueDate") as string)
        : undefined,
    );
    redirect("/todo");
  }

  // async function handleDeleteTodo(formData: FormData) {
  //   "use server";
  //   const id = formData.get("id") as string;
  //   if (id) {
  //     await deleteTodo(id);
  //   }
  //   redirect("/todo");
  // }

  // async function handleToggleTodo(formData: FormData) {
  //   // async function handleToggleTodo(prevState: unknown, formData: FormData) {
  //   "use server";
  //   const id = formData.get("id") as string;
  //   const done = formData.get("done") === "on";
  //   await updateTodo(id, { done });
  //   redirect("/todo");
  // }

  return (
    <div className={cn("space-y-4 flex flex-col", "min-w-2xl", "", "", "")}>
      <Card
        id="table-card"
        className={cn(
          "flex flex-col",
          "w-full",
          "max-w-full",

          "",
          "",
          "",
        )}
      >
        <CardHeader className="shrink-0">
          <CardTitle>TO DO LIST</CardTitle>
          <CardDescription>
            Manage, monitor and edit your schedule
          </CardDescription>
          <CardAction>
            <PeriodSelect />
          </CardAction>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 p-0">
          <ScrollArea className="h-full">
            <div className="px-6 pb-4">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow className="text-left text-sm font-medium text-muted-foreground">
                    {["Done", "Task", "Due", "Tags", "Created", ""].map(
                      (h, i) => (
                        <TableHead key={`h-${i}`} className={cn("", "")}>
                          {h}
                        </TableHead>
                      ),
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y">
                  <TodoList searchParams={searchParams} />
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      {/* _______________________________________________ */}

      <Form className={cn("", "")} action={handleAddTodo}>
        <Card
          id="table-card"
          className={cn(
            "flex flex-col",
            "p-4",
            "w-full",
            "overflow-hidden",
            "",
            "",
          )}
        >
          {/* TODO: maybe add a "+ button" and make this a popup  */}
          <CardHeader>
            <CardTitle>Add new</CardTitle>

            <CardAction>
              <Button
                variant="outline"
                type="submit"
                className={cn(
                  "data-[empty=true]:text-muted-foreground justify-start text-left font-normal",
                  "",
                  "",
                  "",
                )}
              >
                +{/* Add Task */}
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <FieldGroup className="gap-5">
              <Field>
                <Textarea
                  id="task"
                  name="title"
                  placeholder="Describe task.."
                  required
                  className={cn("min-h-20", "resize-none", "", "")}
                />
              </Field>
              <div
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
                <Field>
                  <DatePicker />
                </Field>
                <Field>
                  <Input
                    id="tags"
                    name="tags"
                    type="text"
                    placeholder="Add tags (separate with comma)"
                    className={cn(
                      "w-full!",

                      "",
                      "",
                    )}
                  />
                </Field>
              </div>
            </FieldGroup>
          </CardContent>
        </Card>
      </Form>
    </div>
  );
}
