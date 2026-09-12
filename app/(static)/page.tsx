/**
 * Home page — assembles Hero, LatestReleases, and About sections.
 * Fetches siteConfig (social/streaming links) and releases in parallel,
 * then splits social media into streaming vs. non-streaming for Hero props.
 */
import type { Metadata } from "next";
import Hero from "@/components/home/hero";
import ComingSoon from "@/components/home/coming-soon";
import LatestReleases from "@/components/home/latest-releases";
import About from "@/components/home/about";
import { getSiteConfig } from "@/sanity/queries/site-config";
import {
  getHomeReleases,
  getUpcomingReleases,
} from "@/sanity/queries/releases";
import { urlForSquare } from "@/sanity/lib/image";
import {
  isStreamingPlatform,
  isSupportedPlatform,
  type SupportedSocialPlatform,
} from "@/lib/social-media";
import { JsonLd } from "@/components/shared/json-ld";
import {
  buildHomeMusicGroupJsonLd,
  buildHomeWebSiteJsonLd,
} from "@/lib/structured-data";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Re-evaluates the upcoming-vs-released date comparison hourly, since that
// state is purely date-derived (no Sanity content change to trigger the
// on-demand revalidation webhook when a release date simply arrives).
export const revalidate = 3600;

export default async function Home() {
  const [siteConfig, releases, upcomingReleases] = await Promise.all([
    getSiteConfig(),
    getHomeReleases(),
    getUpcomingReleases(),
  ]);

  const latestReleases = (releases ?? []).slice(0, 4);

  const featuredUpcoming = upcomingReleases?.[0] ?? null;
  const heroUpcomingRelease = featuredUpcoming
    ? {
        title: featuredUpcoming.title ?? "Untitled",
        releaseDate: featuredUpcoming.releaseDate ?? "",
        coverImageUrl: featuredUpcoming.coverImage
          ? urlForSquare(featuredUpcoming.coverImage, 96)
          : null,
        coverImageAlt:
          featuredUpcoming.coverImage?.alt ??
          featuredUpcoming.title ??
          undefined,
        link: featuredUpcoming.streamingLinks?.[0]?.url
          ? {
              platform: featuredUpcoming.streamingLinks[0].platform ?? "custom",
              url: featuredUpcoming.streamingLinks[0].url,
            }
          : null,
      }
    : null;

  // Filter and transform social media links
  const socialMedia = siteConfig?.socialMedia ?? [];

  // Streaming platforms (Spotify, Apple Music, YouTube Music)
  const streamingLinks = socialMedia
    .filter(
      (
        item
      ): item is typeof item & {
        platform: SupportedSocialPlatform;
        url: string;
      } => isStreamingPlatform(item.platform ?? null) && !!item.url
    )
    .map((item) => ({
      platform: item.platform,
      url: item.url,
      label: item.label,
    }));

  // Other social media platforms (preserving original order)
  const socialLinks = socialMedia
    .filter(
      (
        item
      ): item is typeof item & {
        platform: SupportedSocialPlatform;
        url: string;
      } =>
        isSupportedPlatform(item.platform ?? null) &&
        !isStreamingPlatform(item.platform ?? null) &&
        !!item.url
    )
    .map((item) => ({
      platform: item.platform,
      url: item.url,
      label: item.label,
    }));

  const musicGroupJsonLd = buildHomeMusicGroupJsonLd(siteConfig);
  const webSiteJsonLd = buildHomeWebSiteJsonLd(siteConfig);

  return (
    <>
      <JsonLd data={musicGroupJsonLd} />
      <JsonLd data={webSiteJsonLd} />
      <main>
        <Hero
          streamingLinks={streamingLinks}
          socialLinks={socialLinks}
          upcomingRelease={heroUpcomingRelease}
        />
        <ComingSoon releases={upcomingReleases ?? []} />
        <LatestReleases releases={latestReleases} />
        <About />
      </main>
    </>
  );
}
