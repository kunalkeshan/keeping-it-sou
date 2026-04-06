import { cache } from "react";
import { sanityFetch } from "@/sanity/lib/sanity-fetch";
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

/** All legal documents for the /legal index. */
export const getLegalDocuments = cache(
  async (): Promise<LEGAL_DOCUMENTS_QUERY_RESULT> => {
    return sanityFetch<LEGAL_DOCUMENTS_QUERY_RESULT>({
      query: LEGAL_DOCUMENTS_QUERY,
      tags: [legalCollectionTag],
    });
  }
);

/** Single legal document by URL slug. */
export const getLegalDocumentBySlug = cache(
  async (slug: string): Promise<LEGAL_DOCUMENT_BY_SLUG_QUERY_RESULT> => {
    return sanityFetch<LEGAL_DOCUMENT_BY_SLUG_QUERY_RESULT>({
      query: LEGAL_DOCUMENT_BY_SLUG_QUERY,
      params: { slug },
      tags: [legalCollectionTag, createDocumentTag("legal", slug)],
    });
  }
);
