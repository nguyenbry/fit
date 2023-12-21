import * as React from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sidebarLinks } from "./sidebar-links";
import Link from "next/link";
import { capitalizeAndFilter } from "@/lib/string-utils";

export function SidebarDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={"lg:hidden"}>
        <Button variant="outline" size="icon" className="w-full">
          <Menu className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        {Object.entries(sidebarLinks).map(([link, Icon]) => {
          return (
            <DropdownMenuItem key={link} className="flex gap-3 px-3" asChild>
              <Link href={`/admin${link}`} className="flex items-center gap-4">
                <Icon className="size-3" />
                <span>{capitalizeAndFilter(link.slice(1))}</span>
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
