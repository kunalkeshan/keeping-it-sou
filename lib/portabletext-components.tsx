import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { PortableTextComponents } from "@portabletext/react";

/**
 * Custom components for rendering PortableText content from Sanity.
 * Implements heading level shifting (content h1 → h2, etc.) so content
 * headings don't conflict with page titles.
 */
export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;

      const imageUrl = urlFor(value)
        .width(800)
        .height(600)
        .fit("max")
        .auto("format")
        .url();

      return (
        <figure className="my-8">
          <Image
            src={imageUrl}
            alt={(value as { alt?: string }).alt || "Content image"}
            width={800}
            height={600}
            className="rounded-lg w-full h-auto max-w-3xl mx-auto"
            loading="lazy"
          />
          {(value as { alt?: string }).alt && (
            <figcaption className="mt-2 text-sm text-center text-muted-foreground">
              {(value as { alt?: string }).alt}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h1: (props) => (
      <h2 className="text-3xl font-semibold tracking-tight text-foreground mt-8 mb-4 first:mt-0">
        {props.children}
      </h2>
    ),
    h2: (props) => (
      <h3 className="text-2xl font-semibold tracking-tight text-foreground mt-6 mb-3">
        {props.children}
      </h3>
    ),
    h3: (props) => (
      <h4 className="text-xl font-semibold tracking-tight text-foreground mt-5 mb-2">
        {props.children}
      </h4>
    ),
    h4: (props) => (
      <h5 className="text-lg font-semibold tracking-tight text-foreground mt-4 mb-2">
        {props.children}
      </h5>
    ),
    h5: (props) => (
      <h6 className="text-base font-semibold tracking-tight text-foreground mt-4 mb-2">
        {props.children}
      </h6>
    ),
    h6: (props) => (
      <p className="font-bold text-foreground mt-4 mb-2">{props.children}</p>
    ),
    normal: (props) => (
      <p className="text-muted-foreground leading-relaxed mb-4 text-justify">
        {props.children}
      </p>
    ),
    blockquote: (props) => (
      <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4 text-justify">
        {props.children}
      </blockquote>
    ),
  },
  list: {
    bullet: (props) => (
      <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
        {props.children}
      </ul>
    ),
  },
  listItem: {
    bullet: (props) => (
      <li className="leading-relaxed text-justify">{props.children}</li>
    ),
  },
  marks: {
    link: (props) => {
      const href = props.value?.href || "";
      const target = href.startsWith("http") ? "_blank" : undefined;
      return (
        <a
          href={href}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          className="text-primary hover:text-primary/80 underline"
        >
          {props.children}
        </a>
      );
    },
    strong: (props) => (
      <strong className="font-semibold text-foreground">{props.children}</strong>
    ),
    em: (props) => (
      <em className="italic text-muted-foreground">{props.children}</em>
    ),
  },
};
