import clsx from "clsx";
import { ArrowRight, Trophy } from "lucide-react";
import { ROUTES } from "@/config/site";
import Eyebrow from "@/components/Eyebrow";

const PRIZE_PLACES = [
  {
    place: "1st",
    label: "First place",
    badge: "bg-gold text-amber-950",
  },
  {
    place: "2nd",
    label: "Second place",
    badge: "bg-silver text-slate-950",
  },
  {
    place: "3rd",
    label: "Third place",
    badge: "bg-bronze text-stone-950",
  },
] as const;

interface MonthlyPrizesProps {
  compact?: boolean;
}

export default function MonthlyPrizes({ compact = false }: MonthlyPrizesProps) {
  if (compact) {
    return (
      <aside className="mb-6 flex flex-col gap-2 border-l-2 border-blue px-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4 dark:border-blue-300">
        <div className="flex items-center gap-2.5">
          <Trophy
            className="h-4 w-4 shrink-0 text-blue dark:text-blue-300"
            aria-hidden="true"
          />
          <p className="leading-5 text-slate-600 dark:text-slate-300">
            <span className="font-bold text-ink dark:text-white">
              Monthly prizes:
            </span>{" "}
            Starting September, the top 3 play the following month free.
          </p>
        </div>
        <a
          href={ROUTES.format}
          className="inline-flex shrink-0 items-center gap-1 rounded-sm pl-6 text-xs font-semibold text-blue hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue sm:pl-0 dark:text-blue-300"
        >
          Details
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </aside>
    );
  }

  return (
    <section id="monthly-prizes">
      <div className="mb-6">
        <Eyebrow>Monthly prizes</Eyebrow>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Finish in the top three. Play next month free.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          Starting September, the monthly leaders earn free entry to every King
          of the Court event the following month.
        </p>
      </div>

      <div className="overflow-hidden rounded-sm border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <ol
          className="grid grid-cols-3 gap-px bg-slate-200 dark:bg-slate-800"
          aria-label="First, second, and third place"
        >
          {PRIZE_PLACES.map(({ place, label, badge }) => (
            <li
              key={place}
              className="flex items-center gap-3 bg-white px-3 py-3 sm:px-5 sm:py-4 dark:bg-slate-900"
            >
              <span
                className={clsx(
                  "font-display inline-flex h-10 min-w-10 shrink-0 items-center justify-center rounded-sm px-1 text-lg font-bold sm:h-11 sm:min-w-11 sm:text-xl",
                  badge
                )}
              >
                {place}
              </span>
              <span className="hidden text-sm font-semibold text-ink sm:block dark:text-white">
                {label}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
