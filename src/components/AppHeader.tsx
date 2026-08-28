import clsx from "clsx";
import {
  navigationPageForRoute,
  NAV_ITEMS,
  ROUTES,
  type AppRoute,
} from "@/config/site";
import PaddleUpLogo from "@/components/PaddleUpLogo";
import ThemeToggle from "@/components/ThemeToggle";

interface NavigationProps {
  currentRoute: AppRoute;
  mobile?: boolean;
}

function Navigation({ currentRoute, mobile = false }: NavigationProps) {
  return (
    <nav
      className={clsx(
        mobile
          ? "mx-auto flex max-w-5xl border-t border-white/10 px-4 sm:hidden"
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
            aria-current={isActive ? "page" : undefined}
            className={clsx(
              "text-xs font-semibold uppercase transition-colors",
              mobile
                ? "border-b-2 px-3 py-3 tracking-[0.12em]"
                : "tracking-[0.14em]",
              isActive
                ? mobile
                  ? "border-blue-400 text-white"
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
  return (
    <header className="bg-ink text-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <a href={ROUTES.rankings} aria-label="PaddleUp home">
          <PaddleUpLogo className="h-9 w-auto" />
        </a>
        <div className="flex items-center gap-4">
          <Navigation currentRoute={currentRoute} />
          <ThemeToggle />
        </div>
      </div>
      <Navigation currentRoute={currentRoute} mobile />
    </header>
  );
}
