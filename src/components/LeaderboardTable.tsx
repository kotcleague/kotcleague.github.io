import {
  EditorialTableBody,
  EditorialTableHead,
  EditorialTableHeaderCell,
} from "@/components/EditorialTable";
import EmptyState from "@/components/EmptyState";
import { MEDALS, MedalIcon } from "@/components/LeagueMedals";
import PlayerRow from "@/components/PlayerRow";
import TableShell from "@/components/TableShell";
import type { Player } from "@/types/leaderboard";

interface LeaderboardTableProps {
  label: string;
  players: Player[];
}

export default function LeaderboardTable({
  label,
  players,
}: LeaderboardTableProps) {
  if (players.length === 0) {
    return (
      <EmptyState className="py-16 text-slate-400 dark:text-slate-500">
        No rankings available yet.
      </EmptyState>
    );
  }

  return (
    <TableShell className="w-full overflow-hidden border-0">
      <table className="w-full table-fixed border-collapse">
        <caption className="sr-only">{label} league rankings</caption>
        <EditorialTableHead>
          <tr>
            <EditorialTableHeaderCell
              density="compact"
              alignment="center"
              className="w-11 px-1 sm:w-16 sm:px-2"
            >
              Rank
            </EditorialTableHeaderCell>
            <EditorialTableHeaderCell
              alignment="center"
              density="compact"
              className="w-8 px-0 sm:w-10 sm:px-0"
              aria-label="Ranking movement"
            />
            <EditorialTableHeaderCell
              density="compact"
              className="px-1 sm:px-4"
            >
              Player
            </EditorialTableHeaderCell>
            {MEDALS.map(({ key, label: medalLabel }) => (
              <EditorialTableHeaderCell
                key={key}
                alignment="center"
                density="compact"
                className="max-[499px]:hidden w-12 px-1 sm:w-16 sm:px-1"
                aria-label={`${medalLabel} medals`}
              >
                <span className="inline-flex flex-col items-center gap-1.5">
                  <MedalIcon kind={key} />
                  <span className="text-[0.55rem]">{medalLabel}</span>
                </span>
              </EditorialTableHeaderCell>
            ))}
            <EditorialTableHeaderCell
              alignment="right"
              density="compact"
              className="w-[4.5rem] bg-blue/[0.035] px-2 dark:bg-blue/[0.06] sm:w-28 sm:px-4"
            >
              <span className="sm:hidden">Pts</span>
              <span className="hidden sm:inline">Points</span>
            </EditorialTableHeaderCell>
          </tr>
        </EditorialTableHead>
        <EditorialTableBody>
          {players.map((player) => (
            <PlayerRow key={player.id} player={player} />
          ))}
        </EditorialTableBody>
      </table>
    </TableShell>
  );
}
