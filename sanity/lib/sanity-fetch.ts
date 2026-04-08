/**
 * Server-only Sanity fetch wrapper used by all query modules.
 *
 * Key behaviour:
 *  - revalidate: false — disables time-based revalidation; freshness is
 *    controlled entirely by revalidateTag() calls in the webhook handler
 *  - Tags passed to each call map to collection/document cache tags so
 *    Next.js knows exactly which cached responses to bust on publish
 *
 * All query modules should use sanityFetch rather than calling the client
 * directly so the caching strategy stays consistent.
 *
 * @jest-environment node
 */

import "server-only";

import type { FilteredResponseQueryOptions, QueryParams } from "next-sanity";
import { client } from "@/sanity/lib/client";
import type { CacheTag } from "@/sanity/lib/cache-tags";

const DEFAULT_PARAMS = {} as QueryParams;
const DEFAULT_TAGS = [] as CacheTag[];
const FETCH_OPTIONS = {
  revalidate: false, // Use on-demand revalidation via webhook only
} as FilteredResponseQueryOptions & NextFetchRequestConfig;

export const token = process.env.SANITY_API_READ_TOKEN;

export async function sanityFetch<QueryResponse>({
  query,
  params = DEFAULT_PARAMS,
  tags = DEFAULT_TAGS,
  options = FETCH_OPTIONS,
}: {
  query: string;
  params?: QueryParams;
  tags?: CacheTag[];
  options?: FilteredResponseQueryOptions & NextFetchRequestConfig;
}): Promise<QueryResponse> {
  return client.fetch<QueryResponse>(query, params, {
    ...(options.cache && { cache: options.cache }),
    next: {
      revalidate: options.revalidate,
      tags,
    },
  });
}
