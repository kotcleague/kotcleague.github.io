import { CalendarDays, ChevronRight, Trophy, Users } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import EditorialLinkCard from "@/components/EditorialLinkCard";
import JoinLeague from "@/components/JoinLeague";
import LeaderboardPageShell from "@/components/LeaderboardPageShell";
import PageContent from "@/components/PageContent";
import PageHeader from "@/components/PageHeader";
import PlacementBadge from "@/components/PlacementBadge";
import PlayerAvatar from "@/components/PlayerAvatar";
import RegistrationLink from "@/components/RegistrationLink";
import SectionHeading from "@/components/SectionHeading";
import { eventRoute } from "@/config/site";
import { formatEventDateParts } from "@/lib/format";
import { buildPlayerProfileIndex, type PlayerProfile } from "@/lib/players";
import type { PastEvent, PastMonth, UpcomingEvent } from "@/types/leaderboard";

function countLabel(count: number, singular: string) {
  return `${count} ${singular}${count === 1 ? "" : "s"}`;
}

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
    <ol className="grid gap-2">
      {event.podium.map((player) => (
        <li
          key={player.place}
          className="grid min-w-0 grid-cols-[2rem_2rem_minmax(0,1fr)] items-center gap-2.5"
        >
          <PlacementBadge place={player.place} />
          <PlayerAvatar
            name={player.name}
            photoUrl={playerProfiles.get(player.playerId)?.photoUrl ?? null}
            playerId={player.playerId}
            size="sm"
            className="h-8 w-8 rounded-full"
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
      className="grid grid-cols-[4.75rem_1fr] overflow-hidden rounded-sm border-l-slate-200 p-0 shadow-sm hover:border-blue/40 hover:border-l-blue hover:shadow-md sm:grid-cols-[6rem_1fr] lg:grid-cols-[6rem_minmax(15rem,1fr)_minmax(18rem,1.15fr)] dark:border-l-slate-800"
    >
      <div className="flex flex-col items-center justify-center border-r border-blue/10 bg-blue/[0.055] px-3 py-4 dark:border-blue/20 dark:bg-blue/10">
        <span className="font-display text-xs font-bold uppercase tracking-[0.18em] text-blue dark:text-blue-300">
          {date.month}
        </span>
        <span className="font-display mt-0.5 text-4xl font-bold leading-none tabular-nums text-ink dark:text-white">
          {date.day}
        </span>
      </div>
      <div className="min-w-0 px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-display truncate text-xs font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
              {date.weekday} · League night
            </p>
            <h3 className="mt-0.5 truncate text-lg font-bold">
              King of the Court
            </h3>
          </div>
          <span className="hidden shrink-0 rounded-full bg-blue/10 px-3 py-1.5 font-display text-xs font-bold uppercase tracking-wide text-blue sm:inline-block dark:bg-blue/20 dark:text-blue-300">
            {event.maxPointsEarnable.toLocaleString()} pts
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="font-bold text-blue sm:hidden dark:text-blue-300">
            {event.maxPointsEarnable.toLocaleString()} pts
          </span>
          <span>{countLabel(event.playerCount, "player")}</span>
          <span>{countLabel(event.games, "game")}</span>
          <span>{countLabel(event.courts, "court")}</span>
          <span>{countLabel(event.rounds, "round")}</span>
        </div>
      </div>
      <div className="col-span-2 flex min-w-0 items-center gap-4 border-t border-slate-100 bg-slate-50/60 px-4 py-3 sm:px-5 lg:col-span-1 lg:border-l lg:border-t-0 dark:border-slate-800 dark:bg-slate-950/30">
        <div className="min-w-0 flex-1">
          <p className="mb-2 font-display text-[0.65rem] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
            Event podium
          </p>
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

function MonthPodium({
  month,
  playerProfiles,
}: {
  month: PastMonth;
  playerProfiles: Map<string, PlayerProfile>;
}) {
  return (
    <ol className="grid gap-2">
      {month.podium.map((player) => (
        <li
          key={player.place}
          className="grid min-w-0 grid-cols-[2rem_2rem_minmax(0,1fr)] items-center gap-2.5"
        >
          <PlacementBadge place={player.place} />
          <PlayerAvatar
            name={player.name}
            photoUrl={playerProfiles.get(player.playerId)?.photoUrl ?? null}
            playerId={player.playerId}
            size="sm"
            className="h-8 w-8 rounded-full"
          />
          <span className="min-w-0 truncate text-sm font-semibold">
            {player.name}
          </span>
        </li>
      ))}
    </ol>
  );
}

function PastMonthCard({
  month,
  playerProfiles,
}: {
  month: PastMonth;
  playerProfiles: Map<string, PlayerProfile>;
}) {
  const [monthName, year] = month.label.split(" ");

  return (
    <EditorialLinkCard
      href={`#/schedule/month/${month.id}`}
      className="grid overflow-hidden rounded-sm border-l-slate-200 p-0 shadow-sm hover:border-blue/40 hover:border-l-blue hover:shadow-md sm:grid-cols-[10rem_minmax(0,1fr)_minmax(14rem,0.8fr)_3rem] dark:border-l-slate-800"
    >
      <div className="flex items-center gap-3 border-b border-blue/10 bg-blue/[0.055] px-5 py-4 sm:block sm:border-b-0 sm:border-r dark:border-blue/20 dark:bg-blue/10">
        <CalendarDays
          className="h-5 w-5 text-blue dark:text-blue-300"
          aria-hidden="true"
        />
        <div className="sm:mt-5">
          <h3 className="text-xl font-bold leading-tight">{monthName}</h3>
          <p className="font-display mt-0.5 text-sm font-bold tracking-wide text-slate-500 dark:text-slate-400">
            {year}
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center px-5 py-4">
        <p className="font-display text-[0.65rem] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
          Month recap
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold dark:bg-slate-800">
            <CalendarDays className="h-4 w-4 text-blue dark:text-blue-300" />
            {countLabel(month.eventCount, "event")}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold dark:bg-slate-800">
            <Users className="h-4 w-4 text-blue dark:text-blue-300" />
            {countLabel(month.playerCount, "player")}
          </span>
        </div>
      </div>
      <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:border-l sm:border-t-0 dark:border-slate-800 dark:bg-slate-950/30">
        <p className="mb-2 font-display text-[0.65rem] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
          Monthly podium
        </p>
        <MonthPodium month={month} playerProfiles={playerProfiles} />
      </div>
      <div className="hidden items-center justify-center sm:flex">
        <ChevronRight
          className="h-5 w-5 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-blue dark:text-slate-600"
          aria-hidden="true"
        />
      </div>
    </EditorialLinkCard>
  );
}

function MonthRecap({
  month,
  playerProfiles,
}: {
  month: PastMonth;
  playerProfiles: Map<string, PlayerProfile>;
}) {
  return (
    <div className="grid overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm lg:grid-cols-[minmax(18rem,0.9fr)_minmax(20rem,1.1fr)] dark:border-slate-800 dark:bg-slate-900">
      <div className="bg-accent-600 p-6 text-white sm:p-8 dark:bg-slate-900">
        <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
          Month recap
        </p>
        <h2 id="past-month" className="mt-2 text-3xl font-bold sm:text-4xl">
          {month.label}
        </h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-blue-100">
          A look back at the month&apos;s league nights and top finishers.
        </p>
        <dl className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-sm border border-white/15 bg-white/10 p-4">
            <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-100">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              Events
            </dt>
            <dd className="font-display mt-2 text-3xl font-bold tabular-nums">
              {month.eventCount}
            </dd>
          </div>
          <div className="rounded-sm border border-white/15 bg-white/10 p-4">
            <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-100">
              <Users className="h-4 w-4" aria-hidden="true" />
              Players
            </dt>
            <dd className="font-display mt-2 text-3xl font-bold tabular-nums">
              {month.playerCount}
            </dd>
          </div>
        </dl>
      </div>
      <div className="flex flex-col justify-center p-6 sm:p-8">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue/10 text-blue dark:bg-blue/20 dark:text-blue-300">
            <Trophy className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-[0.65rem] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
              Monthly leaders
            </p>
            <h3 className="text-lg font-bold">Top players</h3>
          </div>
        </div>
        <MonthPodium month={month} playerProfiles={playerProfiles} />
      </div>
    </div>
  );
}

function ScheduleTabs({ pastMonths }: { pastMonths: boolean }) {
  return (
    <nav
      aria-label="Schedule views"
      className="flex gap-1 border-b border-slate-200 dark:border-slate-800"
    >
      <a
        href="#/schedule"
        className={`border-b-2 px-3 py-2 font-display text-sm font-bold uppercase tracking-wide ${
          !pastMonths
            ? "border-blue text-blue dark:text-blue-300"
            : "border-transparent text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300"
        }`}
        aria-current={!pastMonths ? "page" : undefined}
      >
        Upcoming events
      </a>
      <a
        href="#/schedule/month"
        className={`border-b-2 px-3 py-2 font-display text-sm font-bold uppercase tracking-wide ${
          pastMonths
            ? "border-blue text-blue dark:text-blue-300"
            : "border-transparent text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300"
        }`}
        aria-current={pastMonths ? "page" : undefined}
      >
        Past months
      </a>
    </nav>
  );
}

export default function SchedulePage({
  monthId,
  pastMonths = false,
}: {
  monthId?: string;
  pastMonths?: boolean;
}) {
  return (
    <LeaderboardPageShell
      errorTitle="Failed to load schedule"
      header={<PageHeader eyebrow="King of the Court">Schedule</PageHeader>}
      loadingLabel="Loading schedule"
    >
      {(data) => {
        const playerProfiles = buildPlayerProfileIndex(data);

        return (
          <PageContent>
            <JoinLeague />
            <div className="mt-8 space-y-8">
              <ScheduleTabs pastMonths={pastMonths || Boolean(monthId)} />
              {!pastMonths && !monthId ? (
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
              ) : !monthId ? (
                <section aria-labelledby="past-months">
                  <SectionHeading id="past-months">Past months</SectionHeading>
                  {data.events.months.length > 0 ? (
                    <div className="mt-4 space-y-3">
                      {data.events.months.map((month) => (
                        <PastMonthCard
                          key={month.id}
                          month={month}
                          playerProfiles={playerProfiles}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState className="py-12 text-sm text-slate-500 dark:text-slate-400">
                      No past months have been posted yet.
                    </EmptyState>
                  )}
                </section>
              ) : (
                (() => {
                  const month = data.events.months.find(
                    (item) => item.id === monthId
                  );

                  if (!month) {
                    return (
                      <EmptyState className="py-12 text-sm text-slate-500 dark:text-slate-400">
                        This month is not available.
                      </EmptyState>
                    );
                  }

                  const events = month.eventIds
                    .map((eventId) =>
                      data.events.past.find((event) => event.id === eventId)
                    )
                    .filter((event): event is PastEvent => event !== undefined);

                  return (
                    <section aria-labelledby="past-month">
                      <div className="space-y-10">
                        <MonthRecap
                          month={month}
                          playerProfiles={playerProfiles}
                        />
                        <div>
                          <SectionHeading
                            id="month-events"
                            eyebrow={`${month.eventCount} league ${
                              month.eventCount === 1 ? "night" : "nights"
                            }`}
                          >
                            Events this month
                          </SectionHeading>
                          {events.length > 0 ? (
                            <div className="mt-4 space-y-3">
                              {events.map((event) => (
                                <PastEventCard
                                  key={event.id}
                                  event={event}
                                  playerProfiles={playerProfiles}
                                />
                              ))}
                            </div>
                          ) : (
                            <EmptyState className="py-12 text-sm text-slate-500 dark:text-slate-400">
                              No events have been posted for this month.
                            </EmptyState>
                          )}
                        </div>
                      </div>
                    </section>
                  );
                })()
              )}
            </div>
          </PageContent>
        );
      }}
    </LeaderboardPageShell>
  );
}
