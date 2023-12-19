"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { FAKE_INPUT_CLASSES } from "@/components/ui/input";

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

const divId = "musclestargeted";

export function ComboboxDemo() {
  const [values, setValues] = React.useState<string[]>([]);
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
                return (
                  <Badge variant={"secondary"} key={v}>
                    {v}
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
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            {frameworks.map((framework) => (
              <CommandItem
                key={framework.value}
                value={framework.value}
                onSelect={(currentValue) => {
                  setValues((c) => [...c, currentValue]);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    values.includes(framework.value)
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
                {framework.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
