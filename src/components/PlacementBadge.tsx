import clsx from "clsx";

interface PlacementBadgeProps {
  place: number;
}

export function placementBadgeClass(place: number) {
  switch (place) {
    case 1:
      return "bg-blue text-white";
    case 2:
      return "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200";
    case 3:
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300";
    default:
      return "bg-transparent text-slate-400 dark:text-slate-500";
  }
}

export default function PlacementBadge({ place }: PlacementBadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums",
        placementBadgeClass(place)
      )}
    >
      {place}
    </span>
  );
}
