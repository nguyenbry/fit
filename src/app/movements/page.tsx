import { drizzyDrake } from "@/server/db/drizzy-drake";
import { createClientOnServer } from "@/supabase/server";
import { redirect } from "next/navigation";
import { MovementTypeSelect } from "./movement-type-select";
import { movements } from "drizzle/schema";
import { desc } from "drizzle-orm";

export default async function MovementsPage() {
  const { isAdmin } = createClientOnServer();

  if (!(await isAdmin())) redirect("/");

  const allMovements = await drizzyDrake.query.movements.findMany({
    orderBy: desc(movements.updatedAt),
  });

  return (
    <div className="w-[80vw]">
      <div className="grid grid-cols-4 gap-2">
        {allMovements.map((movement) => {
          return (
            <div
              className="flex flex-col gap-3 rounded-md border border-xslate-3 bg-xslate-1 p-3"
              key={movement.id}
            >
              <span className="text-md block font-medium text-xslate-11">
                {movement.name} {new Date(movement.updatedAt).toLocaleString()}
              </span>
              <MovementTypeSelect movement={movement} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
