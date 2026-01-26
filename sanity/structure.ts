import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Keeping It Sou")
    .items([
      S.listItem()
        .title("Site Configuration")
        .child(S.document().schemaType("siteConfig").documentId("siteConfig")),
      S.listItem()
        .title("FAQs")
        .child(S.document().schemaType("faqs").documentId("faqs")),
      S.documentTypeListItem("legal").title("Legal"),
      S.divider(),
      // Other document types
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          !["siteConfig", "legal", "faqs"].includes(item.getId()!)
      ),
    ]);
