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
  getLatestFeaturedRelease,
} from "@/sanity/queries/releases";
import { urlFor, urlForSquare } from "@/sanity/lib/image";
import {
  isStreamingPlatform,
  isSupportedPlatform,
  mergeStreamingAndSocialLinks,
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
  const [siteConfig, releases, upcomingReleases, featuredRelease] =
    await Promise.all([
      getSiteConfig(),
      getHomeReleases(),
      getUpcomingReleases(),
      getLatestFeaturedRelease(),
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

  const socialMedia = siteConfig?.socialMedia ?? [];
  const useFeaturedOverride = siteConfig?.useFeaturedReleaseOverride ?? true;
  const featuredStreamingLinks = featuredRelease?.streamingLinks ?? [];

  // Merge siteConfig links with the featured release's links, per platform
  // (release wins per-platform when the override is active), then split
  // into streaming vs. other social platforms for Hero props.
  const mergedLinks = mergeStreamingAndSocialLinks(
    socialMedia,
    featuredStreamingLinks,
    useFeaturedOverride
  );

  const streamingLinks = mergedLinks.filter((link) =>
    isStreamingPlatform(link.platform)
  );
  const socialLinks = mergedLinks.filter(
    (link) =>
      isSupportedPlatform(link.platform) && !isStreamingPlatform(link.platform)
  );

  const heroImageUrl = siteConfig?.heroImage
    ? urlFor(siteConfig.heroImage).width(300).url()
    : null;

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
          title={siteConfig?.heroTitle ?? undefined}
          subtitle={siteConfig?.heroSubtitle ?? undefined}
          heroImageUrl={heroImageUrl}
          heroImageAlt={siteConfig?.heroImage?.alt ?? undefined}
          upcomingRelease={heroUpcomingRelease}
        />
        <ComingSoon releases={upcomingReleases ?? []} />
        <LatestReleases releases={latestReleases} />
        <About />
      </main>
    </>
  );
}
