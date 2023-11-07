"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

export function Navlink({
  href,
  label,
}: { label: string } & Pick<React.ComponentProps<typeof Link>, "href">) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li>
      <Link
        className={cn(
          "relative rounded-full p-2 text-sm font-medium uppercase tracking-wide text-neutral-400",
          isActive
            ? "text-neutral-800 before:absolute before:bottom-1 before:left-1/2 before:h-[0.7px] before:w-[70%] before:-translate-x-1/2 before:bg-neutral-800 dark:text-white dark:before:bg-white"
            : "transition-colors duration-500 hover:text-neutral-800 dark:hover:text-white",
        )}
        href={href}
      >
        {label}
      </Link>
    </li>
  );
}
