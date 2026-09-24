import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import Card from "@/components/Card";
import { ErrorState } from "@/components/DataStates";
import EmptyState from "@/components/EmptyState";
import {
  EditorialTableBody,
  EditorialTableCell,
  EditorialTableHead,
  EditorialTableHeaderCell,
  EditorialTableRow,
} from "@/components/EditorialTable";
import LeaderboardPageShell from "@/components/LeaderboardPageShell";
import PageContent from "@/components/PageContent";
import PageHeader from "@/components/PageHeader";
import PerformanceMetrics from "@/components/PerformanceMetrics";
import PlacementBadge from "@/components/PlacementBadge";
import PlayerIdentityLink from "@/components/PlayerIdentityLink";
import PodiumShowcase from "@/components/PodiumShowcase";
import SectionHeading from "@/components/SectionHeading";
import TableShell from "@/components/TableShell";
import WatchLivestreamLink from "@/components/WatchLivestreamLink";
import { documentTitleForRoute, ROUTES } from "@/config/site";
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
  const [expanded, setExpanded] = useState(false);
  const detailsId = useId();

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex min-h-14 items-center gap-2 px-3 py-2 sm:gap-3 sm:px-4">
        <PlacementBadge place={result.place} />
        <div className="min-w-0 flex-1">
          <PlayerIdentityLink
            className="gap-2 sm:gap-3"
            name={result.name}
            nameClassName="font-semibold"
            photoUrl={photoUrl}
            playerId={result.playerId}
          />
        </div>
        <div className="shrink-0 text-right">
          <span className="block font-display text-base font-bold tabular-nums text-blue dark:text-blue-300">
            {formatInteger(result.points)} pts
          </span>
          <span className="mt-0.5 block text-[0.65rem] font-medium tabular-nums text-slate-400 dark:text-slate-500">
            {formatRecord(result.wins, result.losses)}
          </span>
        </div>
        <button
          type="button"
          className="flex h-8 w-8 shrink-0 items-center justify-center text-slate-400 transition-colors hover:bg-slate-100 hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-blue-300"
          aria-controls={detailsId}
          aria-expanded={expanded}
          aria-label={`${expanded ? "Hide" : "Show"} stats for ${result.name}`}
          onClick={() => setExpanded((value) => !value)}
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </button>
      </div>
      {expanded && (
        <dl
          id={detailsId}
          className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-100 px-3 py-3 text-sm dark:border-slate-800"
        >
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
      )}
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
      <div className="space-y-1.5 md:hidden">
        {results.map((result) => (
          <ResultCard
            key={result.playerId}
            result={result}
            photoUrl={playerProfiles.get(result.playerId)?.photoUrl ?? null}
          />
        ))}
      </div>
      <TableShell className="hidden md:block">
        <table className="w-full min-w-[56rem]">
          <EditorialTableHead>
            <tr>
              <EditorialTableHeaderCell>Place</EditorialTableHeaderCell>
              <EditorialTableHeaderCell>Player</EditorialTableHeaderCell>
              <EditorialTableHeaderCell alignment="right">
                League pts
              </EditorialTableHeaderCell>
              <EditorialTableHeaderCell alignment="right">
                GM pts
              </EditorialTableHeaderCell>
              <EditorialTableHeaderCell alignment="right">
                Record
              </EditorialTableHeaderCell>
              <EditorialTableHeaderCell alignment="right">
                Win %
              </EditorialTableHeaderCell>
              <EditorialTableHeaderCell alignment="right">
                PF / PA
              </EditorialTableHeaderCell>
              <EditorialTableHeaderCell alignment="right">
                Diff
              </EditorialTableHeaderCell>
            </tr>
          </EditorialTableHead>
          <EditorialTableBody>
            {results.map((result) => (
              <EditorialTableRow key={result.playerId}>
                <EditorialTableCell>
                  <PlacementBadge place={result.place} />
                </EditorialTableCell>
                <EditorialTableCell className="font-semibold">
                  <PlayerIdentityLink
                    name={result.name}
                    photoUrl={
                      playerProfiles.get(result.playerId)?.photoUrl ?? null
                    }
                    playerId={result.playerId}
                  />
                </EditorialTableCell>
                <EditorialTableCell
                  alignment="right"
                  numeric
                  className="font-display text-lg font-bold text-blue dark:text-blue-300"
                >
                  {formatInteger(result.points)}
                </EditorialTableCell>
                <EditorialTableCell alignment="right" numeric>
                  {formatInteger(result.gameMakerPoints)}
                </EditorialTableCell>
                <EditorialTableCell alignment="right" numeric>
                  {formatRecord(result.wins, result.losses)}
                </EditorialTableCell>
                <EditorialTableCell alignment="right" numeric>
                  {formatPercent(result.winRate)}
                </EditorialTableCell>
                <EditorialTableCell alignment="right" numeric>
                  {formatPointsForAgainst(
                    result.pointsEarned,
                    result.pointsAgainst
                  )}
                </EditorialTableCell>
                <EditorialTableCell
                  alignment="right"
                  numeric
                  className="font-semibold"
                >
                  {formatSignedPercent(result.pointDifferential)}
                </EditorialTableCell>
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
        description={`${event.playerCount} ${
          event.playerCount === 1 ? "player" : "players"
        } · ${event.games} ${event.games === 1 ? "game" : "games"} · ${
          event.rounds
        } ${event.rounds === 1 ? "round" : "rounds"} · ${formatInteger(
          event.maxPointsEarnable
        )} max points`}
        footer={
          event.youtubeUrl && <WatchLivestreamLink href={event.youtubeUrl} />
        }
      >
        {formatLeagueDate(event.date)}
      </PageHeader>
      <PageContent>
        <div className="space-y-10">
          <PodiumShowcase
            entries={event.results}
            id="event-podium"
            playerProfiles={playerProfiles}
            renderSummary={(result) => `${formatInteger(result.points)} pts`}
            renderMeta={(result) =>
              `${formatRecord(result.wins, result.losses)} · ${formatPercent(
                result.winRate
              )}`
            }
            title="Top finishers"
          />
          <section aria-labelledby="event-standings">
            <SectionHeading id="event-standings">
              Final standings
            </SectionHeading>
            {event.results.length > 0 ? (
              <ResultsTable
                results={event.results}
                playerProfiles={playerProfiles}
              />
            ) : (
              <EmptyState className="py-14">
                <p className="font-semibold">
                  Results have not been posted yet.
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Check back after the event data is published.
                </p>
              </EmptyState>
            )}
          </section>
        </div>
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
      ? `${formatLeagueDate(event.date)} Results | KOTC League`
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
