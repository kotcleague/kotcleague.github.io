import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type Theme } from "@/hooks/useTheme";
import { FOCUS_RING } from "@/lib/styles";

const THEME_OPTIONS: Record<Theme, { icon: typeof Sun; label: string }> = {
  light: { icon: Sun, label: "Light mode" },
  dark: { icon: Moon, label: "Dark mode" },
  system: { icon: Monitor, label: "System theme" },
};

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  const { icon: Icon, label } = THEME_OPTIONS[theme];

  return (
    <button
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`flex h-10 w-10 cursor-pointer items-center justify-center border border-white/15 text-white/70 transition-colors hover:border-white/35 hover:text-white ${FOCUS_RING}`}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
