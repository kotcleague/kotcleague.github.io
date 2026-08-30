import type { RankingView } from "@/types/leaderboard";

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
];

function chip(active: boolean) {
  return `-mb-px cursor-pointer whitespace-nowrap border-b-2 px-1 pb-2 text-sm font-semibold transition-colors ${
    active
      ? "border-blue text-blue dark:border-blue-300 dark:text-blue-300"
      : "border-transparent text-slate-500 hover:text-ink dark:text-slate-400 dark:hover:text-white"
  }`;
}

export default function ViewTabs({ selected, onSelect }: ViewTabsProps) {
  return (
    <div className="scrollbar-hide inline-flex max-w-full gap-6 overflow-x-auto border-b border-slate-200 dark:border-slate-800">
      {VIEWS.map((v) => (
        <button
          key={v.value}
          onClick={() => onSelect(v.value)}
          aria-pressed={selected === v.value}
          className={chip(selected === v.value)}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}
