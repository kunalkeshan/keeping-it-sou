/**
 * General-purpose utility functions shared across the codebase.
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merges Tailwind CSS class names, resolving conflicts via tailwind-merge. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Asserts that a value is defined (not undefined) and returns it.
 * Throws at runtime with errorMessage if the value is undefined.
 * Used in config/site.ts to fail fast when required env vars are missing.
 */
export function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}
