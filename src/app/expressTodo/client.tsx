// "use client";
// import React, { useState } from "react";
// import { TodoType } from "@types";
// import {
//   Table,
//   TableBody,
//   TableRow,
//   TableCell,
//   TableHeader,
//   TableHead,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { HiOutlineAdjustments, HiOutlinePlusSm } from "react-icons/hi";
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import {
//   Card,
//   CardAction,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { LuX } from "react-icons/lu";

// import {
//   Field,
//   FieldDescription,
//   FieldGroup,
//   FieldLabel,
//   FieldSet,
// } from "@/components/ui/field";
// import { cn } from "@lib/utils";

// import { DatePicker } from "@/components/ui/todo/DatePicker";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import PeriodSelect from "../todo/PeriodSelect";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";

// // import { sortTodos, toggleFilters } from "@lib/filter";
// import { toggleFilters } from "@lib/filter";
// import { FILTER, SORT_ORDERS } from "@lib/formConfig";

// const API_BASE = (
//   process.env.NEXT_PUBLIC_EXPRESS_URL ?? "http://localhost:4000"
// ).replace(/\/$/, "");
// const api = (path: string) => `${API_BASE}${path}`;

// export default function TodosClient({
//   initialTodos,
// }: {
//   initialTodos: TodoType[];
// }) {
//   // const [filtered, setTodos] = useState<TodoType[]>(initialTodos);
//   // const [title, setTitle] = useState("");
//   // const [tags, setTags] = useState("");
//   // const [dueDate, setDueDate] = useState("");
//   // const [sortBy, setSortBy] = useState(SORT_ORDERS.createdat_asc);
//   // // const [selectPeriod, setSelectPeriod] = useState("all");
//   // const [selectPeriod, setSelectPeriod] = useState(FILTER.period.all);
//   // const [isDone, setDone] = useState(FILTER.done.all);

//   const [todos, setAllTodos] = useState<TodoType[]>(initialTodos);
//   const [title, setTitle] = useState("");
//   const [tags, setTags] = useState("");
//   const [dueDate, setDueDate] = useState("");
//   const [sortBy, setSortBy] = useState(SORT_ORDERS.createdat_asc);
//   const [selectPeriod, setSelectPeriod] = useState(FILTER.period.all);
//   const [isDone, setDone] = useState(FILTER.done.all);

//   const filtered = toggleFilters(todos, selectPeriod, isDone);

//   // async function handleSelectPeriod(value: string) {
//   //   setSelectPeriod(value);
//   // }

//   async function createTodoClient(e?: React.FormEvent) {
//     e?.preventDefault();
//     const selectedDue = dueDate; // controlled value from DatePicker via setDueDate
//     if (!title.trim()) return;

//     // optimistic UI: create a temp item so user sees immediate feedback
//     // ? should probably use a type schema
//     const temp: TodoType = {
//       id: `temp-${Date.now()}`,
//       title,
//       tags,
//       done: false,
//       createdAt: new Date(),
//       dueDate: selectedDue
//         ? new Date(selectedDue)
//         : new Date("3000-01-01T00:00:00Z"),
//     };
//     setAllTodos((s) => [temp, ...s]);

//     try {
//       const res = await fetch(api("/expressTodo"), {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           title,
//           tags,
//           dueDate: selectedDue || null,
//         }),
//       });
//       if (!res.ok) throw new Error("Create failed");
//       const created = await res.json();
//       // replace temp with server returned item
//       setAllTodos((s) => s.map((t) => (t.id === temp.id ? created : t)));
//       setTitle("");
//       setTags("");
//       setDueDate("");
//     } catch (err) {
//       // rollback on error
//       setAllTodos((s) => s.filter((t) => t.id !== temp.id));
//       console.error("Create failed", err);
//     }
//   }

//   async function delTodo(id: string) {
//     const prev = todos;
//     setAllTodos((t) => t.filter((x) => x.id !== id));

//     try {
//       const res = await fetch(api(`/expressTodo/${id}`), {
//         method: "DELETE",
//       });
//       if (!res.ok) throw new Error("Delete failed");
//     } catch (err) {
//       setAllTodos(prev);
//       console.error("Failed to delete", err);
//     }
//   }

//   const toggleDone = async (id: string, done: boolean) => {
//     const prev = todos;
//     setAllTodos((t) => t.map((x) => (x.id === id ? { ...x, done } : x)));

//     try {
//       const res = await fetch(api(`/expressTodo/${id}`), {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ done }),
//       });
//       if (!res.ok) throw new Error("Toggle failed");
//     } catch (err) {
//       setAllTodos(prev);
//       console.error("Failed to toggle", err);
//     }
//   };

//   return (
//     <>
//       <Card
//         id="table-card"
//         className={cn(
//           "flex flex-col",
//           "p-4",
//           "w-full",
//           "max-h-[70vh]",
//           "overflow-hidden",
//           "",
//           "",
//         )}
//       >
//         {/* <CardHeader className="shrink-0"> */}
//         <CardHeader className="w-full px-0">
//           <CardTitle>TO DO LIST</CardTitle>
//           <CardDescription>
//             Manage, monitor and edit your schedule Displaying: (
//             {filtered.length}) task(s)
//           </CardDescription>
//           <CardAction>
//             {/* <div className="grid grid-cols-[1fr_auto] text-muted-foreground items-center grid-rows-3 "> */}
//             <div
//               className={cn(
//                 "flex flex-col items-end text-muted-foreground text-end",
//                 "gap-2",
//                 "py-2",
//                 "",
//                 "",
//               )}
//             >
//               <div className="text-nowrap  gap-1 text-sm flex flex-row">
//                 Showing
//                 <h2
//                   className={cn(
//                     "text-2xl uppercase",

//                     "leading-4",
//                     "text-primary",
//                     "",
//                     "",
//                   )}
//                 >
//                   {selectPeriod}
//                 </h2>
//               </div>
//               {/* ! TEMP */}
//               <div className="text-nowrap  gap-1 text-sm flex flex-row">
//                 filter by completed:
//                 <h2
//                   className={cn(
//                     "text-2xl uppercase",

//                     "leading-4",
//                     "text-primary",
//                     "",
//                     "",
//                   )}
//                 >
//                   {isDone}
//                 </h2>
//               </div>

//               {/* <div className="text-nowrap flex gap-1 text-sm leading-9 ">
//                 {selectPeriod === "all" ? (
//                   <>
//                     Showing <h2 className="text-2xl">{selectPeriod}</h2> tasks
//                   </>
//                 ) : (
//                   <>
//                     Showing <h2 className="text-2xl">{selectPeriod}&#39;s</h2>{" "}
//                     tasks
//                   </>
//                 )}
//               </div> */}

//               {/* <div className="text-nowrap gap-1 text-sm flex flex-row items-center invert">
//                 Select period
//                 <Card className="relative grid px-2  h-fit w-50 bg-background">
//                   <h2
//                     className={cn(
//                       "text-2xl uppercase leading-2 place-self-center pointer-events-none text-primary",
//                       "",
//                       ""
//                     )}
//                   >
//                     {selectPeriod}
//                   </h2>
//                   <Select
//                     value={selectPeriod}
//                     onValueChange={handleSelectPeriod}
//                   >
//                     <SelectTrigger
//                       className={cn(
//                         "absolute inset-0 w-full h-full opacity-0 cursor-pointer",
//                         "place-self-center",
//                         "",
//                         ""
//                       )}
//                       style={{ zIndex: 10 }}
//                     >
//                       <SelectValue placeholder="All" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">All</SelectItem>
//                       <SelectItem value="today">Today</SelectItem>
//                       <SelectItem value="tomorrow">Tomorrow</SelectItem>
//                       <SelectItem value="this week">This week</SelectItem>
//                       <SelectItem value="next week">Next week</SelectItem>
//                       <SelectItem value="this month">This month</SelectItem>
//                       <SelectItem value="next month">Next month</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </Card>
//               </div> */}

//               {/* <div className="flex flex-row w-fit items-center gap-2">
//                 Select period
//                 <Select value={selectPeriod} onValueChange={handleSelectPeriod}>
//                   <SelectTrigger className="w-fit">
//                     <SelectValue placeholder="SortBy" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All</SelectItem>
//                     <SelectItem value="today">Today</SelectItem>
//                     <SelectItem value="tomorrow">Tomorrow</SelectItem>
//                     <SelectItem value="this week">This week</SelectItem>
//                     <SelectItem value="next week">Next week</SelectItem>
//                     <SelectItem value="this month">This month</SelectItem>
//                     <SelectItem value="next month">Next month</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div> */}
//             </div>
//             {/* </div> */}
//           </CardAction>
//         </CardHeader>

//         <div className="overflow-auto flex-1">
//           <div id="table-settings-row">
//             {/* <div id="open-filter-button ">
//               <Sheet>
//                 <SheetTrigger>Open</SheetTrigger>
//                 <SheetContent>
//                   <SheetHeader>
//                     <SheetTitle>Are you absolutely sure?</SheetTitle>
//                     <SheetDescription>
//                       <form
//                         id="filter filter-form"
//                         action={() => {
//                           toggleFilters(filtered, selectPeriod, isDone);
//                         }}
//                       >
//                         <div
//                           id="select-period"
//                           className="flex flex-row w-fit items-center gap-2"
//                         >
//                           completed:
//                           <Select
//                             value={isDone}
//                             onValueChange={(value: string) => {
//                               setDone(value);
//                             }}
//                           >
//                             <SelectTrigger className="w-fit">
//                               <SelectValue placeholder={isDone} />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {Object.values(FILTER.done).map((label) => (
//                                 <SelectItem key={label} value={label}>
//                                   {label}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                           <Select
//                             value={selectPeriod}
//                             onValueChange={(value: string) => {
//                               setSelectPeriod(value);
//                             }}
//                           >
//                             <SelectTrigger className="w-fit">
//                               <SelectValue placeholder={selectPeriod} />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {Object.values(FILTER.period).map((label) => (
//                                 <SelectItem key={label} value={label}>
//                                   {label}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </div>
//                       </form>
//                     </SheetDescription>
//                   </SheetHeader>
//                 </SheetContent>
//               </Sheet>
//             </div> */}

//             <div
//               id="sortby-select"
//               className="flex flex-row w-fit items-center gap-2 "
//             >
//               Sort by
//               <Select
//                 value={sortBy}
//                 onValueChange={(value: string) => {
//                   setSortBy(value);
//                 }}
//               >
//                 <SelectTrigger className="w-fit">
//                   <SelectValue placeholder={sortBy} />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {Object.values(SORT_ORDERS).map((label) => (
//                     <SelectItem key={label} value={label}>
//                       {label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//           <Table>
//             <TableHeader className="sticky top-0 bg-background z-10">
//               <TableRow className="text-left text-sm font-medium text-muted-foreground">
//                 {["Done", "Task", "Due", "Tags", "Created", ""].map((h, i) => (
//                   <TableHead key={`h-${i}`}>{h}</TableHead>
//                 ))}
//               </TableRow>
//             </TableHeader>

//             <TableBody className="divide-y">
//               {filtered.map((todo) => (
//                 <TableRow key={todo.id} className="align-top">
//                   <TableCell className="py-2 w-16">
//                     <Checkbox
//                       checked={!!todo.done}
//                       onCheckedChange={(val) => toggleDone(todo.id, !!val)}
//                     />
//                   </TableCell>

//                   <TableCell className="py-2 wrap-break-word min-w-50 max-w-75 ">
//                     <p className="h-full w-full text-wrap">{todo.title}</p>
//                   </TableCell>

//                   <TableCell className="py-2 whitespace-nowrap w-24">
//                     <span
//                       className={cn(
//                         "",
//                         {
//                           "text-primary":
//                             !todo.dueDate ||
//                             new Date(todo.dueDate) > new Date(),
//                           "text-warning":
//                             todo.dueDate &&
//                             new Date(todo.dueDate) <= new Date(),
//                         },
//                         "",
//                         "",
//                       )}
//                     >
//                       {todo.dueDate
//                         ? new Date(todo.dueDate).toLocaleDateString("nb-NO", {
//                             dateStyle: "medium",
//                           })
//                         : "-"}
//                     </span>
//                   </TableCell>

//                   <TableCell className="py-2 w-32">
//                     <div className="flex flex-wrap gap-1">
//                       {typeof todo.tags === "string" && todo.tags.trim() !== ""
//                         ? todo.tags
//                             .split(",")
//                             .filter(
//                               (tag: string) =>
//                                 tag.trim() !== "untagged" && tag.trim() !== "",
//                             )
//                             .map((tag: string, i: number) => (
//                               <Badge
//                                 key={i}
//                                 variant="secondary"
//                                 className="text-xs break-all"
//                               >
//                                 {tag}
//                               </Badge>
//                             ))
//                         : null}
//                     </div>
//                   </TableCell>

//                   <TableCell className="py-2 whitespace-nowrap w-24">
//                     {todo.createdAt
//                       ? new Date(todo.createdAt).toLocaleDateString("nb-NO", {
//                           dateStyle: "medium",
//                         })
//                       : "N/A"}
//                   </TableCell>

//                   <TableCell className="py-2 w-16">
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       aria-label="Delete todo"
//                       onClick={() => delTodo(todo.id)}
//                     >
//                       <LuX />
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       </Card>
//     </>
//   );
// }
