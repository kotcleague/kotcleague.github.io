import type { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

import PlayerAvatar from "@/components/PlayerAvatar";
import { playerRoute } from "@/config/site";

interface PlayerIdentityLinkProps
  extends Omit<ComponentPropsWithoutRef<"a">, "href"> {
  avatarSize?: "sm" | "md" | "lg";
  name: string;
  nameClassName?: string;
  photoUrl: string | null;
  playerId: string;
}

export default function PlayerIdentityLink({
  avatarSize = "sm",
  className,
  name,
  nameClassName,
  photoUrl,
  playerId,
  ...props
}: PlayerIdentityLinkProps) {
  return (
    <a
      href={playerRoute(playerId)}
      className={twMerge(
        "flex min-w-0 items-center gap-3 text-inherit hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue",
        className
      )}
      {...props}
    >
      <PlayerAvatar
        name={name}
        photoUrl={photoUrl}
        playerId={playerId}
        size={avatarSize}
      />
      <span className={twMerge("min-w-0 truncate", nameClassName)}>{name}</span>
    </a>
  );
}
