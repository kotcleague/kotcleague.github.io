import type { ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

type TableCellAlignment = "left" | "center" | "right";
type TableDensity = "compact" | "default";

function alignmentClass(alignment: TableCellAlignment) {
  return {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[alignment];
}

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

interface EditorialTableHeaderCellProps extends ComponentPropsWithoutRef<"th"> {
  alignment?: TableCellAlignment;
  density?: TableDensity;
}

export function EditorialTableHeaderCell({
  alignment = "left",
  className,
  density = "default",
  ...props
}: EditorialTableHeaderCellProps) {
  return (
    <th
      className={twMerge(
        clsx(
          "align-middle",
          density === "compact" ? "px-2 py-3 sm:px-4" : "px-3 py-3 sm:px-5",
          alignmentClass(alignment)
        ),
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

interface EditorialTableCellProps extends ComponentPropsWithoutRef<"td"> {
  alignment?: TableCellAlignment;
  density?: TableDensity;
  numeric?: boolean;
}

export function EditorialTableCell({
  alignment = "left",
  className,
  density = "default",
  numeric = false,
  ...props
}: EditorialTableCellProps) {
  return (
    <td
      className={twMerge(
        clsx(
          "align-middle",
          density === "compact"
            ? "px-2 py-3 sm:px-4 sm:py-4"
            : "px-3 py-3 sm:px-5 sm:py-4",
          alignmentClass(alignment),
          numeric && "tabular-nums"
        ),
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
