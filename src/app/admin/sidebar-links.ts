import {
  Building,
  type LucideIcon,
  PersonStanding,
  Target,
} from "lucide-react";
import type { ADMIN_PATHS } from "./admin-paths";

export const sidebarLinks = {
  "/movements": PersonStanding,
  "/gyms": Building,
  "/targets": Target,
} as const satisfies Partial<
  Record<(typeof ADMIN_PATHS)[keyof typeof ADMIN_PATHS], LucideIcon>
>;
