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
    <dl className="grid gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4 dark:border-slate-800 dark:bg-slate-800">
      {items.map(({ label, value }) => (
        <div key={label} className="bg-white px-5 py-4 dark:bg-slate-900">
          <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {label}
          </dt>
          <dd className="mt-1 text-xl font-bold tabular-nums text-ink dark:text-white">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
