/**
 * robots.txt generator — allows all public routes, disallows the Sanity
 * Studio (/cms/) and API routes (/api/) from being indexed.
 */
import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/cms/", "/api/"],
    },
    sitemap: `${SITE_CONFIG.URL}/sitemap.xml`,
  };
}
