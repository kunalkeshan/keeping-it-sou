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
