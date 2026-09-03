import clsx from "clsx";

import { getAvatarDesign, initialsFontSize } from "@/lib/avatar";

interface PlayerAvatarFallbackProps {
  className?: string;
  /** Stable identifier used as the deterministic seed. Falls back to the name. */
  seed: string;
  name: string;
  /** Hide the initials on very small tiles where they would be unreadable. */
  showInitials?: boolean;
}

/**
 * Default avatar for players without a profile photo: a solid tile in a
 * theme-matched color showing the player's initials, both derived from the
 * seed.
 */
export default function PlayerAvatarFallback({
  className,
  seed,
  name,
  showInitials = true,
}: PlayerAvatarFallbackProps) {
  const { palette, initials } = getAvatarDesign(seed, name);

  return (
    <svg
      viewBox="0 0 100 100"
      className={clsx("player-avatar-fallback h-full w-full", className)}
      style={
        {
          "--avatar-bg-light": palette.bgLight,
          "--avatar-fg-light": palette.fgLight,
          "--avatar-bg-dark": palette.bgDark,
          "--avatar-fg-dark": palette.fgDark,
        } as React.CSSProperties
      }
      aria-hidden="true"
      focusable="false"
    >
      {showInitials && (
        <text
          x="50"
          y="52"
          textAnchor="middle"
          dominantBaseline="central"
          fill="currentColor"
          fontFamily="var(--font-display)"
          fontWeight="700"
          fontSize={initialsFontSize(initials)}
        >
          {initials}
        </text>
      )}
    </svg>
  );
}
