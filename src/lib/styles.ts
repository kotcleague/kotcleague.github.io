import clsx from "clsx";

export const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue";
export const META_LABEL =
  "text-[0.7rem] font-semibold uppercase tracking-[0.12em]";
export const META_LABEL_ACCENT = `${META_LABEL} text-blue dark:text-blue-300`;
export const META_LABEL_MUTED = `${META_LABEL} text-slate-400 dark:text-slate-500`;

export type ActionSize = "sm" | "md";
export type ActionVariant = "primary" | "secondary" | "quiet" | "youtube";

export function actionClass({
  className,
  size = "md",
  variant = "primary",
}: {
  className?: string;
  size?: ActionSize;
  variant?: ActionVariant;
} = {}) {
  return clsx(
    "inline-flex cursor-pointer items-center justify-center gap-2 border font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40",
    FOCUS_RING,
    size === "sm"
      ? "min-h-10 px-3 text-xs uppercase tracking-[0.08em]"
      : "min-h-11 px-4 text-sm",
    variant === "primary" &&
      "border-blue bg-blue text-white hover:border-accent-500 hover:bg-accent-500",
    variant === "secondary" &&
      "border-slate-300 bg-white text-ink hover:border-blue hover:text-blue dark:border-scoreboard dark:bg-ink dark:text-white dark:hover:border-blue-300 dark:hover:text-blue-300",
    variant === "quiet" &&
      "border-transparent bg-transparent px-0 text-blue hover:text-accent-500 dark:text-blue-300 dark:hover:text-blue-200",
    variant === "youtube" &&
      "border-red-300 bg-white text-red-700 hover:border-red-600 hover:bg-red-50 focus-visible:outline-red-600 dark:border-red-700 dark:bg-transparent dark:text-red-300 dark:hover:border-red-500 dark:hover:bg-red-950/40 dark:hover:text-red-200",
    className
  );
}

export function tabClass(active: boolean) {
  return clsx(
    "inline-flex min-h-10 cursor-pointer items-center justify-center whitespace-nowrap border px-4 text-xs font-semibold uppercase tracking-[0.1em] transition-colors",
    FOCUS_RING,
    active
      ? "border-blue bg-blue text-white"
      : "border-transparent text-slate-500 hover:text-ink dark:text-slate-400 dark:hover:text-white"
  );
}
