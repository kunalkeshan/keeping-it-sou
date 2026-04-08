/**
 * Sanity schema registry — exports all document types registered with the Studio.
 * Import order does not matter for runtime behaviour, but keep it consistent
 * with sanity/structure.ts for easier maintenance.
 * After adding a new type here, run `pnpm generate:types` to update types/cms.d.ts.
 */
import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { siteConfigType } from "./siteConfigType";
import { legalType } from "./legalType";
import { faqsType } from "./faqsType";
import { releaseType } from "./releaseType";
import { artistType } from "./artistType";
import { releases } from "./releases";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    siteConfigType,
    legalType,
    faqsType,
    releaseType,
    artistType,
    releases,
  ],
};
