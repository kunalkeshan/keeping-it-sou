import Image from "next/image";
import { Icon } from "@iconify/react";
import {
  getSocialIcon,
  getPlatformLabel,
  type SupportedSocialPlatform,
} from "@/lib/social-media";
import { LightRays } from "@/components/ui/light-rays";

interface SocialMediaLink {
  platform: SupportedSocialPlatform;
  url: string;
  label?: string | null;
}

interface HeroProps {
  title?: string;
  streamingLinks: SocialMediaLink[];
  socialLinks: SocialMediaLink[];
}

// Album details - update these as needed
const ALBUM_NAME = "From Hodges";

export default function Hero({
  title = "Keeping it Sou",
  streamingLinks,
  socialLinks,
}: HeroProps) {
  return (
    <section className="min-h-screen lg:h-screen bg-background flex items-center">
      <LightRays
        count={6}
        color="rgba(255, 59, 59, 0.35)"
        blur={32}
        speed={16}
        length="72vh"
      />
      <div className="container py-12 lg:py-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left - Album Cover */}
          <div className="relative max-w-md lg:max-w-lg mx-auto lg:mx-0">
            <div className="relative overflow-hidden rounded-sm shadow-xl">
              <Image
                src="/icon.png"
                alt={`${ALBUM_NAME} Album Cover`}
                width={600}
                height={600}
                className="w-full aspect-square object-cover"
                priority
              />
            </div>
            {/* Album Name */}
            <h2 className="text-xl md:text-2xl font-sans font-bold text-foreground mt-4">
              {ALBUM_NAME}
            </h2>
          </div>

          {/* Right - Title, Streaming Links & Social Media */}
          <div className="flex flex-col gap-6">
            {/* Site Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-foreground tracking-tight">
              {title}
            </h1>

            {/* Album Section */}
            <div>
              <p className="text-muted-foreground text-sm uppercase tracking-widest mb-1">
                The Album
              </p>
              <p className="text-foreground text-lg font-medium">
                {ALBUM_NAME}
              </p>
            </div>

            {/* Streaming Links */}
            {streamingLinks.length > 0 && (
              <div>
                <p className="text-muted-foreground text-sm uppercase tracking-widest mb-4">
                  Listen Now
                </p>
                <div className="flex flex-col gap-3">
                  {streamingLinks.map((link) => (
                    <StreamingLink
                      key={link.platform}
                      platform={link.platform}
                      href={link.url}
                      label={link.label}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Social Media */}
            {socialLinks.length > 0 && (
              <div className="pt-6 border-t border-border">
                <p className="text-muted-foreground text-sm uppercase tracking-widest mb-4">
                  Follow Me
                </p>
                <div className="flex gap-3 flex-wrap">
                  {socialLinks.map((link) => (
                    <SocialIcon
                      key={link.platform}
                      href={link.url}
                      platform={link.platform}
                      label={link.label}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

interface StreamingLinkProps {
  platform: SupportedSocialPlatform;
  href: string;
  label?: string | null;
}

function StreamingLink({ platform, href, label }: StreamingLinkProps) {
  const displayLabel = label || getPlatformLabel(platform);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 p-3 bg-card hover:bg-accent rounded-sm border border-border transition-all duration-300 hover:border-primary/50"
    >
      <div className="w-8 h-8 flex items-center justify-center text-foreground group-hover:text-primary transition-colors">
        {getSocialIcon(platform, "size-5")}
      </div>
      <span className="text-foreground font-medium group-hover:text-primary transition-colors">
        {displayLabel}
      </span>
      <Icon
        icon="lucide:arrow-right"
        className="size-5 ml-auto text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
      />
    </a>
  );
}

interface SocialIconProps {
  href: string;
  platform: SupportedSocialPlatform;
  label?: string | null;
}

function SocialIcon({ href, platform, label }: SocialIconProps) {
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
