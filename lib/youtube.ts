/**
 * Extracts a YouTube video ID from a full YouTube URL.
 * Handles:
 *   - https://www.youtube.com/watch?v=VIDEO_ID
 *   - https://youtu.be/VIDEO_ID
 *   - https://www.youtube.com/embed/VIDEO_ID
 */
export function extractYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);

    if (parsed.hostname === "youtu.be" || parsed.hostname === "www.youtu.be") {
      // https://youtu.be/VIDEO_ID
      const id = parsed.pathname.slice(1).split("/")[0];
      return id || null;
    }

    if (
      parsed.hostname === "youtube.com" ||
      parsed.hostname === "www.youtube.com"
    ) {
      if (parsed.pathname.startsWith("/embed/")) {
        // https://www.youtube.com/embed/VIDEO_ID
        const id = parsed.pathname.replace("/embed/", "").split("/")[0];
        return id || null;
      }
      // https://www.youtube.com/watch?v=VIDEO_ID
      const id = parsed.searchParams.get("v");
      return id || null;
    }

    return null;
  } catch {
    return null;
  }
}
