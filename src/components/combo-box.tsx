"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandDialog,
} from "@/components/ui/command";

export function ComboBox({
  options,
  setValues,
  values,
  emptySearchResult,
  placeholder,
  asDialogProps,
}: {
  options: {
    label: string;
    value: string;
    searchValue?: string;
  }[];
  values: string[];
  setValues: (values: string[]) => void;
  emptySearchResult?: React.ReactNode;
  asDialogProps?: Omit<
    React.ComponentProps<typeof CommandDialog>,
    keyof Pick<React.ComponentProps<typeof CommandDialog>, "commandProps">
  >;
  manualFilter?: boolean;
} & Pick<React.ComponentProps<typeof CommandInput>, "placeholder">) {
  const [search, setSearch] = React.useState("");

  const cleanedSearch = search.trim().toLowerCase();

  const filteredOptions = cleanedSearch
    ? options.filter(({ value, searchValue }) => {
        if (searchValue) return searchValue.includes(cleanedSearch);
        return value.includes(cleanedSearch);
      })
    : options;

  const guts = (
    <>
      <CommandInput
        value={search}
        onValueChange={setSearch}
        placeholder={placeholder}
      />
      <CommandEmpty>{emptySearchResult ?? "No results"}</CommandEmpty>
      <CommandGroup className="max-h-[60dvh] overflow-scroll">
        {filteredOptions.map((option) => {
          const included = values.includes(option.value);

          return (
            <CommandItem
              key={option.value}
              value={option.searchValue ?? option.value}
              onSelect={() => {
                const currentValue = option.value;
                setValues(
                included
                    ? values.filter((v) => v !== currentValue)
                    : [...values, currentValue],
                );
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  included ? "opacity-100" : "opacity-0",
                )}
              />
              {option.label}
            </CommandItem>
          );
        })}
      </CommandGroup>
    </>
  );

  if (asDialogProps)
    return (
      <CommandDialog
        commandProps={{
          shouldFilter: false,
        }}
        {...asDialogProps}
      >
        {guts}
      </CommandDialog>
    );

  return (
    <Command className="rounded-none border-y mt-7" shouldFilter={false}>
      {guts}
    </Command>
  );
}
