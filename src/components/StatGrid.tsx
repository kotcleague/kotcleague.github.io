import type { ReactNode } from "react";

export interface StatItem {
  label: string;
  value: ReactNode;
}

interface StatGridProps {
  items: StatItem[];
}

export default function StatGrid({ items }: StatGridProps) {
  return (
    <dl className="grid grid-cols-2 gap-px border-y border-slate-300 bg-slate-200 lg:grid-cols-4 dark:border-slate-700 dark:bg-slate-700">
      {items.map(({ label, value }) => (
        <div
          key={label}
          className="bg-white px-4 py-4 dark:bg-slate-900 sm:px-5 sm:py-5"
        >
          <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {label}
          </dt>
          <dd className="font-display mt-1 text-2xl font-bold tabular-nums text-ink dark:text-white sm:text-3xl">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
