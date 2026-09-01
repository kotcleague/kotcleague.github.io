import { EditorialTableRow } from "@/components/EditorialTable";
import { placementBadgeClass } from "@/components/PlacementBadge";
import PlayerAvatar from "@/components/PlayerAvatar";
import { playerRoute } from "@/config/site";
import { formatInteger } from "@/lib/format";
import type { Player } from "@/types/leaderboard";

interface PlayerRowProps {
  player: Player;
  rank: number;
}

function Movement({ move }: { move: Player["move"] }) {
  if (move.dir === "none") {
    return null;
  }
  const isUp = move.dir === "up";

  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[0.6875rem] font-medium leading-none tabular-nums ${
        isUp
          ? "text-emerald-700 dark:text-emerald-400"
          : "text-rose-600 dark:text-rose-400"
      }`}
      title={`Moved ${isUp ? "up" : "down"} ${move.places} ${
        move.places === 1 ? "place" : "places"
      }`}
    >
      <span className="text-[0.5rem]" aria-hidden="true">
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
      <td className="px-2 py-3 sm:px-5 sm:py-4">
        <div className="flex items-center gap-1 sm:block">
          <span
            className={`
              font-display inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-sm px-1 text-base font-bold tabular-nums sm:h-8 sm:min-w-8 sm:text-lg
              ${badge}
            `}
          >
            {rank}
          </span>
          <span className="sm:hidden">
            <Movement move={player.move} />
          </span>
        </div>
      </td>

      <td className="hidden px-2 py-4 text-center text-sm sm:table-cell">
        <Movement move={player.move} />
      </td>

      <td
        className={`px-1 py-3 text-sm font-semibold leading-5 sm:px-3 sm:py-4 sm:text-base ${
          isTop3
            ? "text-ink dark:text-white"
            : "text-slate-700 dark:text-slate-300"
        }`}
      >
        <a
          href={playerRoute(player.id)}
          className="flex items-center gap-2 rounded-sm text-inherit hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue sm:gap-3"
        >
          <PlayerAvatar
            name={player.name}
            photoUrl={player.photoUrl}
            size="sm"
          />
          <span className="min-w-0 truncate">{player.name}</span>
        </a>
      </td>

      <td className="px-1 py-3 text-center text-xs tabular-nums text-slate-500 sm:px-3 sm:py-4 sm:text-sm dark:text-slate-400">
        {player.events}
      </td>

      <td
        className={`font-display px-2 py-3 text-right text-lg font-bold tabular-nums sm:px-5 sm:py-4 sm:text-xl ${
          isTop3
            ? "text-blue dark:text-blue-300"
            : "text-slate-600 dark:text-slate-300"
        }`}
      >
        {formatInteger(player.points)}
      </td>
    </EditorialTableRow>
  );
}
