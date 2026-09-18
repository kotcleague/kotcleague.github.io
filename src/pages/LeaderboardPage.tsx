import { ArrowRight } from "lucide-react";
import { useState } from "react";
import ActionLink from "@/components/ActionLink";
import EventDateBadge from "@/components/EventDateBadge";
import LeaderboardTable from "@/components/LeaderboardTable";
import LeaderboardPageShell from "@/components/LeaderboardPageShell";
import PageContent from "@/components/PageContent";
import PageHeader from "@/components/PageHeader";
import RegistrationLink from "@/components/RegistrationLink";
import RegistrationSummary from "@/components/RegistrationSummary";
import SectionHeading from "@/components/SectionHeading";
import ViewTabs from "@/components/ViewTabs";
import { assignmentRoute, eventRoute, ROUTES } from "@/config/site";
import { formatEventDate, formatLeagueDate } from "@/lib/format";
import {
  actionClass,
  META_LABEL_ACCENT,
  META_LABEL_MUTED,
} from "@/lib/styles";
import type {
  PastEvent,
  RankingView,
  UpcomingEvent,
} from "@/types/leaderboard";

function UpcomingEventCard({ event }: { event?: UpcomingEvent }) {
  return (
    <article className="p-5 sm:p-6">
      <p className={META_LABEL_ACCENT}>Next event</p>
      {event ? (
        <>
          <div className="mt-4 flex overflow-hidden border border-slate-200 dark:border-slate-700">
            <EventDateBadge date={event.date} className="min-w-24" />
            <div className="flex min-w-0 flex-1 flex-col justify-center px-4 py-3">
              <h3 className="text-lg font-bold">
                {formatEventDate(event.date)}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                King of the Court league night
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-2 sm:flex sm:flex-wrap sm:items-center">
            <RegistrationSummary
              available={Boolean(event.courtReserveUrl)}
              count={event.registeredPlayerCount}
            />
            {event.courtReserveUrl && (
              <RegistrationLink href={event.courtReserveUrl} compact>
                Court Reserve
              </RegistrationLink>
            )}
            {event.gameMakerUrl && (
              <RegistrationLink href={event.gameMakerUrl} compact>
                Game Maker
              </RegistrationLink>
            )}
            {event.registeredPlayerIds.length > 0 && (
              <ActionLink
                href={assignmentRoute(event.registeredPlayerIds, [], true)}
                size="sm"
                variant="secondary"
              >
                Initial assignments
              </ActionLink>
            )}
          </div>
        </>
      ) : (
        <div className="mt-4 border-y border-slate-200 py-5 dark:border-slate-800">
          <h3 className="text-lg font-bold">To be announced</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Check the schedule for future league nights.
          </p>
        </div>
      )}
    </article>
  );
}

function LatestResultsCard({ event }: { event?: PastEvent }) {
  const winner = event?.podium.find((player) => player.place === 1);

  return (
    <article className="border-t border-slate-200 p-5 md:border-l md:border-t-0 sm:p-6 dark:border-slate-800">
      <p className={META_LABEL_ACCENT}>Latest results</p>
      {event ? (
        <div className="mt-4 flex overflow-hidden border border-slate-200 dark:border-slate-700">
          <EventDateBadge date={event.date} className="min-w-24" />
          <div className="flex min-w-0 flex-1 flex-col justify-center px-4 py-3">
            <p className={META_LABEL_MUTED}>Event winner</p>
            <h3 className="mt-1 truncate text-lg font-bold">
              {winner?.name ?? "Results posted"}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {formatLeagueDate(event.date)}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4 border-y border-slate-200 py-5 dark:border-slate-800">
          <h3 className="text-lg font-bold">No results posted</h3>
        </div>
      )}
      <div className="mt-4 flex">
        <ActionLink
          href={event ? eventRoute(event.id) : ROUTES.schedule}
          size="sm"
          variant="secondary"
        >
          {event ? "View full results" : "View past events"}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </ActionLink>
      </div>
    </article>
  );
}

function byDateAscending<T extends { date: string }>(left: T, right: T) {
  return left.date.localeCompare(right.date);
}

const PLAYERS_PER_PAGE = 10;

export default function LeaderboardPage() {
  const [selectedView, setSelectedView] = useState<RankingView>("past-30-days");
  const [visiblePlayerCount, setVisiblePlayerCount] =
    useState(PLAYERS_PER_PAGE);

  function selectView(view: RankingView) {
    setSelectedView(view);
    setVisiblePlayerCount(PLAYERS_PER_PAGE);
  }

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
          <div className="pb-5">
            <ViewTabs selected={selectedView} onSelect={selectView} />
          </div>

          <LeaderboardTable
            players={data.views[selectedView].slice(0, visiblePlayerCount)}
          />
          {visiblePlayerCount < data.views[selectedView].length && (
            <div className="mt-5 flex justify-center">
              <button
                type="button"
                className={actionClass({ size: "sm", variant: "secondary" })}
                onClick={() =>
                  setVisiblePlayerCount(
                    (count) => count + PLAYERS_PER_PAGE
                  )
                }
              >
                Show more
              </button>
            </div>
          )}

          <section className="mt-10" aria-labelledby="league-updates-heading">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                eyebrow="Around the league"
                id="league-updates-heading"
              >
                Events and results
              </SectionHeading>
              <ActionLink href={ROUTES.schedule} size="sm" variant="quiet">
                Full schedule
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ActionLink>
            </div>
            <div className="grid overflow-hidden border border-slate-200 bg-white shadow-[0_1px_0_rgba(8,27,42,0.04)] md:grid-cols-2 dark:border-scoreboard dark:bg-ink">
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
