export const APP_ROUTES = {
  LOGIN: "/login",
  GYMS: "/gyms",
  MOVEMENTS: "/movements",
} as const satisfies Record<string, `/${string}`>;

type Pathnames = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];

export const REQUIRES_AUTH_MAP = {
  "/gyms": true,
  "/movements": true,
  "/login": false,
} as const satisfies Record<Pathnames, boolean>;
