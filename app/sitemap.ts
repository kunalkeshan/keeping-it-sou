/**
 * Dynamic sitemap generator — see docs/sitemap.md for the full entry table.
 *
 * URLs are not hand-maintained. Slug entries and lastModified timestamps come
 * from Sanity via cached fetches tagged with collection tags so the sitemap
 * gets invalidated when releases or legal docs change.
 *
 * The /cms Studio route is intentionally excluded from the sitemap.
 */
import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/config/site";
import { getLegalDocuments } from "@/sanity/queries/legal";
import { getReleasesForSitemap } from "@/sanity/queries/releases";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [legalDocs, releaseDocs] = await Promise.all([
    getLegalDocuments(),
    getReleasesForSitemap(),
  ]);

  // Derive the most recent _updatedAt across each collection for the parent
  // routes (/ and /releases use maxReleaseDate; /legal uses maxLegalDate).
  const maxReleaseDate =
    releaseDocs.length > 0
      ? new Date(
          releaseDocs.reduce(
            (max, d) => Math.max(max, new Date(d._updatedAt).getTime()),
            Number.NEGATIVE_INFINITY
          )
        )
      : new Date();

  const maxLegalDate =
    legalDocs.length > 0
      ? new Date(
          legalDocs.reduce(
            (max, d) => Math.max(max, new Date(d._updatedAt).getTime()),
            Number.NEGATIVE_INFINITY
          )
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
