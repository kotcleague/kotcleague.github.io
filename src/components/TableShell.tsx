import type { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

export default function TableShell({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={twMerge(
        "overflow-x-auto rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900",
        className
      )}
      {...props}
    />
  );
}
