"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import type { Movement } from "@/trpc/router-outputs";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";

export default function AdminPage() {
  const [isCreating, setIsCreating] = useState(false);

  const movementsQuery = api.movements.getAll.useQuery();

  if (!movementsQuery.data) return null;

  return (
    <div className="flex flex-col gap-3 pb-10">
      {!isCreating && (
        <Button
          onClick={() => setIsCreating(true)}
          size={"icon"}
          variant={"outline"}
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
  return (
    <>
      <span className="mt-5 text-2xl font-medium">Create a new movement</span>
      <form className="mb-5 rounded-md border border-xslate-5 bg-xslate-1 p-4 animate-in slide-in-from-top-6 dark:border-xslate-3">
        <Input placeholder="Movement name" />

        <div className="mt-4 flex gap-1.5">
          <Button
            size={"sm"}
            variant={"destructive"}
            onClick={close}
            className="ml-auto"
          >
            Cancel
          </Button>
          <Button size={"sm"} variant={"outline"} onClick={close}>
            Submit
          </Button>
        </div>
      </form>
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
