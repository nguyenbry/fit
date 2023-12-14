import { SignOutButton } from "../sign-out-button";
import { ThemeToggle } from "../theme-toggle";
import { Button } from "../ui/button";
import { Navlink } from "./nav-link";
import { createClientOnServer } from "@/supabase/server";

const links: {
  label: string;
  href: string;
}[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Track",
    href: "/track",
  },
  {
    label: "Gyms",
    href: "/gyms",
  },
  {
    label: "Movements",
    href: "/movements",
  },
];

export async function Navbar() {
  const { supabase } = createClientOnServer();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <nav className="flex w-2/3 items-center gap-2 py-4">
      <div className="grow">
        <span className="text-lg font-semibold">Fitness Tracker</span>
      </div>

      <ul className="flex items-center gap-2">
        {links.map(({ href, label }) => {
          return <Navlink key={href} href={href} label={label} />;
        })}
      </ul>

      <div className="inline-flex grow justify-end gap-2">
        {session ? (
          <>
            <ThemeToggle />
            <SignOutButton />
          </>
        ) : (
          <>
            <Button variant={"ghost"} size={"sm"}>
              Sign In
            </Button>
            <Button size={"sm"}>GET STARTED</Button>
          </>
        )}
      </div>
    </nav>
  );
}
