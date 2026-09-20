import { cache } from "react";
import { sanityFetch } from "@/sanity/lib/live";
import {
  createCollectionTag,
  createDocumentTag,
} from "@/sanity/lib/cache-tags";
import { LEGAL_DOCUMENTS_QUERY, LEGAL_DOCUMENT_BY_SLUG_QUERY } from "./queries";
import type {
  LEGAL_DOCUMENTS_QUERY_RESULT,
  LEGAL_DOCUMENT_BY_SLUG_QUERY_RESULT,
} from "@/types/cms";

const legalCollectionTag = createCollectionTag("legal");

/**
 * Passing `build: true` pins perspective to "published" and disables stega,
 * for call sites that run outside a request scope (generateStaticParams) —
 * defineLive's sanityFetch otherwise calls draftMode()/cookies() to resolve
 * its default perspective, which throws at build time. `stega: false` alone
 * (no `build`) is for request-scoped call sites (generateMetadata) that
 * still want draft-aware content but must keep <title>/<meta> free of
 * stega's invisible characters.
 */
type QueryContextOptions = { build?: boolean; stega?: boolean };

/** All legal documents for the /legal index. */
export const getLegalDocuments = cache(
  async ({
    build = false,
    stega = true,
  }: QueryContextOptions = {}): Promise<LEGAL_DOCUMENTS_QUERY_RESULT> => {
    const { data } = await sanityFetch({
      query: LEGAL_DOCUMENTS_QUERY,
      tags: [legalCollectionTag],
      ...(build
        ? { perspective: "published" as const, stega: false }
        : { stega }),
    });
    return data;
  }
);

/** Single legal document by URL slug. */
export const getLegalDocumentBySlug = cache(
  async (
    slug: string,
    { build = false, stega = true }: QueryContextOptions = {}
  ): Promise<LEGAL_DOCUMENT_BY_SLUG_QUERY_RESULT> => {
    const { data } = await sanityFetch({
      query: LEGAL_DOCUMENT_BY_SLUG_QUERY,
      params: { slug },
      tags: [legalCollectionTag, createDocumentTag("legal", slug)],
      ...(build
        ? { perspective: "published" as const, stega: false }
        : { stega }),
    });
    return data;
  }
);
