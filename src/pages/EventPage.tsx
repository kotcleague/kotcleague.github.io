import BackLink from "@/components/BackLink";
import { ErrorState, LoadingState } from "@/components/DataStates";
import EmptyState from "@/components/EmptyState";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PerformanceMetrics from "@/components/PerformanceMetrics";
import PlacementBadge from "@/components/PlacementBadge";
import StatGrid from "@/components/StatGrid";
import { documentTitleForRoute, playerRoute, ROUTES } from "@/config/site";
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
import type { EventResult, PastEvent } from "@/types/leaderboard";

function ResultCard({ result }: { result: EventResult }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <PlacementBadge place={result.place} />
        <a
          href={playerRoute(result.playerId)}
          className="min-w-0 flex-1 truncate rounded-sm font-semibold text-inherit hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
        >
          {result.name}
        </a>
        <span className="font-bold tabular-nums">
          {formatInteger(result.points)} pts
        </span>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
        <PerformanceMetrics
          stats={result}
          metrics={[
            "record",
            "winRate",
            "gameMakerPoints",
            "pointsForAgainst",
            "pointDifferential",
          ]}
        />
        <div>
          <dt className="text-xs text-slate-400">Courts</dt>
          <dd className="mt-0.5 font-semibold tabular-nums">{result.courts}</dd>
        </div>
      </dl>
    </article>
  );
}

function ResultsTable({ results }: { results: EventResult[] }) {
  return (
    <>
      <div className="space-y-3 md:hidden">
        {results.map((result) => (
          <ResultCard key={result.playerId} result={result} />
        ))}
      </div>
      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:block">
        <table className="w-full">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:bg-slate-800/60 dark:text-slate-500">
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
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {results.map((result) => (
              <tr
                key={result.playerId}
                className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
              >
                <td className="px-4 py-3">
                  <PlacementBadge place={result.place} />
                </td>
                <td className="px-4 py-3 font-semibold">
                  <a
                    href={playerRoute(result.playerId)}
                    className="rounded-sm text-inherit hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
                  >
                    {result.name}
                  </a>
                </td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums">
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function EventContent({ event }: { event: PastEvent }) {
  return (
    <>
      <PageHeader
        eyebrow="Event results"
        description={`${event.playerCount} players competed across ${event.courts} courts and ${event.rounds} rounds.`}
      >
        {formatLeagueDate(event.date)}
      </PageHeader>
      <div className="mx-auto max-w-5xl space-y-10 px-4 py-8 sm:px-6 sm:py-12">
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
          <h2
            id="event-standings"
            className="mb-5 text-2xl font-bold tracking-tight"
          >
            Final standings
          </h2>
          {event.results.length > 0 ? (
            <ResultsTable results={event.results} />
          ) : (
            <EmptyState className="py-14">
              <p className="font-semibold">Results have not been posted yet.</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Check back after the event data is published.
              </p>
            </EmptyState>
          )}
        </section>
      </div>
    </>
  );
}

export default function EventPage({ eventId }: { eventId: string }) {
  const { data, loading, error } = useLeaderboard();
  const event = data?.events.past.find((item) => item.id === eventId);

  useDocumentTitle(
    event
      ? `${formatLeagueDate(event.date)} Results | Paddle Up Pickleball`
      : documentTitleForRoute({ page: "schedule" })
  );

  return (
    <main>
      {loading && <LoadingState label="Loading event results" />}
      {error && (
        <ErrorState title="Failed to load event results" message={error} />
      )}
      {data && !event && (
        <ErrorState
          actionHref={ROUTES.schedule}
          actionLabel="Back to schedule"
          title="Event not found"
          message="This event may have been removed or the link may be incorrect."
        />
      )}
      {data && event && (
        <>
          <EventContent event={event} />
          <Footer scrapedAt={data.scrapedAt} />
        </>
      )}
    </main>
  );
}
