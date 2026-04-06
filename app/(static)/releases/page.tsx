import Link from "next/link";
import type { Metadata } from "next";
import { getReleasesList } from "@/sanity/queries/releases";
import { mapReleasesToNavItems } from "@/lib/releases-nav";

export const metadata: Metadata = {
  title: "Releases",
  description: "Browse all releases.",
  alternates: { canonical: "/releases" },
};

export default async function ReleasesPage() {
  const releases = (await getReleasesList()) ?? [];

  const items = mapReleasesToNavItems(releases);

  return (
    <main className="container py-20">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Releases</h1>
          <p className="text-muted-foreground text-lg">
            Featured and latest releases
          </p>
        </header>

        {items.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No releases yet.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex flex-col rounded-lg border bg-card overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="aspect-square bg-muted">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt=""
                        className="size-full object-cover"
                        width={400}
                        height={400}
                      />
                    ) : (
                      <div className="size-full flex items-center justify-center text-muted-foreground text-sm">
                        —
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <span className="font-semibold group-hover:text-primary transition-colors block truncate">
                      {item.title}
                    </span>
                    {item.subText ? (
                      <span className="text-xs text-muted-foreground">
                        {item.subText}
                      </span>
                    ) : null}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
