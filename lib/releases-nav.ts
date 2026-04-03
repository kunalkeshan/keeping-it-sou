import type { RELEASES_LIST_QUERY_RESULT } from "@/types/cms";
import { urlForSquare } from "@/sanity/lib/image";

export type ReleaseNavItem = {
  href: string;
  title: string;
  subText: string;
  imageUrl: string | null;
};

const DEFAULT_BASE_PATH = "/releases";

/**
 * Maps releases list query result to nav/footer items (href, title, subText, square image).
 * Only includes items with a valid slug; safe for Link href.
 */
export function mapReleasesToNavItems(
  releases: RELEASES_LIST_QUERY_RESULT,
  options?: { basePath?: string }
): ReleaseNavItem[] {
  const basePath = options?.basePath ?? DEFAULT_BASE_PATH;

  return releases
    .filter((r): r is typeof r & { slug: { current: string } } =>
      Boolean(r.slug?.current)
    )
    .map((r) => ({
      href: `${basePath}/${r.slug.current}`,
      title: r.title ?? "Untitled",
      subText: r.releaseType?.name ?? "",
      imageUrl: r.coverImage ? urlForSquare(r.coverImage) : null,
    }));
}
