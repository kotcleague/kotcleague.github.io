import { ArrowDown, ArrowRight } from "lucide-react";
import { useState } from "react";
import ActionLink from "@/components/ActionLink";
import Card from "@/components/Card";
import EventCardDetails from "@/components/EventCardDetails";
import EventDateBadge from "@/components/EventDateBadge";
import EventRegistrationActions from "@/components/EventRegistrationActions";
import LeaderboardTable from "@/components/LeaderboardTable";
import LeaderboardPageShell from "@/components/LeaderboardPageShell";
import PageContent from "@/components/PageContent";
import PageHeader from "@/components/PageHeader";
import PlayerAvatar from "@/components/PlayerAvatar";
import RegistrationSummary from "@/components/RegistrationSummary";
import SectionHeading from "@/components/SectionHeading";
import ViewTabs, { RANKING_VIEW_LABELS } from "@/components/ViewTabs";
import WatchLivestreamLink from "@/components/WatchLivestreamLink";
import { eventRoute, ROUTES } from "@/config/site";
import { buildPlayerProfileIndex, type PlayerProfile } from "@/lib/players";
import { formatInteger } from "@/lib/format";
import {
  actionClass,
  META_LABEL_ACCENT,
  PANEL_ACCENT,
  PANEL_SURFACE,
} from "@/lib/styles";
import type {
  PastEvent,
  RankingView,
  UpcomingEvent,
} from "@/types/leaderboard";

function UpcomingEventCard({ event }: { event?: UpcomingEvent }) {
  const hasRegistration = Boolean(
    event?.courtReserveUrl || event?.gameMakerUrl
  );

  return (
    <article className="min-w-0 p-4 sm:p-6">
      <p className={META_LABEL_ACCENT}>Next event</p>
      {event ? (
        <>
          <div className="mt-4 flex overflow-hidden border border-slate-200 bg-slate-50/60 dark:border-slate-700 dark:bg-white/[0.025]">
            <EventDateBadge
              compact
              date={event.date}
              className="min-w-16 px-2"
            />
            <EventCardDetails
              className="px-3 py-3 sm:px-4"
              date={event.date}
              label="Upcoming event"
            >
              <h3 className="min-w-0">
                {hasRegistration ? (
                  <RegistrationSummary
                    available
                    count={event.registeredPlayerCount}
                  />
                ) : (
                  <span className="text-lg font-bold">King of the Court</span>
                )}
              </h3>
            </EventCardDetails>
          </div>
          <div className="mt-4">
            <EventRegistrationActions event={event} />
          </div>
        </>
      ) : (
        <div className="mt-4 border-y border-slate-200 py-5 dark:border-slate-800">
          <h3 className="text-lg font-bold">To be announced</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Check the schedule for future events.
          </p>
        </div>
      )}
    </article>
  );
}

function LatestResultsCard({
  event,
  playerProfiles,
}: {
  event?: PastEvent;
  playerProfiles: Map<string, PlayerProfile>;
}) {
  const winner = event?.podium.find((player) => player.place === 1);

  return (
    <article className="min-w-0 border-t border-slate-200 p-4 sm:p-6 lg:border-l lg:border-t-0 dark:border-slate-800">
      <p className={META_LABEL_ACCENT}>Latest results</p>
      {event ? (
        <div className="mt-4 flex overflow-hidden border border-slate-200 bg-slate-50/60 dark:border-slate-700 dark:bg-white/[0.025]">
          <EventDateBadge compact date={event.date} className="min-w-16 px-2" />
          <EventCardDetails
            className="px-3 py-3 sm:px-4"
            date={event.date}
            label="Event winner"
          >
            {winner && (
              <PlayerAvatar
                className="h-8 w-8 sm:h-9 sm:w-9"
                name={winner.name}
                photoUrl={playerProfiles.get(winner.playerId)?.photoUrl ?? null}
                playerId={winner.playerId}
                size="sm"
              />
            )}
            <h3
              className="min-w-0 flex-1 truncate whitespace-nowrap text-lg font-bold"
              title={winner?.name ?? "Results posted"}
            >
              {winner?.name ?? "Results posted"}
            </h3>
          </EventCardDetails>
        </div>
      ) : (
        <div className="mt-4 border-y border-slate-200 py-5 dark:border-slate-800">
          <h3 className="text-lg font-bold">No results posted</h3>
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <ActionLink
          href={event ? eventRoute(event.id) : ROUTES.schedule}
          size="sm"
          variant="secondary"
        >
          {event ? "View full results" : "View past events"}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </ActionLink>
        {event?.youtubeUrl && <WatchLivestreamLink href={event.youtubeUrl} />}
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
        <PageHeader
          actions={<ViewTabs selected={selectedView} onSelect={selectView} />}
          eyebrow="King of the Court"
        >
          Rankings
        </PageHeader>
      }
      loadingLabel="Loading leaderboard"
    >
      {(data) => {
        const playerProfiles = buildPlayerProfileIndex(data);
        const players = data.views[selectedView];
        const visiblePlayers = players.slice(0, visiblePlayerCount);
        const viewLabel = RANKING_VIEW_LABELS[selectedView];

        return (
          <PageContent>
            <Card
              className={`overflow-hidden ${PANEL_ACCENT}`}
              aria-labelledby="standings-heading"
            >
              <SectionHeading
                className="mb-0 p-4 sm:p-6"
                eyebrow="League standings"
                id="standings-heading"
              >
                {viewLabel}
              </SectionHeading>
              <LeaderboardTable label={viewLabel} players={visiblePlayers} />
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-4 sm:px-6 dark:border-scoreboard">
                <p
                  className="text-xs tabular-nums text-slate-500 dark:text-slate-400"
                  role="status"
                >
                  Showing{" "}
                  <span className="font-semibold text-ink dark:text-slate-200">
                    {formatInteger(visiblePlayers.length)}
                  </span>{" "}
                  of {formatInteger(players.length)} players
                </p>
                {visiblePlayerCount < players.length && (
                  <button
                    type="button"
                    className={actionClass({
                      size: "sm",
                      variant: "secondary",
                    })}
                    onClick={() =>
                      setVisiblePlayerCount((count) => count + PLAYERS_PER_PAGE)
                    }
                  >
                    Show more
                    <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </Card>

            <section className="mt-10" aria-labelledby="league-updates-heading">
              <SectionHeading
                eyebrow="Around the league"
                id="league-updates-heading"
                action={
                  <ActionLink href={ROUTES.schedule} size="sm" variant="quiet">
                    Full schedule
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </ActionLink>
                }
              >
                Events and results
              </SectionHeading>
              <div
                className={`grid overflow-hidden lg:grid-cols-2 ${PANEL_SURFACE}`}
              >
                <UpcomingEventCard
                  event={[...data.events.upcoming].sort(byDateAscending)[0]}
                />
                <LatestResultsCard
                  event={
                    [...data.events.past].sort(byDateAscending)[
                      data.events.past.length - 1
                    ]
                  }
                  playerProfiles={playerProfiles}
                />
              </div>
            </section>

            <section className="mt-10" aria-labelledby="deals-promo-heading">
              <div
                className={`flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 ${PANEL_SURFACE}`}
              >
                <div>
                  <p className={META_LABEL_ACCENT}>Player perks</p>
                  <h2
                    id="deals-promo-heading"
                    className="mt-1 text-lg font-bold text-ink dark:text-white"
                  >
                    Pickleball gear deals
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Save 10–15% and help support future league events.
                  </p>
                </div>
                <ActionLink
                  href={ROUTES.deals}
                  size="sm"
                  variant="secondary"
                  className="self-start sm:self-auto"
                >
                  View deals
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </ActionLink>
              </div>
            </section>
          </PageContent>
        );
      }}
    </LeaderboardPageShell>
  );
}
