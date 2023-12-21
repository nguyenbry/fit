import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PropsWithCn } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { RouterOutputs } from "@/trpc/shared";
import { Loader2, Trash } from "lucide-react";
import type { ComponentProps, PropsWithChildren } from "react";

export function DualGridContainer({ children }: PropsWithChildren) {
  return <div className="grid grid-cols-2 gap-3 md:gap-4">{children}</div>;
}

type Target = RouterOutputs["targets"]["getAll"][number];

export function TargetCardClientOrServer({
  target,
  delete: deleteButtonProps,
  className,
}: { target: Target } & {
  delete?: Pick<ComponentProps<typeof Button>, "onClick">;
} & PropsWithCn) {
  return (
    <div
      className={cn(
        "md min-h-28 col-span-1 rounded border border-xslate-5 p-3 hover:border-xviolet-7 md:p-4",
        className,
      )}
    >
      <div className="flex items-start">
        <div className="inline-flex items-center gap-3">
          <span className="font-medium tracking-tight">{target.name}</span>
          <Badge>{target.id}</Badge>
        </div>
        {deleteButtonProps ? (
          <Button
            size={"icon"}
            variant={"outline"}
            className="ml-auto"
            {...deleteButtonProps}
          >
            <Trash className="size-4" />
          </Button>
        ) : (
          <Loader2 className="size-4 ml-auto animate-spin" />
        )}
      </div>
    </div>
  );
}
