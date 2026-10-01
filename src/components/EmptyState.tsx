import { twMerge } from "tailwind-merge";
import type { ReactNode } from "react";
import { PANEL_SURFACE } from "@/lib/styles";

interface EmptyStateProps {
  children: ReactNode;
  className?: string;
}

export default function EmptyState({ children, className }: EmptyStateProps) {
  return (
    <div
      className={twMerge(
        PANEL_SURFACE,
        "px-4 py-12 text-center text-sm text-slate-500 dark:text-slate-400",
        className
      )}
    >
      {children}
    </div>
  );
}
