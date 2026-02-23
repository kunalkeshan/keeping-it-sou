import Link from "next/link";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ReleaseCardProps {
  title: string;
  href: string;
  imageUrl: string | null;
  alt?: string;
  /** When true, title is always visible (no hover, no animation). Default false = title only on hover, no animation. */
  showTitle?: boolean;
}

export default function ReleaseCard({
  title,
  href,
  imageUrl,
  alt = "",
  showTitle = false,
}: ReleaseCardProps) {
  return (
    <Link
      href={href}
      className="group relative block aspect-square overflow-hidden rounded-lg border border-border bg-muted"
      aria-label={`View release: ${title}`}
    >
      {/* Image layer */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={alt || title}
          className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
          width={400}
          height={400}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
          —
        </div>
      )}

      {/* Hover overlay for readability on light/white images; always on when showTitle so title is readable */}
      <div
        className={cn(
          "absolute inset-0 bg-black/60",
          showTitle
            ? "opacity-100"
            : "opacity-0 transition-opacity duration-300 group-hover:opacity-100",
        )}
        aria-hidden
      />

      {/* Title – when showTitle: always visible. Otherwise: visible on hover only, no animation */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <span
          className={cn(
            "block text-sm font-medium uppercase tracking-wide text-white",
            showTitle
              ? "opacity-100"
              : "opacity-0 transition-none group-hover:opacity-100",
          )}
        >
          {title}
        </span>
      </div>

      {/* Play icon – top-right, decorative */}
      <div
        className="absolute right-0 top-0 p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      >
        <span className="flex size-8 items-center justify-center rounded-sm bg-white text-black">
          <Play className="size-4 fill-current" />
        </span>
      </div>
    </Link>
  );
}
