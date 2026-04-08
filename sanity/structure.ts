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
      // Artists Section
      S.documentTypeListItem("artist").title("Artists"),
      // Releases Section
      S.listItem()
        .title("Releases")
        .child(
          S.list()
            .title("Releases")
            .items([
              S.listItem()
                .title("Release Types")
                .child(
                  S.documentTypeList("releaseType").title("All Release Types")
                ),
              S.listItem()
                .title("Releases")
                .child(S.documentTypeList("releases").title("All Releases")),
            ])
        ),
      S.divider(),
      // Other document types
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          ![
            "siteConfig",
            "legal",
            "faqs",
            "artist",
            "releaseType",
            "releases",
          ].includes(item.getId()!)
      ),
    ]);
