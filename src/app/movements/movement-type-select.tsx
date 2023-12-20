"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Movement, MovementType } from "./types";
import {
  type UpdateMovementTypeFormState,
  updateMovementType,
} from "./actions";
import { useFormState } from "react-dom";

const MOVEMENT_TYPES: {
  [TType in NonNullable<MovementType>]: `${TType}lateral`;
} = {
  bi: "bilateral",
  uni: "unilateral",
};

export function MovementTypeSelect({ movement }: { movement: Movement }) {
  // const formRef = useRef<HTMLFormElement>(null);

  const [, formAction] = useFormState<UpdateMovementTypeFormState, FormData>(
    updateMovementType,
    {
      message: null,
      id: movement.id,
    },
  );

  return (
    <>
      {/* <span>{JSON.stringify(state)}</span> */}
      <Select
        required
        key={movement.type}
        name="type"
        defaultValue={movement.type ?? undefined}
        onValueChange={(t) => {
          // by now the <select> component underyling this
          // will have it's value updated to whatever the user
          // selected, so it will be in the form data
          // form.requestSubmit(); // replaces a submit button essentially
          const fd = new FormData();
          fd.set("type", t);
          formAction(fd);
          // const data = await updateMovementType(
          //   {
          //     id: movement.id,
          //     message: null,
          //   },
          //   fd,
          // );
        }}
      >
        <SelectTrigger className="ml-auto max-w-max">
          <SelectValue placeholder="hi"></SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Object.entries(MOVEMENT_TYPES).map(([type, label]) => {
              return (
                <SelectItem key={type} value={type}>
                  {label}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}
