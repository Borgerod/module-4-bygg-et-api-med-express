"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useActionState, useRef } from "react";

type TodoCheckboxProps = {
  todoId: string;
  done: boolean;
  onToggle: (prevState: any, formData: FormData) => Promise<void>;
};

export default function TodoCheckbox({
  todoId,
  done,
  onToggle,
}: TodoCheckboxProps) {
  const [, formAction] = useActionState(onToggle, null);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={formAction} className="todo-inline-form">
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
