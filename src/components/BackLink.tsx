import clsx from "clsx";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { FOCUS_RING } from "@/lib/styles";

interface BackLinkProps {
  children: ReactNode;
  href: string;
}

export default function BackLink({ children, href }: BackLinkProps) {
  return (
    <a
      href={href}
      className={clsx(
        "inline-flex items-center gap-2 text-sm font-semibold text-blue hover:underline dark:text-blue-300",
        FOCUS_RING
      )}
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      {children}
    </a>
  );
}
