import BackLink from "@/components/BackLink";
import { ErrorState, LoadingState } from "@/components/DataStates";
import EmptyState from "@/components/EmptyState";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PerformanceMetrics from "@/components/PerformanceMetrics";
import PlacementBadge from "@/components/PlacementBadge";
import StatGrid from "@/components/StatGrid";
import { documentTitleForRoute, eventRoute, ROUTES } from "@/config/site";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import {
  formatInteger,
  formatLeagueDate,
  formatPercent,
  formatPointsForAgainst,
  formatRecord,
  formatSignedPercent,
} from "@/lib/format";
import type { EventResult, PastEvent, Player } from "@/types/leaderboard";

interface HistoryEntry {
  event: PastEvent;
  result: EventResult;
}

function HistoryCard({ entry }: { entry: HistoryEntry }) {
  const { event, result } = entry;

  return (
    <a
      href={eventRoute(event.id)}
      className="block rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue/40 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue/60"
    >
      <div className="flex items-center gap-3">
        <PlacementBadge place={result.place} />
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold">{formatLeagueDate(event.date)}</h3>
          <p className="text-xs text-slate-400">
            {formatInteger(result.points)} league points
          </p>
        </div>
        <span className="font-semibold tabular-nums">
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
    </a>
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
      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:block">
        <table className="w-full">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:bg-slate-800/60 dark:text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Place</th>
              <th className="px-4 py-3 text-right">League pts</th>
              <th className="px-4 py-3 text-right">Record</th>
              <th className="px-4 py-3 text-right">Win %</th>
              <th className="px-4 py-3 text-right">PF / PA</th>
              <th className="px-4 py-3 text-right">Diff</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {history.map(({ event, result }) => (
              <tr
                key={event.id}
                className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
              >
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
                <td className="px-4 py-3 text-right font-semibold tabular-nums">
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function PlayerContent({
  player,
  history,
}: {
  player: Player;
  history: HistoryEntry[];
}) {
  return (
    <>
      <PageHeader
        eyebrow="Player profile"
        description={`All-time King of the Court statistics and event-by-event finishes for ${player.name}.`}
      >
        {player.name}
      </PageHeader>
      <div className="mx-auto max-w-5xl space-y-10 px-4 py-8 sm:px-6 sm:py-12">
        <BackLink href={ROUTES.rankings}>Back to rankings</BackLink>
        <StatGrid
          items={[
            { label: "All-time rank", value: `#${player.rank}` },
            { label: "League points", value: formatInteger(player.points) },
            { label: "Events", value: player.events },
            {
              label: "Record",
              value: formatRecord(player.wins, player.losses),
            },
            { label: "Win rate", value: formatPercent(player.winRate) },
            {
              label: "GM points",
              value: formatInteger(player.gameMakerPoints),
            },
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
          <h2
            id="event-history"
            className="mb-5 text-2xl font-bold tracking-tight"
          >
            Event history
          </h2>
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
      </div>
    </>
  );
}

export default function PlayerPage({ playerId }: { playerId: string }) {
  const { data, loading, error } = useLeaderboard();
  const player = data?.views["all-time"].find((item) => item.id === playerId);
  const history =
    data?.events.past.flatMap((event) => {
      const result = event.results.find((item) => item.playerId === playerId);
      return result ? [{ event, result }] : [];
    }) ?? [];

  useDocumentTitle(
    player
      ? `${player.name} | Paddle Up Pickleball`
      : documentTitleForRoute({ page: "rankings" })
  );

  return (
    <main>
      {loading && <LoadingState label="Loading player profile" />}
      {error && (
        <ErrorState title="Failed to load player profile" message={error} />
      )}
      {data && !player && (
        <ErrorState
          actionHref={ROUTES.rankings}
          actionLabel="Back to rankings"
          title="Player not found"
          message="This player may have been removed or the link may be incorrect."
        />
      )}
      {data && player && (
        <>
          <PlayerContent player={player} history={history} />
          <Footer scrapedAt={data.scrapedAt} />
        </>
      )}
    </main>
  );
}
