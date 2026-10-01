import type { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";
import { PANEL_SURFACE } from "@/lib/styles";

export default function Card({
  className,
  ...props
}: ComponentPropsWithoutRef<"article">) {
  return <article className={twMerge(PANEL_SURFACE, className)} {...props} />;
}
