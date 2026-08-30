import clsx from "clsx";

interface PlacementBadgeProps {
  place: number;
}

export function placementBadgeClass(place: number) {
  switch (place) {
    case 1:
      return "bg-gold text-amber-950";
    case 2:
      return "bg-silver text-slate-800";
    case 3:
      return "bg-bronze text-stone-950";
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
