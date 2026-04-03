import { defineQuery } from "next-sanity";

/** Lightweight list for nav/footer; sort: featured first, then releaseDate desc. Reusable elsewhere. */
export const RELEASES_LIST_QUERY = defineQuery(`
  *[_type == "releases"] | order(featured desc, releaseDate desc) {
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

export const RELEASE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "releases" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
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
      socialLinks[] {
        platform,
        url,
        label
      },
      website
    },
    coverImage {
      asset->,
      alt
    },
    releaseDate,
    tracklist[] {
      trackTitle,
      duration,
      featuredArtists[]-> {
        _id,
        name,
        slug,
        profileImage {
          asset->,
          alt
        }
      },
      description,
      lyricsLink,
      order
    },
    streamingLinks[] {
      platform,
      url,
      customLabel
    },
    credits,
    label,
    catalogNumber,
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
      },
      streamingLinks[] {
        platform,
        url,
        customLabel
      }
    },
    _createdAt,
    _updatedAt
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
