import { GymForm } from "@/components/gym-form";
import { drizzyDrake } from "@/server/db/drizzy-drake";
import { users } from "@/server/db/public/users";
import { createClientOnServer } from "@/supabase/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

const redirectToProfileSetupIfNecessary = async () => {
  const [supabase, cookieStore] = createClientOnServer();

  const session = await supabase.auth.getSession();

  const sess = session.data.session;

  if (sess) {
    const uid = sess.user.id;
    const profile = await drizzyDrake.query.users.findFirst({
      where: eq(users.id, uid),
    });

    if (!profile) throw new Error("impossible"); // TODO: better error handling

    if (!profile.first || !profile.last) {
      redirect("/setup");
    }
  }

  return [sess, supabase, cookieStore] as const;
};

export default async function Gyms() {
  await redirectToProfileSetupIfNecessary();

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
