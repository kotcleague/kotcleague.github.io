import clsx from "clsx";
import type { ReactNode } from "react";

import RelativeEventDate from "@/components/RelativeEventDate";
import { META_LABEL_MUTED } from "@/lib/styles";

interface EventCardDetailsProps {
  children: ReactNode;
  className?: string;
  date: string;
  label: string;
}

export default function EventCardDetails({
  children,
  className,
  date,
  label,
}: EventCardDetailsProps) {
  return (
    <div
      className={clsx(
        "flex min-w-0 flex-1 flex-col justify-center overflow-hidden",
        className
      )}
    >
      <p className={`${META_LABEL_MUTED} truncate whitespace-nowrap`}>
        {label}
      </p>
      <div className="mt-1.5 flex min-w-0 items-center gap-2.5">{children}</div>
      <RelativeEventDate className="mt-1.5" date={date} />
    </div>
  );
}
