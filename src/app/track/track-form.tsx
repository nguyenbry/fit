"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
} from "@/components/ui/drawer";
import { ComboBox } from "@/components/combo-box";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectValue } from "@/components/ui/select";
import { useMediaQuery } from "@/hooks/use-media-query";
import { api } from "@/trpc/react";
import { SelectContent, SelectTrigger } from "@radix-ui/react-select";
import { CheckIcon, Loader2, Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const DEFAULT_WORKOUT_NAME = "New workout";

// type Workout = "program" | "custom" | "repeat";

export function TrackForm() {
  const movementsQuery = api.movements.getAll.useQuery();
  const [workoutTitle, setWorkoutTitle] = useState(DEFAULT_WORKOUT_NAME);
  const [isEditingWorkoutTitle, setIsEditingWorkoutTitle] = useState(true);

  const [movementsSelectionOpen, setMovementsSelectionOpen] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    isEditingWorkoutTitle && titleRef.current?.focus();
  }, [isEditingWorkoutTitle]);

  const [selectedMovements, setSelectedMovements] = useState<string[]>([]);

  return (
    <div className="flex w-[70dvw] flex-col gap-4 rounded-lg border bg-xslate-1 p-4 px-5 text-xslate-11 shadow-xl">
      <div className="flex items-center gap-1">
        {isEditingWorkoutTitle ? (
          <div className="flex grow gap-1">
            <Input
              autoComplete="off"
              id="title"
              ref={titleRef}
              value={workoutTitle}
              onChange={(e) => setWorkoutTitle(e.target.value)}
            />
            <Button
              className="h-10 w-10"
              size={"icon"}
              variant={"outline"}
              onClick={() => setIsEditingWorkoutTitle(false)}
            >
              <CheckIcon className="size-4" />
            </Button>
          </div>
        ) : (
          <>
            <span className="text-xl font-semibold">{workoutTitle}</span>
            <Button
              size={"icon"}
              variant={"ghost"}
              onClick={() => setIsEditingWorkoutTitle(true)}
            >
              <Pencil className="size-4" />
            </Button>
          </>
        )}

        <Select>
          <SelectTrigger className="max-w-max">
            <SelectValue />
          </SelectTrigger>
          <SelectContent></SelectContent>
        </Select>
      </div>

      {movementsSelectionOpen && (
        <AddMovementDialog
          onSelect={(movement) => {
            if (selectedMovements.includes(movement)) {
              toast("Exercise is already in this workout", {
                action: {
                  label: "Try again",
                  onClick: () => setMovementsSelectionOpen(true),
                },
              });
              return;
            }
            setSelectedMovements((curr) => [...curr, movement]);
          }}
          close={() => {
            setMovementsSelectionOpen(false);
          }}
        />
      )}

      <pre>
        {selectedMovements
          .map((idAsNum) => {
            const id = Number(idAsNum);
            const movement = movementsQuery.data?.find((m) => m.id === id);
            return movement?.name ?? "unknown";
          })
          .join("\n")}
      </pre>

      <div className="flex gap-2">
        <Button
          variant={"default"}
          className="ml-auto"
          onClick={() => setMovementsSelectionOpen(true)}
        >
          {movementsQuery.isLoading ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            "Add exercise"
          )}
        </Button>
        <Button variant={"success"}>Finish</Button>
      </div>
    </div>
  );
}

function AddMovementDialog({
  close,
  onSelect,
}: {
  close: () => void;
  onSelect: (movement: string) => void;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const movementsQuery = api.movements.getAll.useQuery();

  const out = (
    <ComboBox
      placeholder="Search for an exercise"
      asDialogProps={
        isDesktop
          ? {
              open: true,
              onOpenChange: (open) => {
                !open && close();
              },
            }
          : undefined
      }
      values={[]}
      setValues={(newValues) => {
        const [first] = newValues;
        if (!first) throw new Error("This should always be a non-empty array");
        onSelect(first);
        close();
      }}
      options={
        movementsQuery.data?.map((m) => {
          return {
            label: m.name,
            value: m.id.toString(),
            searchValue: m.name.toLowerCase(),
          };
        }) ?? []
      }
    />
  );

  if (isDesktop) return out; // it will show up as a dialog due to prop

  return (
    <Drawer open onClose={close} onOpenChange={(o) => !o && close()}>
      {/* <DrawerTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DrawerTrigger> */}
      <DrawerContent>
        {out}
        <DrawerFooter className="py-5">
          <DrawerClose asChild>
            <Button variant="destructive">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
