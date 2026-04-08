/**
 * Reusable square release card used in the home page grid, releases index,
 * and the "Also In This Release" section on release detail pages.
 * The overlay + title visibility behaviour is controlled by the showTitle prop:
 *  - showTitle=true (default): overlay + title always visible
 *  - showTitle=false: overlay + title only on hover, no animation
 */
import Link from "next/link";
import Image from "next/image";
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
  showTitle = true,
}: ReleaseCardProps) {
  return (
    <Link
      href={href}
      className="group border-border bg-muted relative block aspect-square overflow-hidden rounded-lg border"
      aria-label={`View release: ${title}`}
    >
      {/* Image layer */}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={alt || title}
          className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
          width={400}
          height={400}
        />
      ) : (
        <div className="text-muted-foreground absolute inset-0 flex items-center justify-center text-sm">
          —
        </div>
      )}

      {/* Hover overlay for readability on light/white images; always on when showTitle so title is readable */}
      <div
        className={cn(
          "absolute inset-0 bg-black/60",
          showTitle
            ? "opacity-100"
            : "opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        )}
        aria-hidden
      />

      {/* Title – when showTitle: always visible. Otherwise: visible on hover only, no animation */}
      <div className="absolute right-0 bottom-0 left-0 p-3">
        <span
          className={cn(
            "block text-sm font-medium tracking-wide text-white uppercase",
            showTitle
              ? "opacity-100"
              : "opacity-0 transition-none group-hover:opacity-100"
          )}
        >
          {title}
        </span>
      </div>

      {/* Play icon – top-right, decorative */}
      <div
        className="absolute top-0 right-0 p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      >
        <span className="flex size-8 items-center justify-center rounded-sm bg-white text-black">
          <Play className="size-4 fill-current" />
        </span>
      </div>
    </Link>
  );
}
