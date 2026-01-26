/**
 * This configuration is used by the Sanity CLI to generate TypeScript types
 * from your Sanity schema definitions.
 */

import { defineCliConfig } from 'sanity/cli'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,
})
