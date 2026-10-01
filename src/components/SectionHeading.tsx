import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import type { ReactNode } from "react";
import Eyebrow from "@/components/Eyebrow";

interface SectionHeadingProps {
  children: ReactNode;
  eyebrow?: string;
  id?: string;
  action?: ReactNode;
  description?: ReactNode;
  className?: string;
}

export default function SectionHeading({
  children,
  eyebrow,
  id,
  action,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={twMerge(
        "mb-5 flex flex-wrap items-end justify-between gap-4",
        className
      )}
    >
      <div className="min-w-0">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2
          id={id}
          className={clsx(
            "font-display text-3xl font-semibold leading-none tracking-[0.02em] sm:text-4xl",
            eyebrow && "mt-2"
          )}
        >
          {children}
        </h2>
        {description && (
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
