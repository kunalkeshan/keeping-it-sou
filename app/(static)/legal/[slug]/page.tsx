import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getLegalDocuments,
  getLegalDocumentBySlug,
} from "@/sanity/queries/legal";
import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/lib/portabletext-components";
import { CalendarDays } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const legalDocuments = await getLegalDocuments();
  return (
    legalDocuments
      ?.filter((doc) => doc.slug?.current)
      .map((doc) => ({ slug: doc.slug!.current })) ?? []
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const legalDocument = await getLegalDocumentBySlug(slug);

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
  const legalDocument = await getLegalDocumentBySlug(slug);

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
      <article className="mx-auto max-w-4xl">
        <header className="mb-12">
          <h1 className="mb-4 text-4xl font-bold">{legalDocument.title}</h1>
          {legalDocument.description && (
            <p className="text-muted-foreground mb-4 text-lg">
              {legalDocument.description}
            </p>
          )}
          {formattedDate && (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <CalendarDays className="size-4" />
              <span>Last updated: {formattedDate}</span>
            </div>
          )}
        </header>

        {legalDocument.content && (
          <div className="prose prose-lg dark:prose-invert max-w-none">
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
