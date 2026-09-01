import clsx from "clsx";
import { UserRound } from "lucide-react";
import { useState } from "react";

interface PlayerAvatarProps {
  className?: string;
  name: string;
  photoUrl: string | null;
  size?: "sm" | "md" | "lg" | "xl";
}

const SIZE_CLASSES = {
  sm: "h-9 w-9",
  md: "h-12 w-12",
  lg: "h-20 w-20",
  xl: "h-40 w-40 sm:h-48 sm:w-48",
} as const;

const ICON_SIZE_CLASSES = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-9 w-9",
  xl: "h-16 w-16 sm:h-20 sm:w-20",
} as const;

export default function PlayerAvatar({
  className,
  name,
  photoUrl,
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
        <UserRound
          className={ICON_SIZE_CLASSES[size]}
          aria-hidden="true"
          strokeWidth={1.5}
        />
      )}
    </span>
  );
}
