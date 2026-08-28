import { ArrowRight, CalendarDays, Trophy } from "lucide-react";
import { useState } from "react";
import { ErrorState, LoadingState } from "@/components/DataStates";
import Footer from "@/components/Footer";
import LeaderboardTable from "@/components/LeaderboardTable";
import MonthlyPrizes from "@/components/MonthlyPrizes";
import PageHeader from "@/components/PageHeader";
import RegistrationLink from "@/components/RegistrationLink";
import ViewTabs from "@/components/ViewTabs";
import { eventRoute, ROUTES } from "@/config/site";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { formatEventDate, formatLeagueDate } from "@/lib/format";
import type {
  PastEvent,
  RankingView,
  UpcomingEvent,
} from "@/types/leaderboard";

function UpcomingEventCard({ event }: { event?: UpcomingEvent }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start gap-3">
        <span className="rounded-lg bg-blue/10 p-2.5 text-blue dark:bg-blue/20 dark:text-blue-300">
          <CalendarDays className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Next event
          </p>
          <h3 className="mt-1 text-lg font-bold">
            {event ? formatEventDate(event.date) : "To be announced"}
          </h3>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        {event?.courtReserveUrl && (
          <RegistrationLink href={event.courtReserveUrl} compact>
            Court Reserve
          </RegistrationLink>
        )}
        {event?.gameMakerUrl && (
          <RegistrationLink href={event.gameMakerUrl} compact>
            Game Maker
          </RegistrationLink>
        )}
        {!event && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Check the schedule for future league nights.
          </p>
        )}
        <a
          href={ROUTES.schedule}
          className="inline-flex items-center gap-1 px-1 py-2 text-sm font-semibold text-blue hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue dark:text-blue-300"
        >
          Full schedule
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

function LatestResultsCard({ event }: { event?: PastEvent }) {
  const winner = event?.podium.find((player) => player.place === 1);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start gap-3">
        <span className="rounded-lg bg-amber-100 p-2.5 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
          <Trophy className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Latest results
          </p>
          <h3 className="mt-1 text-lg font-bold">
            {event ? formatLeagueDate(event.date) : "No results posted"}
          </h3>
          {winner && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-ink dark:text-white">
                {winner.name}
              </span>{" "}
              took first place.
            </p>
          )}
        </div>
      </div>
      <div className="mt-5">
        <a
          href={event ? eventRoute(event.id) : ROUTES.schedule}
          className="inline-flex items-center gap-1 py-2 text-sm font-semibold text-blue hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue dark:text-blue-300"
        >
          {event ? "View full results" : "View past events"}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

function byDateAscending<T extends { date: string }>(left: T, right: T) {
  return left.date.localeCompare(right.date);
}

export default function LeaderboardPage() {
  const [selectedView, setSelectedView] =
    useState<RankingView>("current-month");
  const { data, loading, error } = useLeaderboard();

  return (
    <main>
      <PageHeader eyebrow="King of the Court">League Rankings</PageHeader>
      <section>
        {loading && <LoadingState label="Loading leaderboard" />}
        {error && (
          <ErrorState title="Failed to load leaderboard" message={error} />
        )}
        {data && (
          <>
            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
              <MonthlyPrizes compact />

              <div className="pb-7">
                <ViewTabs selected={selectedView} onSelect={setSelectedView} />
              </div>

              <LeaderboardTable players={data.views[selectedView]} />

              <section
                className="mt-14"
                aria-labelledby="league-updates-heading"
              >
                <div className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue dark:text-blue-300">
                    Around the league
                  </p>
                  <h2
                    id="league-updates-heading"
                    className="mt-2 text-2xl font-bold tracking-tight"
                  >
                    Events and results
                  </h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <UpcomingEventCard
                    event={[...data.events.upcoming].sort(byDateAscending)[0]}
                  />
                  <LatestResultsCard
                    event={
                      [...data.events.past].sort(byDateAscending)[
                        data.events.past.length - 1
                      ]
                    }
                  />
                </div>
              </section>

            </div>
            <Footer scrapedAt={data.scrapedAt} />
          </>
        )}
      </section>
    </main>
  );
}
