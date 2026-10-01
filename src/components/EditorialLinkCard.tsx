import type { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";
import { FOCUS_RING, PANEL_SURFACE } from "@/lib/styles";

export default function EditorialLinkCard({
  className,
  ...props
}: ComponentPropsWithoutRef<"a">) {
  return (
    <a
      className={twMerge(
        PANEL_SURFACE,
        FOCUS_RING,
        "group block p-4 transition-colors hover:border-blue/50 dark:hover:border-blue/60",
        className
      )}
      {...props}
    />
  );
}
