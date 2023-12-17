import { Settings } from "lucide-react";
import { SignOutButton } from "../sign-out-button";
import { ThemeToggle } from "../theme-toggle";
import { Button, buttonVariants } from "../ui/button";
import { Navlink } from "./nav-link";
import { createClientOnServer } from "@/supabase/server";
import Link from "next/link";
import { ADMIN_PATHS } from "@/app/admin/admin-paths";
import { APP_ROUTES } from "@/app/app-routes";
import { supabaseUserRole } from "drizzle/auth-role";

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

  const sessionRoleParsed = supabaseUserRole.safeParse(session?.user.role);

  const isAdmin =
    sessionRoleParsed.success && sessionRoleParsed.data === "my_admin";

  return (
    <nav className="flex items-center gap-2 py-4 md:w-4/5 xl:w-2/3">
      <div className="grow">
        <ThemeToggle className="md:hidden" />
        <span className="hidden text-lg font-semibold md:inline">
          Fitness Tracker
        </span>
      </div>

      <ul className="hidden items-center gap-2 md:flex">
        {links.map(({ href, label }) => {
          return <Navlink key={href} href={href} label={label} />;
        })}
      </ul>

      <div className="inline-flex grow justify-end gap-2">
        {session ? (
          <>
            {isAdmin && (
              <Link
                href={"/admin" + ADMIN_PATHS.MOVEMENTS}
                className={buttonVariants({
                  size: "icon",
                  variant: "outline",
                })}
              >
                <Settings className="h-5 w-5" />
              </Link>
            )}
            <ThemeToggle />
            <SignOutButton />
          </>
        ) : (
          <>
            <Link
              className={buttonVariants({
                size: "sm",
                variant: "ghost",
              })}
              href={APP_ROUTES.LOGIN}
            >
              Sign In
            </Link>
            <Button size={"sm"}>GET STARTED</Button>
          </>
        )}
      </div>
    </nav>
  );
}
