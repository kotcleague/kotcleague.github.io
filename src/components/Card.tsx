import type { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

export default function Card({
  className,
  ...props
}: ComponentPropsWithoutRef<"article">) {
  return (
    <article
      className={twMerge(
        "rounded-sm border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900",
        className
      )}
      {...props}
    />
  );
}
