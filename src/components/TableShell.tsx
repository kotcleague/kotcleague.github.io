import type { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

export default function TableShell({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={twMerge(
        "overflow-x-auto overscroll-x-contain border border-slate-200 bg-white dark:border-scoreboard dark:bg-ink",
        className
      )}
      {...props}
    />
  );
}
