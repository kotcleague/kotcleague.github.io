import type { SeededPlayer } from "@/types/leaderboard";

export interface CourtAssignment {
  court: string;
  slots: SeededPlayer[];
}

export interface AssignmentPlan {
  courts: CourtAssignment[];
  byeQueue: SeededPlayer[];
}

const DEFAULT_UNSEEDED_DUPR = 4;

export function buildRegisteredPlayers(
  seeding: SeededPlayer[],
  registeredPlayerIds: string[],
  unmatchedRegistrantNames: string[] = []
): SeededPlayer[] {
  const registeredIds = new Set(registeredPlayerIds);
  const usedIds = new Set(seeding.map((player) => player.id));
  const fallbackIds = new Set<string>();

  const fallbackPlayers = unmatchedRegistrantNames.map((name, index) => {
    const slug =
      name
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("en-US")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "player";
    let id = `court-reserve-${slug}`;
    let suffix = 2;

    while (usedIds.has(id)) {
      id = `court-reserve-${slug}-${suffix}`;
      suffix += 1;
    }

    usedIds.add(id);
    fallbackIds.add(id);

    return {
      id,
      name,
      seed: seeding.length + index + 1,
      past30Days: 0,
      allTime: 0,
      dupr: DEFAULT_UNSEEDED_DUPR,
    };
  });

  const rankedPlayers = [...seeding, ...fallbackPlayers]
    .sort((a, b) => {
      const aIsFallback = fallbackIds.has(a.id);
      const bIsFallback = fallbackIds.has(b.id);

      if (!aIsFallback && !bIsFallback) return a.seed - b.seed;
      if (a.past30Days !== b.past30Days) {
        return b.past30Days - a.past30Days;
      }
      if (a.dupr !== b.dupr) return b.dupr - a.dupr;
      if (aIsFallback !== bIsFallback) return aIsFallback ? 1 : -1;

      return a.name.localeCompare(b.name);
    })
    .map((player, index) => ({ ...player, seed: index + 1 }));

  return rankedPlayers.filter(
    (player) => registeredIds.has(player.id) || fallbackIds.has(player.id)
  );
}

export function buildAssignments(
  players: SeededPlayer[],
  courtLabels: string[] = []
): AssignmentPlan {
  const seededPlayers = players.slice().sort((a, b) => a.seed - b.seed);
  const courtCount = Math.floor(seededPlayers.length / 4);

  return {
    courts: Array.from({ length: courtCount }, (_, index) => ({
      court: courtLabels[index] ?? String(index + 1),
      slots: seededPlayers.slice(index * 4, index * 4 + 4),
    })),
    byeQueue: seededPlayers.slice(courtCount * 4),
  };
}

export function assignmentText(plan: AssignmentPlan) {
  const courts = plan.courts
    .map(
      ({ court, slots }) =>
        `Court ${court}\n${slots
          .map(
            (player) =>
              `${player.name} (#${player.seed}, ${
                player.past30Days
              } pts, DUPR ${player.dupr.toFixed(3)})`
          )
          .slice(0, 2)
          .join(" + ")}\nvs\n${slots
          .map((player) => `${player.name} (#${player.seed})`)
          .slice(2)
          .join(" + ")}`
    )
    .join("\n\n");

  const byeQueue = plan.byeQueue.length
    ? `Bye queue\n${plan.byeQueue
        .map(
          (player, index) => `${index + 1}. ${player.name} (#${player.seed})`
        )
        .join("\n")}`
    : "";

  return [courts, byeQueue].filter(Boolean).join("\n\n");
}
