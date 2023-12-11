export const APP_ROUTES = {
  LOGIN: "/login",
  GYMS: "/gyms",
} as const satisfies Record<string, `/${string}`>;
