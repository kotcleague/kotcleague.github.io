import type { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";
import { PANEL_SURFACE } from "@/lib/styles";

export default function TableShell({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={twMerge(
        PANEL_SURFACE,
        "overflow-x-auto overscroll-x-contain",
        className
      )}
      {...props}
    />
  );
}
