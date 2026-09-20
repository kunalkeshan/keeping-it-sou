import { cache } from "react";
import { sanityFetch } from "@/sanity/lib/live";
import { createCollectionTag } from "@/sanity/lib/cache-tags";
import {
  SITE_CONFIG_QUERY,
  SITE_CONFIG_SOCIAL_MEDIA_QUERY,
  FOOTER_LEGAL_LINKS_QUERY,
} from "./queries";
import type {
  SITE_CONFIG_QUERY_RESULT,
  SITE_CONFIG_SOCIAL_MEDIA_QUERY_RESULT,
  FOOTER_LEGAL_LINKS_QUERY_RESULT,
} from "@/types/cms";

const siteConfigTag = createCollectionTag("siteConfig");

export type SiteConfigWithSocialMedia = SITE_CONFIG_QUERY_RESULT & {
  socialMedia: SITE_CONFIG_SOCIAL_MEDIA_QUERY_RESULT;
};

/**
 * Global site configuration (title, description, OG images, hero, social
 * links). Fetched as two queries merged together: socialMedia[].platform is
 * compared literally against SupportedSocialPlatform elsewhere
 * (lib/social-media.tsx), so it's fetched with stega disabled via
 * SITE_CONFIG_SOCIAL_MEDIA_QUERY — everything else (including the hero
 * fields rendered on the homepage) keeps stega enabled for click-to-edit.
 * See sanity/queries/site-config/queries.ts.
 */
export const getSiteConfig = cache(
  async (): Promise<SiteConfigWithSocialMedia | null> => {
    const [{ data: siteConfig }, { data: socialMedia }] = await Promise.all([
      sanityFetch({
        query: SITE_CONFIG_QUERY,
        tags: [siteConfigTag],
      }),
      sanityFetch({
        query: SITE_CONFIG_SOCIAL_MEDIA_QUERY,
        tags: [siteConfigTag],
        stega: false,
      }),
    ]);

    if (!siteConfig) return null;
    return { ...siteConfig, socialMedia };
  }
);

/** Footer legal links from siteConfig. */
export const getFooterLegalLinks = cache(
  async (): Promise<FOOTER_LEGAL_LINKS_QUERY_RESULT> => {
    const { data } = await sanityFetch({
      query: FOOTER_LEGAL_LINKS_QUERY,
      tags: [siteConfigTag],
    });
    return data;
  }
);
