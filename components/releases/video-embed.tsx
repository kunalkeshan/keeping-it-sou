/**
 * Wraps the official YouTube video embed on a release detail page and tracks
 * the first click on the lite-embed facade as a video_play_click event.
 * YouTubeEmbed exposes no player-ready/state-change callback, so this tracks
 * "user clicked to play" rather than a verified playback event.
 */
"use client";

import { YouTubeEmbed } from "@next/third-parties/google";
import { trackVideoPlayClick } from "@/lib/analytics";

interface VideoEmbedProps {
  videoId: string;
  releaseSlug?: string;
  releaseTitle?: string;
  releaseType?: string;
}

export default function VideoEmbed({
  videoId,
  releaseSlug,
  releaseTitle,
  releaseType,
}: VideoEmbedProps) {
  return (
    <div
      className="border-border overflow-hidden rounded-sm border"
      onClick={() =>
        trackVideoPlayClick({ videoId, releaseSlug, releaseTitle, releaseType })
      }
    >
      <YouTubeEmbed videoid={videoId} style="max-width:100%" />
    </div>
  );
}
