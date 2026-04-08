/**
 * GROQ queries for the FAQs singleton document.
 * Not currently used by any public page — available for future implementation.
 */
import { defineQuery } from "next-sanity";

export const FAQS_QUERY = defineQuery(`
  *[_type == "faqs"][0] {
    ...,
    faqItems[]{ ... }
  }
`);
