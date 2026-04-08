import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "../env";

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset });

export const urlFor = (
  source: Parameters<ReturnType<typeof createImageUrlBuilder>["image"]>[0]
) => {
  return builder.image(source);
};

/** Square thumbnail URL for nav/footer; size defaults to 256. */
export function urlForSquare(
  source:
    | Parameters<ReturnType<typeof createImageUrlBuilder>["image"]>[0]
    | null
    | undefined,
  size: number = 256
): string | null {
  if (!source) return null;
  try {
    return urlFor(source)
      .size(size, size)
      .fit("fill")
      .auto("format")
      .quality(80)
      .url();
  } catch {
    return null;
  }
}
