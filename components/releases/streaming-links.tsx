/**
 * "Available On" row of streaming platform buttons for a release detail page.
 * Links with no URL are filtered out before render. For "custom" platform
 * entries the customLabel field is used as the display text.
 */
import { getSocialIcon, getStreamingPlatformLabel } from "@/lib/social-media";

interface StreamingLink {
  _key: string;
  platform: string | null;
  url: string | null;
  customLabel: string | null;
}

interface StreamingLinksProps {
  links: StreamingLink[];
}

export default function StreamingLinks({ links }: StreamingLinksProps) {
  const validLinks = links.filter((l) => l.url);

  if (validLinks.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {validLinks.map((link) => {
        const platform = link.platform ?? "custom";
        const label =
          platform === "custom" && link.customLabel
            ? link.customLabel
            : getStreamingPlatformLabel(platform);
        const icon = getSocialIcon(platform);

        return (
          <a
            key={link._key}
            href={link.url!}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Listen on ${label}`}
            className="border-border bg-card text-foreground hover:border-primary/50 hover:text-primary inline-flex items-center gap-2 rounded-sm border px-4 py-2 text-sm transition-colors duration-200"
          >
            {icon && <span className="flex size-4 items-center">{icon}</span>}
            {label}
          </a>
        );
      })}
    </div>
  );
}
