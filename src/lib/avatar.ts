// Deterministic default avatars for players without a profile photo.
//
// Every visual decision is derived from a 32-bit FNV-1a hash of the player id,
// so a player always gets the same avatar on every device and every render.

export interface AvatarPalette {
  bgLight: string;
  fgLight: string;
  bgDark: string;
  fgDark: string;
}

export interface AvatarDesign {
  palette: AvatarPalette;
  initials: string;
}

// Muted athletic colors keep default avatars distinct from the site's neutral
// surfaces without overpowering the rankings. Each theme variant has at least
// 4.5:1 text contrast.
const PALETTES: AvatarPalette[] = [
  {
    bgLight: "#c6d8ee",
    fgLight: "#12395f",
    bgDark: "#1d3854",
    fgDark: "#c6d8ee",
  },
  {
    bgLight: "#c9d6dc",
    fgLight: "#263f4a",
    bgDark: "#273c45",
    fgDark: "#c9d6dc",
  },
  {
    bgLight: "#d1d7e2",
    fgLight: "#263b58",
    bgDark: "#29374d",
    fgDark: "#d1d7e2",
  },
  {
    bgLight: "#cbdcd4",
    fgLight: "#24463a",
    bgDark: "#273f36",
    fgDark: "#cbdcd4",
  },
  {
    bgLight: "#dfced2",
    fgLight: "#603342",
    bgDark: "#4a2e38",
    fgDark: "#dfced2",
  },
  {
    bgLight: "#ddd4c2",
    fgLight: "#56452a",
    bgDark: "#463b2c",
    fgDark: "#ddd4c2",
  },
];

/** FNV-1a, 32-bit. Stable across browsers and runs. */
export function hashString(value: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

export function playerInitials(name: string): string {
  const words = name
    .split(/[\s-]+/)
    .map((word) => Array.from(word)[0])
    .filter(
      (letter): letter is string =>
        Boolean(letter) && /\p{L}|\p{N}/u.test(letter)
    );

  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].toUpperCase();
  return (words[0] + words[words.length - 1]).toUpperCase();
}

/** Font size that keeps one- and two-letter initials inside the 100x100 tile. */
export function initialsFontSize(initials: string): number {
  return initials.length > 1 ? 44 : 56;
}

export function getAvatarDesign(seed: string, name: string): AvatarDesign {
  const hash = hashString(seed || name);

  return {
    palette: PALETTES[hash % PALETTES.length],
    initials: playerInitials(name),
  };
}
