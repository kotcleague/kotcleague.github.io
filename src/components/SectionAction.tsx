import type { ReactNode } from "react";
import ActionLink from "@/components/ActionLink";

interface SectionActionProps {
  action: ReactNode;
  children: ReactNode;
  href: string;
}

export default function SectionAction({
  action,
  children,
  href,
}: SectionActionProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-blue/70 bg-scoreboard px-4 py-3 text-white dark:border-blue">
      <p className="text-sm font-semibold">{children}</p>
      <ActionLink href={href} size="sm" className="w-fit shrink-0">
        {action}
      </ActionLink>
    </div>
  );
}
