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

// Palettes are tints/shades of the site's navy/blue accent tokens (see
// --color-accent-400/500/600/700 in src/index.css) so default avatars read as
// part of the brand instead of clashing with it. Each entry carries a light
// and a dark variant with enough contrast for the initials to stay legible.
const PALETTES: AvatarPalette[] = [
  {
    bgLight: "#e8eef7",
    fgLight: "#002659",
    bgDark: "#12283c",
    fgDark: "#7aa7e8",
  },
  {
    bgLight: "#e3ecfb",
    fgLight: "#1167d8",
    bgDark: "#0f2740",
    fgDark: "#4d94f0",
  },
  {
    bgLight: "#e6ecf2",
    fgLight: "#17354d",
    bgDark: "#14293a",
    fgDark: "#8fb3cc",
  },
  {
    bgLight: "#e9edf1",
    fgLight: "#0047a3",
    bgDark: "#102340",
    fgDark: "#5f9bf5",
  },
  {
    bgLight: "#e7eaee",
    fgLight: "#22364a",
    bgDark: "#16202b",
    fgDark: "#9fb4c6",
  },
  {
    bgLight: "#e2eefb",
    fgLight: "#0b5394",
    bgDark: "#0d2b40",
    fgDark: "#6fb3e8",
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
