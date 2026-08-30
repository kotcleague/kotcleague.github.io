import clsx from "clsx";
import type { ReactNode } from "react";

interface PageContentProps {
  children: ReactNode;
  className?: string;
}

export default function PageContent({ children, className }: PageContentProps) {
  return (
    <div
      className={clsx(
        "mx-auto max-w-5xl px-4 pt-6 pb-10 sm:px-6 sm:pt-8 sm:pb-14",
        className
      )}
    >
      {children}
    </div>
  );
}
