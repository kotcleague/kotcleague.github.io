import type { SeededPlayer } from "@/types/leaderboard";

export interface CourtAssignment {
  court: string;
  slots: SeededPlayer[];
}

export interface AssignmentPlan {
  courts: CourtAssignment[];
  byeQueue: SeededPlayer[];
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
