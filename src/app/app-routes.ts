export const APP_ROUTES = {
  LOGIN: "/login",
  GYMS: "/gyms",
  MOVEMENTS: "/movements",
  ADMIN: "/admin",
} as const satisfies Record<string, `/${string}`>;

type Pathnames = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];

export const REQUIRES_AUTH_MAP = {
  "/gyms": true,
  "/movements": true,
  "/login": false,
  "/admin": true,
} as const satisfies Record<Pathnames, boolean>;
