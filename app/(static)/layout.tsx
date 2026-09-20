/**
 * Route-group layout for all public (static) pages.
 * Responsibilities:
 *  - Generates dynamic OG/Twitter metadata from Sanity siteConfig
 *  - Wraps every page with the shared <Header> and <Footer>
 *  - Mounts analytics (Google Analytics + Microsoft Clarity)
 * Uses Promise.all to fetch siteConfig and releases in parallel so both
 * Header and Footer get the data they need in a single round-trip.
 * Streaming links passed to Header/Footer are merged with the latest
 * featured release's links per-platform when siteConfig.useFeaturedReleaseOverride
 * is on (see lib/social-media.tsx's mergeStreamingAndSocialLinks) — the same
 * merge used on the home page, so Hero/Header/nav/Footer stay consistent.
 */
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { GoogleAnalytics } from "@next/third-parties/google";
import { VisualEditing } from "next-sanity/visual-editing";
import { urlFor } from "@/sanity/lib/image";
import { SanityLive } from "@/sanity/lib/live";
import { getSiteConfig } from "@/sanity/queries/site-config";
import {
  getReleasesList,
  getHomeReleases,
  getLatestFeaturedRelease,
} from "@/sanity/queries/releases";
import MicrosoftClarity from "@/components/analytics/clarity";
import { Header } from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { DisableDraftMode } from "@/components/shared/disable-draft-mode";
import {
  isStreamingPlatform,
  mergeStreamingAndSocialLinks,
} from "@/lib/social-media";
import type { SocialMediaLink } from "@/components/shared/social-links";

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig();

  const title = siteConfig?.title || "Keeping It Sou";
  const description = siteConfig?.description || "Hip-Hop artist";

  const ogImageUrl = siteConfig?.ogImage
    ? urlFor(siteConfig.ogImage)
        .width(1200)
        .height(630)
        .fit("crop")
        .format("jpg")
        .quality(85)
        .url()
    : undefined;

  const twitterImageUrl = siteConfig?.twitterImage
    ? urlFor(siteConfig.twitterImage)
        .width(1200)
        .height(600)
        .fit("crop")
        .format("jpg")
        .quality(85)
        .url()
    : ogImageUrl;

  return {
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description,
    openGraph: {
      type: "website",
      title,
      description,
      images: ogImageUrl
        ? [
            {
              url: ogImageUrl,
              alt: siteConfig?.ogImage?.alt || title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: twitterImageUrl ? [twitterImageUrl] : undefined,
    },
  };
}

export default async function StaticLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [siteConfig, releasesList, homeReleases, featuredRelease] =
    await Promise.all([
      getSiteConfig(),
      getReleasesList(),
      getHomeReleases(),
      getLatestFeaturedRelease(),
    ]);

  const socialMedia = siteConfig?.socialMedia ?? [];
  const useFeaturedOverride = siteConfig?.useFeaturedReleaseOverride ?? true;

  // Merge siteConfig links with the featured release's links, per platform,
  // then extract only streaming platforms (Spotify, Apple Music, YouTube
  // Music) for the header CTA.
  const mergedLinks = mergeStreamingAndSocialLinks(
    socialMedia,
    featuredRelease?.streamingLinks,
    useFeaturedOverride
  );
  const streamingLinks: SocialMediaLink[] = mergedLinks.filter((link) =>
    isStreamingPlatform(link.platform)
  );

  return (
    <>
      <Header streamingLinks={streamingLinks} releases={releasesList} />
      {children}
      <Footer
        siteConfig={siteConfig}
        releases={homeReleases}
        featuredRelease={featuredRelease}
      />
      <GoogleAnalytics gaId="G-CBPBRCTFZV" />
      <MicrosoftClarity />
      <SanityLive />
      {(await draftMode()).isEnabled && (
        <>
          <VisualEditing />
          <DisableDraftMode />
        </>
      )}
    </>
  );
}
