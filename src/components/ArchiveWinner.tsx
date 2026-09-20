import { ChevronRight } from "lucide-react";

import PlayerAvatar from "@/components/PlayerAvatar";
import type { PlayerProfile } from "@/lib/players";
import { META_LABEL_MUTED } from "@/lib/styles";
import type { PlayerReference } from "@/types/leaderboard";

interface ArchiveWinnerProps {
  label: string;
  player?: PlayerReference;
  playerProfiles: Map<string, PlayerProfile>;
}

export default function ArchiveWinner({
  label,
  player,
  playerProfiles,
}: ArchiveWinnerProps) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      {player && (
        <PlayerAvatar
          className="h-10 w-10"
          name={player.name}
          photoUrl={playerProfiles.get(player.playerId)?.photoUrl ?? null}
          playerId={player.playerId}
          size="sm"
        />
      )}
      <div className="min-w-0 flex-1">
        <p className={META_LABEL_MUTED}>{label}</p>
        <p className="mt-1 truncate text-sm font-semibold">
          {player?.name ?? "Results posted"}
        </p>
      </div>
      <ChevronRight
        className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-blue dark:text-slate-600"
        aria-hidden="true"
      />
    </div>
  );
}
