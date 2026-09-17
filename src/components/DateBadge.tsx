import type { ReactNode } from "react";
import clsx from "clsx";
import { META_LABEL_ACCENT, META_LABEL_MUTED } from "@/lib/styles";

interface DateBadgeProps {
  bottom: ReactNode;
  className?: string;
  dateTime: string;
  top: ReactNode;
  value: ReactNode;
  valueClassName?: string;
}

export default function DateBadge({
  bottom,
  className,
  dateTime,
  top,
  value,
  valueClassName,
}: DateBadgeProps) {
  return (
    <time
      dateTime={dateTime}
      className={clsx(
        "flex min-w-20 shrink-0 flex-col items-center justify-center border-r border-blue/10 bg-blue/[0.055] px-3 py-4 text-center text-ink dark:border-blue/20 dark:bg-blue/10 dark:text-white",
        className
      )}
    >
      <span className={META_LABEL_ACCENT}>{top}</span>
      <span
        className={clsx(
          "font-display mt-0.5 text-4xl font-bold leading-none tabular-nums",
          valueClassName
        )}
      >
        {value}
      </span>
      <span className={`${META_LABEL_MUTED} mt-1`}>{bottom}</span>
    </time>
  );
}
