import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { sanityFetch } from "@/sanity/lib/sanity-fetch";
import { SITE_CONFIG_QUERY } from "@/sanity/queries/site-config";
import { urlFor } from "@/sanity/lib/image";
import { createCollectionTag } from "@/sanity/lib/cache-tags";
import type { SiteConfig } from "@/types/cms";
import MicrosoftClarity from "@/components/analytics/clarity";
import { Header } from "@/components/layout/header";

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await sanityFetch<SiteConfig>({
    query: SITE_CONFIG_QUERY,
    tags: [createCollectionTag("siteConfig")],
  });

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

export default function StaticLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <GoogleAnalytics gaId="G-CBPBRCTFZV" />
      <MicrosoftClarity />
    </>
  );
}
