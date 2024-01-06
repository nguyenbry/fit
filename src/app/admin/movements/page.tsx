import { drizzyDrake } from "@/server/db/drizzy-drake";
import { AdminMovementPageClient } from "./page.client";

export default async function AdminMovementsPage() {
  const targetOptions = await drizzyDrake.query.targets
    .findMany({
      columns: {
        id: true,
        name: true,
      },
    })
    .then((targets) => {
      return targets.map((t) => {
        return {
          label: t.name,
          value: t.id.toString(),
        };
      });
    });

  return (
    <div className="flex flex-col gap-3 pb-10">
      <AdminMovementPageClient targetOptions={targetOptions} />
    </div>
  );
}
