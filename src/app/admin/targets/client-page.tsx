"use client";

import { FormContainer } from "@/components/form-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { targets } from "drizzle/schema";
import { Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { createTarget } from "../actions";

export function AdminTargetsPage({
  whileLoadingUI,
}: {
  whileLoadingUI: React.ReactNode;
}) {
  const [isCreating, setIsCreating] = useState(false);

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
      {whileLoadingUI}
    </div>
  );
}

function CreateForm({ close }: { close: () => void }) {
  const [pending, startTransition] = useTransition();

  const nameKey = "name" satisfies keyof typeof targets.$inferSelect;

  return (
    <FormContainer
      action={(fd) => {
        startTransition(async () => {
          try {
            await createTarget(fd);
            close();
          } catch (e) {
            if (e instanceof Error) {
              console.log(e.name, 2897);

              console.log(100, e.message);
            }
          }
        });
      }}
    >
      <div className="flex flex-col gap-1">
        <Label htmlFor={nameKey}>Name</Label>
        <Input
          required
          minLength={3}
          name={nameKey}
          id={nameKey}
          disabled={pending}
          autoComplete="off"
        />
      </div>
      <div className="mt-4 flex gap-3 lg:gap-1.5">
        <Button
          disabled={pending}
          type="reset"
          size={"sm"}
          variant={"destructive"}
          onClick={close}
          className="ml-auto grow lg:grow-0"
        >
          Cancel
        </Button>
        <Button
          disabled={pending}
          size={"sm"}
          variant={"success"}
          type="submit"
          className="grow lg:grow-0"
        >
          Submit
        </Button>
      </div>
    </FormContainer>
  );
}
