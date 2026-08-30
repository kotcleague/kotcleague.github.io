import {
  CalendarCheck,
  ChartNoAxesCombined,
  ChevronDown,
  UserPlus,
} from "lucide-react";

const PLATFORMS = [
  {
    name: "CourtReserve",
    description:
      "Handles court scheduling and reservations for each league night.",
    icon: CalendarCheck,
  },
  {
    name: "Game Maker",
    description:
      "Handles KOTC standings and score tracking throughout the league.",
    icon: ChartNoAxesCombined,
  },
] as const;

export default function JoinLeague() {
  return (
    <section aria-labelledby="join-league-heading">
      <details className="group overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <summary className="flex cursor-pointer list-none items-start gap-3 p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue [&::-webkit-details-marker]:hidden sm:items-center">
          <span className="rounded-lg bg-blue/10 p-2.5 text-blue dark:bg-blue/20 dark:text-blue-300">
            <UserPlus className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h2
              id="join-league-heading"
              className="text-base font-bold tracking-tight sm:text-lg"
            >
              Join the League
            </h2>
            <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
              Register below through CourtReserve or Game Maker. You only need
              to sign up once, and we’ll add you to the matching event on the
              other platform.
            </p>
          </div>
          <ChevronDown
            className="mt-2 h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180 sm:mt-0 dark:text-slate-500"
            aria-hidden="true"
          />
        </summary>

        <div className="border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            What each platform does
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {PLATFORMS.map(({ name, description, icon: Icon }) => (
              <div key={name} className="flex items-start gap-3">
                <Icon
                  className="mt-0.5 h-4 w-4 shrink-0 text-blue dark:text-blue-300"
                  aria-hidden="true"
                />
                <div>
                  <h3 className="text-sm font-bold">{name}</h3>
                  <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </details>
    </section>
  );
}
