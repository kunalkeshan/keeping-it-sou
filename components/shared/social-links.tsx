/**
 * Shared social link types and the SocialIcon component used across Header,
 * Footer, and Hero to render icon-only links for social/streaming platforms.
 * SocialMediaLink is the canonical prop type for passing platform links
 * through component trees. Every click is tracked via lib/analytics.ts —
 * callers must pass an explicit `placement` identifying their surface.
 */
"use client";

import {
  getSocialIcon,
  getPlatformLabel,
  type SupportedSocialPlatform,
} from "@/lib/social-media";
import { trackLinkClick, type LinkPlacement } from "@/lib/analytics";

export interface SocialMediaLink {
  platform: SupportedSocialPlatform;
  url: string;
  label?: string | null;
}

interface SocialIconProps {
  href: string;
  platform: SupportedSocialPlatform;
  label?: string | null;
  placement: LinkPlacement;
}

export function SocialIcon({
  href,
  platform,
  label,
  placement,
}: SocialIconProps) {
  const ariaLabel = label || getPlatformLabel(platform);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      onClick={() =>
        trackLinkClick({
          platform,
          url: href,
          placement,
          position: "secondary",
        })
      }
      className="bg-card border-border text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-accent flex h-10 w-10 items-center justify-center rounded-sm border transition-all duration-300"
    >
      {getSocialIcon(platform)}
    </a>
  );
}
