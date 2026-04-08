"use client";
// import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { PixelatedCanvas } from "@/components/ui/pixelated-canvas";

const QUOTE =
  "I'm Sou - Hip-Hop Artist and Producer. Dark Beats, Real Stories, and Raw Energy. No Gimmicks — Just Truth in Every Bar.";

const ASPECT_RATIO = 800 / 1200;

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.offsetWidth;
      setDimensions({
        width: w,
        height: Math.round(w * ASPECT_RATIO),
      });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <section className="relative w-full bg-black" id="about">
      {/* Image wrapper: full width on small screens, max-width + centered on wider; rounded to match platform */}
      <div
        ref={containerRef}
        className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-lg"
      >
        <PixelatedCanvas
          src="/assets/about.jpg"
          width={dimensions.width}
          height={dimensions.height}
          cellSize={4}
          dotScale={0.9}
          shape="square"
          backgroundColor="#000000"
          dropoutStrength={0.1}
          interactive
          distortionStrength={0.1}
          distortionRadius={200}
          distortionMode="repel"
          followSpeed={0.2}
          jitterStrength={4}
          jitterSpeed={1}
          sampleAverage
          fadeOnLeave
          fadeSpeed={0.15}
          className="rounded-lg"
        />
        {/* Dark gradient overlay for text readability (stronger at top) */}
        <div
          className="pointer-events-none absolute inset-0 z-1"
          aria-hidden
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.4) 35%, rgba(0,0,0,0.5) 100%)",
          }}
        />

        {/* Content: top-aligned, centered, over the image; pointer-events-none so canvas receives hover */}
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-start pt-12 pb-24 sm:pt-16 lg:pt-24">
          <div className="mx-auto w-full max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <blockquote className="text-sm leading-relaxed font-medium tracking-wide text-white uppercase md:text-xl lg:text-2xl">
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
