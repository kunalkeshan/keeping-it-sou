import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/sanity-fetch";
import {
  LEGAL_DOCUMENT_BY_SLUG_QUERY,
  LEGAL_DOCUMENTS_QUERY,
} from "@/sanity/queries/legal";
import {
  createCollectionTag,
  createDocumentTag,
} from "@/sanity/lib/cache-tags";
import type {
  LEGAL_DOCUMENT_BY_SLUG_QUERY_RESULT,
  LEGAL_DOCUMENTS_QUERY_RESULT,
} from "@/types/cms";
import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/lib/portabletext-components";
import { CalendarDays } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const legalDocuments = await sanityFetch<LEGAL_DOCUMENTS_QUERY_RESULT>({
    query: LEGAL_DOCUMENTS_QUERY,
    tags: [createCollectionTag("legal")],
  });

  return (
    legalDocuments
      ?.filter((doc) => doc.slug?.current)
      .map((doc) => ({
        slug: doc.slug!.current,
      })) ?? []
  );
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const legalDocument =
    await sanityFetch<LEGAL_DOCUMENT_BY_SLUG_QUERY_RESULT>({
      query: LEGAL_DOCUMENT_BY_SLUG_QUERY,
      params: { slug },
      tags: [
        createCollectionTag("legal"),
        createDocumentTag("legal", slug),
      ],
    });

  if (!legalDocument) {
    return {
      title: "Legal Document Not Found",
    };
  }

  return {
    title: legalDocument.title ?? undefined,
    description: legalDocument.description ?? undefined,
    alternates: { canonical: `/legal/${slug}` },
  };
}

export default async function LegalDocumentPage({ params }: Props) {
  const { slug } = await params;

  const legalDocument =
    await sanityFetch<LEGAL_DOCUMENT_BY_SLUG_QUERY_RESULT>({
      query: LEGAL_DOCUMENT_BY_SLUG_QUERY,
      params: { slug },
      tags: [
        createCollectionTag("legal"),
        createDocumentTag("legal", slug),
      ],
    });

  if (!legalDocument) {
    notFound();
  }

  const formattedDate = legalDocument._updatedAt
    ? new Date(legalDocument._updatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <main className="container py-20">
      <article className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">
            {legalDocument.title}
          </h1>
          {legalDocument.description && (
            <p className="text-lg text-muted-foreground mb-4">
              {legalDocument.description}
            </p>
          )}
          {formattedDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="size-4" />
              <span>Last updated: {formattedDate}</span>
            </div>
          )}
        </header>

        {legalDocument.content && (
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <PortableText
              value={legalDocument.content}
              components={portableTextComponents}
            />
          </div>
        )}
      </article>
    </main>
  );
}
