import type { PropsWithCn } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";

// prestyling form element
export function FormContainer({
  className,
  ...rest
}: PropsWithChildren<PropsWithCn> & React.ComponentProps<"form">) {
  return (
    <form
      className={cn(
        "flex flex-col gap-4 rounded-md border border-xslate-8 p-4 shadow-md animate-in fade-in-10 spin-in-3 slide-in-from-top-5 lg:p-5 dark:border-xslate-5",
        className,
      )}
      {...rest}
    />
  );
}
