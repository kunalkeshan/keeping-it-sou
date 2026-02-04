import { defineQuery } from "next-sanity";

export const ALL_ARTISTS_QUERY = defineQuery(`
  *[_type == "artist"] | order(order asc, name asc) {
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
    website,
    order,
    _createdAt,
    _updatedAt
  }
`);

export const ARTIST_BY_SLUG_QUERY = defineQuery(`
  *[_type == "artist" && slug.current == $slug][0] {
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
    website,
    order,
    "releases": *[_type == "releases" && $slug in artists[].slug.current] | order(featured desc, order asc, releaseDate desc) {
      _id,
      title,
      slug,
      description,
      releaseType-> {
        _id,
        name,
        slug
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
      featured,
      order
    },
    _createdAt,
    _updatedAt
  }
`);
