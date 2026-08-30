import PlayerRow from "@/components/PlayerRow";
import TableShell from "@/components/TableShell";
import type { Player } from "@/types/leaderboard";

interface LeaderboardTableProps {
  players: Player[];
}

export default function LeaderboardTable({ players }: LeaderboardTableProps) {
  if (players.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white py-16 text-center text-slate-400 dark:border-slate-800 dark:bg-slate-900">
        No rankings available yet.
      </div>
    );
  }

  return (
    <TableShell className="w-full overflow-hidden">
      <table className="w-full table-fixed border-collapse sm:table-auto">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-500">
          <tr>
            <th className="w-16 px-2 py-3 text-left sm:w-20 sm:px-5">Rank</th>
            <th
              className="hidden w-12 px-2 py-3 sm:table-cell"
              aria-label="Movement"
            />
            <th className="px-1 py-3 text-left sm:px-3">Player</th>
            <th className="w-12 px-1 py-3 text-center sm:w-20 sm:px-3">
              <span className="sm:hidden">Evt</span>
              <span className="hidden sm:inline">Events</span>
            </th>
            <th className="w-16 px-2 py-3 text-right sm:w-28 sm:px-5">
              <span className="sm:hidden">Pts</span>
              <span className="hidden sm:inline">Points</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {players.map((player) => (
            <PlayerRow key={player.id} player={player} rank={player.rank} />
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}
