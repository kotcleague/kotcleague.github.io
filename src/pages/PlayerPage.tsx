import { ChevronRight } from "lucide-react";
import { ErrorState } from "@/components/DataStates";
import EditorialLinkCard from "@/components/EditorialLinkCard";
import {
  EditorialTableBody,
  EditorialTableCell,
  EditorialTableHead,
  EditorialTableHeaderCell,
  EditorialTableRow,
} from "@/components/EditorialTable";
import EmptyState from "@/components/EmptyState";
import Eyebrow from "@/components/Eyebrow";
import LeaderboardPageShell from "@/components/LeaderboardPageShell";
import PageContent from "@/components/PageContent";
import PerformanceMetrics from "@/components/PerformanceMetrics";
import PlacementBadge from "@/components/PlacementBadge";
import PlayerAvatar from "@/components/PlayerAvatar";
import SectionHeading from "@/components/SectionHeading";
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
import { META_LABEL, META_LABEL_MUTED } from "@/lib/styles";
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
          <p className={META_LABEL_MUTED}>League event</p>
          <h3 className="mt-0.5 font-semibold">
            {formatLeagueDate(event.date)}
          </h3>
          <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-blue dark:text-blue-300">
            {formatInteger(result.points)} league points
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-right">
            <span className={META_LABEL_MUTED}>Record</span>
            <span className="font-display block text-lg font-bold tabular-nums">
              {formatRecord(result.wins, result.losses)}
            </span>
          </span>
          <ChevronRight
            className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-blue dark:text-slate-600 dark:group-hover:text-blue-300"
            aria-hidden="true"
          />
        </div>
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
        <table className="w-full min-w-[44rem]">
          <EditorialTableHead>
            <tr>
              <EditorialTableHeaderCell>Date</EditorialTableHeaderCell>
              <EditorialTableHeaderCell>Place</EditorialTableHeaderCell>
              <EditorialTableHeaderCell alignment="right">
                League pts
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
            {history.map(({ event, result }) => (
              <EditorialTableRow key={event.id}>
                <EditorialTableCell className="font-semibold">
                  <a
                    href={eventRoute(event.id)}
                    className="text-blue hover:underline dark:text-blue-300"
                  >
                    {formatLeagueDate(event.date, true)}
                  </a>
                </EditorialTableCell>
                <EditorialTableCell>
                  <PlacementBadge place={result.place} />
                </EditorialTableCell>
                <EditorialTableCell
                  alignment="right"
                  numeric
                  className="font-display text-lg font-bold text-blue dark:text-blue-300"
                >
                  {formatInteger(result.points)}
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

function PlayerContent({
  player,
  history,
}: {
  player: Player;
  history: HistoryEntry[];
}) {
  return (
    <>
      <section className="border-b border-slate-200 bg-white dark:border-scoreboard dark:bg-ink">
        <div className="mx-auto max-w-5xl px-4 pt-6 pb-8 sm:px-6 sm:pt-8 sm:pb-10">
          <div className="grid gap-7 md:grid-cols-[auto_minmax(0,1fr)] md:items-center md:gap-10">
            <PlayerAvatar
              name={player.name}
              photoUrl={player.photoUrl}
              playerId={player.id}
              size="xl"
            />
            <div className="min-w-0 flex-1">
              <Eyebrow size="hero">Player profile</Eyebrow>
              <h1 className="font-display mt-4 text-5xl font-bold uppercase leading-[0.88] tracking-[0.015em] text-ink sm:text-6xl dark:text-white">
                {player.name}
              </h1>
              <div className="mt-5">
                <span className="inline-grid grid-cols-[auto_auto] overflow-hidden border border-slate-200 bg-white dark:border-blue/40 dark:bg-scoreboard">
                  <span className="flex items-center gap-2.5 px-3.5 py-2.5">
                    <span
                      className="h-1.5 w-1.5 bg-blue dark:bg-blue-300"
                      aria-hidden="true"
                    />
                    <span
                      className={`${META_LABEL} text-slate-600 dark:text-slate-300`}
                    >
                      League rank
                    </span>
                  </span>
                  <strong className="font-display flex items-center border-l border-slate-200 bg-blue/[0.06] px-4 py-1.5 text-2xl font-bold tabular-nums text-blue dark:border-blue/30 dark:bg-blue/15 dark:text-blue-200">
                    #{player.rank}
                  </strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-scoreboard text-white">
        <div className="mx-auto grid max-w-5xl grid-cols-2 divide-x divide-y divide-white/10 px-4 sm:grid-cols-4 sm:divide-y-0 sm:px-6">
          {[
            { label: "League points", value: formatInteger(player.points) },
            {
              label: "Record",
              value: formatRecord(player.wins, player.losses),
            },
            { label: "Win rate", value: formatPercent(player.winRate) },
            {
              label: "Point differential",
              value: formatSignedPercent(player.pointDifferential),
            },
          ].map(({ label, value }) => (
            <div key={label} className="px-4 py-5 first:pl-0 sm:py-6">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-blue-200">
                {label}
              </p>
              <p className="font-display mt-1 text-3xl font-bold tabular-nums">
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>
      <PageContent className="pt-8 sm:pt-10">
        <section aria-labelledby="event-history">
          <div className="flex items-end justify-between gap-4">
            <SectionHeading id="event-history" eyebrow="Results">
              Event history
            </SectionHeading>
            {history.length > 0 && (
              <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
                {history.length} {history.length === 1 ? "event" : "events"}
              </p>
            )}
          </div>
          {history.length > 0 ? (
            <HistoryTable history={history} />
          ) : (
            <EmptyState className="py-14">
              <p className="font-semibold">
                No event history is available yet.
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                This player has rankings data but no published results.
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
  const history = data.events.past.flatMap((event) => {
    const result = event.results.find((item) => item.playerId === playerId);
    return result ? [{ event, result }] : [];
  });

  useDocumentTitle(
    player
      ? `${player.name} | KOTC League`
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

  return <PlayerContent player={player} history={history} />;
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
