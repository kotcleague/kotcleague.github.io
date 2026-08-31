import type { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

export default function EditorialLinkCard({
  className,
  ...props
}: ComponentPropsWithoutRef<"a">) {
  return (
    <a
      className={twMerge(
        "group block rounded-sm border border-slate-200 border-l-4 border-l-slate-300 bg-white p-4 transition-colors hover:border-blue/40 hover:border-l-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue dark:border-slate-800 dark:border-l-slate-700 dark:bg-slate-900 dark:hover:border-blue/60",
        className
      )}
      {...props}
    />
  );
}
