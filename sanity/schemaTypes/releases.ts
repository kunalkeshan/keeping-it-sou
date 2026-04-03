import { ImageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const releases = defineType({
  name: "releases",
  title: "Release",
  type: "document",
  icon: ImageIcon,
  groups: [
    {
      name: "basic",
      title: "Basic Information",
      default: true,
    },
    {
      name: "details",
      title: "Release Details",
    },
    {
      name: "tracklist",
      title: "Tracklist",
    },
    {
      name: "streaming",
      title: "Streaming & Links",
    },
    {
      name: "references",
      title: "Referenced Releases",
    },
    {
      name: "metadata",
      title: "Metadata",
    },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Release Title",
      type: "string",
      group: "basic",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "basic",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "blockContent",
      group: "basic",
      description: "Release description and information",
    }),
    defineField({
      name: "releaseType",
      title: "Release Type",
      type: "reference",
      group: "basic",
      to: [{ type: "releaseType" }],
      description: "Category for this release (Single, EP, Album, etc.)",
    }),
    defineField({
      name: "artists",
      title: "Artists",
      type: "array",
      group: "basic",
      of: [
        {
          type: "reference",
          to: [{ type: "artist" }],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
      description: "Select one or more artists for this release",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      group: "basic",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Short description for accessibility and SEO",
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "releaseDate",
      title: "Release Date",
      type: "date",
      group: "details",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "streamingLinks",
      title: "Streaming Links",
      type: "array",
      group: "streaming",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  { title: "Spotify", value: "spotify" },
                  { title: "Apple Music", value: "apple-music" },
                  { title: "YouTube Music", value: "youtube-music" },
                  { title: "SoundCloud", value: "soundcloud" },
                  { title: "Bandcamp", value: "bandcamp" },
                  { title: "Tidal", value: "tidal" },
                  { title: "Amazon Music", value: "amazon-music" },
                  { title: "Deezer", value: "deezer" },
                  { title: "Custom", value: "custom" },
                ],
                layout: "dropdown",
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "customLabel",
              title: "Custom Label",
              type: "string",
              description: "Required if platform is 'Custom'",
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  const platform = (context.parent as any)?.platform;
                  if (platform === "custom" && !value) {
                    return "Custom label is required when platform is 'Custom'";
                  }
                  return true;
                }),
            }),
          ],
          preview: {
            select: {
              title: "platform",
              subtitle: "url",
              customLabel: "customLabel",
            },
            prepare({ title, subtitle, customLabel }) {
              const displayTitle =
                title === "custom" && customLabel
                  ? customLabel
                  : title?.charAt(0).toUpperCase() + title?.slice(1);
              return {
                title: displayTitle,
                subtitle: subtitle,
              };
            },
          },
        },
      ],
      description: "Add streaming platform links for this release",
    }),
    defineField({
      name: "credits",
      title: "Credits",
      type: "blockContent",
      group: "details",
      description:
        "Production credits, collaborators, and other acknowledgments",
    }),
    defineField({
      name: "referencesOtherReleases",
      title: "References Other Releases",
      type: "boolean",
      group: "references",
      initialValue: false,
      description:
        "Check if this release references or contains other releases (e.g., an Album containing Singles)",
    }),
    defineField({
      name: "referencedReleases",
      title: "Referenced Releases",
      type: "array",
      group: "references",
      of: [
        {
          type: "reference",
          to: [{ type: "releases" }],
          options: {
            filter: ({ document }) => {
              // Prevent self-reference
              return {
                filter: "_id != $currentId",
                params: { currentId: document._id },
              };
            },
          },
        },
      ],
      hidden: ({ document }) => !document?.referencesOtherReleases,
      validation: (Rule) =>
        Rule.custom((referencedReleases, context) => {
          const referencesOtherReleases = (context.document as any)
            ?.referencesOtherReleases;
          if (
            referencesOtherReleases &&
            (!referencedReleases || referencedReleases.length === 0)
          ) {
            return "At least one referenced release is required when 'References Other Releases' is enabled";
          }
          return true;
        }),
      description:
        "Select the releases that are referenced or contained in this release",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "metadata",
      initialValue: false,
      description: "Feature this release prominently on the site",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "coverImage",
      releaseType: "releaseType.name",
      featured: "featured",
      releaseDate: "releaseDate",
    },
    prepare({ title, media, releaseType, featured, releaseDate }) {
      const subtitleParts = [
        releaseType && `Type: ${releaseType}`,
        releaseDate &&
          (() => {
            // Use user's timezone via Intl if in browser, otherwise fallback to ISO
            if (
              typeof window !== "undefined" &&
              typeof navigator !== "undefined"
            ) {
              const dateObj = new Date(releaseDate);
              // fallback to short if medium not supported
              const locale = navigator.language || "en-US";
              try {
                return `Released: ${dateObj.toLocaleDateString(locale, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}`;
              } catch {
                return `Released: ${dateObj.toLocaleDateString()}`;
              }
            } else {
              return `Released: ${releaseDate}`;
            }
          })(),
      ].filter(Boolean);

      return {
        title: featured ? `⭐ ${title}` : title || "Untitled Release",
        subtitle: subtitleParts.join(" • "),
        media,
      };
    },
  },
  orderings: [
    {
      title: "Featured First",
      name: "featuredDesc",
      by: [{ field: "featured", direction: "desc" }],
    },
    {
      title: "Release Date (Newest)",
      name: "releaseDateDesc",
      by: [{ field: "releaseDate", direction: "desc" }],
    },
    {
      title: "Release Date (Oldest)",
      name: "releaseDateAsc",
      by: [{ field: "releaseDate", direction: "asc" }],
    },
  ],
});
