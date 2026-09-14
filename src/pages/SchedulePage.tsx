import { ChevronRight } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import EditorialLinkCard from "@/components/EditorialLinkCard";
import JoinLeague from "@/components/JoinLeague";
import LeaderboardPageShell from "@/components/LeaderboardPageShell";
import PageContent from "@/components/PageContent";
import PageHeader from "@/components/PageHeader";
import PlayerAvatar from "@/components/PlayerAvatar";
import RegistrationLink from "@/components/RegistrationLink";
import SectionHeading from "@/components/SectionHeading";
import { eventRoute } from "@/config/site";
import { formatEventDateParts } from "@/lib/format";
import { buildPlayerProfileIndex, type PlayerProfile } from "@/lib/players";
import type { PastEvent, UpcomingEvent } from "@/types/leaderboard";

function UpcomingEventRow({ event }: { event: UpcomingEvent }) {
  const hasRegistration = event.courtReserveUrl || event.gameMakerUrl;
  const date = formatEventDateParts(event.date);

  return (
    <article className="grid grid-cols-[4.25rem_1fr] border-l-2 border-transparent transition-colors hover:border-blue hover:bg-blue/[0.035] sm:grid-cols-[5.25rem_1fr_auto] dark:hover:bg-blue/[0.08]">
      <div className="flex flex-col items-center justify-center border-r border-slate-200 bg-slate-50 px-3 py-4 dark:border-slate-700 dark:bg-slate-950/60">
        <span className="font-display text-sm font-bold uppercase tracking-[0.16em] text-blue dark:text-blue-300">
          {date.month}
        </span>
        <span className="font-display text-4xl font-bold leading-none tabular-nums text-ink dark:text-white">
          {date.day}
        </span>
      </div>
      <div className="flex min-w-0 flex-col justify-center px-4 py-4 sm:px-5">
        <p className="font-display text-sm font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
          {date.weekday} · League night
        </p>
        <h3 className="mt-0.5 text-lg font-bold">King of the Court</h3>
      </div>
      <div className="col-span-2 flex flex-wrap items-center gap-2 border-t border-slate-100 px-4 py-3 sm:col-span-1 sm:border-0 sm:px-5 dark:border-slate-800">
        {hasRegistration ? (
          <>
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
          </>
        ) : (
          <span className="font-display border border-slate-300 px-3 py-1.5 text-sm font-bold uppercase tracking-wide text-slate-400 dark:border-slate-700 dark:text-slate-500">
            Registration coming soon
          </span>
        )}
      </div>
    </article>
  );
}

function Podium({
  event,
  playerProfiles,
}: {
  event: PastEvent;
  playerProfiles: Map<string, PlayerProfile>;
}) {
  return (
    <ol className="grid gap-1.5">
      {event.podium.map((player) => (
        <li
          key={player.place}
          className="grid min-w-0 grid-cols-[2rem_2rem_minmax(0,1fr)] items-center gap-2"
        >
          <span className="font-display text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            {player.place}
            {player.place === 1 ? "st" : player.place === 2 ? "nd" : "rd"}
          </span>
          <PlayerAvatar
            name={player.name}
            photoUrl={playerProfiles.get(player.playerId)?.photoUrl ?? null}
            playerId={player.playerId}
            size="sm"
            className="h-7 w-7 rounded-full"
          />
          <span className="min-w-0 truncate text-sm font-semibold">
            {player.name}
          </span>
        </li>
      ))}
    </ol>
  );
}

function PastEventCard({
  event,
  playerProfiles,
}: {
  event: PastEvent;
  playerProfiles: Map<string, PlayerProfile>;
}) {
  const date = formatEventDateParts(event.date);

  return (
    <EditorialLinkCard
      href={eventRoute(event.id)}
      className="grid grid-cols-[4.25rem_1fr] rounded-none border-x-0 border-t-0 border-l-2 border-l-transparent p-0 hover:border-l-blue hover:bg-blue/[0.035] sm:grid-cols-[5.25rem_1fr] lg:grid-cols-[5.25rem_minmax(14rem,1fr)_minmax(20rem,1.5fr)] dark:hover:bg-blue/[0.08]"
    >
      <div className="flex flex-col items-center justify-center border-r border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-700 dark:bg-slate-950/60">
        <span className="font-display text-sm font-bold uppercase tracking-[0.16em] text-blue dark:text-blue-300">
          {date.month}
        </span>
        <span className="font-display text-3xl font-bold leading-none tabular-nums text-ink dark:text-white">
          {date.day}
        </span>
      </div>
      <div className="min-w-0 px-4 py-3 sm:px-5 sm:py-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-display truncate text-xs font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
              {date.weekday} · League night
            </p>
            <h3 className="mt-0.5 truncate text-base font-bold sm:text-lg">
              King of the Court
            </h3>
          </div>
          <span className="hidden shrink-0 font-display rounded-sm bg-blue/10 px-2.5 py-1.5 text-xs font-bold uppercase tracking-wide text-blue lg:inline-block dark:bg-blue/20 dark:text-blue-300">
            {event.maxPointsEarnable.toLocaleString()} pts
          </span>
        </div>
        <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
          {event.playerCount} players · {event.games} games · {event.courts}{" "}
          courts · {event.rounds} rounds
        </p>
      </div>
      <div className="col-span-2 flex min-w-0 items-center gap-3 border-t border-slate-100 px-4 py-2.5 sm:px-5 lg:col-span-1 lg:border-t-0 dark:border-slate-800">
        <div className="min-w-0 flex-1">
        <Podium event={event} playerProfiles={playerProfiles} />
        </div>
        <ChevronRight
          className="hidden h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-blue lg:block dark:text-slate-600"
          aria-hidden="true"
        />
      </div>
    </EditorialLinkCard>
  );
}

export default function SchedulePage() {
  return (
    <LeaderboardPageShell
      errorTitle="Failed to load schedule"
      header={
        <PageHeader
          eyebrow="King of the Court"
        >
          Schedule
        </PageHeader>
      }
      loadingLabel="Loading schedule"
    >
      {(data) => {
        const playerProfiles = buildPlayerProfileIndex(data);

        return (
          <PageContent>
            <JoinLeague />
            <div className="mt-8 space-y-10">
              <section aria-labelledby="upcoming-events">
                <SectionHeading id="upcoming-events">
                  Upcoming events
                </SectionHeading>
                {data.events.upcoming.length > 0 ? (
                  <div className="divide-y divide-slate-200 overflow-hidden rounded-sm border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
                    {data.events.upcoming.map((event) => (
                      <UpcomingEventRow key={event.id} event={event} />
                    ))}
                  </div>
                ) : (
                  <EmptyState className="py-12 text-sm text-slate-500 dark:text-slate-400">
                    No upcoming events have been posted yet.
                  </EmptyState>
                )}
              </section>

              <section aria-labelledby="past-events">
                <SectionHeading id="past-events">Past events</SectionHeading>
                {data.events.past.length > 0 ? (
                  <div className="divide-y divide-slate-200 overflow-hidden rounded-sm border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
                    {data.events.past.map((event) => (
                      <PastEventCard
                        key={event.id}
                        event={event}
                        playerProfiles={playerProfiles}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState className="py-12 text-sm text-slate-500 dark:text-slate-400">
                    No past events have been posted yet.
                  </EmptyState>
                )}
              </section>
            </div>
          </PageContent>
        );
      }}
    </LeaderboardPageShell>
  );
}
