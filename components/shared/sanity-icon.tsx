"use client";

import { Icon } from "@iconify/react";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IconManager } from "@/types/cms";
import DOMPurify from "isomorphic-dompurify";

export interface SanityIconProps {
  /**
   * Icon data from Sanity Icon Manager
   */
  icon?: IconManager | null;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Override icon size (width and height)
   * If not provided, uses metadata.size or defaults to 20x20
   */
  size?: number | { width: number; height: number };
  /**
   * Override icon color
   * If not provided, uses metadata.color.hex or defaults to currentColor
   * Must be a valid CSS color string (hex, rgb, rgba, or named color)
   */
  color?: string;
  /**
   * ARIA label for accessibility
   * If provided, the icon will be accessible to screen readers.
   * If not provided and icon is decorative, aria-hidden="true" will be used.
   */
  "aria-label"?: string;
}

/**
 * Validates if a string is a valid CSS color
 * Works in both server and client environments
 */
function isValidColor(color: string): boolean {
  if (!color || typeof color !== "string") {
    return false;
  }

  // Check for hex color (#rgb or #rrggbb)
  if (/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(color)) {
    return true;
  }

  // Check for rgb/rgba color with basic validation
  if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+/.test(color)) {
    return true;
  }

  // Check for hsl/hsla color
  if (/^hsla?\(\s*\d+\s*,\s*\d+%/.test(color)) {
    return true;
  }

  // Check for named colors (basic validation - CSS supports many more)
  const namedColors = [
    "currentColor",
    "transparent",
    "black",
    "white",
    "red",
    "blue",
    "green",
    "yellow",
    "orange",
    "purple",
    "pink",
    "gray",
    "grey",
    "silver",
    "maroon",
    "navy",
    "olive",
    "lime",
    "aqua",
    "fuchsia",
    "teal",
  ];
  if (namedColors.includes(color.toLowerCase())) {
    return true;
  }

  // For client-side, try to validate using DOM (only if available)
  if (typeof document !== "undefined") {
    try {
      const div = document.createElement("div");
      div.style.color = color;
      return div.style.color !== "";
    } catch {
      return false;
    }
  }

  // If we can't validate (server-side), be conservative and reject
  // Only allow known safe formats
  return false;
}

/**
 * Reusable component for rendering icons from Sanity Icon Manager
 *
 * Features:
 * - Supports inline SVG rendering when available (sanitized with DOMPurify)
 * - Applies transforms (flip, rotate) from metadata
 * - Applies color from metadata (validated before use)
 * - Falls back to lucide-react HelpCircle icon when icon is missing/invalid
 * - Fully typed with TypeScript
 * - Accessible: supports aria-label for meaningful icons
 *
 * Note: The rotate value in metadata is stored as quarters (0-3), where:
 * - 0 = 0 degrees
 * - 1 = 90 degrees
 * - 2 = 180 degrees
 * - 3 = 270 degrees
 * This component converts it to degrees for Iconify (multiplies by 90).
 *
 * @example
 * ```tsx
 * import { SanityIcon } from '@/components/shared/sanity-icon'
 *
 * // Decorative icon (hidden from screen readers)
 * <SanityIcon icon={item.icon} className="w-6 h-6" />
 *
 * // Meaningful icon (accessible to screen readers)
 * <SanityIcon
 *   icon={item.icon}
 *   className="w-6 h-6"
 *   aria-label="Item type: Example"
 * />
 * ```
 */
export function SanityIcon({
  icon,
  className,
  size,
  color,
  "aria-label": ariaLabel,
}: SanityIconProps) {
  // Safeguard: Return fallback if icon is missing or invalid
  if (!icon || icon._type !== "icon.manager" || !icon.icon) {
    const fallbackSize = typeof size === "number" ? size : size?.width || 20;
    return (
      <HelpCircle
        className={cn("text-muted-foreground", className)}
        size={fallbackSize}
        aria-label={ariaLabel}
        aria-hidden={ariaLabel ? undefined : "true"}
      />
    );
  }

  const { icon: iconName, metadata } = icon;

  // Safeguard: Validate icon name exists
  if (!iconName) {
    const fallbackSize = typeof size === "number" ? size : size?.width || 20;
    return (
      <HelpCircle
        className={cn("text-muted-foreground", className)}
        size={fallbackSize}
        aria-label={ariaLabel}
        aria-hidden={ariaLabel ? undefined : "true"}
      />
    );
  }

  // Determine size
  const iconSize =
    typeof size === "number"
      ? { width: size, height: size }
      : size || metadata?.size || { width: 20, height: 20 };

  // Determine color - prioritize prop, then metadata, then currentColor
  // Validate color before applying to prevent CSS injection
  const rawColor = color || metadata?.color?.hex || "currentColor";
  const iconColor = isValidColor(rawColor) ? rawColor : "currentColor";

  // Handle inline SVG if available
  // Sanitize SVG content to prevent XSS attacks
  if (metadata?.inlineSvg) {
    const sanitizedSvg = DOMPurify.sanitize(metadata.inlineSvg, {
      USE_PROFILES: { svg: true, svgFilters: true },
    });

    return (
      <span
        className={cn("inline-flex items-center justify-center", className)}
        style={{
          width: iconSize.width,
          height: iconSize.height,
          color: iconColor,
        }}
        dangerouslySetInnerHTML={{ __html: sanitizedSvg }}
        aria-label={ariaLabel}
        aria-hidden={ariaLabel ? undefined : "true"}
      />
    );
  }

  // Determine flip value from hFlip and vFlip booleans
  let flip: "horizontal" | "vertical" | "horizontal,vertical" | undefined;
  if (metadata?.hFlip && metadata?.vFlip) {
    flip = "horizontal,vertical";
  } else if (metadata?.hFlip) {
    flip = "horizontal";
  } else if (metadata?.vFlip) {
    flip = "vertical";
  }

  // Determine rotate value
  // metadata.rotate is stored as quarters (0-3), where:
  // 0 = 0°, 1 = 90°, 2 = 180°, 3 = 270°
  // Iconify expects degrees, so we multiply by 90
  const rotate = metadata?.rotate !== undefined ? metadata.rotate * 90 : 0;

  // Render using Iconify
  return (
    <Icon
      icon={iconName}
      width={iconSize.width}
      height={iconSize.height}
      flip={flip}
      rotate={rotate}
      style={{ color: iconColor }}
      className={className}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : "true"}
    />
  );
}
