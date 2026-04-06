import { cache } from "react";
import { sanityFetch } from "@/sanity/lib/sanity-fetch";
import {
  createCollectionTag,
  createDocumentTag,
} from "@/sanity/lib/cache-tags";
import {
  RELEASES_LIST_QUERY,
  SITEMAP_RELEASES_QUERY,
  ALL_RELEASES_QUERY,
  RELEASE_BY_SLUG_QUERY,
  FEATURED_RELEASES_QUERY,
} from "./queries";
import type {
  RELEASES_LIST_QUERY_RESULT,
  SITEMAP_RELEASES_QUERY_RESULT,
  ALL_RELEASES_QUERY_RESULT,
  RELEASE_BY_SLUG_QUERY_RESULT,
  FEATURED_RELEASES_QUERY_RESULT,
} from "@/types/cms";

const releasesCollectionTag = createCollectionTag("releases");

/** Lightweight list for nav/footer/releases index. */
export const getReleasesList = cache(
  async (): Promise<RELEASES_LIST_QUERY_RESULT> => {
    return sanityFetch<RELEASES_LIST_QUERY_RESULT>({
      query: RELEASES_LIST_QUERY,
      tags: [releasesCollectionTag],
    });
  }
);

/** Minimal slugs + timestamps for sitemap generation. */
export const getReleasesForSitemap = cache(
  async (): Promise<SITEMAP_RELEASES_QUERY_RESULT> => {
    return sanityFetch<SITEMAP_RELEASES_QUERY_RESULT>({
      query: SITEMAP_RELEASES_QUERY,
      tags: [releasesCollectionTag],
    });
  }
);

/** Full release list with all fields. */
export const getAllReleases = cache(
  async (): Promise<ALL_RELEASES_QUERY_RESULT> => {
    return sanityFetch<ALL_RELEASES_QUERY_RESULT>({
      query: ALL_RELEASES_QUERY,
      tags: [releasesCollectionTag],
    });
  }
);

/** Featured releases only. */
export const getFeaturedReleases = cache(
  async (): Promise<FEATURED_RELEASES_QUERY_RESULT> => {
    return sanityFetch<FEATURED_RELEASES_QUERY_RESULT>({
      query: FEATURED_RELEASES_QUERY,
      tags: [releasesCollectionTag],
    });
  }
);

/** Single release by URL slug. */
export const getReleaseBySlug = cache(
  async (slug: string): Promise<RELEASE_BY_SLUG_QUERY_RESULT> => {
    return sanityFetch<RELEASE_BY_SLUG_QUERY_RESULT>({
      query: RELEASE_BY_SLUG_QUERY,
      params: { slug },
      tags: [releasesCollectionTag, createDocumentTag("releases", slug)],
    });
  }
);
