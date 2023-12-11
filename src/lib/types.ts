import type * as React from "react";

// eslint-disable-next-line @typescript-eslint/ban-types
export type PropsWithCn<T = {}> = T & { className?: string };

export type ErrorPageComponent = React.FC<{
  error: Error & { digest?: string };
  reset: () => void;
}>;
