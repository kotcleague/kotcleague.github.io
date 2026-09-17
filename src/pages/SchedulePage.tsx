import { ChevronRight } from "lucide-react";
import DateBadge from "@/components/DateBadge";
import EmptyState from "@/components/EmptyState";
import EditorialLinkCard from "@/components/EditorialLinkCard";
import EventDateBadge from "@/components/EventDateBadge";
import LeaderboardPageShell from "@/components/LeaderboardPageShell";
import PageContent from "@/components/PageContent";
import PageHeader from "@/components/PageHeader";
import PageTabs from "@/components/PageTabs";
import PodiumList from "@/components/PodiumList";
import PodiumShowcase from "@/components/PodiumShowcase";
import RegistrationLink from "@/components/RegistrationLink";
import SectionHeading from "@/components/SectionHeading";
import StatGrid from "@/components/StatGrid";
import { eventRoute, monthRoute, ROUTES } from "@/config/site";
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
  const hasRegistration = event.courtReserveUrl || event.gameMakerUrl;

  return (
    <article className="grid grid-cols-[5.25rem_1fr] overflow-hidden rounded-sm border border-slate-200 bg-white shadow-[0_1px_0_rgba(8,27,42,0.04)] transition-colors hover:border-blue/40 sm:grid-cols-[6rem_1fr_auto] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue/60">
      <EventDateBadge date={event.date} />
      <div className="flex min-w-0 flex-col justify-center px-4 py-4 sm:px-5">
        <p className={META_LABEL_ACCENT}>Upcoming league night</p>
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
          <span className="rounded-sm border border-slate-300 px-3 py-1.5 text-sm font-semibold uppercase tracking-wide text-slate-400 dark:border-slate-700 dark:text-slate-500">
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
  return (
    <EditorialLinkCard
      href={eventRoute(event.id)}
      className="grid grid-cols-[5.25rem_1fr] overflow-hidden p-0 sm:grid-cols-[6rem_1fr] lg:grid-cols-[6rem_minmax(15rem,1fr)_minmax(18rem,1.15fr)]"
    >
      <EventDateBadge date={event.date} />
      <div className="min-w-0 px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className={`${META_LABEL_ACCENT} truncate`}>
              Completed league night
            </p>
            <h3 className="mt-0.5 truncate text-lg font-bold">
              King of the Court
            </h3>
          </div>
          <span className="hidden shrink-0 font-display text-sm font-bold tabular-nums text-blue sm:inline-block dark:text-blue-300">
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
      <div className="col-span-2 flex min-w-0 items-center gap-4 border-t border-slate-100 px-4 py-3 sm:px-5 lg:col-span-1 lg:border-l lg:border-t-0 dark:border-slate-800">
        <div className="min-w-0 flex-1">
          <p className={`${META_LABEL_MUTED} mb-2`}>Event podium</p>
          <PodiumList podium={event.podium} playerProfiles={playerProfiles} />
        </div>
        <ChevronRight
          className="hidden h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-blue lg:block dark:text-slate-600"
          aria-hidden="true"
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
  const [monthName, year] = month.label.split(" ");

  return (
    <EditorialLinkCard
      href={monthRoute(month.id)}
      className="grid grid-cols-[5.25rem_1fr] overflow-hidden p-0 sm:grid-cols-[6rem_1fr] lg:grid-cols-[6rem_minmax(15rem,1fr)_minmax(18rem,1.15fr)]"
    >
      <DateBadge
        bottom={year}
        dateTime={month.id}
        top="Archive"
        value={monthName.slice(0, 3)}
        valueClassName="text-3xl uppercase"
      />
      <div className="min-w-0 px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className={`${META_LABEL_ACCENT} truncate`}>Completed month</p>
            <h3 className="mt-0.5 truncate text-lg font-bold">{month.label}</h3>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>{countLabel(month.eventCount, "event")}</span>
          <span>{countLabel(month.playerCount, "player")}</span>
        </div>
      </div>
      <div className="col-span-2 flex min-w-0 items-center gap-4 border-t border-slate-100 px-4 py-3 sm:px-5 lg:col-span-1 lg:border-l lg:border-t-0 dark:border-slate-800">
        <div className="min-w-0 flex-1">
          <p className={`${META_LABEL_MUTED} mb-2`}>Monthly podium</p>
          <PodiumList podium={month.podium} playerProfiles={playerProfiles} />
        </div>
        <ChevronRight
          className="hidden h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-blue lg:block dark:text-slate-600"
          aria-hidden="true"
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
        <div className="space-y-3">
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
      <div className="space-y-12">
        <PodiumShowcase
          entries={month.podium}
          id="monthly-podium"
          playerProfiles={playerProfiles}
          title="Top players"
        />
        <section aria-labelledby="month-events">
          <SectionHeading
            id="month-events"
            eyebrow={`${month.eventCount} league ${
              month.eventCount === 1 ? "night" : "nights"
            }`}
          >
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
                eyebrow="Past month"
                footer={
                  month && (
                    <StatGrid
                      className="border-b-0 pb-0"
                      columns={2}
                      compact
                      items={[
                        { label: "Events", value: month.eventCount },
                        { label: "Players", value: month.playerCount },
                      ]}
                    />
                  )
                }
              >
                {month?.label ?? "Month not found"}
              </PageHeader>
            );
          }
        ) : (
          <PageHeader
            eyebrow="King of the Court"
            description="Register for the next league night or revisit past results."
          >
            Schedule
          </PageHeader>
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
