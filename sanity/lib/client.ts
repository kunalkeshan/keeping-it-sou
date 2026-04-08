/**
 * Configured Sanity client for server-side data fetching.
 * CDN is disabled because tag-based revalidation (revalidateTag) requires
 * fresh data from the API — the CDN may serve stale responses after a tag
 * has been invalidated but before the CDN edge has flushed its cache.
 */
import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // tag-based revalidation requires fresh data; CDN may serve stale after revalidateTag()
});
