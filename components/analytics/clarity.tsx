/**
 * Initialises Microsoft Clarity on the client, production only.
 * Renders nothing — used purely for its side effect inside useEffect.
 * The project ID is hardcoded here; to disable, remove this component
 * from app/(static)/layout.tsx.
 */
"use client";

import { useEffect } from "react";
import clarity from "@microsoft/clarity";

const CLARITY_PROJECT_ID = "v8362knwnh";

export default function MicrosoftClarity() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      try {
        clarity.init(CLARITY_PROJECT_ID);
      } catch (error) {
        console.error("Failed to initialize Microsoft Clarity:", error);
      }
    }
  }, []);

  return null;
}
