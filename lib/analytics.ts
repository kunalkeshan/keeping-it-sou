/**
 * Single entry point for custom click-tracking analytics. Every call fires to
 * both GA4 (via sendGAEvent) and Microsoft Clarity (via event + setTag).
 * Components must call trackLinkClick / trackVideoPlayClick — never call
 * sendGAEvent or clarity directly, so event names/params stay consistent.
 */
"use client";

import { sendGAEvent } from "@next/third-parties/google";
import clarity from "@microsoft/clarity";
import { getTrackingPlatformId } from "@/lib/social-media";

export type LinkPlacement =
  | "hero"
  | "header"
  | "mobile_nav"
  | "desktop_nav"
  | "footer"
  | "release_detail_primary_cta"
  | "release_detail_list"
  | "hero_upcoming_release"
  | "upcoming_release_section";

export type LinkPosition = "primary" | "secondary";

interface TrackLinkClickParams {
  platform: string;
  url: string;
  placement: LinkPlacement;
  position: LinkPosition;
  releaseSlug?: string;
  releaseTitle?: string;
  releaseType?: string;
}

interface TrackVideoPlayClickParams {
  videoId: string;
  releaseSlug?: string;
  releaseTitle?: string;
  releaseType?: string;
}

const GA_EVENT_LINK_CLICK = "streaming_link_click";
const GA_EVENT_VIDEO_PLAY = "video_play_click";

function safeCall(fn: () => void) {
  try {
    fn();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[analytics]", error);
    }
  }
}

export function trackLinkClick({
  platform,
  url,
  placement,
  position,
  releaseSlug,
  releaseTitle,
  releaseType,
}: TrackLinkClickParams): void {
  const trackingPlatform = getTrackingPlatformId(platform);

  safeCall(() =>
    sendGAEvent("event", GA_EVENT_LINK_CLICK, {
      platform: trackingPlatform,
      placement,
      position,
      link_url: url,
      ...(releaseSlug && { release_slug: releaseSlug }),
      ...(releaseTitle && { release_title: releaseTitle }),
      ...(releaseType && { release_type: releaseType }),
    })
  );

  safeCall(() => {
    clarity.setTag("last_link_platform", trackingPlatform);
    clarity.setTag("last_link_placement", placement);
    if (releaseSlug) clarity.setTag("last_release_slug", releaseSlug);
    clarity.event(GA_EVENT_LINK_CLICK);
  });
}

export function trackVideoPlayClick({
  videoId,
  releaseSlug,
  releaseTitle,
  releaseType,
}: TrackVideoPlayClickParams): void {
  safeCall(() =>
    sendGAEvent("event", GA_EVENT_VIDEO_PLAY, {
      placement: "release_detail_video",
      video_id: videoId,
      ...(releaseSlug && { release_slug: releaseSlug }),
      ...(releaseTitle && { release_title: releaseTitle }),
      ...(releaseType && { release_type: releaseType }),
    })
  );

  safeCall(() => {
    clarity.setTag("last_video_id", videoId);
    if (releaseSlug) clarity.setTag("last_release_slug", releaseSlug);
    clarity.event(GA_EVENT_VIDEO_PLAY);
  });
}
