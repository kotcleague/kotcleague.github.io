import clsx from "clsx";
import type { ReactNode } from "react";
import Eyebrow from "@/components/Eyebrow";

interface SectionHeadingProps {
  children: ReactNode;
  eyebrow?: string;
  id?: string;
  prominent?: boolean;
}

export default function SectionHeading({
  children,
  eyebrow,
  id,
  prominent = false,
}: SectionHeadingProps) {
  return (
    <div className={prominent ? "mb-5" : "mb-4"}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2
        id={id}
        className={clsx(
          "font-display text-3xl font-semibold leading-none tracking-[0.02em] sm:text-4xl",
          eyebrow && "mt-2",
          prominent && "text-4xl sm:text-5xl"
        )}
      >
        {children}
      </h2>
    </div>
  );
}
