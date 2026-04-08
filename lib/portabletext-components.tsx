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
            className="mx-auto h-auto w-full max-w-3xl rounded-lg"
            loading="lazy"
          />
          {(value as { alt?: string }).alt && (
            <figcaption className="text-muted-foreground mt-2 text-center text-sm">
              {(value as { alt?: string }).alt}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h1: (props) => (
      <h2 className="text-foreground mt-8 mb-4 text-3xl font-semibold tracking-tight first:mt-0">
        {props.children}
      </h2>
    ),
    h2: (props) => (
      <h3 className="text-foreground mt-6 mb-3 text-2xl font-semibold tracking-tight">
        {props.children}
      </h3>
    ),
    h3: (props) => (
      <h4 className="text-foreground mt-5 mb-2 text-xl font-semibold tracking-tight">
        {props.children}
      </h4>
    ),
    h4: (props) => (
      <h5 className="text-foreground mt-4 mb-2 text-lg font-semibold tracking-tight">
        {props.children}
      </h5>
    ),
    h5: (props) => (
      <h6 className="text-foreground mt-4 mb-2 text-base font-semibold tracking-tight">
        {props.children}
      </h6>
    ),
    h6: (props) => (
      <p className="text-foreground mt-4 mb-2 font-bold">{props.children}</p>
    ),
    normal: (props) => (
      <p className="text-muted-foreground mb-4 text-justify leading-relaxed">
        {props.children}
      </p>
    ),
    blockquote: (props) => (
      <blockquote className="border-primary text-muted-foreground my-4 border-l-4 pl-4 text-justify italic">
        {props.children}
      </blockquote>
    ),
  },
  list: {
    bullet: (props) => (
      <ul className="text-muted-foreground mb-4 list-disc space-y-2 pl-6">
        {props.children}
      </ul>
    ),
  },
  listItem: {
    bullet: (props) => (
      <li className="text-justify leading-relaxed">{props.children}</li>
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
      <strong className="text-foreground font-semibold">
        {props.children}
      </strong>
    ),
    em: (props) => (
      <em className="text-muted-foreground italic">{props.children}</em>
    ),
  },
};
