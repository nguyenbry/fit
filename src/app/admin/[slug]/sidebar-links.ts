import { Building, type LucideIcon, PersonStanding } from "lucide-react";
import type { ADMIN_PATHS } from "../admin-paths";

export const sidebarLinks = [
  {
    link: "/movements",
    icon: PersonStanding,
  },
  {
    link: "/gyms",
    icon: Building,
  },
] as const satisfies readonly {
  link: (typeof ADMIN_PATHS)[keyof typeof ADMIN_PATHS];
  icon: LucideIcon;
}[];
