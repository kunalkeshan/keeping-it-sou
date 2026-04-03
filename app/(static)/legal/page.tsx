import Link from "next/link";
import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/sanity-fetch";
import { LEGAL_DOCUMENTS_QUERY } from "@/sanity/queries/legal";
import { createCollectionTag } from "@/sanity/lib/cache-tags";
import type { LEGAL_DOCUMENTS_QUERY_RESULT } from "@/types/cms";
import { getLegalIcon } from "@/constants/nav-links";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Legal Documents",
  description:
    "View our legal documents including privacy policy, terms of service, and related policies.",
};

export default async function LegalPage() {
  const legalDocuments = await sanityFetch<LEGAL_DOCUMENTS_QUERY_RESULT>({
    query: LEGAL_DOCUMENTS_QUERY,
    tags: [createCollectionTag("legal")],
  });

  if (!legalDocuments || legalDocuments.length === 0) {
    return (
      <main className="container py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Legal Documents</h1>
          <p className="text-muted-foreground">
            No legal documents are currently available.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Legal Documents</h1>
          <p className="text-muted-foreground text-lg">
            Important information about our policies and terms
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {legalDocuments.map((doc) => {
            const Icon = getLegalIcon(doc.title ?? "");
            return (
              <Link
                key={doc._id}
                href={`/legal/${doc.slug?.current}`}
                className="group block p-6 rounded-lg border bg-card hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary shrink-0">
                    <Icon className="size-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {doc.title}
                    </h2>
                    {doc.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {doc.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-3 text-sm text-primary">
                      <span>Read more</span>
                      <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
