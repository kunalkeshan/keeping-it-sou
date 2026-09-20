/**
 * Live Content API + Draft Mode fetch helper.
 *
 * Replaces the previous manual sanity-fetch.ts + revalidateTag webhook as
 * the query layer. defineLive's sanityFetch automatically switches between
 * the `published` and `drafts` perspectives based on Next.js Draft Mode,
 * enables stega encoding for click-to-edit overlays while previewing, and
 * SanityLive subscribes to the Live Content API to re-render on publish.
 *
 * The existing webhook (app/api/revalidate/route.ts) is kept as the
 * deterministic, instant production invalidation path — SanityLive's own
 * revalidation is eventually-consistent by default.
 */
import { defineLive } from "next-sanity/live";
import { client } from "@/sanity/lib/client";

const token = process.env.SANITY_API_READ_TOKEN;

if (!token) {
  throw new Error("Missing environment variable: SANITY_API_READ_TOKEN");
}

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
});
