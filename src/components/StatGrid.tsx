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
}

export default function StatGrid({
  className,
  columns = 4,
  compact = false,
  items,
}: StatGridProps) {
  return (
    <dl
      className={twMerge(
        clsx(
          "grid grid-cols-2 border-y border-slate-200 dark:border-slate-800",
          compact ? "gap-x-5 gap-y-3 py-4" : "gap-x-6 gap-y-5 py-5",
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
        <div key={label}>
          <dt className={`${META_LABEL} text-slate-500 dark:text-slate-400`}>
            {label}
          </dt>
          <dd
            className={clsx(
              "font-display mt-1 font-bold tabular-nums text-ink dark:text-white",
              compact ? "text-xl" : "text-2xl"
            )}
          >
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
