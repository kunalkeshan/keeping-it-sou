"use client";

import { useIsPresentationTool } from "next-sanity/hooks";

/**
 * Floating "Disable Draft Mode" link, rendered only while Draft Mode is on.
 * Hidden inside the Presentation Tool iframe (the Studio controls draft mode
 * there), shown when the draft-mode preview is opened directly in a browser tab.
 */
export function DisableDraftMode() {
  const isPresentationTool = useIsPresentationTool();

  if (isPresentationTool) return null;

  return (
    <a
      href="/api/draft-mode/disable"
      className="bg-foreground text-background fixed right-4 bottom-4 z-50 rounded-full px-4 py-2 text-sm shadow-lg"
    >
      Disable Draft Mode
    </a>
  );
}
