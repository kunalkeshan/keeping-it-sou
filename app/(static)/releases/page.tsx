/**
 * /releases — grid index of all releases ordered by featured then date.
 * Uses mapReleasesToNavItems to normalise Sanity data for the Link/Image grid.
 */
import Link from "next/link";
import Image from "next/image";
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
      <div className="mx-auto max-w-4xl">
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Releases</h1>
          <p className="text-muted-foreground text-lg">
            Featured and latest releases
          </p>
        </header>

        {items.length === 0 ? (
          <p className="text-muted-foreground text-center">No releases yet.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group bg-card flex flex-col overflow-hidden rounded-lg border transition-all hover:shadow-lg"
                >
                  <div className="bg-muted aspect-square">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt=""
                        className="size-full object-cover"
                        width={400}
                        height={400}
                      />
                    ) : (
                      <div className="text-muted-foreground flex size-full items-center justify-center text-sm">
                        —
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <span className="group-hover:text-primary block truncate font-semibold transition-colors">
                      {item.title}
                    </span>
                    {item.subText ? (
                      <span className="text-muted-foreground text-xs">
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
