/**
 * /legal — index of all legal documents (Privacy Policy, Terms of Service, etc.).
 * Renders a card grid with icons resolved by getLegalIcon() based on the doc title.
 */
import Link from "next/link";
import type { Metadata } from "next";
import { getLegalDocuments } from "@/sanity/queries/legal";
import { getLegalIcon } from "@/constants/nav-links";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/shared/json-ld";
import { buildWebPageJsonLd } from "@/lib/structured-data";

const LEGAL_INDEX_DESCRIPTION =
  "View our legal documents including privacy policy, terms of service, and related policies.";

export const metadata: Metadata = {
  title: "Legal Documents",
  description: LEGAL_INDEX_DESCRIPTION,
  alternates: { canonical: "/legal" },
};

export default async function LegalPage() {
  const legalDocuments = await getLegalDocuments();
  const legalJsonLd = buildWebPageJsonLd({
    name: "Legal Documents",
    description: LEGAL_INDEX_DESCRIPTION,
    path: "/legal",
  });

  if (!legalDocuments || legalDocuments.length === 0) {
    return (
      <>
        <JsonLd data={legalJsonLd} />
        <main className="container py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold">Legal Documents</h1>
            <p className="text-muted-foreground">
              No legal documents are currently available.
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <JsonLd data={legalJsonLd} />
      <main className="container py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold">Legal Documents</h1>
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
                  className="group bg-card block rounded-lg border p-6 transition-all hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 text-primary shrink-0 rounded-lg p-3">
                      <Icon className="size-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="group-hover:text-primary mb-2 text-xl font-semibold transition-colors">
                        {doc.title}
                      </h2>
                      {doc.description && (
                        <p className="text-muted-foreground line-clamp-2 text-sm">
                          {doc.description}
                        </p>
                      )}
                      <div className="text-primary mt-3 flex items-center gap-2 text-sm">
                        <span>Read more</span>
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
