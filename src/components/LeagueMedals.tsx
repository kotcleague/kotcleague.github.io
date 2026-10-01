import { Medal } from "lucide-react";
import { twMerge } from "tailwind-merge";

export const MEDALS = [
  { key: "gold", label: "Gold" },
  { key: "silver", label: "Silver" },
  { key: "bronze", label: "Bronze" },
] as const;

type MedalKind = (typeof MEDALS)[number]["key"];
type MedalCounts = Record<MedalKind, number>;
const MEDAL_COLORS: Record<MedalKind, string> = {
  gold: "text-amber-700 dark:text-amber-300",
  silver: "text-slate-500 dark:text-slate-300",
  bronze: "text-orange-700 dark:text-orange-300",
};

export function MedalIcon({ kind }: { kind: MedalKind }) {
  return (
    <Medal
      className={`h-4 w-4 shrink-0 ${MEDAL_COLORS[kind]}`}
      strokeWidth={1.75}
      aria-hidden="true"
    />
  );
}

export default function LeagueMedals({
  counts,
  className,
}: {
  counts: MedalCounts;
  className?: string;
}) {
  return (
    <span
      className={twMerge(
        "inline-flex items-center gap-3 text-xs font-semibold tabular-nums text-slate-600 dark:text-slate-300",
        className
      )}
    >
      {MEDALS.map(({ key, label }) => (
        <span
          key={key}
          className="inline-flex items-center gap-1"
          aria-label={`${counts[key]} ${label.toLowerCase()} medal${
            counts[key] === 1 ? "" : "s"
          }`}
        >
          <MedalIcon kind={key} />
          <span aria-hidden="true">{counts[key]}</span>
        </span>
      ))}
    </span>
  );
}
