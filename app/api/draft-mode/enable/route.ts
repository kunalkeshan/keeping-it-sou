/**
 * GET /api/draft-mode/enable — activates Next.js Draft Mode.
 *
 * Called by the Presentation Tool (sanity.config.ts's previewUrl.previewMode.enable)
 * when an editor opens the preview. defineEnableDraftMode verifies the request
 * carries a valid Sanity-issued preview secret before enabling draft mode, so
 * this route can't be triggered by an arbitrary visitor.
 */
import { client } from "@/sanity/lib/client";
import { defineEnableDraftMode } from "next-sanity/draft-mode";

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({
    token: process.env.SANITY_API_READ_TOKEN,
  }),
});
