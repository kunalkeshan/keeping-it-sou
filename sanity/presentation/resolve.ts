import {
  defineDocuments,
  defineLocations,
  type PresentationPluginOptions,
} from "sanity/presentation";

/**
 * Presentation Tool document resolvers.
 *
 * mainDocuments: maps a previewed URL to the document the Studio should open.
 * locations: powers each document's "used on" links in the Studio.
 *
 * Types without a dedicated rendering route (artist, faqs, releaseType) get a
 * `message`-only location instead of a broken link — add a real location here
 * once a route renders them directly.
 */

const mainDocuments = defineDocuments([
  {
    route: "/releases/:slug",
    filter: `_type == "releases" && slug.current == $slug`,
  },
  {
    route: "/legal/:slug",
    filter: `_type == "legal" && slug.current == $slug`,
  },
]);

export const presentationResolve: PresentationPluginOptions["resolve"] = {
  mainDocuments,
  locations: {
    releases: defineLocations({
      select: {
        title: "title",
        slug: "slug.current",
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Untitled release",
            href: `/releases/${doc?.slug}`,
          },
          { title: "All releases", href: "/releases" },
        ],
      }),
    }),
    legal: defineLocations({
      select: {
        title: "title",
        slug: "slug.current",
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Untitled legal document",
            href: `/legal/${doc?.slug}`,
          },
          { title: "All legal documents", href: "/legal" },
        ],
      }),
    }),
    // Singleton — drives the homepage hero/header/footer (see CLAUDE.md's
    // featured-release-override docs). No slug/route of its own.
    siteConfig: defineLocations({
      message: "Drives the homepage hero, header, and footer",
      tone: "positive",
      locations: [{ title: "Home", href: "/" }],
    }),
    artist: defineLocations({
      message: "Referenced by releases — no dedicated route yet",
      tone: "caution",
    }),
    faqs: defineLocations({
      message: "Not yet rendered on a public route",
      tone: "caution",
    }),
    releaseType: defineLocations({
      message: "Used to group releases — no dedicated route",
      tone: "caution",
    }),
  },
};
