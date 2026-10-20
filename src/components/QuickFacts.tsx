import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import clsx from "clsx";
import {
  META_LABEL_ACCENT,
  PANEL_ACCENT,
  PANEL_INSET,
  PANEL_SURFACE,
} from "@/lib/styles";

interface QuickFact {
  icon: LucideIcon;
  label: string;
  lines: readonly string[];
  note?: string;
}

export default function QuickFacts({
  facts,
  footer,
  variant = "default",
}: {
  facts: readonly QuickFact[];
  footer?: ReactNode;
  variant?: "default" | "compact";
}) {
  return (
    <div className={`${PANEL_SURFACE} ${PANEL_ACCENT}`}>
      <dl className="grid grid-cols-2 lg:grid-cols-4">
        {facts.map(({ icon: Icon, label, lines, note }) => (
          <div
            key={label}
            className="min-w-0 border-b border-slate-200 px-3 py-4 odd:border-r [&:nth-last-child(-n+2)]:border-b-0 sm:px-4 lg:border-b-0 lg:border-r lg:last:border-r-0 dark:border-slate-800"
          >
            <dt
              className={clsx(
                "flex items-center gap-2",
                variant === "compact"
                  ? META_LABEL_ACCENT
                  : "text-sm font-semibold text-ink dark:text-white"
              )}
            >
              <Icon
                className="h-4 w-4 shrink-0 text-blue dark:text-blue-300"
                aria-hidden="true"
              />
              {label}
            </dt>
            <dd
              className={clsx(
                "font-semibold text-ink dark:text-white",
                variant === "compact"
                  ? "mt-1 text-sm leading-5"
                  : "mt-2 text-base leading-6 sm:text-lg sm:leading-7"
              )}
            >
              {lines.map((line) => (
                <span className="block" key={line}>
                  {line}
                </span>
              ))}
            </dd>
            {note && (
              <dd className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {note}
              </dd>
            )}
          </div>
        ))}
      </dl>
      {footer && (
        <div className={`border-t px-4 py-4 ${PANEL_INSET}`}>{footer}</div>
      )}
    </div>
  );
}
