/**
 * Mobile navigation drawer (visible below md breakpoint).
 * Opens as a Portal overlay below the sticky header. Uses Accordion
 * for the Releases sub-list. Locks body scroll while open on mobile
 * (guarded by useMediaQuery so it doesn't affect desktop resize).
 */
"use client";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Portal } from "@radix-ui/react-portal";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { navLinks } from "@/constants/nav-links";
import { LinkItem } from "@/components/layout/sheard";
import { SocialIcon } from "@/components/shared/social-links";
import type { SocialMediaLink } from "@/components/shared/social-links";
import { mapReleasesToNavItems, type ReleaseNavItem } from "@/lib/releases-nav";
import type { RELEASES_LIST_QUERY_RESULT } from "@/types/cms";

const NAV_RELEASES_LIMIT = 9;

function MobileReleaseLinkRow({
  item,
  className,
  onNavigate,
}: {
  item: ReleaseNavItem;
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <Link
      className={cn(
        "group hover:bg-accent dark:hover:bg-accent/50 flex h-14 w-full items-center gap-x-3 border-b",
        className
      )}
      href={item.href}
      onClick={onNavigate}
    >
      {item.imageUrl ? (
        <Image
          src={item.imageUrl}
          alt=""
          className="size-8 shrink-0 rounded object-cover"
          width={32}
          height={32}
        />
      ) : (
        <span className="bg-muted text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded text-xs">
          —
        </span>
      )}
      <div className="flex min-w-0 flex-col items-start justify-center">
        <span className="w-full truncate text-sm font-medium">
          {item.title}
        </span>
        {item.subText ? (
          <span className="text-muted-foreground line-clamp-1 text-[10px]">
            {item.subText}
          </span>
        ) : null}
      </div>
    </Link>
  );
}

type MobileNavProps = {
  streamingLinks?: SocialMediaLink[];
  releases?: RELEASES_LIST_QUERY_RESULT;
};

export function MobileNav({
  streamingLinks = [],
  releases = [],
}: MobileNavProps) {
  const releaseItems = mapReleasesToNavItems(releases).slice(
    0,
    NAV_RELEASES_LIMIT
  );
  const [open, setOpen] = React.useState(false);
  const { isMobile } = useMediaQuery();

  // 🚫 Disable body scroll when open
  React.useEffect(() => {
    if (open && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // Cleanup on unmount too
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, isMobile]);

  return (
    <>
      <Button
        aria-controls="mobile-menu"
        aria-expanded={open}
        aria-label="Toggle menu"
        className="md:hidden"
        onClick={() => setOpen(!open)}
        size="icon"
        variant="ghost"
      >
        <div className="relative size-4">
          <span
            className={cn(
              "bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-200",
              open ? "top-[0.4rem] rotate-45" : "top-1"
            )}
          />
          <span
            className={cn(
              "bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-200",
              open ? "top-[0.4rem] -rotate-45" : "top-2.5"
            )}
          />
        </div>
        <span className="sr-only">Toggle Menu</span>
      </Button>
      {open && (
        <Portal
          className={cn(
            "fixed inset-0 top-[calc(3.5rem+1px)] z-40 flex flex-col bg-black/20 md:hidden"
          )}
          style={{ height: "calc(100vh - 3.5rem - 1px)" }}
        >
          <div
            className={cn(
              "bg-background min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain border-b pb-4",
              "data-[slot=open]:slide-in-from-top-10 data-[slot=open]:animate-in ease-out"
            )}
            data-slot={open ? "open" : "closed"}
          >
            <Accordion collapsible type="single">
              <AccordionItem className="border-b-0" value="releases">
                <AccordionTrigger className="rounded-none border-b px-6 hover:no-underline">
                  Releases
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  {releaseItems.map((item) => (
                    <MobileReleaseLinkRow
                      key={item.href}
                      item={item}
                      className="px-8"
                      onNavigate={() => setOpen(false)}
                    />
                  ))}
                  <Link
                    className="group hover:bg-accent dark:hover:bg-accent/50 flex h-14 w-full items-center gap-x-3 border-b px-8"
                    href="/releases"
                    onClick={() => setOpen(false)}
                  >
                    <span className="text-primary text-sm font-medium">
                      View more
                    </span>
                    <ArrowRightIcon className="size-4" />
                  </Link>
                </AccordionContent>
              </AccordionItem>
              {/* Resources accordion commented out for now; restore when needed
              <AccordionItem className="border-b-0" value={resourcesSection.id}>
                <AccordionTrigger className="rounded-none border-b px-6 hover:no-underline">
                  {resourcesSection.name}
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  {resourcesSection.list.map((link) => (
                    <LinkItem
                      className="px-8"
                      key={`mobile-${resourcesSection.id}-${link.label}`}
                      {...link}
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>
              */}
            </Accordion>
            {navLinks.map((link, i) => (
              <LinkItem
                className="px-6"
                key={`mobile-${link.label}-${i}`}
                {...link}
                onClick={() => setOpen(false)}
              />
            ))}
            {streamingLinks.length > 0 && (
              <div className="mt-5 px-6">
                <p className="text-muted-foreground mb-3 text-sm tracking-widest uppercase">
                  Listen Now
                </p>
                <div className="flex flex-wrap gap-3">
                  {streamingLinks.map((link) => (
                    <SocialIcon
                      key={link.platform}
                      href={link.url}
                      platform={link.platform}
                      label={link.label}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </Portal>
      )}
    </>
  );
}
