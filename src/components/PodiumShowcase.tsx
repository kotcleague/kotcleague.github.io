import type { ReactNode } from "react";

import Card from "@/components/Card";
import PlacementBadge from "@/components/PlacementBadge";
import PlayerAvatar from "@/components/PlayerAvatar";
import SectionHeading from "@/components/SectionHeading";
import { playerRoute } from "@/config/site";
import type { PlayerProfile } from "@/lib/players";
import { META_LABEL_MUTED } from "@/lib/styles";
import type { PlayerReference } from "@/types/leaderboard";

interface PodiumShowcaseProps<T extends PlayerReference> {
  entries: T[];
  id: string;
  playerProfiles: Map<string, PlayerProfile>;
  renderMeta?: (entry: T) => ReactNode;
  renderSummary?: (entry: T) => ReactNode;
  title: string;
}

function placementLabel(place: number) {
  if (place === 1) return "Champion";
  if (place === 2) return "Runner-up";
  return "Third place";
}

function podiumBorderClass(place: number) {
  if (place === 1) return "border-t-gold";
  if (place === 2) return "border-t-silver";
  return "border-t-bronze";
}

export default function PodiumShowcase<T extends PlayerReference>({
  entries,
  id,
  playerProfiles,
  renderMeta,
  renderSummary,
  title,
}: PodiumShowcaseProps<T>) {
  const podium = entries
    .filter((entry) => entry.place <= 3)
    .sort((left, right) => left.place - right.place);

  if (podium.length === 0) return null;

  return (
    <section aria-labelledby={id}>
      <SectionHeading id={id} prominent>
        {title}
      </SectionHeading>
      <div className="grid gap-3 sm:grid-cols-3">
        {podium.map((entry) => (
          <Card
            key={entry.playerId}
            className={`overflow-hidden border-t-2 ${podiumBorderClass(
              entry.place
            )}`}
          >
            <div className="flex items-center gap-4 p-5">
              <PlayerAvatar
                name={entry.name}
                photoUrl={playerProfiles.get(entry.playerId)?.photoUrl ?? null}
                playerId={entry.playerId}
                size="lg"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <PlacementBadge place={entry.place} />
                  <span className={META_LABEL_MUTED}>
                    {placementLabel(entry.place)}
                  </span>
                </div>
                <a
                  href={playerRoute(entry.playerId)}
                  className="mt-3 block truncate rounded-sm text-lg font-bold text-inherit hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
                >
                  {entry.name}
                </a>
                {renderSummary && (
                  <p className="font-display mt-1 text-lg font-bold tabular-nums text-blue dark:text-blue-300">
                    {renderSummary(entry)}
                  </p>
                )}
              </div>
            </div>
            {renderMeta && (
              <p
                className={`${META_LABEL_MUTED} border-t border-slate-100 px-5 py-3 dark:border-slate-800`}
              >
                {renderMeta(entry)}
              </p>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}
