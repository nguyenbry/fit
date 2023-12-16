"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import type { Movement } from "@/trpc/router-outputs";
import { Pencil } from "lucide-react";

export default function AdminPage() {
  const movementsQuery = api.movements.getAll.useQuery();

  if (!movementsQuery.data) return null;

  return (
    <div className="flex flex-col gap-3 pb-10">
      {movementsQuery.data.map((movement) => {
        return <MovementCard movement={movement} key={movement.id} />;
      })}
    </div>
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
