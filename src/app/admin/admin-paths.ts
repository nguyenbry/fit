import { APP_ROUTES } from "../app-routes";

export const ADMIN_PATHS = {
  MOVEMENTS: APP_ROUTES.MOVEMENTS,
  IDK: "/idk",
} as const satisfies Record<string, `/${string}`>;
