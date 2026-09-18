import type { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

export default function EditorialLinkCard({
  className,
  ...props
}: ComponentPropsWithoutRef<"a">) {
  return (
    <a
      className={twMerge(
        "group block rounded-sm border border-slate-200 bg-white p-4 transition-colors hover:border-blue/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue dark:border-scoreboard dark:bg-ink dark:hover:border-blue/60",
        className
      )}
      {...props}
    />
  );
}
