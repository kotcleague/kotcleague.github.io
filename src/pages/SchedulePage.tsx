import { ChevronRight, Gamepad2, Users } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import JoinLeague from "@/components/JoinLeague";
import LeaderboardPageShell from "@/components/LeaderboardPageShell";
import PageContent from "@/components/PageContent";
import PageHeader from "@/components/PageHeader";
import RegistrationLink from "@/components/RegistrationLink";
import SectionHeading from "@/components/SectionHeading";
import { eventRoute } from "@/config/site";
import { formatEventDate } from "@/lib/format";
import type { PastEvent, UpcomingEvent } from "@/types/leaderboard";

function UpcomingEventRow({ event }: { event: UpcomingEvent }) {
  const hasRegistration = event.courtReserveUrl || event.gameMakerUrl;

  return (
    <article className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          League night
        </p>
        <h3 className="mt-0.5 text-base font-bold sm:text-lg">
          {formatEventDate(event.date)}
        </h3>
      </div>
      {hasRegistration && (
        <div className="flex flex-wrap gap-2">
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
        </div>
      )}
      {!hasRegistration && (
        <span className="text-sm text-slate-400 dark:text-slate-500">
          Registration coming soon
        </span>
      )}
    </article>
  );
}

function Podium({ event }: { event: PastEvent }) {
  function placeStyle(place: number) {
    if (place === 1) return "bg-gold/25 text-amber-800 dark:text-gold";
    if (place === 2) {
      return "bg-silver/50 text-slate-700 dark:bg-silver/20 dark:text-silver";
    }
    return "bg-bronze/20 text-amber-900 dark:bg-bronze/25 dark:text-orange-300";
  }

  return (
    <ol className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-100 pt-4 dark:border-slate-800">
      {event.podium.map((player) => (
        <li key={player.place} className="flex items-center gap-2 text-sm">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-bold ${placeStyle(player.place)}`}
          >
            {player.place}
            {player.place === 1 ? "st" : player.place === 2 ? "nd" : "rd"}
          </span>
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
      className="group block rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-blue/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue/60 sm:p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-bold sm:text-xl">
          {formatEventDate(event.date)}
        </h3>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-blue/10 px-3 py-1.5 text-xs font-bold text-blue dark:bg-blue/20 dark:text-blue-300">
            {event.maxPointsEarnable.toLocaleString()} point event
          </span>
          <ChevronRight
            className="h-5 w-5 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-blue dark:text-slate-600"
            aria-hidden="true"
          />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
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
  return (
    <LeaderboardPageShell
      errorTitle="Failed to load schedule"
      header={
        <PageHeader
          eyebrow="King of the Court"
          description="Join an upcoming league night or revisit complete results from past events."
        >
          Schedule
        </PageHeader>
      }
      loadingLabel="Loading schedule"
    >
      {(data) => (
        <PageContent>
          <JoinLeague />
          <div className="mt-8 space-y-10">
            <section aria-labelledby="upcoming-events">
              <SectionHeading id="upcoming-events">
                Upcoming events
              </SectionHeading>
              {data.events.upcoming.length > 0 ? (
                <div className="divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
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
        </PageContent>
      )}
    </LeaderboardPageShell>
  );
}
