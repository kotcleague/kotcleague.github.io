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
  /** Court rotation in degrees: 0 (portrait) or 90 (landscape). */
  rotation: 0 | 90;
  /** Which service box is shaded: 0 none, 1 top-left, 2 bottom-right, 3 both. */
  boxes: number;
  initials: string;
}

// Palettes are built from the site theme tokens in src/index.css so default
// avatars never clash with the navy/blue brand. Each entry carries a light and
// a dark variant with enough contrast for the initials to stay legible.
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
    bgLight: "#eef4e4",
    fgLight: "#4f7a13",
    bgDark: "#1a2a17",
    fgDark: "#a8d95c",
  },
  {
    bgLight: "#fdf3dc",
    fgLight: "#8a6605",
    bgDark: "#2b2411",
    fgDark: "#f4c430",
  },
  {
    bgLight: "#f2ece6",
    fgLight: "#8a5320",
    bgDark: "#2a1f16",
    fgDark: "#d09a5e",
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

function bits(hash: number, shift: number, count: number): number {
  return (hash >>> shift) & ((1 << count) - 1);
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
    rotation: bits(hash, 8, 1) === 1 ? 90 : 0,
    boxes: bits(hash, 9, 2),
    initials: playerInitials(name),
  };
}
