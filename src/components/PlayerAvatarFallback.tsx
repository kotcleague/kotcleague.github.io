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
 * Default avatar for players without a profile photo: a stylised top-down
 * pickleball court with the player's initials, both derived from the seed.
 */
export default function PlayerAvatarFallback({
  className,
  seed,
  name,
  showInitials = true,
}: PlayerAvatarFallbackProps) {
  const { palette, rotation, boxes, initials } = getAvatarDesign(seed, name);

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
      <g
        transform={`rotate(${rotation} 50 50)`}
        fill="none"
        stroke="currentColor"
      >
        <rect
          x="8"
          y="6"
          width="84"
          height="88"
          strokeWidth="2.5"
          opacity="0.45"
        />
        <line x1="8" y1="50" x2="92" y2="50" strokeWidth="3" opacity="0.45" />
        <rect
          x="8"
          y="36"
          width="84"
          height="28"
          fill="currentColor"
          stroke="none"
          opacity="0.14"
        />
        {(boxes & 1) === 1 && (
          <rect
            x="8"
            y="6"
            width="42"
            height="30"
            fill="currentColor"
            stroke="none"
            opacity="0.1"
          />
        )}
        {(boxes & 2) === 2 && (
          <rect
            x="50"
            y="64"
            width="42"
            height="30"
            fill="currentColor"
            stroke="none"
            opacity="0.1"
          />
        )}
        <line x1="50" y1="6" x2="50" y2="36" strokeWidth="2" opacity="0.4" />
        <line x1="50" y1="64" x2="50" y2="94" strokeWidth="2" opacity="0.4" />
      </g>
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
