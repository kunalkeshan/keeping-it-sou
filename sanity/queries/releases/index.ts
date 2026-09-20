import { cache } from "react";
import { sanityFetch } from "@/sanity/lib/live";
import {
  createCollectionTag,
  createDocumentTag,
} from "@/sanity/lib/cache-tags";
import {
  RELEASES_LIST_QUERY,
  HOME_RELEASES_QUERY,
  SITEMAP_RELEASES_QUERY,
  ALL_RELEASES_QUERY,
  RELEASE_BY_SLUG_QUERY,
  RELEASE_BY_SLUG_STREAMING_LINKS_QUERY,
  RELEASE_BY_SLUG_ARTIST_SOCIAL_LINKS_QUERY,
  RELEASE_BY_SLUG_REFERENCED_RELEASES_STREAMING_LINKS_QUERY,
  FEATURED_RELEASES_QUERY,
  UPCOMING_RELEASES_QUERY,
  UPCOMING_RELEASES_STREAMING_LINKS_QUERY,
  LATEST_FEATURED_RELEASE_QUERY,
  LATEST_FEATURED_RELEASE_STREAMING_LINKS_QUERY,
} from "./queries";
import type {
  RELEASES_LIST_QUERY_RESULT,
  HOME_RELEASES_QUERY_RESULT,
  SITEMAP_RELEASES_QUERY_RESULT,
  ALL_RELEASES_QUERY_RESULT,
  RELEASE_BY_SLUG_QUERY_RESULT,
  RELEASE_BY_SLUG_STREAMING_LINKS_QUERY_RESULT,
  RELEASE_BY_SLUG_ARTIST_SOCIAL_LINKS_QUERY_RESULT,
  RELEASE_BY_SLUG_REFERENCED_RELEASES_STREAMING_LINKS_QUERY_RESULT,
  FEATURED_RELEASES_QUERY_RESULT,
  UPCOMING_RELEASES_QUERY_RESULT,
  UPCOMING_RELEASES_STREAMING_LINKS_QUERY_RESULT,
  LATEST_FEATURED_RELEASE_QUERY_RESULT,
  LATEST_FEATURED_RELEASE_STREAMING_LINKS_QUERY_RESULT,
} from "@/types/cms";

type NonNullElement<T> = NonNullable<T> extends Array<infer U> ? U : never;

export type UpcomingReleaseWithStreamingLinks =
  NonNullElement<UPCOMING_RELEASES_QUERY_RESULT> & {
    streamingLinks: NonNullElement<UPCOMING_RELEASES_STREAMING_LINKS_QUERY_RESULT>["streamingLinks"];
  };

export type LatestFeaturedReleaseWithStreamingLinks =
  NonNullable<LATEST_FEATURED_RELEASE_QUERY_RESULT> & {
    streamingLinks: NonNullable<LATEST_FEATURED_RELEASE_STREAMING_LINKS_QUERY_RESULT>["streamingLinks"];
  };

type ReleaseBySlugDocument = NonNullable<RELEASE_BY_SLUG_QUERY_RESULT>;

export type ReleaseBySlugWithLinks = ReleaseBySlugDocument & {
  streamingLinks: NonNullable<RELEASE_BY_SLUG_STREAMING_LINKS_QUERY_RESULT>["streamingLinks"];
  artists:
    | (NonNullElement<ReleaseBySlugDocument["artists"]> & {
        socialLinks: NonNullElement<RELEASE_BY_SLUG_ARTIST_SOCIAL_LINKS_QUERY_RESULT>["socialLinks"];
      })[]
    | null;
  referencedReleases:
    | (NonNullElement<ReleaseBySlugDocument["referencedReleases"]> & {
        streamingLinks: NonNullElement<RELEASE_BY_SLUG_REFERENCED_RELEASES_STREAMING_LINKS_QUERY_RESULT>["streamingLinks"];
      })[]
    | null;
};

const releasesCollectionTag = createCollectionTag("releases");

/** Lightweight list for nav/footer/releases index. */
export const getReleasesList = cache(
  async (): Promise<RELEASES_LIST_QUERY_RESULT> => {
    const { data } = await sanityFetch({
      query: RELEASES_LIST_QUERY,
      tags: [releasesCollectionTag],
    });
    return data;
  }
);

/** Top-level releases only (excludes releases referenced as children of another release). Home page only. */
export const getHomeReleases = cache(
  async (): Promise<HOME_RELEASES_QUERY_RESULT> => {
    const { data } = await sanityFetch({
      query: HOME_RELEASES_QUERY,
      tags: [releasesCollectionTag],
    });
    return data;
  }
);

/** Minimal slugs + timestamps for sitemap generation. */
export const getReleasesForSitemap = cache(
  async (): Promise<SITEMAP_RELEASES_QUERY_RESULT> => {
    const { data } = await sanityFetch({
      query: SITEMAP_RELEASES_QUERY,
      tags: [releasesCollectionTag],
      perspective: "published",
      stega: false,
    });
    return data;
  }
);

/**
 * Full release list with all fields.
 * stega disabled: streamingLinks[].platform is compared literally against
 * SupportedSocialPlatform elsewhere (lib/social-media.tsx) and stega-branded
 * strings aren't assignable to that literal union.
 */
export const getAllReleases = cache(
  async (): Promise<ALL_RELEASES_QUERY_RESULT> => {
    const { data } = await sanityFetch({
      query: ALL_RELEASES_QUERY,
      tags: [releasesCollectionTag],
      stega: false,
    });
    return data;
  }
);

/** Featured releases only. stega disabled — see getAllReleases. */
export const getFeaturedReleases = cache(
  async (): Promise<FEATURED_RELEASES_QUERY_RESULT> => {
    const { data } = await sanityFetch({
      query: FEATURED_RELEASES_QUERY,
      tags: [releasesCollectionTag],
      stega: false,
    });
    return data;
  }
);

/**
 * Releases with releaseDate in the future, soonest first. Home page Hero
 * teaser + Coming Soon section.
 * streamingLinks is fetched separately (stega disabled) and merged by _id —
 * see UPCOMING_RELEASES_QUERY's comment and CLAUDE.md's Query/fetch pattern.
 */
export const getUpcomingReleases = cache(
  async (): Promise<UpcomingReleaseWithStreamingLinks[]> => {
    const [{ data: releases }, { data: streamingLinksById }] =
      await Promise.all([
        sanityFetch({
          query: UPCOMING_RELEASES_QUERY,
          tags: [releasesCollectionTag],
        }),
        sanityFetch({
          query: UPCOMING_RELEASES_STREAMING_LINKS_QUERY,
          tags: [releasesCollectionTag],
          stega: false,
        }),
      ]);

    const linksById = new Map(
      (streamingLinksById ?? []).map((r) => [r._id, r.streamingLinks])
    );
    return (releases ?? []).map((release) => ({
      ...release,
      streamingLinks: linksById.get(release._id) ?? null,
    }));
  }
);

/**
 * The single most recent featured release, or null if none is featured.
 * streamingLinks is fetched separately (stega disabled) and merged — see
 * LATEST_FEATURED_RELEASE_QUERY's comment and CLAUDE.md's Query/fetch pattern.
 */
export const getLatestFeaturedRelease = cache(
  async (): Promise<LatestFeaturedReleaseWithStreamingLinks | null> => {
    const [{ data: release }, { data: streamingLinksResult }] =
      await Promise.all([
        sanityFetch({
          query: LATEST_FEATURED_RELEASE_QUERY,
          tags: [releasesCollectionTag],
        }),
        sanityFetch({
          query: LATEST_FEATURED_RELEASE_STREAMING_LINKS_QUERY,
          tags: [releasesCollectionTag],
          stega: false,
        }),
      ]);

    if (!release) return null;
    return {
      ...release,
      streamingLinks: streamingLinksResult?.streamingLinks ?? null,
    };
  }
);

/**
 * Single release by URL slug.
 * streamingLinks (this release's, each artist's socialLinks, and each
 * referenced release's) are fetched separately (stega disabled) and merged
 * by _id — see RELEASE_BY_SLUG_QUERY's comment and CLAUDE.md's Query/fetch
 * pattern.
 */
export const getReleaseBySlug = cache(
  async (slug: string): Promise<ReleaseBySlugWithLinks | null> => {
    const [
      { data: release },
      { data: streamingLinksResult },
      { data: artistSocialLinks },
      { data: referencedReleasesStreamingLinks },
    ] = await Promise.all([
      sanityFetch({
        query: RELEASE_BY_SLUG_QUERY,
        params: { slug },
        tags: [releasesCollectionTag, createDocumentTag("releases", slug)],
      }),
      sanityFetch({
        query: RELEASE_BY_SLUG_STREAMING_LINKS_QUERY,
        params: { slug },
        tags: [releasesCollectionTag, createDocumentTag("releases", slug)],
        stega: false,
      }),
      sanityFetch({
        query: RELEASE_BY_SLUG_ARTIST_SOCIAL_LINKS_QUERY,
        params: { slug },
        tags: [releasesCollectionTag, createDocumentTag("releases", slug)],
        stega: false,
      }),
      sanityFetch({
        query: RELEASE_BY_SLUG_REFERENCED_RELEASES_STREAMING_LINKS_QUERY,
        params: { slug },
        tags: [releasesCollectionTag, createDocumentTag("releases", slug)],
        stega: false,
      }),
    ]);

    if (!release) return null;

    const socialLinksByArtistId = new Map(
      (artistSocialLinks ?? []).map((a) => [a._id, a.socialLinks])
    );
    const streamingLinksByReleaseId = new Map(
      (referencedReleasesStreamingLinks ?? []).map((r) => [
        r._id,
        r.streamingLinks,
      ])
    );

    return {
      ...release,
      streamingLinks: streamingLinksResult?.streamingLinks ?? null,
      artists:
        release.artists?.map((artist) => ({
          ...artist,
          socialLinks: socialLinksByArtistId.get(artist._id) ?? null,
        })) ?? null,
      referencedReleases:
        release.referencedReleases?.map((referenced) => ({
          ...referenced,
          streamingLinks: streamingLinksByReleaseId.get(referenced._id) ?? null,
        })) ?? null,
    };
  }
);
