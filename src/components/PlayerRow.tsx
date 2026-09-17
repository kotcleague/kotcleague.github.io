import {
  EditorialTableCell,
  EditorialTableRow,
} from "@/components/EditorialTable";
import { placementBadgeClass } from "@/components/PlacementBadge";
import PlayerIdentityLink from "@/components/PlayerIdentityLink";
import { formatInteger } from "@/lib/format";
import type { Player } from "@/types/leaderboard";

interface PlayerRowProps {
  player: Player;
  rank: number;
}

function Movement({ move }: { move: Player["move"] }) {
  if (move.dir === "none") {
    return (
      <span
        className="inline-flex min-h-6 min-w-8 items-center justify-center text-sm font-semibold text-slate-300 sm:min-h-7 sm:min-w-10 dark:text-slate-600"
        title="No ranking movement"
        aria-label="No ranking movement"
      >
        —
      </span>
    );
  }
  const isUp = move.dir === "up";

  return (
    <span
      className={`inline-flex min-h-6 min-w-8 items-center justify-center gap-1 rounded-full px-1.5 text-sm font-bold leading-none tabular-nums sm:min-h-7 sm:min-w-10 ${
        isUp
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
          : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
      }`}
      title={`Moved ${isUp ? "up" : "down"} ${move.places} ${
        move.places === 1 ? "place" : "places"
      }`}
    >
      <span className="text-[0.6rem] sm:text-xs" aria-hidden="true">
        {isUp ? "▲" : "▼"}
      </span>
      {move.places}
    </span>
  );
}

export default function PlayerRow({ player, rank }: PlayerRowProps) {
  const badge = placementBadgeClass(rank);
  const isTop3 = rank <= 3;

  return (
    <EditorialTableRow
      className={isTop3 ? "bg-slate-50/70 dark:bg-slate-800/25" : undefined}
    >
      <EditorialTableCell density="compact">
        <span
          className={`
            font-display inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-sm px-1 text-base font-bold tabular-nums sm:h-8 sm:min-w-8 sm:text-lg
            ${badge}
          `}
        >
          {rank}
        </span>
      </EditorialTableCell>

      <EditorialTableCell
        alignment="center"
        density="compact"
        className="px-0 sm:px-2"
      >
        <Movement move={player.move} />
      </EditorialTableCell>

      <EditorialTableCell
        density="compact"
        className={`px-1 text-sm font-semibold leading-5 sm:px-3 sm:text-base ${
          isTop3
            ? "text-ink dark:text-white"
            : "text-slate-700 dark:text-slate-300"
        }`}
      >
        <PlayerIdentityLink
          className="gap-2 sm:gap-3"
          name={player.name}
          photoUrl={player.photoUrl}
          playerId={player.id}
        />
      </EditorialTableCell>

      <EditorialTableCell
        alignment="center"
        density="compact"
        numeric
        className="px-1 text-sm font-semibold text-slate-600 sm:px-3 sm:text-base dark:text-slate-300"
      >
        {player.gold}
      </EditorialTableCell>

      <EditorialTableCell
        alignment="center"
        density="compact"
        numeric
        className="px-1 text-sm font-semibold text-slate-600 sm:px-3 sm:text-base dark:text-slate-300"
      >
        {player.silver}
      </EditorialTableCell>

      <EditorialTableCell
        alignment="center"
        density="compact"
        numeric
        className="px-1 text-sm font-semibold text-slate-600 sm:px-3 sm:text-base dark:text-slate-300"
      >
        {player.bronze}
      </EditorialTableCell>

      <EditorialTableCell
        alignment="right"
        density="compact"
        numeric
        className={`font-display px-2 py-3 text-right text-lg font-bold tabular-nums sm:px-5 sm:py-4 sm:text-xl ${
          isTop3
            ? "text-blue dark:text-blue-300"
            : "text-slate-600 dark:text-slate-300"
        }`}
      >
        {formatInteger(player.points)}
      </EditorialTableCell>
    </EditorialTableRow>
  );
}
