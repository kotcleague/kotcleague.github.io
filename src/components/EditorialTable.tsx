import type { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

export function EditorialTableHead({
  className,
  ...props
}: ComponentPropsWithoutRef<"thead">) {
  return (
    <thead
      className={twMerge(
        "border-b border-blue/70 bg-scoreboard text-xs font-semibold uppercase tracking-wider text-white dark:border-blue dark:text-slate-100",
        className
      )}
      {...props}
    />
  );
}

export function EditorialTableBody({
  className,
  ...props
}: ComponentPropsWithoutRef<"tbody">) {
  return (
    <tbody
      className={twMerge(
        "divide-y divide-slate-200 dark:divide-slate-800",
        className
      )}
      {...props}
    />
  );
}

export function EditorialTableRow({
  className,
  ...props
}: ComponentPropsWithoutRef<"tr">) {
  return (
    <tr
      className={twMerge(
        "transition-colors hover:bg-blue/[0.035] dark:hover:bg-blue/[0.08]",
        className
      )}
      {...props}
    />
  );
}
