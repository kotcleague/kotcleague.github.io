import { ArrowRight, CalendarDays, Trophy } from "lucide-react";
import { useState } from "react";
import Card from "@/components/Card";
import LeaderboardTable from "@/components/LeaderboardTable";
import LeaderboardPageShell from "@/components/LeaderboardPageShell";
import MonthlyPrizes from "@/components/MonthlyPrizes";
import PageContent from "@/components/PageContent";
import PageHeader from "@/components/PageHeader";
import RegistrationLink from "@/components/RegistrationLink";
import SectionHeading from "@/components/SectionHeading";
import ViewTabs from "@/components/ViewTabs";
import { eventRoute, ROUTES } from "@/config/site";
import { formatEventDate, formatLeagueDate } from "@/lib/format";
import type {
  PastEvent,
  RankingView,
  UpcomingEvent,
} from "@/types/leaderboard";

function UpcomingEventCard({ event }: { event?: UpcomingEvent }) {
  return (
    <Card className="border-l-4 border-l-blue p-4">
      <div className="flex items-start gap-3">
        <span className="border border-blue/20 bg-blue/10 p-2.5 text-blue dark:border-blue/40 dark:bg-blue/20 dark:text-blue-300">
          <CalendarDays className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
            Next event
          </p>
          <h3 className="mt-1 text-lg font-bold">
            {event ? formatEventDate(event.date) : "To be announced"}
          </h3>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
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
    </Card>
  );
}

function LatestResultsCard({ event }: { event?: PastEvent }) {
  const winner = event?.podium.find((player) => player.place === 1);

  return (
    <Card className="border-l-4 border-l-gold p-4">
      <div className="flex items-start gap-3">
        <span className="border border-amber-300 bg-amber-100 p-2.5 text-amber-700 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
          <Trophy className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
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
      <div className="mt-4">
        <a
          href={event ? eventRoute(event.id) : ROUTES.schedule}
          className="inline-flex items-center gap-1 py-2 text-sm font-semibold text-blue hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue dark:text-blue-300"
        >
          {event ? "View full results" : "View past events"}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </Card>
  );
}

function byDateAscending<T extends { date: string }>(left: T, right: T) {
  return left.date.localeCompare(right.date);
}

export default function LeaderboardPage() {
  const [selectedView, setSelectedView] = useState<RankingView>("past-30-days");

  return (
    <LeaderboardPageShell
      errorTitle="Failed to load leaderboard"
      header={
        <PageHeader eyebrow="King of the Court">League Rankings</PageHeader>
      }
      loadingLabel="Loading leaderboard"
    >
      {(data) => (
        <PageContent>
          <MonthlyPrizes compact />

          <div className="pb-5">
            <ViewTabs selected={selectedView} onSelect={setSelectedView} />
          </div>

          <LeaderboardTable players={data.views[selectedView]} />

          <section className="mt-10" aria-labelledby="league-updates-heading">
            <SectionHeading
              eyebrow="Around the league"
              id="league-updates-heading"
            >
              Events and results
            </SectionHeading>
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
        </PageContent>
      )}
    </LeaderboardPageShell>
  );
}
