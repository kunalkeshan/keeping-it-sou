import { Icon } from "@iconify/react";
import type { SiteConfig } from "@/types/cms";

// Extract the supported platform type from SiteConfig
type SocialMediaItem = NonNullable<SiteConfig["socialMedia"]>[number];
export type SupportedSocialPlatform = NonNullable<SocialMediaItem["platform"]>;

export const SUPPORTED_PLATFORMS: readonly SupportedSocialPlatform[] = [
  "facebook",
  "instagram",
  "linkedin",
  "twitter",
  "youtube",
  "whatsapp",
  "spotify",
  "applemusic",
  "youtubemusic",
] as const;

const PLATFORM_ICONS: Record<string, string> = {
  facebook: "simple-icons:facebook",
  instagram: "simple-icons:instagram",
  linkedin: "simple-icons:linkedin",
  twitter: "simple-icons:x",
  youtube: "simple-icons:youtube",
  whatsapp: "simple-icons:whatsapp",
  spotify: "simple-icons:spotify",
  applemusic: "simple-icons:applemusic",
  youtubemusic: "simple-icons:youtubemusic",
  // Streaming platform keys from the Sanity releases schema (hyphenated variants)
  "apple-music": "simple-icons:applemusic",
  "youtube-music": "simple-icons:youtubemusic",
  soundcloud: "simple-icons:soundcloud",
  bandcamp: "simple-icons:bandcamp",
  tidal: "simple-icons:tidal",
  "amazon-music": "simple-icons:amazonmusic",
  deezer: "simple-icons:deezer",
};

export function getSocialIcon(platform: string, className = "size-4") {
  const icon = PLATFORM_ICONS[platform];
  if (!icon) return null;
  return <Icon icon={icon} className={className} />;
}

export function isSupportedPlatform(
  platform: string | null
): platform is SupportedSocialPlatform {
  return (
    platform !== null &&
    (SUPPORTED_PLATFORMS as readonly string[]).includes(platform)
  );
}

export function getPlatformLabel(platform: string): string {
  switch (platform) {
    case "facebook":
      return "Facebook";
    case "instagram":
      return "Instagram";
    case "linkedin":
      return "LinkedIn";
    case "twitter":
      return "Twitter";
    case "youtube":
      return "YouTube";
    case "whatsapp":
      return "WhatsApp";
    case "spotify":
      return "Spotify";
    case "applemusic":
      return "Apple Music";
    case "youtubemusic":
      return "YouTube Music";
    default:
      return platform;
  }
}

export function getStreamingPlatformLabel(platform: string): string {
  switch (platform) {
    case "spotify":
      return "Spotify";
    case "apple-music":
    case "applemusic":
      return "Apple Music";
    case "youtube-music":
    case "youtubemusic":
      return "YouTube Music";
    case "soundcloud":
      return "SoundCloud";
    case "bandcamp":
      return "Bandcamp";
    case "tidal":
      return "Tidal";
    case "amazon-music":
      return "Amazon Music";
    case "deezer":
      return "Deezer";
    default:
      return platform;
  }
}

// Streaming platforms that should appear in the "Listen Now" section
export const STREAMING_PLATFORMS: readonly SupportedSocialPlatform[] = [
  "spotify",
  "applemusic",
  "youtubemusic",
] as const;

export function isStreamingPlatform(
  platform: string | null
): platform is (typeof STREAMING_PLATFORMS)[number] {
  return (
    platform !== null &&
    (STREAMING_PLATFORMS as readonly string[]).includes(platform)
  );
}
