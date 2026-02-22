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
import { ArrowRightIcon, UsersRound } from "lucide-react";
import Link from "next/link";
import React from "react";
import { navLinks, resourcesLinks } from "@/constants/nav-links";
import { LinkItem } from "@/components/layout/sheard";
import { SocialIcon } from "@/components/shared/social-links";
import type { SocialMediaLink } from "@/components/shared/social-links";
import {
  mapReleasesToNavItems,
  type ReleaseNavItem,
} from "@/lib/releases-nav";
import type { RELEASES_LIST_QUERY_RESULT } from "@/types/cms";

const NAV_RELEASES_LIMIT = 9;

function MobileReleaseLinkRow({
  item,
  className,
}: {
  item: ReleaseNavItem;
  className?: string;
}) {
  return (
    <Link
      className={cn(
        "group flex h-14 w-full items-center gap-x-3 border-b hover:bg-accent dark:hover:bg-accent/50",
        className
      )}
      href={item.href}
    >
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt=""
          className="size-8 shrink-0 rounded object-cover"
          width={32}
          height={32}
        />
      ) : (
        <span className="flex size-8 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground text-xs">
          —
        </span>
      )}
      <div className="flex min-w-0 flex-col items-start justify-center">
        <span className="font-medium text-sm truncate w-full">{item.title}</span>
        {item.subText ? (
          <span className="line-clamp-1 text-[10px] text-muted-foreground">
            {item.subText}
          </span>
        ) : null}
      </div>
    </Link>
  );
}

const resourcesSection = {
  id: "resources",
  name: "Resources",
  list: [
    ...resourcesLinks,
    {
      label: "Customer Stories",
      href: "#",
      icon: UsersRound,
      description: "Browse our success stories",
    },
  ],
} as const;

type MobileNavProps = {
  streamingLinks?: SocialMediaLink[];
  releases?: RELEASES_LIST_QUERY_RESULT;
};

export function MobileNav({
  streamingLinks = [],
  releases = [],
}: MobileNavProps) {
  const releaseItems = mapReleasesToNavItems(releases).slice(0, NAV_RELEASES_LIMIT);
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
              "absolute left-0 block h-0.5 w-4 bg-foreground transition-all duration-200",
              open ? "top-[0.4rem] rotate-45" : "top-1"
            )}
          />
          <span
            className={cn(
              "absolute left-0 block h-0.5 w-4 bg-foreground transition-all duration-200",
              open ? "-rotate-45 top-[0.4rem]" : "top-2.5"
            )}
          />
        </div>
        <span className="sr-only">Toggle Menu</span>
      </Button>
      {open && (
        <Portal
          className={cn(
            "fixed inset-0 top-[calc(3.5rem+1px)] z-40 grid h-screen overflow-hidden bg-black/20 pb-14 md:hidden"
          )}
        >
          <div
            className={cn(
              "h-max overflow-y-auto border-b bg-background pb-4",
              "data-[slot=open]:slide-in-from-top-10 ease-out data-[slot=open]:animate-in"
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
                    />
                  ))}
                  <Link
                    className="group flex h-14 w-full items-center gap-x-3 border-b px-8 hover:bg-accent dark:hover:bg-accent/50"
                    href="/releases"
                  >
                    <span className="font-medium text-sm text-primary">
                      View more
                    </span>
                    <ArrowRightIcon className="size-4" />
                  </Link>
                </AccordionContent>
              </AccordionItem>
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
            </Accordion>
            {navLinks.map((link, i) => (
              <LinkItem
                className="px-6"
                key={`mobile-${link.label}-${i}`}
                {...link}
              />
            ))}
            {streamingLinks.length > 0 && (
              <div className="mt-5 px-6">
                <p className="text-muted-foreground text-sm uppercase tracking-widest mb-3">
                  Listen Now
                </p>
                <div className="flex gap-3 flex-wrap">
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
