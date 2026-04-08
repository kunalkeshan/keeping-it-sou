/**
 * releaseType Sanity document schema — reusable category for releases.
 * Examples: Single, EP, Album, Mixtape, Compilation, Live Album, Remix Album.
 * Referenced by the releases schema via a reference field.
 * The order field controls display ordering in dropdowns and listing pages.
 */
import { FolderIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const releaseType = defineType({
  name: "releaseType",
  title: "Release Type",
  type: "document",
  icon: FolderIcon,
  fields: [
    defineField({
      name: "name",
      title: "Release Type Name",
      type: "string",
      description:
        "The name of the release type. Examples: 'Single', 'EP', 'Album', 'Mixtape', 'Compilation', 'Live Album', 'Remix Album'. This is a reusable category that can be used across multiple releases.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "URL-friendly identifier for the release type. Example: 'single', 'ep', 'album'. Auto-generated from name if not provided.",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description:
        "Optional description explaining what this release type represents. Example: 'A single typically contains 1-3 tracks'.",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description:
        "Optional number to control the display order of release types. Lower numbers appear first. Example: 1 for 'Single', 2 for 'EP', 3 for 'Album'",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "description",
    },
  },
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
