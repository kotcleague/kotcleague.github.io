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
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 lg:grid-cols-4 dark:border-slate-800 dark:bg-slate-800">
      {items.map(({ label, value }) => (
        <div
          key={label}
          className="bg-white px-4 py-3 dark:bg-slate-900 sm:px-5 sm:py-4"
        >
          <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {label}
          </dt>
          <dd className="mt-1 text-lg font-bold tabular-nums text-ink dark:text-white sm:text-xl">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
