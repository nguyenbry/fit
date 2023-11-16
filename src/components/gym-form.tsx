"use client";

import type { PropsWithCn } from "@/lib/types";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export function GymForm({ className }: PropsWithCn) {
  return (
    <form className={cn(className)}>
      <Label htmlFor="name">Name</Label>
      <Input id="name" autoComplete="off"/>

      <div className="mt-4 flex justify-end">
        <Button type="submit">Create</Button>
      </div>
    </form>
  );
}
