import BackLink from "@/components/BackLink";
import Card from "@/components/Card";
import { ErrorState } from "@/components/DataStates";
import EmptyState from "@/components/EmptyState";
import {
  EditorialTableBody,
  EditorialTableHead,
  EditorialTableRow,
} from "@/components/EditorialTable";
import LeaderboardPageShell from "@/components/LeaderboardPageShell";
import PageContent from "@/components/PageContent";
import PageHeader from "@/components/PageHeader";
import PerformanceMetrics from "@/components/PerformanceMetrics";
import PlacementBadge from "@/components/PlacementBadge";
import PlayerAvatar from "@/components/PlayerAvatar";
import SectionHeading from "@/components/SectionHeading";
import StatGrid from "@/components/StatGrid";
import TableShell from "@/components/TableShell";
import { documentTitleForRoute, playerRoute, ROUTES } from "@/config/site";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import {
  formatInteger,
  formatLeagueDate,
  formatPercent,
  formatPointsForAgainst,
  formatRecord,
  formatSignedPercent,
} from "@/lib/format";
import { buildPlayerProfileIndex, type PlayerProfile } from "@/lib/players";
import type {
  EventResult,
  LeaderboardData,
  PastEvent,
} from "@/types/leaderboard";

function ResultCard({
  result,
  photoUrl,
}: {
  result: EventResult;
  photoUrl: string | null;
}) {
  return (
    <Card className="border-l-4 border-l-slate-300 p-3 shadow-none dark:border-l-slate-700 sm:p-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <PlacementBadge place={result.place} />
        <a
          href={playerRoute(result.playerId)}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-sm font-semibold text-inherit hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue sm:gap-3"
        >
          <PlayerAvatar name={result.name} photoUrl={photoUrl} size="sm" />
          <span className="min-w-0 truncate">{result.name}</span>
        </a>
        <span className="font-display text-lg font-bold tabular-nums text-blue dark:text-blue-300">
          {formatInteger(result.points)} pts
        </span>
      </div>
      <dl className="mt-2 grid grid-cols-3 gap-x-2 gap-y-1 border-t border-slate-100 pt-2 text-sm dark:border-slate-800 sm:mt-4 sm:grid-cols-2 sm:gap-3 sm:pt-4">
        <PerformanceMetrics
          compactLabels
          stats={result}
          metrics={[
            "record",
            "winRate",
            "gameMakerPoints",
            "pointsForAgainst",
            "pointDifferential",
          ]}
        />
      </dl>
    </Card>
  );
}

function ResultsTable({
  results,
  playerProfiles,
}: {
  results: EventResult[];
  playerProfiles: Map<string, PlayerProfile>;
}) {
  return (
    <>
      <div className="space-y-2 md:hidden sm:space-y-3">
        {results.map((result) => (
          <ResultCard
            key={result.playerId}
            result={result}
            photoUrl={playerProfiles.get(result.playerId)?.photoUrl ?? null}
          />
        ))}
      </div>
      <TableShell className="hidden md:block">
        <table className="w-full">
          <EditorialTableHead>
            <tr>
              <th className="px-4 py-3 text-left">Place</th>
              <th className="px-4 py-3 text-left">Player</th>
              <th className="px-4 py-3 text-right">League pts</th>
              <th className="px-4 py-3 text-right">GM pts</th>
              <th className="px-4 py-3 text-right">Record</th>
              <th className="px-4 py-3 text-right">Win %</th>
              <th className="px-4 py-3 text-right">PF / PA</th>
              <th className="px-4 py-3 text-right">Diff</th>
            </tr>
          </EditorialTableHead>
          <EditorialTableBody>
            {results.map((result) => (
              <EditorialTableRow key={result.playerId}>
                <td className="px-4 py-3">
                  <PlacementBadge place={result.place} />
                </td>
                <td className="px-4 py-3 font-semibold">
                  <a
                    href={playerRoute(result.playerId)}
                    className="flex items-center gap-3 rounded-sm text-inherit hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
                  >
                    <PlayerAvatar
                      name={result.name}
                      photoUrl={
                        playerProfiles.get(result.playerId)?.photoUrl ?? null
                      }
                      size="sm"
                    />
                    {result.name}
                  </a>
                </td>
                <td className="font-display px-4 py-3 text-right text-lg font-bold tabular-nums text-blue dark:text-blue-300">
                  {formatInteger(result.points)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {formatInteger(result.gameMakerPoints)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {formatRecord(result.wins, result.losses)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {formatPercent(result.winRate)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {formatPointsForAgainst(
                    result.pointsEarned,
                    result.pointsAgainst
                  )}
                </td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums">
                  {formatSignedPercent(result.pointDifferential)}
                </td>
              </EditorialTableRow>
            ))}
          </EditorialTableBody>
        </table>
      </TableShell>
    </>
  );
}

function EventContent({
  event,
  playerProfiles,
}: {
  event: PastEvent;
  playerProfiles: Map<string, PlayerProfile>;
}) {
  return (
    <>
      <PageHeader
        eyebrow="Event results"
        description={`${event.playerCount} players competed across ${event.courts} courts and ${event.rounds} rounds.`}
      >
        {formatLeagueDate(event.date)}
      </PageHeader>
      <PageContent className="space-y-10">
        <BackLink href={ROUTES.schedule}>Back to schedule</BackLink>
        <StatGrid
          items={[
            { label: "Players", value: event.playerCount },
            { label: "Games", value: event.games },
            { label: "Rounds", value: event.rounds },
            {
              label: "Max points",
              value: formatInteger(event.maxPointsEarnable),
            },
          ]}
        />
        <section aria-labelledby="event-standings">
          <SectionHeading id="event-standings">Final standings</SectionHeading>
          {event.results.length > 0 ? (
            <ResultsTable
              results={event.results}
              playerProfiles={playerProfiles}
            />
          ) : (
            <EmptyState className="py-14">
              <p className="font-semibold">Results have not been posted yet.</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Check back after the event data is published.
              </p>
            </EmptyState>
          )}
        </section>
      </PageContent>
    </>
  );
}

function LoadedEventPage({
  data,
  eventId,
}: {
  data: LeaderboardData;
  eventId: string;
}) {
  const event = data.events.past.find((item) => item.id === eventId);
  const playerProfiles = buildPlayerProfileIndex(data);

  useDocumentTitle(
    event
      ? `${formatLeagueDate(event.date)} Results | Paddle Up Pickleball`
      : documentTitleForRoute({ page: "schedule" })
  );

  if (!event) {
    return (
      <ErrorState
        actionHref={ROUTES.schedule}
        actionLabel="Back to schedule"
        title="Event not found"
        message="This event may have been removed or the link may be incorrect."
      />
    );
  }

  return <EventContent event={event} playerProfiles={playerProfiles} />;
}

export default function EventPage({ eventId }: { eventId: string }) {
  return (
    <LeaderboardPageShell
      errorTitle="Failed to load event results"
      loadingLabel="Loading event results"
    >
      {(data) => <LoadedEventPage data={data} eventId={eventId} />}
    </LeaderboardPageShell>
  );
}
