import type { RankingView } from "@/types/leaderboard";
import { tabClass } from "@/lib/styles";

interface ViewTabsProps {
  selected: RankingView;
  onSelect: (view: RankingView) => void;
}

const currentMonthName = new Date().toLocaleDateString("en-US", {
  month: "long",
});

const VIEWS: { value: RankingView; label: string }[] = [
  { value: "past-30-days", label: "Past 30 Days" },
  { value: "current-month", label: currentMonthName },
  { value: "all-time", label: "All Time" },
];

export default function ViewTabs({ selected, onSelect }: ViewTabsProps) {
  return (
    <div className="scrollbar-hide inline-flex max-w-full overflow-x-auto border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
      {VIEWS.map((v) => (
        <button
          key={v.value}
          onClick={() => onSelect(v.value)}
          aria-pressed={selected === v.value}
          className={tabClass(selected === v.value)}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}
