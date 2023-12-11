import { GymForm } from "@/app/gyms/(components)/gym-form";
import { drizzyDrake } from "@/server/db/drizzy-drake";
import { gyms, users } from "@/server/db/schema";
import { createClientOnServer } from "@/supabase/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { ParamToast } from "./(components)/param-toast";

const redirectToProfileSetupIfNecessary = async () => {
  const stuff = createClientOnServer();
  const { supabase } = stuff;

  const session = await supabase.auth.getUser();

  const user = session.data.user;

  if (user) {
    const uid = user.id;
    const profile = await drizzyDrake.query.users.findFirst({
      where: eq(users.id, uid),
    });

    if (!profile) throw new Error("impossible"); // TODO: better error handling

    if (!profile.first || !profile.last) {
      redirect("/setup");
    }
  }

  if (!user) {
    redirect("/login");
  }

  return {
    user,
    ...stuff,
  };
};

export default async function Gyms() {
  const { user } = await redirectToProfileSetupIfNecessary();

  const userGyms = await drizzyDrake.query.gyms.findMany({
    where: eq(gyms.uid, user.id),
  });

  const myUsers = await drizzyDrake.query.users.findMany();
  const supabaseUsers = await drizzyDrake.query.supabaseUsers.findMany();

  console.log("ayeee", {
    myUsers,
    supabaseUsers,
  });

  return (
    <div className="flex flex-col gap-10 px-60">
      <ParamToast />
      <div>
        <span className="block text-4xl font-semibold text-black">
          Add a Gym
        </span>
        <span className="text-sm text-foreground">
          Keep track of not only your workouts but where they happened, too!
        </span>
      </div>
      <GymForm className="rounded-lg border p-4 px-5 shadow-xl" />
      {userGyms.length > 0 && (
        <div>
          {userGyms.map((gym) => {
            return (
              <div
                key={gym.id}
                className="rounded-md border border-xslate-6 bg-xslate-2 p-6 transition-colors animate-in spin-in-3 slide-in-from-top-3 hover:bg-xslate-4"
              >
                <span className="text-md font-medium text-xslate-11">
                  {gym.name}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
