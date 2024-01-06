"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { FAKE_INPUT_CLASSES } from "@/components/ui/input";
import { ComboBox } from "./combo-box";

const divId = "musclestargeted";

export function MultiSelect(props: React.ComponentProps<typeof ComboBox>) {
  const { options, values } = props;
  const [divWidth, setDivWidth] = React.useState<number>();

  React.useEffect(() => {
    const debounce = (fn: () => void, ms: number) => {
      let timer: NodeJS.Timeout;
      return () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          fn();
        }, ms);
      };
    };

    const run = debounce(() => {
      const box = document.getElementById(divId);
      if (!box) return;
      const width = box.getBoundingClientRect().width;
      setDivWidth(width);
    }, 150);
    console.log("add event listener");
    window.addEventListener("resize", run);

    run(); // do it once on mount
    return () => {
      window.removeEventListener("resize", run);
    };
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          id={divId}
          className={cn(
            FAKE_INPUT_CLASSES, // make this look like an input
            "min-h-10 cursor-pointer items-center gap-3",
          )}
        >
          {values.length > 0 ? (
            <div className="inline-flex flex-wrap gap-1.5">
              {values.map((v) => {
                const label = options.find((o) => o.value === v)?.label;

                if (!label) throw new Error("label not found");
                return (
                  <Badge variant={"secondary"} key={v}>
                    {label}
                  </Badge>
                );
              })}
            </div>
          ) : (
            <span className="cursor-pointer text-muted-foreground">
              Select muscles targeted
            </span>
          )}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="p-0"
        align="start"
        style={
          divWidth
            ? {
                width: `${divWidth}px`,
              }
            : undefined
        }
      >
        <ComboBox {...props} />
      </PopoverContent>
    </Popover>
  );
}
