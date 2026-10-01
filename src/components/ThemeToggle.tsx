import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type Theme } from "@/hooks/useTheme";
import { HEADER_ICON_BUTTON } from "@/lib/styles";

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
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={HEADER_ICON_BUTTON}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
