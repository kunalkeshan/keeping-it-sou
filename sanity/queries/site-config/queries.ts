import { defineQuery } from "next-sanity";

/**
 * All siteConfig fields except socialMedia — kept in a query of its own so it
 * can be fetched with stega enabled (click-to-edit) without also branding
 * socialMedia[].platform, which lib/social-media.tsx compares literally.
 * See SITE_CONFIG_SOCIAL_MEDIA_QUERY for that field.
 */
export const SITE_CONFIG_QUERY = defineQuery(`
  *[_type == "siteConfig"][0] {
    _id,
    title,
    description,
    ogImage {
      asset->,
      alt
    },
    twitterImage {
      asset->,
      alt
    },
    useFeaturedReleaseOverride,
    heroTitle,
    heroSubtitle,
    heroImage {
      asset->,
      alt
    },
    phoneNumbers[] {
      number,
      label
    },
    emails[] {
      email,
      label
    },
    address {
      street,
      city,
      state,
      postalCode,
      country
    },
    sitetiming,
    footerLegalLinks[]-> {
      _id,
      title,
      slug,
      description
    }
  }
`);

/**
 * socialMedia only, fetched with stega disabled — see SITE_CONFIG_QUERY.
 */
export const SITE_CONFIG_SOCIAL_MEDIA_QUERY = defineQuery(`
  *[_type == "siteConfig"][0].socialMedia[] {
    platform,
    url,
    label
  }
`);

export const FOOTER_LEGAL_LINKS_QUERY = defineQuery(`
  *[_type == "siteConfig"][0].footerLegalLinks[]-> {
    _id,
    title,
    slug,
    description,
    _updatedAt
  }
`);
