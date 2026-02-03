import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type LogoVariant = "bg-white" | "no-bg";
export type LogoFormat = "png" | "svg";

const DEFAULT_LOGO_SRC = "/icon.png";

interface LogoProps {
  className?: string;
  imageClassName?: string;
  href?: React.ComponentProps<typeof Link>["href"];
  width?: number;
  height?: number;
  priority?: boolean;
  alt?: string;
  /**
   * When true, show the icon plus "sou" text to the right. When false, icon only.
   * @default true
   */
  showText?: boolean;
  /**
   * When set, image src becomes /logos/logo-<variant>.<format>. When unset, defaults to /icon.png.
   */
  variant?: LogoVariant;
  /**
   * File format for variant-based logo path. Ignored when variant is not set.
   * @default "png"
   */
  format?: LogoFormat;
  /**
   * Override image src. When provided, used instead of variant path or /icon.png.
   */
  logoSrc?: string;
}

/**
 * Renders the sou logo: Link + Image with optional "sou" text to the right.
 * Default src is /icon.png. Pass variant to use /logos/logo-<variant>.<format>. Use logoSrc to override.
 */
export function Logo({
  className,
  imageClassName,
  href = "/",
  width = 32,
  height = 32,
  priority = false,
  alt = "sou",
  showText = true,
  variant,
  format = "png",
  logoSrc,
}: LogoProps) {
  const src =
    logoSrc ??
    (variant ? `/logos/logo-${variant}.${format}` : DEFAULT_LOGO_SRC);
  return (
    <Link
      href={href}
      className={cn("flex items-center gap-1", className)}
      prefetch={false}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={cn("h-auto w-auto shrink-0", imageClassName)}
      />
      {showText && (
        <span className="font-semibold tracking-tight text-foreground text-xl">
          sou
        </span>
      )}
    </Link>
  );
}
