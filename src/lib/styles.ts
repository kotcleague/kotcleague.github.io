import clsx from "clsx";

export const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue";
export const META_LABEL =
  "text-[0.7rem] font-semibold uppercase tracking-[0.12em]";
export const META_LABEL_ACCENT = `${META_LABEL} text-blue dark:text-blue-300`;
export const META_LABEL_MUTED = `${META_LABEL} text-slate-400 dark:text-slate-500`;
export const PAGE_CONTAINER = "mx-auto w-full max-w-5xl px-4 sm:px-6";
export const PANEL_SURFACE =
  "border border-slate-200 bg-white dark:border-scoreboard dark:bg-ink";
export const PANEL_ACCENT = "border-t-2 border-t-blue dark:border-t-blue-300";
export const PANEL_INSET =
  "border-slate-200 bg-slate-50/70 dark:border-scoreboard dark:bg-scoreboard/20";
export const FIELD_CLASS = `w-full min-h-11 border border-slate-300 bg-white px-3 py-2.5 text-sm text-ink transition-colors placeholder:text-slate-400 focus:border-blue dark:border-slate-700 dark:bg-ink dark:text-white dark:placeholder:text-slate-500 ${FOCUS_RING}`;
export const FIELD_LABEL = `${META_LABEL} mb-2 block text-slate-500 dark:text-slate-400`;
export const HEADER_ICON_BUTTON = `flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center border border-white/15 text-white/70 transition-colors hover:border-white/35 hover:text-white ${FOCUS_RING}`;
export const TAB_LIST = `scrollbar-hide inline-flex max-w-full overflow-x-auto p-1 ${PANEL_SURFACE}`;

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
