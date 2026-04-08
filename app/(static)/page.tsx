import type { Metadata } from "next";
import Hero from "@/components/home/hero";
import LatestReleases from "@/components/home/latest-releases";
import About from "@/components/home/about";
import { getSiteConfig } from "@/sanity/queries/site-config";
import { getReleasesList } from "@/sanity/queries/releases";
import {
  isStreamingPlatform,
  isSupportedPlatform,
  type SupportedSocialPlatform,
} from "@/lib/social-media";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function Home() {
  const [siteConfig, releases] = await Promise.all([
    getSiteConfig(),
    getReleasesList(),
  ]);

  const latestReleases = (releases ?? []).slice(0, 4);

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

  return (
    <main>
      <Hero streamingLinks={streamingLinks} socialLinks={socialLinks} />
      <LatestReleases releases={latestReleases} />
      <About />
    </main>
  );
}
