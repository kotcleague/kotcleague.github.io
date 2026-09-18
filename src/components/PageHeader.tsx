import type { ReactNode } from "react";
import clsx from "clsx";
import Eyebrow from "@/components/Eyebrow";

interface PageHeaderProps {
  children: ReactNode;
  description?: ReactNode;
  eyebrow: string;
  className?: string;
  footer?: ReactNode;
}

export default function PageHeader({
  children,
  description,
  eyebrow,
  className,
  footer,
}: PageHeaderProps) {
  return (
    <section
      className={clsx(
        "border-b border-slate-200 bg-white dark:border-scoreboard dark:bg-ink",
        className
      )}
    >
      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-7">
        <Eyebrow size="hero">{eyebrow}</Eyebrow>
        <h1 className="font-display mt-3 text-4xl font-bold uppercase leading-none tracking-[0.015em] sm:text-5xl">
          {children}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base dark:text-slate-400">
            {description}
          </p>
        )}
        {footer && <div className="mt-6">{footer}</div>}
      </div>
    </section>
  );
}
