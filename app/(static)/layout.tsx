/**
 * Route-group layout for all public (static) pages.
 * Responsibilities:
 *  - Generates dynamic OG/Twitter metadata from Sanity siteConfig
 *  - Wraps every page with the shared <Header> and <Footer>
 *  - Mounts analytics (Google Analytics + Microsoft Clarity)
 * Uses Promise.all to fetch siteConfig and releases in parallel so both
 * Header and Footer get the data they need in a single round-trip.
 */
import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { urlFor } from "@/sanity/lib/image";
import { getSiteConfig } from "@/sanity/queries/site-config";
import { getReleasesList } from "@/sanity/queries/releases";
import MicrosoftClarity from "@/components/analytics/clarity";
import { Header } from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import {
  isStreamingPlatform,
  type SupportedSocialPlatform,
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
  const [siteConfig, releasesList] = await Promise.all([
    getSiteConfig(),
    getReleasesList(),
  ]);

  const socialMedia = siteConfig?.socialMedia ?? [];
  // Extract only streaming platforms (Spotify, Apple Music, YouTube Music) for the header CTA.
  const streamingLinks: SocialMediaLink[] = socialMedia
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

  return (
    <>
      <Header streamingLinks={streamingLinks} releases={releasesList} />
      {children}
      <Footer siteConfig={siteConfig} releases={releasesList} />
      <GoogleAnalytics gaId="G-CBPBRCTFZV" />
      <MicrosoftClarity />
    </>
  );
}
