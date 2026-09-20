import { defineQuery } from "next-sanity";

/**
 * Lightweight list for nav/footer/releases index; sort: featured first, then
 * releaseDate desc. Excludes upcoming releases (releaseDate in the future) —
 * see UPCOMING_RELEASES_QUERY for those. Reusable elsewhere.
 *
 * Compares releaseDate (a plain "YYYY-MM-DD" date string) against
 * string(now()) as plain strings, NOT dateTime(releaseDate) vs dateTime(now()).
 * Two reasons:
 *  1. GROQ's dateTime() returns null for a bare date string like "2026-12-25"
 *     (it requires a full ISO datetime) — dateTime(releaseDate) is always
 *     null, silently matching zero documents at runtime.
 *  2. Sanity TypeGen's static analyzer can't narrow a filter containing a
 *     raw now()/releaseDate comparison — `releaseDate <= now()` infers
 *     `Array<never>` for the whole query. string(now()) keeps inference
 *     working (verified) while ISO 8601 strings still sort/compare
 *     correctly lexicographically, including today's date comparing as
 *     "already released" (not upcoming) the moment it arrives.
 */
export const RELEASES_LIST_QUERY = defineQuery(`
  *[_type == "releases" && releaseDate <= string(now())] | order(featured desc, releaseDate desc) {
    _id,
    title,
    slug,
    releaseType-> {
      name
    },
    coverImage {
      asset->,
      alt
    }
  }
`);

/**
 * Top-level releases only, for the home page. Excludes any release that is
 * listed in another release's referencedReleases (e.g. individual tracks
 * that already appear nested under their parent EP/Album), and excludes
 * upcoming releases (releaseDate in the future) — see UPCOMING_RELEASES_QUERY
 * for those. Sort matches RELEASES_LIST_QUERY: featured first, then
 * releaseDate desc.
 */
export const HOME_RELEASES_QUERY = defineQuery(`
  *[_type == "releases"
    && releaseDate <= string(now())
    && !(_id in *[_type == "releases" && referencesOtherReleases == true].referencedReleases[]._ref)
  ] | order(featured desc, releaseDate desc) {
    _id,
    title,
    slug,
    releaseType-> {
      name
    },
    coverImage {
      asset->,
      alt
    }
  }
`);

/**
 * Releases with releaseDate in the future, soonest first. Excludes nested
 * referenced releases (same rule as HOME_RELEASES_QUERY). Powers the home
 * page Hero teaser (soonest = first item) and the "Coming Soon" section.
 * "Upcoming" is derived purely from releaseDate — no separate status field.
 *
 * streamingLinks (which contains the stega-unsafe `platform` field) is
 * fetched separately by UPCOMING_RELEASES_STREAMING_LINKS_QUERY and merged
 * by _id in getUpcomingReleases() — see CLAUDE.md's Query/fetch pattern.
 */
export const UPCOMING_RELEASES_QUERY = defineQuery(`
  *[_type == "releases"
    && releaseDate > string(now())
    && !(_id in *[_type == "releases" && referencesOtherReleases == true].referencedReleases[]._ref)
  ] | order(releaseDate asc) {
    _id,
    title,
    slug,
    releaseType-> {
      name
    },
    coverImage {
      asset->,
      alt
    },
    releaseDate
  }
`);

/** streamingLinks for UPCOMING_RELEASES_QUERY, fetched with stega disabled. */
export const UPCOMING_RELEASES_STREAMING_LINKS_QUERY = defineQuery(`
  *[_type == "releases"
    && releaseDate > string(now())
    && !(_id in *[_type == "releases" && referencesOtherReleases == true].referencedReleases[]._ref)
  ] | order(releaseDate asc) {
    _id,
    streamingLinks[] {
      _key,
      platform,
      url,
      customLabel
    }
  }
`);

/** Minimal fields for sitemap URLs and lastModified; order matches the releases index. */
export const SITEMAP_RELEASES_QUERY = defineQuery(`
  *[_type == "releases"] | order(featured desc, releaseDate desc) {
    _id,
    slug,
    _updatedAt
  }
`);

export const ALL_RELEASES_QUERY = defineQuery(`
  *[_type == "releases"] | order(featured desc, releaseDate desc) {
    _id,
    title,
    slug,
    description,
    releaseType-> {
      _id,
      name,
      slug
    },
    artists[]-> {
      _id,
      name,
      slug,
      profileImage {
        asset->,
        alt
      }
    },
    coverImage {
      asset->,
      alt
    },
    releaseDate,
    streamingLinks[] {
      platform,
      url,
      customLabel
    },
    credits,
    featured,
    referencesOtherReleases,
    referencedReleases[]-> {
      _id,
      title,
      slug,
      coverImage {
        asset->,
        alt
      },
      releaseDate,
      releaseType-> {
        name,
        slug
      }
    },
    _createdAt,
    _updatedAt
  }
`);

/**
 * All fields except the three `platform`-bearing arrays (this release's
 * streamingLinks, each artist's socialLinks, each referencedReleases'
 * streamingLinks) — kept out so this query can run with stega enabled
 * (click-to-edit) without also branding `platform` as a StegaString, which
 * conflicts with the literal union it's compared against in
 * lib/social-media.tsx. Those three are fetched separately (stega disabled)
 * by RELEASE_BY_SLUG_STREAMING_LINKS_QUERY, RELEASE_BY_SLUG_ARTIST_SOCIAL_LINKS_QUERY,
 * and RELEASE_BY_SLUG_REFERENCED_RELEASES_STREAMING_LINKS_QUERY, and merged
 * by _id/_key in getReleaseBySlug() — see CLAUDE.md's Query/fetch pattern.
 */
export const RELEASE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "releases" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    shortDescription,
    releaseType-> {
      _id,
      name,
      slug,
      description
    },
    artists[]-> {
      _id,
      name,
      slug,
      bio,
      profileImage {
        asset->,
        alt
      },
      website
    },
    coverImage {
      asset->,
      alt
    },
    releaseDate,
    genre,
    duration,
    videoUrl,
    credits,
    featured,
    referencesOtherReleases,
    referencedReleases[]-> {
      _id,
      title,
      slug,
      description,
      coverImage {
        asset->,
        alt
      },
      releaseDate,
      releaseType-> {
        name,
        slug
      },
      artists[]-> {
        _id,
        name,
        slug
      }
    },
    _createdAt,
    _updatedAt
  }
`);

/** This release's streamingLinks, stega disabled — see RELEASE_BY_SLUG_QUERY. */
export const RELEASE_BY_SLUG_STREAMING_LINKS_QUERY = defineQuery(`
  *[_type == "releases" && slug.current == $slug][0] {
    streamingLinks[] {
      _key,
      platform,
      url,
      customLabel
    }
  }
`);

/**
 * Each artist's socialLinks, stega disabled, keyed by artist _id — see
 * RELEASE_BY_SLUG_QUERY.
 */
export const RELEASE_BY_SLUG_ARTIST_SOCIAL_LINKS_QUERY = defineQuery(`
  *[_type == "releases" && slug.current == $slug][0].artists[]-> {
    _id,
    socialLinks[] {
      platform,
      url,
      label
    }
  }
`);

/**
 * Each referenced release's streamingLinks, stega disabled, keyed by
 * referenced release _id — see RELEASE_BY_SLUG_QUERY.
 */
export const RELEASE_BY_SLUG_REFERENCED_RELEASES_STREAMING_LINKS_QUERY =
  defineQuery(`
  *[_type == "releases" && slug.current == $slug][0].referencedReleases[]-> {
    _id,
    streamingLinks[] {
      platform,
      url,
      customLabel
    }
  }
`);

export const FEATURED_RELEASES_QUERY = defineQuery(`
  *[_type == "releases" && featured == true] | order(releaseDate desc) {
    _id,
    title,
    slug,
    description,
    releaseType-> {
      _id,
      name,
      slug
    },
    artists[]-> {
      _id,
      name,
      slug,
      profileImage {
        asset->,
        alt
      }
    },
    coverImage {
      asset->,
      alt
    },
    releaseDate,
    streamingLinks[] {
      platform,
      url,
      customLabel
    },
    featured
  }
`);

/**
 * The single most recent featured release (featured == true, latest
 * releaseDate). Powers the Hero/Header/nav/Footer featured-release override
 * (see siteConfig.useFeaturedReleaseOverride). Returns null when no release
 * is featured.
 *
 * streamingLinks (stega-unsafe `platform` field) is fetched separately by
 * LATEST_FEATURED_RELEASE_STREAMING_LINKS_QUERY and merged in
 * getLatestFeaturedRelease() — see CLAUDE.md's Query/fetch pattern.
 */
export const LATEST_FEATURED_RELEASE_QUERY = defineQuery(`
  *[_type == "releases" && featured == true] | order(releaseDate desc)[0] {
    _id,
    title,
    slug,
    coverImage {
      asset->,
      alt
    },
    releaseDate
  }
`);

/** streamingLinks for LATEST_FEATURED_RELEASE_QUERY, stega disabled. */
export const LATEST_FEATURED_RELEASE_STREAMING_LINKS_QUERY = defineQuery(`
  *[_type == "releases" && featured == true] | order(releaseDate desc)[0] {
    streamingLinks[] {
      _key,
      platform,
      url,
      customLabel
    }
  }
`);

export const RELEASES_BY_TYPE_QUERY = defineQuery(`
  *[_type == "releases" && releaseType._ref == $releaseTypeId] | order(featured desc, releaseDate desc) {
    _id,
    title,
    slug,
    description,
    releaseType-> {
      _id,
      name,
      slug
    },
    artists[]-> {
      _id,
      name,
      slug,
      profileImage {
        asset->,
        alt
      }
    },
    coverImage {
      asset->,
      alt
    },
    releaseDate,
    streamingLinks[] {
      platform,
      url,
      customLabel
    },
    featured
  }
`);

export const RELEASES_BY_ARTIST_QUERY = defineQuery(`
  *[_type == "releases" && $artistId in artists[]._ref] | order(featured desc, releaseDate desc) {
    _id,
    title,
    slug,
    description,
    releaseType-> {
      _id,
      name,
      slug
    },
    artists[]-> {
      _id,
      name,
      slug,
      profileImage {
        asset->,
        alt
      }
    },
    coverImage {
      asset->,
      alt
    },
    releaseDate,
    streamingLinks[] {
      platform,
      url,
      customLabel
    },
    featured
  }
`);
