import {
  formatInteger,
  formatPercent,
  formatPointsForAgainst,
  formatRecord,
  formatSignedPercent,
} from "@/lib/format";
import type { PerformanceStats } from "@/types/leaderboard";

type PerformanceMetric =
  | "record"
  | "winRate"
  | "gameMakerPoints"
  | "pointsForAgainst"
  | "pointDifferential";

interface PerformanceMetricsProps {
  compactLabels?: boolean;
  metrics: readonly PerformanceMetric[];
  stats: PerformanceStats;
}

const LABELS: Record<PerformanceMetric, string> = {
  record: "Record",
  winRate: "Win rate",
  gameMakerPoints: "GM points",
  pointsForAgainst: "Points for / against",
  pointDifferential: "Point differential",
};

const COMPACT_LABELS: Record<PerformanceMetric, string> = {
  ...LABELS,
  pointsForAgainst: "PF / PA",
  pointDifferential: "Differential",
};

function metricValue(metric: PerformanceMetric, stats: PerformanceStats) {
  switch (metric) {
    case "record":
      return formatRecord(stats.wins, stats.losses);
    case "winRate":
      return formatPercent(stats.winRate);
    case "gameMakerPoints":
      return formatInteger(stats.gameMakerPoints);
    case "pointsForAgainst":
      return formatPointsForAgainst(stats.pointsEarned, stats.pointsAgainst);
    case "pointDifferential":
      return formatSignedPercent(stats.pointDifferential);
  }
}

export default function PerformanceMetrics({
  compactLabels = false,
  metrics,
  stats,
}: PerformanceMetricsProps) {
  const labels = compactLabels ? COMPACT_LABELS : LABELS;

  return (
    <>
      {metrics.map((metric) => (
        <div key={metric}>
          <dt className="text-xs text-slate-400">{labels[metric]}</dt>
          <dd className="mt-0.5 font-semibold tabular-nums">
            {metricValue(metric, stats)}
          </dd>
        </div>
      ))}
    </>
  );
}
