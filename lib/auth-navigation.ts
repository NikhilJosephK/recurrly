import type { Href } from "expo-router";
import type { Router } from "expo-router";

/** Clerk `finalize` navigate callback for Expo Router (no `window` on native). */
export function finalizeAuthNavigation(
  decorateUrl: (path: string) => string,
  router: Router,
  session: { currentTask?: unknown } | null | undefined
): void {
  if (session?.currentTask) {
    return;
  }
  const url = decorateUrl("/");
  if (url.startsWith("http")) {
    if (typeof window !== "undefined") {
      window.location.href = url;
    }
    return;
  }
  router.replace(url as Href);
}
