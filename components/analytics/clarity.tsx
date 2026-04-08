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
