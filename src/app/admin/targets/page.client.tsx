"use client";

import { FormContainer } from "@/components/form-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { targets } from "drizzle/schema";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { deleteTarget } from "../actions";
import { api } from "@/trpc/react";
import type { RouterOutputs } from "@/trpc/shared";
import { cn } from "@/lib/utils";
// import { parseActionErrorClient } from "@/lib/action-error";
import { useToast } from "@/components/ui/use-toast";
import {
  DualGridContainer,
  TargetCardClientOrServer,
} from "./target-components";
import { useFormState, useFormStatus } from "react-dom";
import {
  type CreateTargetFormState,
  createTarget,
} from "../actions/create-target";

export function AdminTargetsPage({
  whileLoadingUI,
}: {
  whileLoadingUI: React.ReactNode;
}) {
  const [isCreating, setIsCreating] = useState(false);

  const targetsQuery = api.targets.getAll.useQuery();

  return (
    <div className="flex flex-col gap-3 pb-10">
      {!isCreating && (
        <Button
          onClick={() => setIsCreating(true)}
          size={"icon"}
          variant={"success"}
          className="w-full lg:ml-auto lg:w-9"
        >
          <Plus className="size-4" />
        </Button>
      )}
      {isCreating && <CreateForm close={() => setIsCreating(false)} />}
      {targetsQuery.data ? (
        <DualGridContainer>
          {targetsQuery.data.map((t) => {
            return <TargetCardClient key={t.id} target={t} />;
          })}
        </DualGridContainer>
      ) : (
        whileLoadingUI
      )}
    </div>
  );
}

type Target = RouterOutputs["targets"]["getAll"][number];

function TargetCardClient({ target }: { target: Target }) {
  const utils = api.useUtils();

  const afterDelete = () => {
    const currentData = utils.targets.getAll.getData();

    if (!currentData) {
      void utils.targets.getAll.invalidate();
      return;
    }

    utils.targets.getAll.setData(undefined, (curr) => {
      if (!curr) throw new Error("impossible");

      return curr.filter((t) => t.id !== target.id); // set for instant update
    });
    void utils.targets.getAll.invalidate(); // invalidate anyway!
  };

  return (
    <TargetCardClientOrServer
      className="transition-colors duration-300 animate-in odd:slide-in-from-left-4 even:slide-in-from-right-4"
      target={target}
      delete={{
        onClick: () => {
          void deleteTarget(target.id).then((deletedSomethingSuccessfully) => {
            deletedSomethingSuccessfully && afterDelete();
          });
        },
      }}
    />
  );
}

function CreateForm({ close }: { close: () => void }) {
  const { toast } = useToast();
  const [hasClosed, setHasClosed] = useState(false);

  const [formState, formAction] = useFormState<CreateTargetFormState, FormData>(
    createTarget,
    null,
  );

  const utils = api.useUtils();

  const onCreation = (
    newTarget: RouterOutputs["targets"]["getAll"][number],
  ) => {
    const currentData = utils.targets.getAll.getData();
    if (!currentData) return void utils.targets.getAll.invalidate();

    utils.targets.getAll.setData(undefined, (curr) => {
      if (!curr) throw new Error("impossible"); // we just checked it exists
      return [newTarget, ...curr];
    });

    void utils.targets.getAll.invalidate();
  };

  useEffect(() => {
    console.log("effect firing");
    if (!formState) return;

    if (formState.success) {
      setHasClosed(true);

      onCreation(formState.data);
      return;
    }

    toast({
      title: "Target creation failed",
      description: formState.error ?? undefined,
      variant: "destructive",
    });
  }, [formState, toast]);

  useEffect(() => {
    if (hasClosed) {
      const timer = setTimeout(() => {
        close();
      }, 300);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [hasClosed, close]);

  return (
    <FormContainer
      className={cn(
        hasClosed && "duration-700 animate-out fade-out-5 slide-out-to-top-6",
      )}
      action={formAction}
    >
      <FormGuts close={close} />
    </FormContainer>
  );
}

function FormGuts({ close }: { close: () => void }) {
  const nameKey = "name" satisfies keyof typeof targets.$inferSelect;

  const { pending } = useFormStatus();

  return (
    <>
      <div className="flex flex-col gap-1">
        <Label htmlFor={nameKey}>Name</Label>
        <Input
          required
          minLength={3}
          name={nameKey}
          id={nameKey}
          autoComplete="off"
          disabled={pending}
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
    </>
  );
}
