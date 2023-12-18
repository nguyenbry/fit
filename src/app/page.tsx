import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import type { PropsWithCn } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";

function Text({ children, className }: PropsWithChildren & PropsWithCn) {
  return (
    <span
      className={cn(
        "min-w-[50vw] text-center text-4xl font-semibold tracking-tight animate-in fade-in-20 spin-in-2 slide-in-from-top-7 md:text-5xl xl:min-w-0 xl:max-w-[40vw]",
        className,
      )}
      style={{
        animationDuration: "1s",
      }}
    >
      {children}
    </span>
  );
}

export default function Home() {
  // const hello = await api.post.hello.query({ text: "from tRPC" });

  return (
    <>
      <div className="flex h-screen flex-col items-center gap-4 px-8 pt-12 sm:px-16 md:px-32 lg:pt-32">
        <span className="text-xred-11 border-xred-5 bg-xred-4 rounded-xl border px-4 py-1.5 text-xl uppercase tracking-tight">
          Coming soon
        </span>
        <Text className="my-4">
          The definitive fitness tracking tool for the avid lifter.
        </Text>
        <Button size={"lg"} variant={"contrast"} className="text-md">
          START YOUR JOURNEY
        </Button>
      </div>
      <div className="bg-xcyan-1 h-screen w-full"></div>
      <ThemeToggle className="mb-4 mt-auto" />
    </>
  );
}
