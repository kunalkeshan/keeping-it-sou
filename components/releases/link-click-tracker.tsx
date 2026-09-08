/**
 * Thin client wrapper that adds click tracking to a single anchor rendered
 * from a Server Component (e.g. the release detail page's primary "Listen
 * Now" CTA). Renders its children unchanged, just adds the onClick handler.
 */
"use client";

import type { ReactElement } from "react";
import { cloneElement } from "react";
import {
  trackLinkClick,
  type LinkPlacement,
  type LinkPosition,
} from "@/lib/analytics";

interface LinkClickTrackerProps {
  platform: string;
  url: string;
  placement: LinkPlacement;
  position: LinkPosition;
  releaseSlug?: string;
  releaseTitle?: string;
  releaseType?: string;
  children: ReactElement<{ onClick?: () => void }>;
}

export function LinkClickTracker({
  platform,
  url,
  placement,
  position,
  releaseSlug,
  releaseTitle,
  releaseType,
  children,
}: LinkClickTrackerProps) {
  return cloneElement(children, {
    onClick: () =>
      trackLinkClick({
        platform,
        url,
        placement,
        position,
        releaseSlug,
        releaseTitle,
        releaseType,
      }),
  });
}
