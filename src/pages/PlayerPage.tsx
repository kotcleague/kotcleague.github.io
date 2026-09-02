import BackLink from "@/components/BackLink";
import { ErrorState } from "@/components/DataStates";
import EditorialLinkCard from "@/components/EditorialLinkCard";
import {
  EditorialTableBody,
  EditorialTableHead,
  EditorialTableRow,
} from "@/components/EditorialTable";
import EmptyState from "@/components/EmptyState";
import Eyebrow from "@/components/Eyebrow";
import LeaderboardPageShell from "@/components/LeaderboardPageShell";
import PageContent from "@/components/PageContent";
import PerformanceMetrics from "@/components/PerformanceMetrics";
import PlacementBadge from "@/components/PlacementBadge";
import PlayerAvatar from "@/components/PlayerAvatar";
import RegistrationLink from "@/components/RegistrationLink";
import SectionHeading from "@/components/SectionHeading";
import StatGrid from "@/components/StatGrid";
import TableShell from "@/components/TableShell";
import { documentTitleForRoute, eventRoute, ROUTES } from "@/config/site";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import {
  formatInteger,
  formatLeagueDate,
  formatPercent,
  formatPointsForAgainst,
  formatRecord,
  formatSignedPercent,
} from "@/lib/format";
import type {
  EventResult,
  LeaderboardData,
  PastEvent,
  Player,
} from "@/types/leaderboard";

interface HistoryEntry {
  event: PastEvent;
  result: EventResult;
}

function HistoryCard({ entry }: { entry: HistoryEntry }) {
  const { event, result } = entry;

  return (
    <EditorialLinkCard href={eventRoute(event.id)}>
      <div className="flex items-center gap-3">
        <PlacementBadge place={result.place} />
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold">{formatLeagueDate(event.date)}</h3>
          <p className="font-display text-sm font-semibold uppercase tracking-wide text-blue dark:text-blue-300">
            {formatInteger(result.points)} league points
          </p>
        </div>
        <span className="font-display text-lg font-bold tabular-nums">
          {formatRecord(result.wins, result.losses)}
        </span>
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
        <PerformanceMetrics
          compactLabels
          stats={result}
          metrics={["winRate", "pointsForAgainst", "pointDifferential"]}
        />
      </dl>
    </EditorialLinkCard>
  );
}

function HistoryTable({ history }: { history: HistoryEntry[] }) {
  return (
    <>
      <div className="space-y-3 md:hidden">
        {history.map((entry) => (
          <HistoryCard key={entry.event.id} entry={entry} />
        ))}
      </div>
      <TableShell className="hidden md:block">
        <table className="w-full">
          <EditorialTableHead>
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Place</th>
              <th className="px-4 py-3 text-right">League pts</th>
              <th className="px-4 py-3 text-right">Record</th>
              <th className="px-4 py-3 text-right">Win %</th>
              <th className="px-4 py-3 text-right">PF / PA</th>
              <th className="px-4 py-3 text-right">Diff</th>
            </tr>
          </EditorialTableHead>
          <EditorialTableBody>
            {history.map(({ event, result }) => (
              <EditorialTableRow key={event.id}>
                <td className="px-4 py-3 font-semibold">
                  <a
                    href={eventRoute(event.id)}
                    className="text-blue hover:underline dark:text-blue-300"
                  >
                    {formatLeagueDate(event.date, true)}
                  </a>
                </td>
                <td className="px-4 py-3">
                  <PlacementBadge place={result.place} />
                </td>
                <td className="font-display px-4 py-3 text-right text-lg font-bold tabular-nums text-blue dark:text-blue-300">
                  {formatInteger(result.points)}
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

function PlayerContent({
  currentMonthRank,
  player,
  history,
}: {
  currentMonthRank: number | null;
  player: Player;
  history: HistoryEntry[];
}) {
  return (
    <>
      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
          <Eyebrow size="hero">Player profile</Eyebrow>
          <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center">
            <PlayerAvatar
              name={player.name}
              photoUrl={player.photoUrl}
              size="xl"
              className="ring-1 ring-slate-200 dark:ring-slate-700"
            />
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-4xl font-bold uppercase leading-none tracking-tight sm:text-5xl">
                {player.name}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="font-display inline-flex items-center justify-center rounded-sm px-4 py-2 text-2xl font-bold tabular-nums text-blue dark:text-blue-300">
                  #{player.rank}
                </span>
                <span className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Past 30-day rank
                </span>
              </div>
              {player.gameMakerProfileUrl && (
                <div className="mt-4">
                  <RegistrationLink href={player.gameMakerProfileUrl} compact>
                    Game Maker Profile
                  </RegistrationLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <PageContent className="space-y-10">
        <BackLink href={ROUTES.rankings}>Back to rankings</BackLink>
        <StatGrid
          items={[
            { label: "Past 30-day rank", value: `#${player.rank}` },
            {
              label: "Current month rank",
              value:
                currentMonthRank === null ? "Unranked" : `#${currentMonthRank}`,
            },
            { label: "League points", value: formatInteger(player.points) },
            { label: "Events", value: player.events },
            {
              label: "Record",
              value: formatRecord(player.wins, player.losses),
            },
            { label: "Win rate", value: formatPercent(player.winRate) },
            {
              label: "Points for / against",
              value: formatPointsForAgainst(
                player.pointsEarned,
                player.pointsAgainst
              ),
            },
            {
              label: "Point differential",
              value: formatSignedPercent(player.pointDifferential),
            },
          ]}
        />
        <section aria-labelledby="event-history">
          <SectionHeading id="event-history">Event history</SectionHeading>
          {history.length > 0 ? (
            <HistoryTable history={history} />
          ) : (
            <EmptyState className="py-14">
              <p className="font-semibold">
                No event history is available yet.
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                This player has rankings data but no published nightly results.
              </p>
            </EmptyState>
          )}
        </section>
      </PageContent>
    </>
  );
}

function LoadedPlayerPage({
  data,
  playerId,
}: {
  data: LeaderboardData;
  playerId: string;
}) {
  const player = data.views["past-30-days"].find(
    (item) => item.id === playerId
  );
  const currentMonthRank =
    data.views["current-month"].find((item) => item.id === playerId)?.rank ??
    null;
  const history = data.events.past.flatMap((event) => {
    const result = event.results.find((item) => item.playerId === playerId);
    return result ? [{ event, result }] : [];
  });

  useDocumentTitle(
    player
      ? `${player.name} | Paddle Up Pickleball`
      : documentTitleForRoute({ page: "rankings" })
  );

  if (!player) {
    return (
      <ErrorState
        actionHref={ROUTES.rankings}
        actionLabel="Back to rankings"
        title="No recent ranking"
        message="This player does not have a published ranking from the past 30 days."
      />
    );
  }

  return (
    <PlayerContent
      currentMonthRank={currentMonthRank}
      player={player}
      history={history}
    />
  );
}

export default function PlayerPage({ playerId }: { playerId: string }) {
  return (
    <LeaderboardPageShell
      errorTitle="Failed to load player profile"
      loadingLabel="Loading player profile"
    >
      {(data) => <LoadedPlayerPage data={data} playerId={playerId} />}
    </LeaderboardPageShell>
  );
}
