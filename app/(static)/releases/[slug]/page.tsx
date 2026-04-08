/**
 * /releases/[slug] — individual release detail page.
 * Sections rendered (when data is present): cover art + info panel, streaming
 * links, official YouTube video embed, credits, and referenced releases grid.
 * The first streaming link becomes the primary "Listen Now" CTA button.
 */
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Play } from "lucide-react";
import { PortableText } from "@portabletext/react";
import { YouTubeEmbed } from "@next/third-parties/google";
import { getReleaseBySlug } from "@/sanity/queries/releases";
import { urlFor, urlForSquare } from "@/sanity/lib/image";
import { portableTextComponents } from "@/lib/portabletext-components";
import { extractYouTubeId } from "@/lib/youtube";
import StreamingLinks from "@/components/releases/streaming-links";
import ReleaseCard from "@/components/releases/release-card";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const release = await getReleaseBySlug(slug);

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
      ...(release.shortDescription && {
        description: release.shortDescription,
      }),
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
      ...(release.shortDescription && {
        description: release.shortDescription,
      }),
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
  };
}

export default async function ReleasePage({ params }: Props) {
  const { slug } = await params;
  const release = await getReleaseBySlug(slug);

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
    (r) => r.slug?.current
  );

  return (
    <main className="container py-16 md:py-20">
      {/* Back link */}
      <Link
        href="/releases"
        className="text-muted-foreground hover:text-primary mb-12 inline-block text-xs tracking-[0.2em] uppercase transition-colors"
      >
        ← Back to Releases
      </Link>

      {/* ── HERO ── */}
      <section className="mb-20 grid gap-12 md:mb-28 md:grid-cols-2 md:gap-16">
        {/* Cover Art */}
        <div className="border-border bg-muted aspect-square w-full overflow-hidden rounded-sm border">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={release.coverImage?.alt ?? title}
              className="size-full object-cover"
              width={800}
              height={800}
            />
          ) : (
            <div className="text-muted-foreground flex size-full items-center justify-center text-sm">
              —
            </div>
          )}
        </div>

        {/* Info Panel */}
        <div className="flex flex-col justify-center gap-6">
          {/* Type • Year */}
          {(releaseTypeName || releaseYear) && (
            <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
              {releaseTypeName}
              {releaseTypeName && releaseYear ? " • " : ""}
              {releaseYear}
            </p>
          )}

          {/* Title */}
          <h1 className="text-4xl leading-tight font-bold md:text-5xl lg:text-6xl">
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
              className="bg-primary hover:bg-primary/80 inline-flex w-fit items-center gap-2 rounded-sm px-6 py-3 text-sm font-medium tracking-[0.1em] text-white uppercase transition-colors"
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
          <h2 className="text-muted-foreground mb-6 text-xs tracking-[0.2em] uppercase">
            Available On
          </h2>
          <StreamingLinks links={streamingLinks} />
        </section>
      )}

      {/* ── OFFICIAL VIDEO ── */}
      {release.videoUrl && videoId && (
        <section className="mb-16 md:mb-20">
          <h2 className="text-muted-foreground mb-6 text-xs tracking-[0.2em] uppercase">
            Official Video
          </h2>
          <div className="border-border overflow-hidden rounded-sm border">
            <YouTubeEmbed videoid={videoId} style="max-width:100%" />
          </div>
        </section>
      )}

      {/* ── CREDITS ── */}
      {release.credits && release.credits.length > 0 && (
        <section className="mb-16 md:mb-20">
          <h2 className="text-muted-foreground mb-6 text-xs tracking-[0.2em] uppercase">
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
          <h2 className="text-muted-foreground mb-6 text-xs tracking-[0.2em] uppercase">
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
