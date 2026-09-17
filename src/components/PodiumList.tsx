import PlacementBadge from "@/components/PlacementBadge";
import PlayerAvatar from "@/components/PlayerAvatar";
import type { PlayerProfile } from "@/lib/players";
import type { PlayerReference } from "@/types/leaderboard";

interface PodiumListProps {
  playerProfiles: Map<string, PlayerProfile>;
  podium: PlayerReference[];
}

export default function PodiumList({
  playerProfiles,
  podium,
}: PodiumListProps) {
  return (
    <ol className="grid gap-2.5">
      {podium.map((player) => (
        <li
          key={player.place}
          className="grid min-w-0 grid-cols-[2rem_2rem_minmax(0,1fr)] items-center gap-2.5"
        >
          <PlacementBadge place={player.place} />
          <PlayerAvatar
            name={player.name}
            photoUrl={playerProfiles.get(player.playerId)?.photoUrl ?? null}
            playerId={player.playerId}
            size="sm"
            className="h-8 w-8"
          />
          <span className="min-w-0 truncate text-sm font-semibold">
            {player.name}
          </span>
        </li>
      ))}
    </ol>
  );
}
