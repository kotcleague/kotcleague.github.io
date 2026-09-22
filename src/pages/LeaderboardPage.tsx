import { ArrowRight } from "lucide-react";
import { useState } from "react";
import ActionLink from "@/components/ActionLink";
import EventCardDetails from "@/components/EventCardDetails";
import EventDateBadge from "@/components/EventDateBadge";
import LeaderboardTable from "@/components/LeaderboardTable";
import LeaderboardPageShell from "@/components/LeaderboardPageShell";
import PageContent from "@/components/PageContent";
import PageHeader from "@/components/PageHeader";
import PlayerAvatar from "@/components/PlayerAvatar";
import RegistrationLink from "@/components/RegistrationLink";
import RegistrationSummary from "@/components/RegistrationSummary";
import SectionHeading from "@/components/SectionHeading";
import ViewTabs from "@/components/ViewTabs";
import { eventAssignmentsRoute, eventRoute, ROUTES } from "@/config/site";
import { buildPlayerProfileIndex, type PlayerProfile } from "@/lib/players";
import { actionClass, META_LABEL_ACCENT } from "@/lib/styles";
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
          <div className="mt-4 flex flex-col gap-3">
            <div className="grid gap-1 sm:flex sm:flex-wrap sm:items-center sm:gap-2">
              {event.courtReserveUrl && (
                <RegistrationLink href={event.courtReserveUrl} compact>
                  Register
                </RegistrationLink>
              )}
              {event.gameMakerUrl && (
                <RegistrationLink href={event.gameMakerUrl} compact>
                  Game Maker
                </RegistrationLink>
              )}
              {event.registeredPlayerIds.length > 0 && (
                <ActionLink
                  href={eventAssignmentsRoute(event.id)}
                  size="sm"
                  variant="secondary"
                >
                  Initial assignments
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </ActionLink>
              )}
            </div>
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
      {(data) => {
        const playerProfiles = buildPlayerProfileIndex(data);

        return (
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
                    setVisiblePlayerCount((count) => count + PLAYERS_PER_PAGE)
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
              <div className="grid overflow-hidden border border-slate-200 bg-white lg:grid-cols-2 dark:border-scoreboard dark:bg-ink">
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
              <div className="flex flex-col gap-4 border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 dark:border-scoreboard dark:bg-ink">
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
