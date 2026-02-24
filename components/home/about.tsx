// import Link from "next/link";
import Image from "next/image";

const QUOTE =
  "I'm Sou - Hip-Hop Artist and Producer. Dark Beats, Real Stories, and Raw Energy. No Gimmicks — Just Truth in Every Bar.";

export default function About() {
  return (
    <section className="relative w-full bg-black" id="about">
      {/* Image wrapper: full width on small screens, max-width + centered on wider; rounded to match platform */}
      <div className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-lg">
        {/* Full image at natural height – no crop; width constrained on large screens only */}
        <Image
          src="/assets/about.jpg"
          alt=""
          width={1200}
          height={800}
          className="block w-full h-auto"
          sizes="(min-width: 1152px) 1152px, 100vw"
        />
        {/* Dark gradient overlay for text readability (stronger at top) */}
        <div
          className="absolute inset-0 z-1 pointer-events-none"
          aria-hidden
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.4) 35%, rgba(0,0,0,0.5) 100%)",
          }}
        />

        {/* Content: top-aligned, centered, over the image */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-start pt-12 sm:pt-16 lg:pt-24 pb-24">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <blockquote className="text-white text-sm md:text-xl lg:text-2xl font-medium uppercase tracking-wide leading-relaxed">
              &ldquo;{QUOTE}&rdquo;
            </blockquote>
            {/* <div className="mt-6 sm:mt-8">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-white text-sm font-medium uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                LEARN MORE
                <span className="text-white" aria-hidden>
                  ▶
                </span>
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
