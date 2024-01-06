import { FormContainer } from "@/components/form-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { targets } from "drizzle/schema";
import { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import type { RouterOutputs } from "@/trpc/shared";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useFormState, useFormStatus } from "react-dom";
import {
  type CreateOrEditTargetFormState,
  createTarget,
  editTarget,
} from "./actions";
import type { PropsWithCn } from "@/lib/types";

export function EditTargetForm({
  close,
  defaultValues,
  className,
}: Required<BodyOfFormProps> & PropsWithCn) {
  const [formState, formAction] = useFormState<
    CreateOrEditTargetFormState,
    FormData
  >(editTarget, null);

  return (
    <BaseForm
      defaultValues={defaultValues}
      className={className}
      close={close}
      formAction={(fd) => {
        fd.set("id", defaultValues.id.toString());
        formAction(fd);
      }}
      formState={formState}
    />
  );
}

export function CreateTargetForm({
  close,
  className,
}: Pick<BodyOfFormProps, "close"> & PropsWithCn) {
  const [formState, formAction] = useFormState<
    CreateOrEditTargetFormState,
    FormData
  >(createTarget, null);

  return (
    <BaseForm
      className={className}
      close={close}
      formAction={formAction}
      formState={formState}
    />
  );
}

function BaseForm({
  close,
  className,
  formAction,
  formState,
  defaultValues,
}: {
  formState: CreateOrEditTargetFormState;
  formAction: (payload: FormData) => void;
} & PropsWithCn &
  BodyOfFormProps) {
  const { toast } = useToast();
  const [hasClosed, setHasClosed] = useState(false);

  const utils = api.useUtils();

  const afterCreate = (
    newTarget: RouterOutputs["targets"]["getAll"][number],
  ) => {
    const currentData = utils.targets.getAll.getData();
    if (!currentData) return void utils.targets.getAll.invalidate();

    utils.targets.getAll.setData(undefined, (curr) => {
      if (!curr) throw new Error("impossible"); // we just checked it exists
      if (defaultValues) {
        return curr.map((t) => {
          if (t.id === defaultValues.id) return newTarget;
          return t;
        });
      } else return [newTarget, ...curr];
    });

    void utils.targets.getAll.invalidate(); // get fresh data anyway
  };

  useEffect(() => {
    console.log("effect firing");
    if (!formState) return;

    if (formState.success) {
      setHasClosed(true);
      afterCreate(formState.data);
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
        className,
      )}
      action={formAction}
    >
      <FormGuts close={close} defaultValues={defaultValues} />
    </FormContainer>
  );
}

type BodyOfFormProps = {
  close: () => void;
  defaultValues?: typeof targets.$inferSelect;
};

function FormGuts({ close, defaultValues }: BodyOfFormProps) {
  const nameKey = "name" satisfies keyof typeof targets.$inferSelect;

  const { pending } = useFormStatus();

  return (
    <>
      <div className="flex flex-col gap-1">
        <Label htmlFor={nameKey}>Name</Label>
        <Input
          defaultValue={defaultValues?.name}
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
