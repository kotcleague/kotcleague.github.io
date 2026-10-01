import type { RankingView } from "@/types/leaderboard";
import { TAB_LIST, tabClass } from "@/lib/styles";
import { twMerge } from "tailwind-merge";

interface ViewTabsProps {
  selected: RankingView;
  onSelect: (view: RankingView) => void;
}

const currentMonthName = new Date().toLocaleDateString("en-US", {
  month: "long",
});

export const RANKING_VIEW_LABELS: Record<RankingView, string> = {
  "past-30-days": "Past 30 Days",
  "current-month": currentMonthName,
  "all-time": "All Time",
};

const VIEWS: RankingView[] = ["past-30-days", "current-month", "all-time"];

export default function ViewTabs({ selected, onSelect }: ViewTabsProps) {
  return (
    <div
      className={twMerge(
        TAB_LIST,
        "grid w-full grid-cols-3 sm:inline-flex sm:w-auto"
      )}
      role="group"
      aria-label="Ranking period"
    >
      {VIEWS.map((view) => (
        <button
          type="button"
          key={view}
          onClick={() => onSelect(view)}
          aria-pressed={selected === view}
          className={twMerge(
            tabClass(selected === view),
            "px-1 text-[0.6rem] tracking-[0.06em] sm:px-4 sm:text-xs sm:tracking-[0.1em]"
          )}
        >
          {RANKING_VIEW_LABELS[view]}
        </button>
      ))}
    </div>
  );
}
