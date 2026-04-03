import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const artistType = defineType({
  name: "artist",
  title: "Artist",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      title: "Artist Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bio",
      title: "Biography",
      type: "blockContent",
      description: "Artist biography and background information",
    }),
    defineField({
      name: "profileImage",
      title: "Profile Image",
      type: "image",
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
    }),
    defineField({
      name: "socialLinks",
      title: "Social Media Links",
      type: "array",
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
                  { title: "Twitter (X)", value: "twitter" },
                  { title: "YouTube", value: "youtube" },
                  { title: "Instagram", value: "instagram" },
                  { title: "Facebook", value: "facebook" },
                  { title: "TikTok", value: "tiktok" },
                  { title: "LinkedIn", value: "linkedin" },
                  { title: "Spotify", value: "spotify" },
                  { title: "Apple Music", value: "applemusic" },
                  { title: "YouTube Music", value: "youtubemusic" },
                  { title: "SoundCloud", value: "soundcloud" },
                  { title: "Bandcamp", value: "bandcamp" },
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
              name: "label",
              title: "Label (optional)",
              type: "string",
              description: "Custom label for the social media link",
            }),
          ],
          preview: {
            select: {
              title: "platform",
              subtitle: "url",
            },
            prepare(selection) {
              const { title, subtitle } = selection;
              return {
                title: title?.charAt(0).toUpperCase() + title?.slice(1),
                subtitle: subtitle,
              };
            },
          },
        },
      ],
      description:
        "Add artist's social media profiles. Only platforms with URLs will be displayed.",
    }),
    defineField({
      name: "website",
      title: "Website",
      type: "url",
      description: "Artist's official website URL",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description:
        "Optional number to control the display order of artists. Lower numbers appear first.",
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "profileImage",
      order: "order",
    },
    prepare({ title, media, order }) {
      return {
        title: title || "Untitled Artist",
        subtitle: order ? `Order: ${order}` : undefined,
        media,
      };
    },
  },
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Name A-Z",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
});
