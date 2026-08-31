import type { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

export default function TableShell({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={twMerge(
        "overflow-x-auto rounded-sm border border-slate-200 bg-white shadow-[0_1px_0_rgba(8,27,42,0.05)] dark:border-slate-700 dark:bg-slate-900",
        className
      )}
      {...props}
    />
  );
}
