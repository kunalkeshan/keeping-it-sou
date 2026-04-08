import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { RELEASES_LIST_QUERY_RESULT } from "@/types/cms";
import { urlForSquare } from "@/sanity/lib/image";
import ReleaseCard from "@/components/releases/release-card";

interface LatestReleasesProps {
  releases: RELEASES_LIST_QUERY_RESULT;
}

export default function LatestReleases({ releases }: LatestReleasesProps) {
  const items = releases.filter(
    (r): r is typeof r & { slug: { current: string } } =>
      Boolean(r.slug?.current)
  );

  if (items.length === 0) {
    return (
      <section className="container py-12">
        <p className="text-muted-foreground text-center">No releases yet.</p>
      </section>
    );
  }

  return (
    <section className="container py-12 lg:py-16">
      <h2 className="border-foreground text-foreground mb-8 border px-4 py-2 text-center text-sm font-medium tracking-widest uppercase">
        RELEASES
      </h2>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {items.map((release) => (
          <li key={release._id}>
            <ReleaseCard
              title={release.title ?? "Untitled"}
              href={`/releases/${release.slug.current}`}
              imageUrl={
                release.coverImage
                  ? urlForSquare(release.coverImage, 512)
                  : null
              }
              alt={release.coverImage?.alt ?? release.title ?? undefined}
            />
          </li>
        ))}
      </ul>

      <div className="mt-8 flex justify-center">
        <Link
          href="/releases"
          className="border-border bg-card text-foreground hover:border-primary/50 hover:bg-accent hover:text-primary inline-flex items-center gap-2 border px-5 py-3 text-sm font-medium tracking-wide uppercase transition-colors"
        >
          VIEW ALL
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
