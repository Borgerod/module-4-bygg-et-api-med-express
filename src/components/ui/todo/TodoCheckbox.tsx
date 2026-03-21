"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useRef } from "react";

type TodoCheckboxProps = {
  todoId: string;
  done: boolean;
  onToggle: (formData: FormData) => Promise<void>;
};

export default function TodoCheckbox({
  todoId,
  done,
  onToggle,
}: TodoCheckboxProps) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={onToggle} className={cn("inline", "", "")}>
      <input type="hidden" name="id" value={todoId} />
      <Checkbox
        name="done"
        defaultChecked={done}
        onCheckedChange={() => {
          formRef.current?.requestSubmit();
        }}
      />
    </form>
  );
}
