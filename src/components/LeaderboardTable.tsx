import {
  EditorialTableBody,
  EditorialTableHead,
  EditorialTableHeaderCell,
} from "@/components/EditorialTable";
import EmptyState from "@/components/EmptyState";
import PlayerRow from "@/components/PlayerRow";
import TableShell from "@/components/TableShell";
import type { Player } from "@/types/leaderboard";

interface LeaderboardTableProps {
  players: Player[];
}

export default function LeaderboardTable({ players }: LeaderboardTableProps) {
  if (players.length === 0) {
    return (
      <EmptyState className="py-16 text-slate-400 dark:text-slate-500">
        No rankings available yet.
      </EmptyState>
    );
  }

  return (
    <TableShell className="w-full overflow-hidden">
      <table className="w-full table-fixed border-collapse sm:table-auto">
        <EditorialTableHead>
          <tr>
            <EditorialTableHeaderCell
              density="compact"
              className="w-12 sm:w-16"
            >
              Rank
            </EditorialTableHeaderCell>
            <EditorialTableHeaderCell
              alignment="center"
              density="compact"
              className="w-10 sm:w-14"
              aria-label="Movement"
            >
              <span className="sm:hidden" aria-hidden="true">
                ±
              </span>
              <span className="hidden sm:inline">Move</span>
            </EditorialTableHeaderCell>
            <EditorialTableHeaderCell density="compact">
              Player
            </EditorialTableHeaderCell>
            <EditorialTableHeaderCell
              alignment="center"
              density="compact"
              className="w-9 px-1 text-base sm:w-14 sm:text-lg"
              aria-label="Gold medals"
            >
              🥇
            </EditorialTableHeaderCell>
            <EditorialTableHeaderCell
              alignment="center"
              density="compact"
              className="w-9 px-1 text-base sm:w-14 sm:text-lg"
              aria-label="Silver medals"
            >
              🥈
            </EditorialTableHeaderCell>
            <EditorialTableHeaderCell
              alignment="center"
              density="compact"
              className="w-9 px-1 text-base sm:w-14 sm:text-lg"
              aria-label="Bronze medals"
            >
              🥉
            </EditorialTableHeaderCell>
            <EditorialTableHeaderCell
              alignment="right"
              density="compact"
              className="w-16 sm:w-24"
            >
              <span className="sm:hidden">Pts</span>
              <span className="hidden sm:inline">Points</span>
            </EditorialTableHeaderCell>
          </tr>
        </EditorialTableHead>
        <EditorialTableBody>
          {players.map((player) => (
            <PlayerRow key={player.id} player={player} rank={player.rank} />
          ))}
        </EditorialTableBody>
      </table>
    </TableShell>
  );
}
