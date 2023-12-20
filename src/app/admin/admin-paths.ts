import { APP_ROUTES } from "../app-routes";

export const ADMIN_PATHS = {
  MOVEMENTS: APP_ROUTES.MOVEMENTS,
  IDK: "/idk",
  GYMS: APP_ROUTES.GYMS,
  TARGETS: "/targets",
} as const satisfies Record<string, `/${string}`>;
