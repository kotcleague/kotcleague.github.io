import type { ReactNode } from "react";

import ActionLink from "@/components/ActionLink";

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
    <ActionLink external href={href} size={compact ? "sm" : "md"}>
      {children}
    </ActionLink>
  );
}
