import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/config/site";
import { sanityFetch } from "@/sanity/lib/sanity-fetch";
import { LEGAL_DOCUMENTS_QUERY } from "@/sanity/queries/legal";
import { SITEMAP_RELEASES_QUERY } from "@/sanity/queries/releases";
import { createCollectionTag } from "@/sanity/lib/cache-tags";
import type { Legal, SITEMAP_RELEASES_QUERY_RESULT } from "@/types/cms";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [legalDocs, releaseDocs] = await Promise.all([
    sanityFetch<Array<Legal>>({
      query: LEGAL_DOCUMENTS_QUERY,
      tags: [createCollectionTag("legal")],
    }),
    sanityFetch<SITEMAP_RELEASES_QUERY_RESULT>({
      query: SITEMAP_RELEASES_QUERY,
      tags: [createCollectionTag("releases")],
    }),
  ]);

  const maxReleaseDate =
    releaseDocs.length > 0
      ? new Date(
          Math.max(...releaseDocs.map((d) => new Date(d._updatedAt).getTime()))
        )
      : new Date();

  const maxLegalDate =
    legalDocs.length > 0
      ? new Date(
          Math.max(...legalDocs.map((d) => new Date(d._updatedAt).getTime()))
        )
      : new Date();

  const legalEntries: MetadataRoute.Sitemap = legalDocs
    .filter((doc) => doc.slug?.current)
    .map((doc) => ({
      url: `${SITE_CONFIG.URL}/legal/${doc.slug?.current}`,
      lastModified: doc._updatedAt ? new Date(doc._updatedAt) : new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    }));

  const releaseEntries: MetadataRoute.Sitemap = releaseDocs
    .filter((doc) => doc.slug?.current)
    .map((doc) => ({
      url: `${SITE_CONFIG.URL}/releases/${doc.slug!.current}`,
      lastModified: doc._updatedAt ? new Date(doc._updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.65,
    }));

  return [
    {
      url: SITE_CONFIG.URL,
      lastModified: maxReleaseDate,
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${SITE_CONFIG.URL}/legal`,
      lastModified: maxLegalDate,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${SITE_CONFIG.URL}/releases`,
      lastModified: maxReleaseDate,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    },
    ...releaseEntries,
    ...legalEntries,
  ];
}
