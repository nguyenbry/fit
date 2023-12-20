import { drizzyDrake } from "@/server/db/drizzy-drake";
import { TargetCard } from "./target-card";
import { AdminTargetsPage } from "./client-page";

export default async function AdminTargetsPageServer() {
  // assuming my middleware is set up correctly...

  const targets = await drizzyDrake.query.targets.findMany({});

  return (
    <AdminTargetsPage
      whileLoadingUI={
        <>
          {targets.map((target) => {
            return <TargetCard key={target.id} target={target} />;
          })}
        </>
      }
    />
  );
}
