import clsx from "clsx";
import { useState } from "react";

import PlayerAvatarFallback from "@/components/PlayerAvatarFallback";

interface PlayerAvatarProps {
  className?: string;
  name: string;
  photoUrl: string | null;
  /** Stable player id used to seed the default avatar. Falls back to the name. */
  playerId?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const SIZE_CLASSES = {
  sm: "h-9 w-9",
  md: "h-12 w-12",
  lg: "h-20 w-20",
  xl: "h-40 w-40 sm:h-48 sm:w-48",
} as const;

export default function PlayerAvatar({
  className,
  name,
  photoUrl,
  playerId,
  size = "md",
}: PlayerAvatarProps) {
  const [failed, setFailed] = useState(false);

  return (
    <span
      className={clsx(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-sm bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500",
        SIZE_CLASSES[size],
        className
      )}
    >
      {photoUrl && !failed ? (
        <img
          src={photoUrl}
          alt={`${name} profile photo`}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <PlayerAvatarFallback seed={playerId ?? name} name={name} />
      )}
    </span>
  );
}
