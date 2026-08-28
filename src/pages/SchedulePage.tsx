import {
  CalendarDays,
  ChevronRight,
  Gamepad2,
  Trophy,
  Users,
} from "lucide-react";
import { ErrorState, LoadingState } from "@/components/DataStates";
import EmptyState from "@/components/EmptyState";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import RegistrationLink from "@/components/RegistrationLink";
import { eventRoute } from "@/config/site";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { formatEventDate } from "@/lib/format";
import type { PastEvent, UpcomingEvent } from "@/types/leaderboard";

function UpcomingEventCard({ event }: { event: UpcomingEvent }) {
  const hasRegistration = event.courtReserveUrl || event.gameMakerUrl;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="flex items-start gap-4">
        <span className="rounded-lg bg-blue/10 p-2.5 text-blue dark:bg-blue/20 dark:text-blue-300">
          <CalendarDays className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Upcoming event
          </p>
          <h3 className="mt-1 text-xl font-bold">
            {formatEventDate(event.date)}
          </h3>
        </div>
      </div>
      {hasRegistration && (
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          {event.courtReserveUrl && (
            <RegistrationLink href={event.courtReserveUrl}>
              Court Reserve
            </RegistrationLink>
          )}
          {event.gameMakerUrl && (
            <RegistrationLink href={event.gameMakerUrl}>
              Game Maker
            </RegistrationLink>
          )}
        </div>
      )}
    </article>
  );
}

function Podium({ event }: { event: PastEvent }) {
  return (
    <ol className="mt-5 grid gap-2 sm:grid-cols-3">
      {event.podium.map((player) => (
        <li
          key={player.place}
          className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800/60"
        >
          <Trophy
            className={
              player.place === 1
                ? "h-4 w-4 text-amber-500"
                : "h-4 w-4 text-slate-400"
            }
            aria-hidden="true"
          />
          <span className="font-semibold">{player.name}</span>
        </li>
      ))}
    </ol>
  );
}

function PastEventCard({ event }: { event: PastEvent }) {
  return (
    <a
      href={eventRoute(event.id)}
      className="group block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue/60 sm:p-6"
    >
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Completed event
          </p>
          <h3 className="mt-1 text-xl font-bold">
            {formatEventDate(event.date)}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-blue/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-blue dark:bg-blue/20 dark:text-blue-300">
            {event.maxPointsEarnable.toLocaleString()} Point Event
          </span>
          <ChevronRight
            className="h-5 w-5 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-blue dark:text-slate-600"
            aria-hidden="true"
          />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <Users className="h-4 w-4" aria-hidden="true" />
          {event.playerCount} players
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Gamepad2 className="h-4 w-4" aria-hidden="true" />
          {event.games} games
        </span>
        <span>{event.courts} courts</span>
        <span>{event.rounds} rounds</span>
      </div>
      <Podium event={event} />
    </a>
  );
}

export default function SchedulePage() {
  const { data, loading, error } = useLeaderboard();

  return (
    <main>
      <PageHeader
        eyebrow="King of the Court"
        description="Register for the next league night or revisit complete results from past events."
      >
        Schedule
      </PageHeader>
      {loading && <LoadingState label="Loading schedule" />}
      {error && <ErrorState title="Failed to load schedule" message={error} />}
      {data && (
        <>
          <div className="mx-auto max-w-5xl space-y-14 px-4 py-10 sm:px-6 sm:py-14">
            <section aria-labelledby="upcoming-events">
              <h2
                id="upcoming-events"
                className="mb-5 text-2xl font-bold tracking-tight"
              >
                Upcoming events
              </h2>
              {data.events.upcoming.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {data.events.upcoming.map((event) => (
                    <UpcomingEventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <EmptyState className="py-12 text-sm text-slate-500 dark:text-slate-400">
                  No upcoming events have been posted yet.
                </EmptyState>
              )}
            </section>

            <section aria-labelledby="past-events">
              <h2
                id="past-events"
                className="mb-5 text-2xl font-bold tracking-tight"
              >
                Past events
              </h2>
              {data.events.past.length > 0 ? (
                <div className="space-y-4">
                  {data.events.past.map((event) => (
                    <PastEventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <EmptyState className="py-12 text-sm text-slate-500 dark:text-slate-400">
                  No past events have been posted yet.
                </EmptyState>
              )}
            </section>
          </div>
          <Footer scrapedAt={data.scrapedAt} />
        </>
      )}
    </main>
  );
}
