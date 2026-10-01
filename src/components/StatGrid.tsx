import type { ReactNode } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { META_LABEL } from "@/lib/styles";

export interface StatItem {
  label: string;
  value: ReactNode;
}

interface StatGridProps {
  className?: string;
  columns?: 2 | 4 | 5;
  compact?: boolean;
  items: StatItem[];
  variant?: "default" | "scoreboard";
}

export default function StatGrid({
  className,
  columns = 4,
  compact = false,
  items,
  variant = "default",
}: StatGridProps) {
  return (
    <dl
      className={twMerge(
        clsx(
          "grid grid-cols-2",
          variant === "scoreboard"
            ? "gap-px bg-white/10"
            : "border-y border-slate-200 dark:border-slate-800",
          variant === "default" &&
            (compact ? "gap-x-5 gap-y-3 py-4" : "gap-x-6 gap-y-5 py-5"),
          columns === 2
            ? "sm:grid-cols-2"
            : columns === 5
            ? "lg:grid-cols-5"
            : "lg:grid-cols-4"
        ),
        className
      )}
    >
      {items.map(({ label, value }) => (
        <div
          key={label}
          className={
            variant === "scoreboard"
              ? "bg-scoreboard px-4 py-5 sm:px-5"
              : undefined
          }
        >
          <dt
            className={clsx(
              META_LABEL,
              variant === "scoreboard"
                ? "text-blue-200"
                : "text-slate-500 dark:text-slate-400"
            )}
          >
            {label}
          </dt>
          <dd
            className={clsx(
              "font-display mt-1 font-semibold tabular-nums",
              variant === "scoreboard"
                ? "text-3xl text-white"
                : "text-ink dark:text-white",
              variant === "default" && (compact ? "text-xl" : "text-2xl")
            )}
          >
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
