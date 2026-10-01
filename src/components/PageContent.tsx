import { twMerge } from "tailwind-merge";
import type { ReactNode } from "react";
import { PAGE_CONTAINER } from "@/lib/styles";

interface PageContentProps {
  children: ReactNode;
  className?: string;
}

export default function PageContent({ children, className }: PageContentProps) {
  return (
    <div
      className={twMerge(
        PAGE_CONTAINER,
        "pt-6 pb-10 sm:pt-8 sm:pb-14",
        className
      )}
    >
      {children}
    </div>
  );
}
