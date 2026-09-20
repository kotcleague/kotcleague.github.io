import { CalendarClock } from "lucide-react";
import clsx from "clsx";
import { formatRelativeEventDate } from "@/lib/format";

interface RelativeEventDateProps {
  className?: string;
  date: string;
}

export default function RelativeEventDate({
  className,
  date,
}: RelativeEventDateProps) {
  return (
    <time
      className={clsx(
        "inline-flex w-fit items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-blue dark:text-blue-300",
        className
      )}
      dateTime={date}
    >
      <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
      {formatRelativeEventDate(date)}
    </time>
  );
}
