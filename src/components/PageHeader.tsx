import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import Eyebrow from "@/components/Eyebrow";
import { PAGE_CONTAINER, PANEL_SURFACE } from "@/lib/styles";

interface PageHeaderProps {
  children: ReactNode;
  description?: ReactNode;
  eyebrow: string;
  className?: string;
  actions?: ReactNode;
  footer?: ReactNode;
  media?: ReactNode;
}

export default function PageHeader({
  children,
  description,
  eyebrow,
  className,
  actions,
  footer,
  media,
}: PageHeaderProps) {
  return (
    <section
      className={twMerge(PANEL_SURFACE, "border-x-0 border-t-0", className)}
    >
      <div
        className={`${PAGE_CONTAINER} flex flex-col gap-5 py-6 sm:py-8 md:flex-row md:items-center md:justify-between`}
      >
        <div
          className={`min-w-0 flex-1 ${
            media ? "flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8" : ""
          }`}
        >
          {media}
          <div className="min-w-0 flex-1">
            <Eyebrow size="hero">{eyebrow}</Eyebrow>
            <h1 className="font-display mt-3 break-words text-4xl font-bold uppercase leading-none tracking-[0.015em] sm:text-5xl">
              {children}
            </h1>
            {description && (
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base dark:text-slate-400">
                {description}
              </p>
            )}
            {footer && <div className="mt-6">{footer}</div>}
          </div>
        </div>
        {actions && <div className="min-w-0 md:shrink-0">{actions}</div>}
      </div>
    </section>
  );
}
