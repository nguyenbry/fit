import { drizzyDrake } from "@/server/db/drizzy-drake";
import { AdminTargetsPage } from "./page.client";
import {
  DualGridContainer,
  TargetCardClientOrServer,
} from "./target-components";

export default async function AdminTargetsPageServer() {
  // assuming my middleware is set up correctly...

  const targets = await drizzyDrake.query.targets.findMany({
    limit: 6, // just a few to show the initial page load
  });

  return (
    <AdminTargetsPage
      whileLoadingUI={
        <DualGridContainer>
          {targets.map((target) => {
            return (
              <TargetCardClientOrServer
                key={target.id}
                target={target}
                className="animate-pulse"
              />
            );
          })}
        </DualGridContainer>
      }
    />
  );
}
