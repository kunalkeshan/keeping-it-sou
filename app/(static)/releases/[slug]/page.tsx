import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Play } from "lucide-react";
import { PortableText } from "@portabletext/react";
import { YouTubeEmbed } from "@next/third-parties/google";
import { sanityFetch } from "@/sanity/lib/sanity-fetch";
import {
  RELEASE_BY_SLUG_QUERY,
  RELEASES_LIST_QUERY,
} from "@/sanity/queries/releases";
import {
  createCollectionTag,
  createDocumentTag,
} from "@/sanity/lib/cache-tags";
import type {
  RELEASE_BY_SLUG_QUERY_RESULT,
  RELEASES_LIST_QUERY_RESULT,
} from "@/types/cms";
import { urlFor, urlForSquare } from "@/sanity/lib/image";
import { portableTextComponents } from "@/lib/portabletext-components";
import { extractYouTubeId } from "@/lib/youtube";
import StreamingLinks from "@/components/releases/streaming-links";
import ReleaseCard from "@/components/releases/release-card";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const releases =
    (await sanityFetch<RELEASES_LIST_QUERY_RESULT>({
      query: RELEASES_LIST_QUERY,
      tags: [createCollectionTag("releases")],
    })) ?? [];

  return releases
    .filter((r) => r.slug?.current)
    .map((r) => ({ slug: r.slug!.current }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const release = await sanityFetch<RELEASE_BY_SLUG_QUERY_RESULT>({
    query: RELEASE_BY_SLUG_QUERY,
    params: { slug },
    tags: [
      createCollectionTag("releases"),
      createDocumentTag("releases", slug),
    ],
  });

  if (!release) {
    return { title: "Release Not Found" };
  }

  const ogImageUrl = release.coverImage?.asset
    ? urlFor(release.coverImage)
        .width(1200)
        .height(630)
        .fit("crop")
        .format("jpg")
        .quality(85)
        .url()
    : undefined;

  return {
    title: release.title ?? undefined,
    description: release.shortDescription ?? undefined,
    alternates: { canonical: `/releases/${slug}` },
    openGraph: {
      url: `/releases/${slug}`,
      ...(release.title && { title: release.title }),
      ...(release.shortDescription && { description: release.shortDescription }),
      ...(ogImageUrl && {
        images: [
          {
            url: ogImageUrl,
            alt: release.coverImage?.alt ?? release.title ?? "",
          },
        ],
      }),
    },
    twitter: {
      ...(release.title && { title: release.title }),
      ...(release.shortDescription && { description: release.shortDescription }),
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
  };
}

export default async function ReleasePage({ params }: Props) {
  const { slug } = await params;

  const release = await sanityFetch<RELEASE_BY_SLUG_QUERY_RESULT>({
    query: RELEASE_BY_SLUG_QUERY,
    params: { slug },
    tags: [
      createCollectionTag("releases"),
      createDocumentTag("releases", slug),
    ],
  });

  if (!release) {
    notFound();
  }

  const coverUrl = release.coverImage
    ? urlForSquare(release.coverImage, 800)
    : null;
  const title = release.title ?? "Untitled";
  const releaseTypeName = release.releaseType?.name ?? "";
  const releaseYear = release.releaseDate
    ? release.releaseDate.slice(0, 4)
    : null;
  const artists = release.artists ?? [];
  const artistNames = artists
    .map((a) => a.name)
    .filter(Boolean)
    .join(", ");
  const streamingLinks = release.streamingLinks ?? [];
  const primaryLink = streamingLinks[0] ?? null;
  const videoId = release.videoUrl ? extractYouTubeId(release.videoUrl) : null;
  const referencedReleases = (release.referencedReleases ?? []).filter(
    (r) => r.slug?.current,
  );

  return (
    <main className="container py-16 md:py-20">
      {/* Back link */}
      <Link
        href="/releases"
        className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors mb-12 inline-block"
      >
        ← Back to Releases
      </Link>

      {/* ── HERO ── */}
      <section className="grid md:grid-cols-2 gap-12 md:gap-16 mb-20 md:mb-28">
        {/* Cover Art */}
        <div className="aspect-square w-full overflow-hidden rounded-sm border border-border bg-muted">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={release.coverImage?.alt ?? title}
              className="size-full object-cover"
              width={800}
              height={800}
            />
          ) : (
            <div className="size-full flex items-center justify-center text-muted-foreground text-sm">
              —
            </div>
          )}
        </div>

        {/* Info Panel */}
        <div className="flex flex-col justify-center gap-6">
          {/* Type • Year */}
          {(releaseTypeName || releaseYear) && (
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {releaseTypeName}
              {releaseTypeName && releaseYear ? " • " : ""}
              {releaseYear}
            </p>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            {title}
          </h1>

          {/* Artists */}
          {artistNames && (
            <p className="text-muted-foreground text-base">{artistNames}</p>
          )}

          {/* Description */}
          {release.description && release.description.length > 0 && (
            <div>
              <PortableText
                value={release.description}
                components={portableTextComponents}
              />
            </div>
          )}

          {/* Listen Now CTA */}
          {primaryLink?.url && (
            <a
              href={primaryLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 w-fit px-6 py-3 bg-primary text-white rounded-sm hover:bg-primary/80 transition-colors font-medium text-sm uppercase tracking-[0.1em]"
            >
              <Play className="size-4 fill-current" />
              Listen Now
            </a>
          )}
        </div>
      </section>

      {/* ── AVAILABLE ON ── */}
      {streamingLinks.length > 0 && (
        <section className="mb-16 md:mb-20">
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
            Available On
          </h2>
          <StreamingLinks links={streamingLinks} />
        </section>
      )}

      {/* ── OFFICIAL VIDEO ── */}
      {release.videoUrl && videoId && (
        <section className="mb-16 md:mb-20">
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
            Official Video
          </h2>
          <div className="rounded-sm overflow-hidden border border-border">
            <YouTubeEmbed videoid={videoId} style="max-width:100%" />
          </div>
        </section>
      )}

      {/* ── CREDITS ── */}
      {release.credits && release.credits.length > 0 && (
        <section className="mb-16 md:mb-20">
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
            Credits
          </h2>
          <div>
            <PortableText
              value={release.credits}
              components={portableTextComponents}
            />
          </div>
        </section>
      )}

      {/* ── REFERENCED RELEASES ── */}
      {release.referencesOtherReleases && referencedReleases.length > 0 && (
        <section>
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
            Also In This Release
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {referencedReleases.map((r) => {
              const imgUrl = r.coverImage
                ? urlForSquare(r.coverImage, 400)
                : null;
              return (
                <li key={r._id}>
                  <ReleaseCard
                    title={r.title ?? "Untitled"}
                    href={`/releases/${r.slug?.current ?? ""}`}
                    imageUrl={imgUrl}
                    alt={r.coverImage?.alt ?? r.title ?? ""}
                  />
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </main>
  );
}
