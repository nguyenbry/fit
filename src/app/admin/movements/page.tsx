"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import type { Movement } from "@/trpc/router-outputs";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { createMovement } from "../actions";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MovementType } from "@/app/movements/types";
import { ComboboxDemo } from "./combo-box";
import { FormContainer } from "@/components/form-container";

const MOVEMENT_TYPES: {
  [TType in NonNullable<MovementType>]: `${TType}lateral`;
} = {
  bi: "bilateral",
  uni: "unilateral",
};

export default function AdminMovementPage() {
  const [isCreating, setIsCreating] = useState(false);

  const movementsQuery = api.movements.getAll.useQuery();

  if (!movementsQuery.data) return null;

  return (
    <div className="flex flex-col gap-3 pb-10">
      {!isCreating && (
        <Button
          onClick={() => setIsCreating(true)}
          size={"icon"}
          variant={"success"}
          className="w-full lg:ml-auto lg:w-9"
        >
          <Plus className="h-4 w-4" />
        </Button>
      )}
      {isCreating && <CreateForm close={() => setIsCreating(false)} />}
      {movementsQuery.data.map((movement) => {
        return <MovementCard movement={movement} key={movement.id} />;
      })}
    </div>
  );
}

function CreateForm({ close }: { close: () => void }) {
  const nameKey = "name" satisfies keyof Movement; // type check for form action

  const movementTypeKey = "type" satisfies keyof Movement;
  return (
    <>
      <span className="mt-5 text-2xl font-medium">Create a new movement</span>
      <FormContainer className="mb-5" action={createMovement}>
        <div className="flex flex-col gap-1">
          <Label htmlFor={nameKey}>Name</Label>
          <Input
            placeholder="Movement name"
            id={nameKey}
            name={nameKey}
            required
            minLength={4}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor={movementTypeKey}>Type</Label>
          <Select required name={movementTypeKey}>
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  <span className="text-muted-foreground">Select a type</span>
                }
              />
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
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor={"box"}>Box</Label>
          <ComboboxDemo />
        </div>

        <div className="mt-4 flex gap-3 lg:gap-1.5">
          <Button
            type="reset"
            size={"sm"}
            variant={"destructive"}
            onClick={close}
            className="ml-auto grow lg:grow-0"
          >
            Cancel
          </Button>
          <Button
            size={"sm"}
            variant={"success"}
            type="submit"
            className="grow lg:grow-0"
          >
            Submit
          </Button>
        </div>
      </FormContainer>
    </>
  );
}

function MovementCard({ movement: { name } }: { movement: Movement }) {
  return (
    <div className="rounded-md border border-xslate-5 p-4 dark:border-xslate-3">
      <div className="flex items-center justify-between">
        <span className="font-medium tracking-tight">{name}</span>

        <Button variant={"outline"} size={"icon"}>
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
