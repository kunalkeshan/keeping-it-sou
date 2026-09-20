/**
 * GET /api/draft-mode/disable — deactivates Next.js Draft Mode.
 *
 * Not called automatically by the Presentation Tool (its previewMode.disable
 * option is registered but never invoked) — this is the target of the
 * "Disable Draft Mode" button rendered outside the Presentation iframe.
 */
import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  (await draftMode()).disable();
  return NextResponse.redirect(new URL("/", request.url));
}
