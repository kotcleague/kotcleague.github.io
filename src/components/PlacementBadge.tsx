import clsx from "clsx";

interface PlacementBadgeProps {
  place: number;
}

export function placementBadgeClass(place: number) {
  switch (place) {
    case 1:
      return "border border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200";
    case 2:
      return "border border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200";
    case 3:
      return "border border-orange-300 bg-orange-50 text-orange-800 dark:border-orange-800 dark:bg-orange-950/40 dark:text-orange-200";
    default:
      return "border border-transparent bg-transparent text-slate-400 dark:text-slate-500";
  }
}

export default function PlacementBadge({ place }: PlacementBadgeProps) {
  return (
    <span
      className={clsx(
        "font-display inline-flex h-8 min-w-8 shrink-0 items-center justify-center px-1 text-lg font-bold tabular-nums",
        placementBadgeClass(place)
      )}
    >
      {place}
    </span>
  );
}
