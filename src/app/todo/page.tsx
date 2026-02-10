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
import SortSelect from "./SortSelect";
import { HiOutlinePlusSm } from "react-icons/hi";

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

  return (
    <div
      className={cn(
        "space-y-4 ",
        "flex flex-col",
        "min-w-2xl",
        "min-w-full",
        "items-center",
        "",
        "",
      )}
    >
      <Card
        id="table-card"
        className={cn(
          "flex flex-col",
          "w-full",
          "max-w-full",
          "md:min-w-150",
          "w-fit",
          "border-0 sm:border",
          "shadow-none sm:shadow",

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
          <CardAction className="flex gap-5">
            <SortSelect />
            <PeriodSelect />
          </CardAction>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 p-0 sm:px-6">
          <ScrollArea className="h-full">
            <div
            // className="px-6 pb-4"
            >
              <Table className={cn("w-auto table-auto", "", "")}>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow
                    className={cn(
                      "text-left text-xs font-medium text-muted-foreground",
                      "",
                      "",
                    )}
                  >
                    {["Done", "Task", "Due", "Tags", "Created", ""].map(
                      (h, i) => (
                        <TableHead
                          key={`h-${i}`}
                          className={cn(
                            "py-1 px-1 whitespace-nowrap",
                            h === "Task" ? "max-w-[8rem] truncate" : "",
                            h === "Tags" ? "max-w-[6rem] truncate" : "",
                            h === "Due" ? "max-w-[7rem] truncate" : "",
                            h === "Created"
                              ? "hidden md:table-cell max-w-[7rem] truncate"
                              : "",
                            "",
                          )}
                        >
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
      <Form className={cn("w-full", "px-2", "")} action={handleAddTodo}>
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
          <CardHeader className="px-0">
            <CardTitle>Add new</CardTitle>

            <CardAction>
              <Button
                variant="outline"
                type="submit"
                className={cn(
                  "data-[empty=true]:text-muted-foreground justify-start text-left font-normal",
                  "text-muted-foreground",
                  "",
                  "",
                )}
              >
                <HiOutlinePlusSm />
                {/* +Add Task */}
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="px-0">
            <FieldGroup className="gap-5 sm:-mb-5">
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
                    className={cn("w-full!", "hidden sm:block", "", "")}
                  />
                </Field>
              </div>
              <Field>
                <Input
                  id="tags"
                  name="tags"
                  type="text"
                  placeholder="Add tags (separate with comma)"
                  className={cn("w-full!", "block sm:hidden", "", "")}
                />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </Form>
    </div>
  );
}
