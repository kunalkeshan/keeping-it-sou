import Link from "next/link";
import type { Metadata } from "next";
import { getLegalDocuments } from "@/sanity/queries/legal";
import { getLegalIcon } from "@/constants/nav-links";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Legal Documents",
  description:
    "View our legal documents including privacy policy, terms of service, and related policies.",
  alternates: { canonical: "/legal" },
};

export default async function LegalPage() {
  const legalDocuments = await getLegalDocuments();

  if (!legalDocuments || legalDocuments.length === 0) {
    return (
      <main className="container py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-4xl font-bold">Legal Documents</h1>
          <p className="text-muted-foreground">
            No legal documents are currently available.
          </p>
        </div>
      </main>
    );
  }

  return (
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
  );
}
