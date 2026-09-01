import type { LeaderboardData } from "@/types/leaderboard";

export interface PlayerProfile {
  name: string;
  photoUrl: string | null;
  gameMakerProfileUrl: string | null;
}

// Player photos live on the ranking rows. Build a lookup so pages that only
// have a playerId/name (event results, podium finishers) can still show a
// photo, preferring whichever ranking view has one published.
export function buildPlayerProfileIndex(
  data: LeaderboardData
): Map<string, PlayerProfile> {
  const index = new Map<string, PlayerProfile>();

  for (const players of Object.values(data.views)) {
    for (const player of players) {
      const existing = index.get(player.id);
      if (!existing || (!existing.photoUrl && player.photoUrl)) {
        index.set(player.id, {
          name: player.name,
          photoUrl: player.photoUrl,
          gameMakerProfileUrl: player.gameMakerProfileUrl,
        });
      }
    }
  }

  return index;
}
