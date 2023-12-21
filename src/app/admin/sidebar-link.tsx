"use client";

import Link from "next/link";
import { sidebarLinks } from "./sidebar-links";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function SidebarLink({ link }: { link: keyof typeof sidebarLinks }) {
  const pathname = usePathname();
  const active = pathname === `/admin${link}`;

  const Icon = sidebarLinks[link];

  return (
    <Link
      href={`/admin${link}`}
      key={link}
      className={cn(
        active
          ? "border-xviolet-5 bg-xviolet-3 text-black dark:text-inherit"
          : "border-transparent hover:bg-xslate-3 hover:text-black dark:hover:text-inherit",
        "inline-flex items-center gap-2 rounded-md border py-2 pl-3 text-sm font-medium tracking-wide transition-all hover:pl-3.5 active:scale-95",
      )}
    >
      <Icon className="size-4" />
      <span className="text-md">{link.split("/")[1]!}</span>
    </Link>
  );
}
