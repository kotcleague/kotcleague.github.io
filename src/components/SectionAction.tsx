import type { ReactNode } from "react";
import { FOCUS_RING } from "@/lib/styles";

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
      <a
        href={href}
        className={`inline-flex w-fit shrink-0 rounded-sm bg-blue px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-accent-500 ${FOCUS_RING}`}
      >
        {action}
      </a>
    </div>
  );
}
