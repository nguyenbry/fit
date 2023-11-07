import { GymForm } from "@/components/gym-form";
import { drizzyDrake } from "@/server/db/drizzy-drake";
import { users } from "@/server/db/users";
import { eq } from "drizzle-orm";

export default async function Gyms() {
  const firstUser = await drizzyDrake.query.users.findFirst({
    where: eq(users.first, "Bryan"),
  });

  console.log("firstuser", firstUser);

  return (
    <div className="flex flex-col gap-10 px-60">
      <div>
        <span className="block text-4xl font-semibold text-black">
          Add a Gym
        </span>
        <span className="text-sm text-foreground">
          Keep track of not only your workouts but where they happened, too!
        </span>
      </div>
      <GymForm className="rounded-lg border p-4 px-5 shadow-xl" />
    </div>
  );
}
