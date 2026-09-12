/**
 * Hero section — the top-of-page block on the home page.
 * Layers a floating artist image behind the title text, then renders
 * streaming CTA buttons and social icon links below.
 * streamingLinks and socialLinks are pre-split by the parent page.
 * An optional upcomingRelease prop renders a "Coming Soon" teaser banner
 * for the soonest upcoming release (releaseDate in the future); omitted
 * entirely when there's nothing upcoming.
 */
"use client";

import {
  getSocialIcon,
  getPlatformLabel,
  getStreamingPlatformLabel,
  type SupportedSocialPlatform,
} from "@/lib/social-media";
import { trackLinkClick } from "@/lib/analytics";
import { LightRays } from "@/components/ui/light-rays";
import Image from "next/image";

interface SocialMediaLink {
  platform: SupportedSocialPlatform;
  url: string;
  label?: string | null;
}

export interface UpcomingReleaseTeaser {
  title: string;
  releaseDate: string;
  coverImageUrl: string | null;
  coverImageAlt?: string;
  link: { platform: string; url: string } | null;
}

interface HeroProps {
  streamingLinks: SocialMediaLink[];
  socialLinks: SocialMediaLink[];
  title?: string;
  upcomingRelease?: UpcomingReleaseTeaser | null;
}

const PLACEHOLDER_TITLE = "Sou";

function formatReleaseDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function UpcomingReleaseBanner({
  release,
}: {
  release: UpcomingReleaseTeaser;
}) {
  const linkLabel = release.link
    ? getStreamingPlatformLabel(release.link.platform)
    : null;

  return (
    <div className="border-border bg-card/80 mx-auto mt-6 flex max-w-xl flex-col items-center gap-3 rounded-sm border px-6 py-4 text-center backdrop-blur-sm sm:flex-row sm:justify-between sm:text-left">
      <div className="flex items-center gap-3">
        {release.coverImageUrl && (
          <Image
            src={release.coverImageUrl}
            alt={release.coverImageAlt || release.title}
            width={48}
            height={48}
            className="size-12 shrink-0 rounded-sm object-cover"
          />
        )}
        <div>
          <p className="text-primary text-xs font-medium tracking-widest uppercase">
            Coming Soon
          </p>
          <p className="text-foreground text-sm font-medium">
            {release.title}{" "}
            <span className="text-muted-foreground">
              — {formatReleaseDate(release.releaseDate)}
            </span>
          </p>
        </div>
      </div>
      {release.link && (
        <a
          href={release.link.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackLinkClick({
              platform: release.link!.platform,
              url: release.link!.url,
              placement: "hero_upcoming_release",
              position: "primary",
              releaseTitle: release.title,
            })
          }
          className="bg-primary text-primary-foreground inline-flex shrink-0 items-center gap-2 rounded-sm px-4 py-2 text-xs font-medium tracking-wide uppercase transition-opacity hover:opacity-90"
        >
          {getSocialIcon(release.link.platform, "size-4")}
          <span>View on {linkLabel}</span>
        </a>
      )}
    </div>
  );
}

export default function Hero({
  streamingLinks,
  socialLinks,
  title = PLACEHOLDER_TITLE,
  upcomingRelease,
}: HeroProps) {
  return (
    <section className="bg-background relative overflow-hidden">
      <LightRays
        count={6}
        color="rgba(255, 59, 59, 0.35)"
        blur={32}
        speed={16}
        length="60vh"
      />
      <div className="relative z-10 container py-6 lg:py-8">
        {/* Hero block: image behind text. */}
        <div className="relative flex min-h-[240px] flex-col items-center justify-center lg:min-h-[360px]">
          {/* Layer 1: floating figure */}
          <div
            className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
            aria-hidden
          >
            <div className="animate-float relative h-[220px] w-full max-w-[240px] lg:h-[300px] lg:max-w-[300px]">
              <Image
                src="/assets/sou-float.png"
                alt=""
                width={137}
                height={283}
                className="absolute inset-0 h-full w-full object-contain object-center opacity-90"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </div>

          {/* Layer 2: text on top – higher z-index and isolation so it always paints above */}
          <div
            className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 text-center"
            style={{ isolation: "isolate" }}
          >
            <p className="text-foreground mb-4 text-sm tracking-widest uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
              Hip-Hop Artist
            </p>
            {/* Solid headline so it's always readable; image stays behind */}
            <h1 className="text-foreground font-sans text-4xl font-bold tracking-tight uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] md:text-5xl lg:text-6xl xl:text-7xl">
              &ldquo;{title}&rdquo;
            </h1>
            {/* Subline – add content later */}
            {/* <p className="text-xl md:text-2xl text-foreground/90 font-medium uppercase mt-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              is out now
            </p> */}
          </div>
        </div>

        {/* Upcoming release teaser */}
        {upcomingRelease && <UpcomingReleaseBanner release={upcomingRelease} />}

        {/* Streaming + social below the hero block */}
        <div className="mx-auto mt-6 flex max-w-4xl flex-col items-center text-center">
          {/* Streaming - TRVNS-style buttons in a row */}
          {streamingLinks.length > 0 && (
            <div className="flex flex-col flex-wrap justify-center gap-3 sm:flex-row">
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
            <div className="border-border mt-6 flex flex-wrap justify-center gap-3 border-t pt-6">
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
      onClick={() =>
        trackLinkClick({
          platform,
          url: href,
          placement: "hero",
          position: "secondary",
        })
      }
      className="bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-sm px-5 py-3 text-sm font-medium tracking-wide uppercase transition-opacity hover:opacity-90"
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
      onClick={() =>
        trackLinkClick({
          platform,
          url: href,
          placement: "hero",
          position: "secondary",
        })
      }
      className="bg-card border-border text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-accent flex h-10 w-10 items-center justify-center rounded-sm border transition-all duration-300"
    >
      {getSocialIcon(platform)}
    </a>
  );
}
