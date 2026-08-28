import { useMemo, useSyncExternalStore } from "react";
import { parseHashRoute, ROUTES } from "@/config/site";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("hashchange", onStoreChange);
  return () => window.removeEventListener("hashchange", onStoreChange);
}

function getSnapshot() {
  return window.location.hash;
}

export function useHashRoute() {
  const hash = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => ROUTES.rankings
  );
  return useMemo(() => parseHashRoute(hash), [hash]);
}
