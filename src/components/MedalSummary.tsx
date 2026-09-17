interface MedalSummaryProps {
  bronze: number;
  gold: number;
  silver: number;
}

const MEDALS = [
  { key: "gold", emoji: "🥇", label: "Gold" },
  { key: "silver", emoji: "🥈", label: "Silver" },
  { key: "bronze", emoji: "🥉", label: "Bronze" },
] as const;

function medalCountLabel(count: number, label: string) {
  return `${count} ${label.toLowerCase()} medal${count === 1 ? "" : "s"}`;
}

export default function MedalSummary({
  bronze,
  gold,
  silver,
}: MedalSummaryProps) {
  const counts = { bronze, gold, silver };

  return (
    <div className="px-4 py-3">
      <p className={`${META_LABEL} text-slate-500 dark:text-slate-400`}>
        Medals
      </p>
      <div
        className="mt-1 flex items-center gap-3"
        aria-label={`${medalCountLabel(gold, "gold")}, ${medalCountLabel(
          silver,
          "silver"
        )}, and ${medalCountLabel(bronze, "bronze")}`}
      >
        {MEDALS.map(({ emoji, key, label }) => (
          <span
            key={key}
            title={medalCountLabel(counts[key], label)}
            className="font-display inline-flex items-center gap-1 text-3xl font-bold tabular-nums text-ink dark:text-white"
          >
            <span className="text-lg" aria-hidden="true">
              {emoji}
            </span>
            {counts[key]}
          </span>
        ))}
      </div>
    </div>
  );
}
import { META_LABEL } from "@/lib/styles";
