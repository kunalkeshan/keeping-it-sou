import {
  getSocialIcon,
  getPlatformLabel,
  type SupportedSocialPlatform,
} from "@/lib/social-media";
import { LightRays } from "@/components/ui/light-rays";
import Image from "next/image";

interface SocialMediaLink {
  platform: SupportedSocialPlatform;
  url: string;
  label?: string | null;
}

interface HeroProps {
  streamingLinks: SocialMediaLink[];
  socialLinks: SocialMediaLink[];
  title?: string;
}

const PLACEHOLDER_TITLE = "Keeping it Sou";

export default function Hero({
  streamingLinks,
  socialLinks,
  title = PLACEHOLDER_TITLE,
}: HeroProps) {
  return (
    <section className="relative bg-background overflow-hidden">
      <LightRays
        count={6}
        color="rgba(255, 59, 59, 0.35)"
        blur={32}
        speed={16}
        length="60vh"
      />
      <div className="container relative z-10 py-6 lg:py-8">
        {/* Hero block: image behind text. */}
        <div className="relative min-h-[240px] lg:min-h-[360px] flex flex-col items-center justify-center">
          {/* Layer 1: floating figure */}
          <div
            className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
            aria-hidden
          >
            <div className="relative w-full max-w-[240px] lg:max-w-[300px] h-[220px] lg:h-[300px] animate-float">
              <Image
                src="/assets/sou-float.png"
                alt=""
                width={137}
                height={283}
                className="absolute inset-0 w-full h-full object-contain object-center opacity-90"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </div>

          {/* Layer 2: text on top – higher z-index and isolation so it always paints above */}
          <div
            className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto px-4"
            style={{ isolation: "isolate" }}
          >
            <p className="text-foreground text-sm uppercase tracking-widest mb-4 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
              Hip-Hop Artist
            </p>
            {/* Solid headline so it's always readable; image stays behind */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-sans font-bold tracking-tight uppercase text-foreground drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              &ldquo;{title}&rdquo;
            </h1>
            {/* Subline – add content later */}
            {/* <p className="text-xl md:text-2xl text-foreground/90 font-medium uppercase mt-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              is out now
            </p> */}
          </div>
        </div>

        {/* Streaming + social below the hero block */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mt-6">
          {/* Streaming - TRVNS-style buttons in a row */}
          {streamingLinks.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 flex-wrap justify-center">
              {streamingLinks.map((link) => (
                <StreamingButton
                  key={link.platform}
                  platform={link.platform}
                  href={link.url}
                  label={link.label}
                />
              ))}
            </div>
          )}

          {/* Social row */}
          {socialLinks.length > 0 && (
            <div className="flex gap-3 flex-wrap justify-center pt-6 mt-6 border-t border-border">
              {socialLinks.map((link) => (
                <SocialIcon
                  key={link.platform}
                  href={link.url}
                  platform={link.platform}
                  label={link.label}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

interface StreamingButtonProps {
  platform: SupportedSocialPlatform;
  href: string;
  label?: string | null;
}

function StreamingButton({ platform, href, label }: StreamingButtonProps) {
  const displayLabel = label || getPlatformLabel(platform);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground font-medium rounded-sm hover:opacity-90 transition-opacity uppercase text-sm tracking-wide"
    >
      {getSocialIcon(platform, "size-5")}
      <span>Listen on {displayLabel}</span>
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
