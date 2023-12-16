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

export function SidebarDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={"lg:hidden"}>
        <Button variant="outline" size="icon" className="w-full">
          <Menu className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-full">
        {sidebarLinks.map(({ icon: Icon, link }) => {
          return (
            <DropdownMenuItem key={link} className="flex gap-3 px-3">
              <Icon className="h-3 w-3" />
              {link}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
