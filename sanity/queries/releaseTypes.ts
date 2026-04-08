/**
 * GROQ queries for releaseType documents.
 * Not yet connected to a public page — available for future use (e.g., filtering
 * releases by type: Singles, EPs, Albums).
 */
import { defineQuery } from "next-sanity";

export const ALL_RELEASE_TYPES_QUERY = defineQuery(`
  *[_type == "releaseType"] | order(order asc, name asc) {
    _id,
    name,
    slug,
    description,
    order,
    _createdAt,
    _updatedAt
  }
`);

export const RELEASE_TYPE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "releaseType" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    order,
    _createdAt,
    _updatedAt
  }
`);
