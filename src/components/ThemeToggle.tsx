import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type Theme } from "@/hooks/useTheme";

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
      className="cursor-pointer rounded-lg p-2 text-white/70 transition-colors
                 hover:bg-white/10 hover:text-white"
    >
      <Icon className="w-5 h-5" />
    </button>
  );
}
