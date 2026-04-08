/**
 * POST /api/revalidate — Sanity webhook handler for on-demand ISR.
 *
 * When a document is published in Sanity, the webhook posts here with the
 * document _type and optional slug. This handler:
 *  1. Verifies the HMAC signature using SANITY_WEBHOOK_SECRET
 *  2. Calls revalidateTag() with "max" scope to bust all matching cached
 *     responses across the deployment, not just the current server instance
 *
 * Supported document types: releases, legal, siteConfig
 * Unsupported types are silently ignored (no-op revalidation is safe).
 */
import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import {
  createCollectionTag,
  createDocumentTag,
} from "@/sanity/lib/cache-tags";

type WebhookBody = {
  _type: string;
  slug?: { current?: string };
};

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.SANITY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Missing SANITY_WEBHOOK_SECRET" },
      { status: 500 }
    );
  }

  const rawBody = await req.text();
  const signature = req.headers.get(SIGNATURE_HEADER_NAME) ?? "";

  const valid = await isValidSignature(rawBody, signature, webhookSecret);
  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: WebhookBody;
  try {
    body = JSON.parse(rawBody) as WebhookBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body._type === "releases") {
    revalidateTag(createCollectionTag("releases"), "max");
    if (body.slug?.current) {
      revalidateTag(createDocumentTag("releases", body.slug.current), "max");
    }
  } else if (body._type === "legal") {
    revalidateTag(createCollectionTag("legal"), "max");
    if (body.slug?.current) {
      revalidateTag(createDocumentTag("legal", body.slug.current), "max");
    }
  } else if (body._type === "siteConfig") {
    revalidateTag(createCollectionTag("siteConfig"), "max");
  }

  return NextResponse.json({ revalidated: true, type: body._type });
}
