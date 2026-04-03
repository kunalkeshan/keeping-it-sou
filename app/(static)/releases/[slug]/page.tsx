import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
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
import { urlForSquare } from "@/sanity/lib/image";

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

  return {
    title: release.title ?? undefined,
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
    ? urlForSquare(release.coverImage, 512)
    : null;
  const title = release.title ?? "Untitled";
  const releaseTypeName = release.releaseType?.name ?? "";

  return (
    <main className="container py-20">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/releases"
          className="text-sm text-muted-foreground hover:text-primary mb-8 inline-block"
        >
          ← Back to Releases
        </Link>

        <header className="mb-8">
          <div className="aspect-square max-w-xs mx-auto rounded-lg overflow-hidden bg-muted mb-6">
            {coverUrl ? (
              <img
                src={coverUrl}
                alt={release.coverImage?.alt ?? title}
                className="size-full object-cover"
                width={512}
                height={512}
              />
            ) : (
              <div className="size-full flex items-center justify-center text-muted-foreground">
                —
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold">{title}</h1>
          {releaseTypeName ? (
            <p className="text-muted-foreground mt-1">{releaseTypeName}</p>
          ) : null}
          {release.releaseDate ? (
            <p className="text-sm text-muted-foreground mt-1">
              Released {new Date(release.releaseDate).toLocaleDateString()}
            </p>
          ) : null}
        </header>

        {release.description && release.description.length > 0 ? (
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {/* TODO: PortableText when blockContent is used */}
            <p className="text-muted-foreground">
              Release detail content can be rendered here with PortableText.
            </p>
          </div>
        ) : null}
      </div>
    </main>
  );
}
