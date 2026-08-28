import clsx from "clsx";
import { ExternalLink } from "lucide-react";
import type { ReactNode } from "react";

interface RegistrationLinkProps {
  children: ReactNode;
  compact?: boolean;
  href: string;
}

export default function RegistrationLink({
  children,
  compact = false,
  href,
}: RegistrationLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-lg bg-blue px-4 text-sm font-semibold text-white transition-colors hover:bg-accent-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue",
        compact ? "py-2" : "py-2.5"
      )}
    >
      {children}
      <ExternalLink className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}
