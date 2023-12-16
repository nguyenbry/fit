import { createClientOnServer } from "@/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import { SidebarDropdown } from "./mobile-dropdown";
import { sidebarLinks } from "./sidebar-links";

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
    <div className="flex w-full grow flex-col gap-3 px-5 lg:flex-row lg:px-12 xl:px-24">
      <SidebarDropdown />
      <div className="hidden w-[15vw] flex-col gap-1 lg:inline-flex">
        {sidebarLinks.map(({ link, icon: Icon }) => {
          const active = "/" + slug === link;

          return (
            <Link
              href={`/admin${link}`}
              key={link}
              className={cn(
                active
                  ? "border-xslate-5 bg-xslate-3 text-black dark:text-inherit"
                  : "border-transparent hover:bg-xslate-3 hover:text-black dark:hover:text-inherit",
                "inline-flex items-center gap-2 rounded-md border py-2 pl-4 text-sm font-medium tracking-wide transition-all hover:pl-5 active:scale-95",
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="text-md">{link.split("/")[1]!}</span>
            </Link>
          );
        })}
      </div>
      <div className="grow rounded-md animate-in fade-in-10 slide-in-from-top-3">
        {children}
      </div>
    </div>
  );
}
