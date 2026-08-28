import clsx from "clsx";
import type { ReactNode } from "react";

interface EmptyStateProps {
  children: ReactNode;
  className?: string;
}

export default function EmptyState({ children, className }: EmptyStateProps) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-dashed border-slate-300 bg-white text-center dark:border-slate-700 dark:bg-slate-900",
        className
      )}
    >
      {children}
    </div>
  );
}
