import {
  EditorialTableCell,
  EditorialTableRow,
} from "@/components/EditorialTable";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { MEDALS } from "@/components/LeagueMedals";
import PlacementBadge, {
  placementAccentClass,
} from "@/components/PlacementBadge";
import PlayerIdentityLink from "@/components/PlayerIdentityLink";
import { formatInteger } from "@/lib/format";
import type { Player } from "@/types/leaderboard";

interface PlayerRowProps {
  player: Player;
}

function Movement({ move }: { move: Player["move"] }) {
  if (move.dir === "none") {
    return <span className="sr-only">No ranking movement</span>;
  }
  const isUp = move.dir === "up";
  const Icon = isUp ? ArrowUpRight : ArrowDownRight;
  const label = `Moved ${isUp ? "up" : "down"} ${move.places} ${
    move.places === 1 ? "place" : "places"
  }`;

  return (
    <span
      className={`font-display inline-flex min-h-8 min-w-7 flex-col items-center justify-center text-xs font-semibold leading-none tabular-nums ${
        isUp
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-rose-600 dark:text-rose-400"
      }`}
      title={label}
      aria-label={label}
    >
      {isUp && (
        <Icon className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
      )}
      <span aria-hidden="true">{move.places}</span>
      {!isUp && (
        <Icon className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
      )}
    </span>
  );
}

export default function PlayerRow({ player }: PlayerRowProps) {
  const { rank } = player;
  const isTop3 = rank <= 3;

  return (
    <EditorialTableRow
      className={rank === 1 ? "bg-amber-50/40 dark:bg-amber-950/10" : undefined}
    >
      <EditorialTableCell
        alignment="center"
        density="compact"
        className={`border-l-2 px-1 sm:px-2 ${placementAccentClass(rank)}`}
      >
        <PlacementBadge
          place={rank}
          className="h-8 min-w-8 sm:h-10 sm:min-w-10 sm:text-2xl"
        />
      </EditorialTableCell>

      <EditorialTableCell
        alignment="center"
        density="compact"
        className="px-0 sm:px-0"
      >
        <Movement move={player.move} />
      </EditorialTableCell>

      <EditorialTableCell
        density="compact"
        className={`px-1 text-sm font-semibold leading-5 sm:px-4 sm:text-base ${
          isTop3
            ? "text-ink dark:text-white"
            : "text-slate-700 dark:text-slate-300"
        }`}
      >
        <PlayerIdentityLink
          className="gap-2 sm:gap-3"
          nameClassName="whitespace-normal break-words"
          name={player.name}
          photoUrl={player.photoUrl}
          playerId={player.id}
        />
      </EditorialTableCell>

      {MEDALS.map(({ key }) => (
        <EditorialTableCell
          key={key}
          alignment="center"
          density="compact"
          numeric
          className={`max-[499px]:hidden px-1 text-sm sm:px-1 ${
            player[key] > 0
              ? "font-semibold text-ink dark:text-slate-200"
              : "text-slate-400 dark:text-slate-500"
          }`}
        >
          {player[key]}
        </EditorialTableCell>
      ))}

      <EditorialTableCell
        alignment="right"
        density="compact"
        numeric
        score
        className={`whitespace-nowrap px-2 text-xl sm:px-4 sm:text-3xl ${
          isTop3
            ? "text-blue dark:text-blue-300"
            : "text-ink dark:text-slate-200"
        }`}
      >
        {formatInteger(player.points)}
      </EditorialTableCell>
    </EditorialTableRow>
  );
}
