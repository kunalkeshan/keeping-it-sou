import { cache } from "react";
import { sanityFetch } from "@/sanity/lib/sanity-fetch";
import { createCollectionTag } from "@/sanity/lib/cache-tags";
import { SITE_CONFIG_QUERY, FOOTER_LEGAL_LINKS_QUERY } from "./queries";
import type {
  SITE_CONFIG_QUERY_RESULT,
  FOOTER_LEGAL_LINKS_QUERY_RESULT,
} from "@/types/cms";

const siteConfigTag = createCollectionTag("siteConfig");

/** Global site configuration (title, description, OG images, social links). */
export const getSiteConfig = cache(
  async (): Promise<SITE_CONFIG_QUERY_RESULT> => {
    return sanityFetch<SITE_CONFIG_QUERY_RESULT>({
      query: SITE_CONFIG_QUERY,
      tags: [siteConfigTag],
    });
  }
);

/** Footer legal links from siteConfig. */
export const getFooterLegalLinks = cache(
  async (): Promise<FOOTER_LEGAL_LINKS_QUERY_RESULT> => {
    return sanityFetch<FOOTER_LEGAL_LINKS_QUERY_RESULT>({
      query: FOOTER_LEGAL_LINKS_QUERY,
      tags: [siteConfigTag],
    });
  }
);
