"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { deleteTarget } from "../movements/actions";
import { api } from "@/trpc/react";
import type { RouterOutputs } from "@/trpc/shared";
import { cn } from "@/lib/utils";
import {
  DualGridContainer,
  TargetCardClientOrServer,
} from "./target-components";
import { CreateTargetForm, EditTargetForm } from "./target-form";

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
      {isCreating && <CreateTargetForm close={() => setIsCreating(false)} />}
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
  const [isEditing, setIsEditing] = useState(false);
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
      className={cn(
        "transition-colors duration-300 animate-in odd:slide-in-from-left-4 even:slide-in-from-right-4",
      )}
      target={target}
      delete={{
        onClick: () => {
          void deleteTarget(target.id).then((deletedSomethingSuccessfully) => {
            deletedSomethingSuccessfully && afterDelete();
          });
        },
      }}
      edit={{
        onClick: () => setIsEditing((c) => !c),
      }}
    >
      {isEditing && (
        <EditTargetForm
          defaultValues={target}
          className="mt-4 border-0 !p-1"
          close={() => setIsEditing(false)}
        />
      )}
    </TargetCardClientOrServer>
  );
}
