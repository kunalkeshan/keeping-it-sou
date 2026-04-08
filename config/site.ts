/**
 * Static site configuration — canonical URL resolution.
 *
 * Priority order for the site URL:
 *  1. VERCEL_PROJECT_PRODUCTION_URL (set automatically by Vercel on production)
 *  2. SITE_URL env var (required for local dev and non-Vercel deploys)
 *
 * All metadata, sitemap, and OG URLs must reference SITE_CONFIG.URL rather
 * than hardcoding the origin anywhere in the codebase.
 */
import { assertValue } from "@/lib/utils";

export const SITE_CONFIG = {
  URL: assertValue(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.SITE_URL,
    "Missing environment variable: SITE_URL"
  ),
};
