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
      className="w-10 h-10 flex items-center justify-center bg-card border border-border rounded-sm text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-accent transition-all duration-300"
    >
      {getSocialIcon(platform)}
    </a>
  );
}
