import DateBadge from "@/components/DateBadge";
import { formatEventDateParts } from "@/lib/format";

interface EventDateBadgeProps {
  className?: string;
  date: string;
}

export default function EventDateBadge({
  className,
  date,
}: EventDateBadgeProps) {
  const parts = formatEventDateParts(date);

  return (
    <DateBadge
      bottom={parts.weekday}
      className={className}
      dateTime={date}
      top={parts.month}
      value={parts.day}
    />
  );
}
