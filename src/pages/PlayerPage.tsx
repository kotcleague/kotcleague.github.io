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
import MedalSummary from "@/components/MedalSummary";
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
import { META_LABEL } from "@/lib/styles";
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
          <p className="text-sm font-semibold uppercase tracking-wide text-blue dark:text-blue-300">
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
      <section className="border-b border-slate-200 bg-white dark:border-scoreboard dark:bg-ink">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
          <Eyebrow size="hero">Player profile</Eyebrow>
          <div className="mt-5 flex flex-col gap-7 sm:flex-row sm:items-center sm:gap-9">
            <PlayerAvatar
              name={player.name}
              photoUrl={player.photoUrl}
              playerId={player.id}
              size="xl"
              className="ring-1 ring-slate-200 dark:ring-slate-700"
            />
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-4xl font-bold uppercase leading-none tracking-[0.015em] text-ink sm:text-5xl dark:text-white">
                {player.name}
              </h1>
              <div className="mt-6 grid max-w-xl grid-cols-2 overflow-hidden border-y border-slate-200 sm:inline-grid sm:grid-cols-[auto_auto_auto] dark:border-slate-700">
                <div className="px-4 py-3">
                  <p
                    className={`${META_LABEL} text-slate-500 dark:text-slate-400`}
                  >
                    League Rank
                  </p>
                  <p className="font-display mt-1 text-3xl font-bold tabular-nums text-ink dark:text-white">
                    #{player.rank}
                  </p>
                </div>
                <div className="border-l border-slate-200 px-4 py-3 dark:border-slate-700">
                  <p
                    className={`${META_LABEL} text-slate-500 dark:text-slate-400`}
                  >
                    League points
                  </p>
                  <p className="font-display mt-1 text-3xl font-bold tabular-nums text-blue dark:text-blue-300">
                    {formatInteger(player.points)}
                  </p>
                </div>
                <div className="col-span-2 border-t border-slate-200 sm:col-span-1 sm:border-l sm:border-t-0 dark:border-slate-700">
                  <MedalSummary
                    bronze={player.bronze}
                    gold={player.gold}
                    silver={player.silver}
                  />
                </div>
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
          <StatGrid
            className="mt-7 border-b-0 pb-0"
            columns={4}
            compact
            items={[
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
        </div>
      </section>
      <PageContent>
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
