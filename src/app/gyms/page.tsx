import { GymForm } from "@/components/gym-form";
import { drizzyDrake } from "@/server/db/drizzy-drake";

export default async function Gyms() {
  const myUsers = await drizzyDrake.query.users.findMany();
  const supabaseUsers = await drizzyDrake.query.supabaseUsers.findMany();

  console.log("ayeee", {
    myUsers,
    supabaseUsers,
  });

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
