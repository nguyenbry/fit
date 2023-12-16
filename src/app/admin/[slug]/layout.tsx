import { Button } from "@/components/ui/button";
import { createClientOnServer } from "@/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ADMIN_PATHS } from "../admin-paths";
import { cn } from "@/lib/utils";

const links = Object.values(ADMIN_PATHS);

export default async function AdminPageLayout({
  children,
  params: { slug },
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  console.log("rendering admin layout");
  const { getAppUserRequired } = createClientOnServer();

  const user = await getAppUserRequired();

  if (user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex w-full grow gap-3 px-24">
      <div className="inline-flex w-[15vw] flex-col gap-1">
        {links.map((link) => {
          const active = "/" + slug === link;

          return (
            <Link
              href={`/admin${link}`}
              key={link}
              className={cn(
                active
                  ? "bg-xslate-4 text-black dark:bg-xslate-3 dark:text-inherit"
                  : "hover:bg-xslate-3 hover:text-black dark:hover:bg-xslate-3 dark:hover:text-inherit",
                "rounded-lg py-3 pl-4 text-sm font-medium tracking-wide transition-all active:scale-95",
              )}
            >
              <span className="text-md">{link.split("/")[1]!}</span>
            </Link>
          );
        })}
      </div>
      <div className="grow rounded-md border border-xslate-3 animate-in fade-in-10 slide-in-from-top-3">
        <Button>Add</Button>
        {children}
      </div>
    </div>
  );
}
