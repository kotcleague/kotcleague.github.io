import type { ReactNode } from "react";
import clsx from "clsx";

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
      <SectionHeading id={id}>{title}</SectionHeading>
      <Card className="grid overflow-hidden rounded-none p-0 sm:grid-cols-3">
        {podium.map((entry, index) => (
          <div
            key={entry.playerId}
            className={clsx(
              "min-w-0 p-5",
              index > 0 &&
                "border-t border-slate-100 sm:border-l sm:border-t-0 dark:border-slate-800",
              entry.place === 1 && "bg-amber-50/35 dark:bg-amber-400/[0.025]"
            )}
          >
            <div className="flex items-center gap-3">
              <PlayerAvatar
                name={entry.name}
                photoUrl={playerProfiles.get(entry.playerId)?.photoUrl ?? null}
                playerId={entry.playerId}
                size="podium"
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
                  className="mt-2 block truncate text-base font-bold text-inherit hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
                >
                  {entry.name}
                </a>
              </div>
            </div>
            {(renderSummary || renderMeta) && (
              <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
                {renderSummary && (
                  <p className="font-display text-lg font-bold tabular-nums text-blue dark:text-blue-300">
                    {renderSummary(entry)}
                  </p>
                )}
                {renderMeta && (
                  <p className={`${META_LABEL_MUTED} text-right`}>
                    {renderMeta(entry)}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </Card>
    </section>
  );
}
