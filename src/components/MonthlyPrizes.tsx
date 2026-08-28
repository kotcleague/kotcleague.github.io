import clsx from "clsx";
import { ArrowRight, Trophy } from "lucide-react";
import { ROUTES } from "@/config/site";

const PRIZE_PLACES = [
  {
    place: "1st",
    badge: "bg-gold text-amber-950",
  },
  {
    place: "2nd",
    badge: "bg-silver text-slate-950",
  },
  {
    place: "3rd",
    badge: "bg-bronze text-white",
  },
] as const;

interface MonthlyPrizesProps {
  compact?: boolean;
}

export default function MonthlyPrizes({ compact = false }: MonthlyPrizesProps) {
  if (compact) {
    return (
      <aside className="mb-5 flex flex-col gap-2 rounded-lg border border-blue/20 bg-blue/5 px-4 py-3 text-sm dark:border-blue/30 dark:bg-blue/10 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
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
    <section
      id="monthly-prizes"
      className="overflow-hidden rounded-xl border border-blue/20 bg-white shadow-sm dark:border-blue/30 dark:bg-slate-900"
    >
      <div className="border-b border-slate-200 bg-blue/5 p-6 dark:border-slate-800 dark:bg-blue/10 sm:flex sm:items-start sm:gap-5 sm:p-8">
        <span className="mb-4 inline-flex rounded-lg bg-blue p-3 text-white sm:mb-0">
          <Trophy className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="self-center">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">
              Monthly prizes
            </h2>
            <span className="rounded-full bg-blue/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue dark:bg-blue/20 dark:text-blue-300">
              Starting September
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-8 sm:p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            Eligible finishers
          </p>
          <ol
            className="mt-3 flex gap-2"
            aria-label="First, second, and third place"
          >
            {PRIZE_PLACES.map(({ place, badge }) => (
              <li
                key={place}
                className={clsx(
                  "inline-flex h-12 w-12 items-center justify-center rounded-full text-sm font-extrabold shadow-sm ring-4 ring-white dark:ring-slate-900",
                  badge
                )}
              >
                {place}
              </li>
            ))}
          </ol>
        </div>

        <div className="border-t border-slate-200 pt-6 sm:border-l sm:border-t-0 sm:py-1 sm:pl-8 dark:border-slate-800">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue dark:text-blue-300">
            Prize
          </p>
          <h3 className="mt-2 text-xl font-bold tracking-tight text-ink dark:text-white">
            Free entry to every KOTC event the following month
          </h3>
        </div>
      </div>
    </section>
  );
}
