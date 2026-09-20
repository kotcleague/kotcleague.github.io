import DateBadge from "@/components/DateBadge";
import { formatEventDateParts } from "@/lib/format";

interface EventDateBadgeProps {
  className?: string;
  compact?: boolean;
  date: string;
}

export default function EventDateBadge({
  className,
  compact = false,
  date,
}: EventDateBadgeProps) {
  const parts = formatEventDateParts(date);

  return (
    <DateBadge
      bottom={compact ? parts.weekday.slice(0, 3) : parts.weekday}
      className={className}
      dateTime={date}
      top={parts.month}
      value={parts.day}
    />
  );
}
