import CourtAssignmentDisplay from "@/components/CourtAssignmentDisplay";
import { ErrorState } from "@/components/DataStates";
import EmptyState from "@/components/EmptyState";
import LeaderboardPageShell from "@/components/LeaderboardPageShell";
import PageContent from "@/components/PageContent";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/SectionHeading";
import StatGrid from "@/components/StatGrid";
import { ROUTES } from "@/config/site";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { buildAssignments } from "@/lib/assignments";
import { formatLeagueDate } from "@/lib/format";
import type { LeaderboardData } from "@/types/leaderboard";

function LoadedUpcomingEventAssignments({
  data,
  eventId,
}: {
  data: LeaderboardData;
  eventId: string;
}) {
  const event = data.events.upcoming.find((item) => item.id === eventId);
  const registeredIds = new Set(event?.registeredPlayerIds ?? []);
  const players = data.seeding.filter((player) => registeredIds.has(player.id));
  const assignmentPlan = buildAssignments(players);

  useDocumentTitle(
    event
      ? `${formatLeagueDate(event.date)} Assignments | KOTC League`
      : "KOTC League | Event Assignments"
  );

  if (!event) {
    return (
      <ErrorState
        actionHref={ROUTES.schedule}
        actionLabel="Back to schedule"
        title="Upcoming event not found"
        message="This event may have been removed or the link may be incorrect."
      />
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Initial court assignments"
        description="Seeding is first determined by past 30 day rankings then by DUPR."
        footer={
          <StatGrid
            className="border-b-0 pb-0"
            columns={2}
            compact
            items={[
              { label: "Players", value: players.length },
              { label: "Courts", value: assignmentPlan.courts.length },
            ]}
          />
        }
      >
        {formatLeagueDate(event.date)}
      </PageHeader>
      <PageContent>
        <section aria-labelledby="event-assignments">
          <SectionHeading id="event-assignments">
            Initial assignments
          </SectionHeading>
          {players.length > 0 ? (
            <CourtAssignmentDisplay plan={assignmentPlan} />
          ) : (
            <EmptyState className="py-14">
              <p className="font-semibold">
                Assignments are not available yet.
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Check back after players have registered for this event.
              </p>
            </EmptyState>
          )}
        </section>
      </PageContent>
    </>
  );
}

export default function UpcomingEventAssignmentsPage({
  eventId,
}: {
  eventId: string;
}) {
  return (
    <LeaderboardPageShell
      errorTitle="Failed to load court assignments"
      loadingLabel="Loading court assignments"
    >
      {(data) => (
        <LoadedUpcomingEventAssignments data={data} eventId={eventId} />
      )}
    </LeaderboardPageShell>
  );
}
