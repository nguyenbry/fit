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

export function SidebarDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={"lg:hidden"}>
        <Button variant="outline" size="icon" className="w-full">
          <Menu className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-full">
        {Object.entries(sidebarLinks).map(([link, Icon]) => {
          return (
            <DropdownMenuItem key={link} className="flex gap-3 px-3" asChild>
              <Link href={`/admin${link}`}>
                <Icon className="h-3 w-3" />
                {link}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
