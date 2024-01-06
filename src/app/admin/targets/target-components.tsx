import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PropsWithCn } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { RouterOutputs } from "@/trpc/shared";
import { Loader2, Pencil, Trash } from "lucide-react";
import type { ComponentProps, PropsWithChildren } from "react";

export function DualGridContainer({ children }: PropsWithChildren) {
  return <div className="grid gap-3 md:gap-4 lg:grid-cols-2">{children}</div>;
}

type Target = RouterOutputs["targets"]["getAll"][number];

export function TargetCardClientOrServer({
  target,
  delete: deleteButtonProps,
  className,
  children,
  edit: editButtonProps,
}: { target: Target } & {
  delete?: Pick<ComponentProps<typeof Button>, "onClick">;
  edit?: Pick<ComponentProps<typeof Button>, "onClick">;
} & PropsWithCn &
  PropsWithChildren) {
  return (
    <div
      className={cn(
        "md min-h-28 hover:border-xviolet-7 col-span-1 rounded border border-xslate-5 p-3 md:p-4",
        className,
      )}
    >
      <div className="flex items-start gap-1 md:gap-2">
        <div className="inline-flex items-center gap-3">
          <span className="font-medium tracking-tight">{target.name}</span>
          <Badge>{target.id}</Badge>
        </div>
        {deleteButtonProps ? (
          <Button
            size={"responsive-icon"}
            variant={"outline"}
            className="ml-auto"
            {...deleteButtonProps}
          >
            <Trash />
          </Button>
        ) : (
          <Loader2 className="size-4 ml-auto animate-spin" />
        )}
        {editButtonProps && (
          <Button
            size={"responsive-icon"}
            variant={"outline"}
            {...editButtonProps}
          >
            <Pencil />
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}
