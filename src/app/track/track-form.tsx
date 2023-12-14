"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectValue } from "@/components/ui/select";
import { SelectContent, SelectTrigger } from "@radix-ui/react-select";
import { CheckIcon, Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const DEFAULT_WORKOUT_NAME = "New workout";

// type Workout = "program" | "custom" | "repeat";

export function TrackForm() {
  const [workoutTitle, setWorkoutTitle] = useState(DEFAULT_WORKOUT_NAME);
  const [isEditingWorkoutTitle, setIsEditingWorkoutTitle] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, [isEditingWorkoutTitle]);

  return (
    <div className="w-[70dvw] rounded-lg border bg-xslate-1 p-4 px-5 text-xslate-11 shadow-xl">
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
              <CheckIcon className="h-4 w-4" />
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
              <Pencil className="h-4 w-4" />
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
    </div>
  );
}
