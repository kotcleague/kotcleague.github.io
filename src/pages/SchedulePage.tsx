import { ArrowRight } from "lucide-react";
import ActionLink from "@/components/ActionLink";
import ArchiveWinner from "@/components/ArchiveWinner";
import EmptyState from "@/components/EmptyState";
import EditorialLinkCard from "@/components/EditorialLinkCard";
import EventCardDetails from "@/components/EventCardDetails";
import EventDateBadge from "@/components/EventDateBadge";
import LeaderboardPageShell from "@/components/LeaderboardPageShell";
import PageContent from "@/components/PageContent";
import PageHeader from "@/components/PageHeader";
import PageTabs from "@/components/PageTabs";
import PodiumShowcase from "@/components/PodiumShowcase";
import RegistrationLink from "@/components/RegistrationLink";
import RegistrationSummary from "@/components/RegistrationSummary";
import SectionHeading from "@/components/SectionHeading";
import {
  eventAssignmentsRoute,
  eventRoute,
  monthRoute,
  ROUTES,
} from "@/config/site";
import { buildPlayerProfileIndex, type PlayerProfile } from "@/lib/players";
import { META_LABEL_ACCENT, META_LABEL_MUTED } from "@/lib/styles";
import type {
  LeaderboardData,
  PastEvent,
  PastMonth,
  UpcomingEvent,
} from "@/types/leaderboard";

function countLabel(count: number, singular: string) {
  return `${count} ${singular}${count === 1 ? "" : "s"}`;
}

function UpcomingEventRow({ event }: { event: UpcomingEvent }) {
  const hasRegistration = Boolean(event.courtReserveUrl || event.gameMakerUrl);

  return (
    <article className="grid grid-cols-[5.25rem_1fr] overflow-hidden border border-slate-200 bg-white transition-colors hover:border-blue/40 lg:grid-cols-[6rem_minmax(14rem,1fr)_auto] dark:border-scoreboard dark:bg-ink dark:hover:border-blue/60">
      <EventDateBadge date={event.date} />
      <EventCardDetails
        className="px-4 py-4 sm:px-5"
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
      <div className="col-span-2 flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 px-4 py-3.5 sm:px-5 lg:col-span-1 lg:min-w-[19rem] lg:flex-row lg:items-center lg:justify-end lg:border-l lg:border-t-0 dark:border-slate-800 dark:bg-white/[0.025]">
        {hasRegistration ? (
          <div className="grid w-full gap-1 sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:gap-2">
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
        ) : (
          <span className="border border-slate-300 px-3 py-1.5 text-sm font-semibold uppercase tracking-wide text-slate-400 dark:border-slate-700 dark:text-slate-500">
            Registration coming soon
          </span>
        )}
      </div>
    </article>
  );
}

function PastEventCard({
  event,
  playerProfiles,
}: {
  event: PastEvent;
  playerProfiles: Map<string, PlayerProfile>;
}) {
  const winner = event.podium.find((player) => player.place === 1);

  return (
    <EditorialLinkCard
      href={eventRoute(event.id)}
      className="grid grid-cols-[5.25rem_1fr] overflow-hidden rounded-none p-0 sm:grid-cols-[6rem_1fr] lg:grid-cols-[6rem_minmax(0,1fr)_17rem]"
    >
      <EventDateBadge date={event.date} />
      <div className="min-w-0 px-4 py-4 sm:px-5 sm:py-5">
        <p className={META_LABEL_MUTED}>Completed event</p>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-lg font-bold">King of the Court</h3>
          <span className="font-display text-base font-bold tabular-nums text-blue dark:text-blue-300">
            {event.maxPointsEarnable.toLocaleString()} pts
          </span>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>{countLabel(event.playerCount, "player")}</span>
          <span>{countLabel(event.games, "game")}</span>
          <span>{countLabel(event.courts, "court")}</span>
          <span>{countLabel(event.rounds, "round")}</span>
        </div>
      </div>
      <div className="col-span-2 flex items-center border-t border-slate-100 bg-slate-50/60 px-4 py-3.5 sm:px-5 lg:col-span-1 lg:border-l lg:border-t-0 dark:border-slate-800 dark:bg-white/[0.02]">
        <ArchiveWinner
          label="Event winner"
          player={winner}
          playerProfiles={playerProfiles}
        />
      </div>
    </EditorialLinkCard>
  );
}

function PastMonthCard({
  month,
  playerProfiles,
}: {
  month: PastMonth;
  playerProfiles: Map<string, PlayerProfile>;
}) {
  const champion = month.podium.find((player) => player.place === 1);

  return (
    <EditorialLinkCard
      href={monthRoute(month.id)}
      className="overflow-hidden rounded-none p-0"
    >
      <div className="p-5 sm:p-6">
        <p className={META_LABEL_ACCENT}>Monthly archive</p>
        <div className="mt-2">
          <h3 className="font-display text-3xl font-bold uppercase leading-none">
            {month.label}
          </h3>
        </div>
        <div className="mt-5 grid grid-cols-2 border-y border-slate-100 py-4 dark:border-slate-800">
          <div>
            <p className={META_LABEL_MUTED}>Events</p>
            <p className="font-display mt-1 text-xl font-bold tabular-nums">
              {month.eventCount}
            </p>
          </div>
          <div>
            <p className={META_LABEL_MUTED}>Players</p>
            <p className="font-display mt-1 text-xl font-bold tabular-nums">
              {month.playerCount}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:px-6 dark:border-slate-800 dark:bg-white/[0.02]">
        <ArchiveWinner
          label="Month champion"
          player={champion}
          playerProfiles={playerProfiles}
        />
      </div>
    </EditorialLinkCard>
  );
}

function ScheduleTabs({ pastMonths }: { pastMonths: boolean }) {
  return (
    <PageTabs
      ariaLabel="Schedule views"
      tabs={[
        {
          active: !pastMonths,
          href: "#/schedule",
          label: "Upcoming events",
        },
        {
          active: pastMonths,
          href: ROUTES.pastMonths,
          label: "Past events",
        },
      ]}
    />
  );
}

function UpcomingEventsView({ events }: { events: UpcomingEvent[] }) {
  return (
    <section aria-labelledby="upcoming-events">
      <SectionHeading id="upcoming-events">Upcoming events</SectionHeading>
      {events.length > 0 ? (
        <div className="space-y-3">
          {events.map((event) => (
            <UpcomingEventRow key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <EmptyState className="py-12 text-sm text-slate-500 dark:text-slate-400">
          No upcoming events have been posted yet.
        </EmptyState>
      )}
    </section>
  );
}

function PastMonthsView({
  months,
  playerProfiles,
}: {
  months: PastMonth[];
  playerProfiles: Map<string, PlayerProfile>;
}) {
  return (
    <section aria-labelledby="past-months">
      <SectionHeading id="past-months">Past months</SectionHeading>
      {months.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {months.map((month) => (
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
  );
}

function PastMonthView({
  data,
  monthId,
  playerProfiles,
}: {
  data: LeaderboardData;
  monthId: string;
  playerProfiles: Map<string, PlayerProfile>;
}) {
  const month = data.events.months.find((item) => item.id === monthId);

  if (!month) {
    return (
      <EmptyState className="py-12 text-sm text-slate-500 dark:text-slate-400">
        This month is not available.
      </EmptyState>
    );
  }

  const events = month.eventIds
    .map((eventId) => data.events.past.find((event) => event.id === eventId))
    .filter((event): event is PastEvent => event !== undefined);

  return (
    <section aria-label={`${month.label} results`}>
      <div className="space-y-10">
        <PodiumShowcase
          entries={month.podium}
          id="monthly-podium"
          playerProfiles={playerProfiles}
          title="Top players"
        />
        <section aria-labelledby="month-events">
          <SectionHeading id="month-events" eyebrow="Event archive">
            Events this month
          </SectionHeading>
          {events.length > 0 ? (
            <div className="space-y-3">
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
        </section>
      </div>
    </section>
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
      header={
        monthId ? (
          (data) => {
            const month = data.events.months.find(
              (item) => item.id === monthId
            );

            return (
              <PageHeader
                eyebrow="Monthly archive"
                description={
                  month &&
                  `${countLabel(
                    month.eventCount,
                    "event"
                  )} · ${countLabel(month.playerCount, "player")}`
                }
              >
                {month?.label ?? "Month not found"}
              </PageHeader>
            );
          }
        ) : (
          <PageHeader eyebrow="King of the Court">Schedule</PageHeader>
        )
      }
      loadingLabel="Loading schedule"
    >
      {(data) => {
        const playerProfiles = buildPlayerProfileIndex(data);

        return (
          <PageContent>
            <div className="space-y-8">
              {!monthId && <ScheduleTabs pastMonths={pastMonths} />}
              {monthId ? (
                <PastMonthView
                  data={data}
                  monthId={monthId}
                  playerProfiles={playerProfiles}
                />
              ) : pastMonths ? (
                <PastMonthsView
                  months={data.events.months}
                  playerProfiles={playerProfiles}
                />
              ) : (
                <UpcomingEventsView events={data.events.upcoming} />
              )}
            </div>
          </PageContent>
        );
      }}
    </LeaderboardPageShell>
  );
}
