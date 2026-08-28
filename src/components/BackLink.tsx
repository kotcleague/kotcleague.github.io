import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

interface BackLinkProps {
  children: ReactNode;
  href: string;
}

export default function BackLink({ children, href }: BackLinkProps) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 text-sm font-semibold text-blue hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue dark:text-blue-300"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      {children}
    </a>
  );
}
