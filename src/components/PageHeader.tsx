import type { ReactNode } from "react";
import Eyebrow from "@/components/Eyebrow";

interface PageHeaderProps {
  children: ReactNode;
  description?: ReactNode;
  eyebrow: string;
}

export default function PageHeader({
  children,
  description,
  eyebrow,
}: PageHeaderProps) {
  return (
    <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
        <Eyebrow size="hero">{eyebrow}</Eyebrow>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
          {children}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg dark:text-slate-400">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
