/**
 * Shared social link types and the SocialIcon component used across Header,
 * Footer, and Hero to render icon-only links for social/streaming platforms.
 * SocialMediaLink is the canonical prop type for passing platform links
 * through component trees.
 */
import {
  getSocialIcon,
  getPlatformLabel,
  type SupportedSocialPlatform,
} from "@/lib/social-media";

export interface SocialMediaLink {
  platform: SupportedSocialPlatform;
  url: string;
  label?: string | null;
}

interface SocialIconProps {
  href: string;
  platform: SupportedSocialPlatform;
  label?: string | null;
}

export function SocialIcon({ href, platform, label }: SocialIconProps) {
  const ariaLabel = label || getPlatformLabel(platform);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="bg-card border-border text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-accent flex h-10 w-10 items-center justify-center rounded-sm border transition-all duration-300"
    >
      {getSocialIcon(platform)}
    </a>
  );
}
