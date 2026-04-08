/**
 * Desktop navigation bar (hidden on mobile via Tailwind `hidden md:flex`).
 * Uses Radix NavigationMenu with a custom full-width mega-dropdown viewport
 * positioned below the header. The Releases dropdown shows up to 9 releases
 * and a "Listen Now" Spotify card. The Resources dropdown is currently
 * commented out and can be restored when needed.
 */
"use client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { getSocialIcon } from "@/lib/social-media";
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui";
import { ArrowRightIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { navLinks } from "@/constants/nav-links";
import {
  SocialIcon,
  type SocialMediaLink,
} from "@/components/shared/social-links";
import { mapReleasesToNavItems, type ReleaseNavItem } from "@/lib/releases-nav";
import type { RELEASES_LIST_QUERY_RESULT } from "@/types/cms";

const NAV_RELEASES_LIMIT = 9;

type DesktopNavProps = {
  streamingLinks?: SocialMediaLink[];
  releases?: RELEASES_LIST_QUERY_RESULT;
};

export function DesktopNav({
  streamingLinks = [],
  releases = [],
}: DesktopNavProps) {
  const [open, setOpen] = useState(false);
  const releaseItems = mapReleasesToNavItems(releases).slice(
    0,
    NAV_RELEASES_LIMIT
  );

  return (
    <NavigationMenu
      className="static hidden md:flex"
      data-viewport={true}
      onValueChange={(value) => {
        setOpen(Boolean(value));
      }}
      viewport={false}
    >
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-muted-foreground hover:text-foreground bg-transparent px-2 hover:bg-transparent">
            Releases
          </NavigationMenuTrigger>
          <CustomNavigationMenuContent className="grid w-full grid-cols-1 md:grid-cols-[3fr_1fr]">
            <Section className="border-r" title="Releases">
              <div className="grid grid-cols-2">
                <div className="border-r">
                  {releaseItems.slice(0, 5).map((item) => (
                    <NavigationMenuPrimitive.Link asChild key={item.href}>
                      <ReleaseLinkRow item={item} />
                    </NavigationMenuPrimitive.Link>
                  ))}
                </div>
                <div>
                  {releaseItems.slice(5, 9).map((item) => (
                    <NavigationMenuPrimitive.Link asChild key={item.href}>
                      <ReleaseLinkRow item={item} />
                    </NavigationMenuPrimitive.Link>
                  ))}
                  <NavigationMenuPrimitive.Link asChild>
                    <Link
                      className="group hover:bg-accent dark:hover:bg-accent/50 flex h-14 w-full items-center gap-x-3 border-b px-3"
                      href="/releases"
                    >
                      <span className="text-primary text-sm font-medium">
                        View more
                      </span>
                      <ArrowRightIcon className="size-4" />
                    </Link>
                  </NavigationMenuPrimitive.Link>
                </div>
              </div>
            </Section>
            <Section title="Listen Now">
              <ListenNowSpotifyCard streamingLinks={streamingLinks} />
            </Section>
          </CustomNavigationMenuContent>
        </NavigationMenuItem>
        {/* Resources dropdown commented out for now; restore when needed
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent px-2 text-muted-foreground hover:bg-transparent hover:text-foreground">
            Resources
          </NavigationMenuTrigger>
          <CustomNavigationMenuContent className="grid w-full grid-cols-3">
            <Section className="col-span-2 w-full border-r" title="Resources">
              <div className="grid grid-cols-2">
                <div className="border-r">
                  {resourcesLinks.slice(0, 3).map((link, linkIndex) => (
                    <NavigationMenuPrimitive.Link
                      asChild
                      className="flex-row gap-3 px-3 py-1.5"
                      key={`${link.label}-${linkIndex}`}
                    >
                      <LinkItem {...link} />
                    </NavigationMenuPrimitive.Link>
                  ))}
                </div>
                <div>
                  {resourcesLinks.slice(3, 6).map((link, linkIndex) => (
                    <NavigationMenuPrimitive.Link
                      asChild
                      className="flex-row gap-3 px-3 py-1.5"
                      key={`${link.label}-${linkIndex}`}
                    >
                      <LinkItem {...link} />
                    </NavigationMenuPrimitive.Link>
                  ))}
                </div>
              </div>
            </Section>
            <Section title="Open Source">
              <OpenSource />
              <NavigationMenuPrimitive.Link asChild>
                <LinkItem
                  description="View the repository"
                  href="#"
                  icon={GithubIcon as LucideIcon}
                  label="See GitHub"
                />
              </NavigationMenuPrimitive.Link>
            </Section>
          </CustomNavigationMenuContent>
        </NavigationMenuItem>
        */}
        {navLinks.map((link, i) => (
          <NavigationMenuLink asChild key={`${link.label}-${i}`}>
            <a
              className="text-muted-foreground hover:text-foreground bg-transparent px-2 hover:bg-transparent"
              href={link.href}
            >
              {link.label}
            </a>
          </NavigationMenuLink>
        ))}
      </NavigationMenuList>

      <CustomNavigationMenuViewport />
      <NavigationMenuOverlay open={open} />
    </NavigationMenu>
  );
}

function ReleaseLinkRow({ item }: { item: ReleaseNavItem }) {
  return (
    <Link
      className="group hover:bg-accent dark:hover:bg-accent/50 flex h-14 w-full items-center gap-x-3 border-b px-3"
      href={item.href}
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

function ListenNowSpotifyCard({
  streamingLinks,
}: {
  streamingLinks: SocialMediaLink[];
}) {
  const spotifyLink = streamingLinks.find((l) => l.platform === "spotify");
  const otherStreamingLinks = streamingLinks.filter(
    (l) => l.platform !== "spotify" && l.url
  );

  return (
    <>
      {!spotifyLink?.url ? (
        <div className="border-b px-8 py-4">
          <p className="text-muted-foreground text-sm">
            Add Spotify in site settings to show here.
          </p>
        </div>
      ) : (
        <NavigationMenuPrimitive.Link asChild>
          <a
            className="group hover:bg-accent dark:hover:bg-accent/50 flex h-56 cursor-pointer flex-col border-b px-8 py-4"
            href={spotifyLink.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex items-center justify-between">
              <div className="bg-secondary rounded-md px-2 py-1">
                <p className="text-foreground text-xs font-medium">
                  Listen Now
                </p>
              </div>
              <div className="rounded-full border p-1.5">
                <ArrowRightIcon className="size-3 -rotate-45 transition-transform duration-300 group-hover:rotate-0" />
              </div>
            </div>
            <div className="space-y-5 pt-8">
              <div className="text-muted-foreground [&>svg]:size-6">
                {getSocialIcon("spotify", "size-6")}
              </div>
              <p className="text-foreground/60 text-2xl font-medium">
                <span className="text-foreground">
                  {spotifyLink.label ?? "Listen on Spotify"}
                </span>
              </p>
            </div>
          </a>
        </NavigationMenuPrimitive.Link>
      )}
      {otherStreamingLinks.length > 0 && (
        <div className="flex flex-wrap gap-3 border-b px-8 py-4">
          {otherStreamingLinks.map((link) => (
            <SocialIcon
              key={link.platform}
              href={link.url}
              platform={link.platform}
              label={link.label}
            />
          ))}
        </div>
      )}
    </>
  );
}

function Section({
  title,
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="border-b p-2">
        <span className="text-muted-foreground my-1 ps-1 text-xs font-medium">
          {title}
        </span>
      </div>
      {children}
      <div className="p-2" />
    </div>
  );
}

function CustomNavigationMenuContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      className="group/nav-content absolute top-0 left-1/2 w-full max-w-(--nav-max-w) -translate-x-1/2 overflow-hidden border-x"
      data-slot="navigation-menu-content"
      {...props}
    >
      <div
        className={cn(
          "w-full",
          "group-data-[motion^=from-]/nav-content:animate-in group-data-[motion^=to-]/nav-content:animate-out duration-250",
          "group-data-[motion^=from-]/nav-content:fade-in group-data-[motion^=to-]/nav-content:fade-out",
          "group-data-[motion=from-end]/nav-content:slide-in-from-right-20 group-data-[motion=from-start]/nav-content:slide-in-from-left-20 group-data-[motion=to-end]/nav-content:slide-out-to-right-20 group-data-[motion=to-start]/nav-content:slide-out-to-left-20",
          className
        )}
      >
        {children}
      </div>
    </NavigationMenuPrimitive.Content>
  );
}

function CustomNavigationMenuViewport({
  className: _className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "bg-background absolute inset-x-0 top-[calc(3.5rem+1px)] isolate z-50 w-full overflow-hidden border-b",
        "data-[state=closed]:animate-out data-[state=open]:animate-in transition-[height] duration-250 ease-in-out data-[state=closed]:h-0 data-[state=open]:h-(--radix-navigation-menu-viewport-height)"
      )}
      data-slot="navigation-menu-viewport"
      {...props}
    />
  );
}

function NavigationMenuOverlay({
  className: _className,
  open,
  ...props
}: React.ComponentProps<"div"> & { open: boolean }) {
  return (
    <div
      aria-hidden={!open}
      className="pointer-events-none fixed inset-0 top-[calc(3.5rem+1px)] bottom-0 z-40 h-screen bg-black/20 opacity-0 transition-opacity duration-300 ease-in-out data-[state=open]:opacity-100"
      data-slot="navigation-menu-overlay"
      data-state={open ? "open" : "closed"}
      {...props}
    />
  );
}
