import clsx from "clsx";
import type { ReactNode } from "react";

interface EyebrowProps {
  children: ReactNode;
  muted?: boolean;
  size?: "default" | "hero";
}

export default function Eyebrow({
  children,
  muted = false,
  size = "default",
}: EyebrowProps) {
  return (
    <div
      className={clsx(
        "inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em]",
        muted
          ? "text-slate-400 dark:text-slate-500"
          : "text-blue dark:text-blue-300"
      )}
    >
      <span
        className={clsx(
          "shrink-0 bg-blue dark:bg-blue-300",
          size === "hero" ? "h-2 w-2" : "h-1.5 w-1.5"
        )}
        aria-hidden="true"
      />
      <span>{children}</span>
    </div>
  );
}
