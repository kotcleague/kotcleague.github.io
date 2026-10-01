import clsx from "clsx";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import {
  navigationPageForRoute,
  NAV_ITEMS,
  ROUTES,
  type AppRoute,
} from "@/config/site";
import KotcLeagueLogo from "@/components/KotcLeagueLogo";
import ThemeToggle from "@/components/ThemeToggle";
import { FOCUS_RING, HEADER_ICON_BUTTON, PAGE_CONTAINER } from "@/lib/styles";

interface NavigationProps {
  currentRoute: AppRoute;
  mobile?: boolean;
  onNavigate?: () => void;
}

function Navigation({
  currentRoute,
  mobile = false,
  onNavigate,
}: NavigationProps) {
  return (
    <nav
      className={clsx(
        mobile
          ? "mx-auto flex max-w-5xl flex-col border-t border-white/10 px-4 py-2 sm:hidden"
          : "hidden items-center gap-5 sm:flex"
      )}
      aria-label={mobile ? "Mobile navigation" : "Primary navigation"}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = navigationPageForRoute(currentRoute) === item.page;

        return (
          <a
            key={item.route}
            href={item.route}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={clsx(
              "text-xs font-semibold uppercase tracking-[0.08em] transition-colors",
              FOCUS_RING,
              mobile
                ? "border-l-2 px-3 py-3 tracking-[0.12em]"
                : "tracking-[0.14em]",
              isActive
                ? mobile
                  ? "border-blue-400 bg-white/[0.04] text-white"
                  : "text-white"
                : mobile
                ? "border-transparent text-white/55"
                : "text-white/55 hover:text-white"
            )}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}

interface AppHeaderProps {
  currentRoute: AppRoute;
}

export default function AppHeader({ currentRoute }: AppHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-ink text-white">
      <div
        className={`${PAGE_CONTAINER} flex items-center justify-between py-4`}
      >
        <a
          href={ROUTES.rankings}
          aria-label="KOTC League home"
          className={FOCUS_RING}
        >
          <KotcLeagueLogo />
        </a>
        <div className="flex items-center gap-4">
          <Navigation currentRoute={currentRoute} />
          <ThemeToggle />
          <button
            type="button"
            className={`${HEADER_ICON_BUTTON} sm:hidden`}
            aria-controls="mobile-navigation"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div id="mobile-navigation">
          <Navigation
            currentRoute={currentRoute}
            mobile
            onNavigate={() => setMobileMenuOpen(false)}
          />
        </div>
      )}
    </header>
  );
}
