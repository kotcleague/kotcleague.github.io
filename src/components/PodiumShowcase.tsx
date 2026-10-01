import type { ReactNode } from "react";
import clsx from "clsx";

import Card from "@/components/Card";
import PlacementBadge, {
  placementAccentClass,
} from "@/components/PlacementBadge";
import PlayerAvatar from "@/components/PlayerAvatar";
import SectionHeading from "@/components/SectionHeading";
import { playerRoute } from "@/config/site";
import type { PlayerProfile } from "@/lib/players";
import { FOCUS_RING, META_LABEL_MUTED } from "@/lib/styles";
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
      <SectionHeading id={id} eyebrow="On the podium">
        {title}
      </SectionHeading>
      <Card className="grid overflow-hidden p-0 sm:grid-cols-3">
        {podium.map((entry, index) => (
          <div
            key={entry.playerId}
            className={clsx(
              "min-w-0 border-t-2 p-5",
              index > 0 &&
                "sm:border-l sm:border-l-slate-100 dark:sm:border-l-slate-800",
              placementAccentClass(entry.place),
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
                  className={`mt-2 block break-words text-base font-bold text-inherit underline-offset-4 hover:underline ${FOCUS_RING}`}
                >
                  {entry.name}
                </a>
              </div>
            </div>
            {(renderSummary || renderMeta) && (
              <div className="mt-4 flex flex-wrap items-baseline justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
                {renderSummary && (
                  <p className="font-display text-2xl font-semibold tabular-nums text-blue dark:text-blue-300">
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
