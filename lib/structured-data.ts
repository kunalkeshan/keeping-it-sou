/**
 * Builds schema.org JSON-LD objects (typed via schema-dts) from data already
 * fetched for a page's normal rendering — never issue a new Sanity fetch
 * solely for structured data. Render the result with components/shared/json-ld.tsx.
 * Every property is omitted entirely (never null/"" /[]) when its source is
 * empty, so emitted JSON-LD stays valid per schema.org's "missing = unknown"
 * semantics. See CLAUDE.md's Structured Data (JSON-LD) section.
 */
import type {
  MusicRecording,
  MusicAlbum,
  MusicGroup,
  WebSite,
  ItemList,
  WebPage,
  WithContext,
} from "schema-dts";
import { SITE_CONFIG } from "@/config/site";
import { urlForSquare } from "@/sanity/lib/image";
import type {
  RELEASE_BY_SLUG_QUERY_RESULT,
  RELEASES_LIST_QUERY_RESULT,
  SITE_CONFIG_QUERY_RESULT,
} from "@/types/cms";

type Release = NonNullable<RELEASE_BY_SLUG_QUERY_RESULT>;
type ReleaseArtist = NonNullable<Release["artists"]>[number];

function absoluteUrl(path: string): string {
  return `${SITE_CONFIG.URL}${path}`;
}

/** Converts a validated "mm:ss" string to an ISO 8601 duration, e.g. "3:24" -> "PT3M24S". */
function toIsoDuration(value: string): string | undefined {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!match) return undefined;
  const [, minutes, seconds] = match;
  return `PT${minutes}M${seconds}S`;
}

function buildArtistJsonLd(artists: Release["artists"]): MusicGroup[] {
  return (artists ?? []).map((artist: ReleaseArtist) => {
    const image = urlForSquare(artist.profileImage, 800);
    const sameAs = (artist.socialLinks ?? [])
      .map((link) => link.url)
      .filter((url): url is string => !!url);

    return {
      "@type": "MusicGroup",
      ...(artist.name && { name: artist.name }),
      ...(artist.website && { url: artist.website }),
      ...(sameAs.length > 0 && { sameAs }),
      ...(image && { image }),
    };
  });
}

export function buildReleaseJsonLd(
  release: Release
): WithContext<MusicRecording | MusicAlbum> {
  const isSingle = release.releaseType?.name === "Single";
  const type = isSingle ? "MusicRecording" : "MusicAlbum";
  const url = release.slug?.current
    ? absoluteUrl(`/releases/${release.slug.current}`)
    : undefined;
  const image = urlForSquare(release.coverImage, 1200);
  const sameAs = (release.streamingLinks ?? [])
    .map((link) => link.url)
    .filter((linkUrl): linkUrl is string => !!linkUrl);
  const byArtist = buildArtistJsonLd(release.artists);
  const duration =
    isSingle && release.duration ? toIsoDuration(release.duration) : undefined;

  return {
    "@context": "https://schema.org",
    "@type": type,
    ...(url && { "@id": url, url }),
    ...(release.title && { name: release.title }),
    ...(release.shortDescription && {
      description: release.shortDescription,
    }),
    ...(image && { image }),
    ...(release.releaseDate && { datePublished: release.releaseDate }),
    ...(byArtist.length > 0 && { byArtist }),
    ...(release.genre && release.genre.length > 0 && { genre: release.genre }),
    ...(duration && { duration }),
    ...(sameAs.length > 0 && { sameAs }),
  };
}

export function buildHomeMusicGroupJsonLd(
  siteConfig: SITE_CONFIG_QUERY_RESULT
): WithContext<MusicGroup> {
  const image = urlForSquare(siteConfig?.ogImage, 800);
  const sameAs = (siteConfig?.socialMedia ?? [])
    .map((link) => link.url)
    .filter((url): url is string => !!url);

  return {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    "@id": SITE_CONFIG.URL,
    url: SITE_CONFIG.URL,
    ...(siteConfig?.title && { name: siteConfig.title }),
    ...(siteConfig?.description && { description: siteConfig.description }),
    ...(image && { image }),
    ...(sameAs.length > 0 && { sameAs }),
  };
}

export function buildHomeWebSiteJsonLd(
  siteConfig: SITE_CONFIG_QUERY_RESULT
): WithContext<WebSite> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: SITE_CONFIG.URL,
    ...(siteConfig?.title && { name: siteConfig.title }),
    ...(siteConfig?.description && { description: siteConfig.description }),
  };
}

export function buildReleasesListJsonLd(
  releases: RELEASES_LIST_QUERY_RESULT
): WithContext<ItemList> {
  const itemListElement = releases
    .filter((release) => release.slug?.current)
    .map((release, index) => ({
      "@type": "ListItem" as const,
      position: index + 1,
      url: absoluteUrl(`/releases/${release.slug!.current}`),
      ...(release.title && { name: release.title }),
    }));

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    url: absoluteUrl("/releases"),
    name: "Releases",
    ...(itemListElement.length > 0 && { itemListElement }),
  };
}

export function buildWebPageJsonLd(params: {
  name?: string | null;
  description?: string | null;
  path: string;
}): WithContext<WebPage> {
  const { name, description, path } = params;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: absoluteUrl(path),
    ...(name && { name }),
    ...(description && { description }),
  };
}
