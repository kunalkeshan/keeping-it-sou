import { getSocialIcon, getStreamingPlatformLabel } from "@/lib/social-media";

interface StreamingLink {
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
      {validLinks.map((link, i) => {
        const platform = link.platform ?? "custom";
        const label =
          platform === "custom" && link.customLabel
            ? link.customLabel
            : getStreamingPlatformLabel(platform);
        const icon = getSocialIcon(platform);

        return (
          <a
            key={i}
            href={link.url!}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Listen on ${label}`}
            className="inline-flex items-center gap-2 px-4 py-2 border border-border bg-card rounded-sm text-sm text-foreground hover:border-primary/50 hover:text-primary transition-colors duration-200"
          >
            {icon && <span className="size-4 flex items-center">{icon}</span>}
            {label}
          </a>
        );
      })}
    </div>
  );
}
