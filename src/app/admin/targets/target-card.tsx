import type { targets } from "drizzle/schema";

export function TargetCard({
  target,
}: {
  target: typeof targets.$inferSelect;
}) {
  // fetch the target using trpc anyway

  return (
    <div className="md animate-pulse rounded border border-xslate-5 bg-xslate-3 p-3">
      <span>{target.name}</span>
    </div>
  );
}
