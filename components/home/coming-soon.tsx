/**
 * ComingSoon section — displays releases with a future releaseDate ("upcoming").
 * Mirrors LatestReleases' grid layout, but renders nothing when there are no
 * upcoming releases (no empty-state paragraph, unlike LatestReleases) since
 * upcoming releases are the exception, not the norm. Each card gets a
 * release-date caption and, when available, a single lightweight link to the
 * first streaming/Instagram entry — full multi-link rendering (StreamingLinks)
 * is reserved for the release detail page.
 */
import type { UPCOMING_RELEASES_QUERY_RESULT } from "@/types/cms";
import { urlForSquare } from "@/sanity/lib/image";
import ReleaseCard from "@/components/releases/release-card";
import { LinkClickTracker } from "@/components/releases/link-click-tracker";
import { getSocialIcon, getStreamingPlatformLabel } from "@/lib/social-media";

interface ComingSoonProps {
  releases: UPCOMING_RELEASES_QUERY_RESULT;
}

function formatReleaseDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export default function ComingSoon({ releases }: ComingSoonProps) {
  const items = releases.filter(
    (r): r is typeof r & { slug: { current: string } } =>
      Boolean(r.slug?.current)
  );

  if (items.length === 0) return null;

  return (
    <section className="container py-12 lg:py-16">
      <h2 className="border-foreground text-foreground mb-8 border px-4 py-2 text-center text-sm font-medium tracking-widest uppercase">
        Coming Soon
      </h2>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {items.map((release) => {
          const title = release.title ?? "Untitled";
          const teaserLink = release.streamingLinks?.[0] ?? null;
          const platform = teaserLink?.platform ?? "custom";
          const linkLabel =
            platform === "custom" && teaserLink?.customLabel
              ? teaserLink.customLabel
              : getStreamingPlatformLabel(platform);

          return (
            <li key={release._id}>
              <ReleaseCard
                title={title}
                href={`/releases/${release.slug.current}`}
                imageUrl={
                  release.coverImage
                    ? urlForSquare(release.coverImage, 512)
                    : null
                }
                alt={release.coverImage?.alt ?? title}
              />
              <div className="mt-3 flex items-center justify-between gap-2">
                {release.releaseDate && (
                  <p className="text-muted-foreground text-xs tracking-wide uppercase">
                    {formatReleaseDate(release.releaseDate)}
                  </p>
                )}
                {teaserLink?.url && (
                  <LinkClickTracker
                    platform={platform}
                    url={teaserLink.url}
                    placement="upcoming_release_section"
                    position="secondary"
                    releaseSlug={release.slug.current}
                    releaseTitle={title}
                    releaseType={release.releaseType?.name ?? undefined}
                  >
                    <a
                      href={teaserLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${linkLabel} — ${title}`}
                      className="text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 text-xs transition-colors"
                    >
                      {getSocialIcon(platform, "size-3.5")}
                      {linkLabel}
                    </a>
                  </LinkClickTracker>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
