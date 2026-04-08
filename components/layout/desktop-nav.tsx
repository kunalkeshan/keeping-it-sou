"use client";
import { Logo } from "@/components/shared/logo";
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
import { ArrowRightIcon, type LucideIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { navLinks, resourcesLinks } from "@/constants/nav-links";
import { SocialIcon, type SocialMediaLink } from "@/components/shared/social-links";
import { GithubIcon, LinkItem } from "@/components/layout/sheard";
import {
  mapReleasesToNavItems,
  type ReleaseNavItem,
} from "@/lib/releases-nav";
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
  const releaseItems = mapReleasesToNavItems(releases).slice(0, NAV_RELEASES_LIMIT);

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
          <NavigationMenuTrigger className="bg-transparent px-2 text-muted-foreground hover:bg-transparent hover:text-foreground">
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
                      className="group flex h-14 w-full items-center gap-x-3 border-b px-3 hover:bg-accent dark:hover:bg-accent/50"
                      href="/releases"
                    >
                      <span className="font-medium text-sm text-primary">
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
              className="bg-transparent px-2 text-muted-foreground hover:bg-transparent hover:text-foreground"
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
      className="group flex h-14 w-full items-center gap-x-3 border-b px-3 hover:bg-accent dark:hover:bg-accent/50"
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
            className="group flex h-56 cursor-pointer flex-col border-b px-8 py-4 hover:bg-accent dark:hover:bg-accent/50"
            href={spotifyLink.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-md bg-secondary px-2 py-1">
                <p className="font-medium text-foreground text-xs">
                  Listen Now
                </p>
              </div>
              <div className="rounded-full border p-1.5">
                <ArrowRightIcon className="-rotate-45 size-3 transition-transform duration-300 group-hover:rotate-0" />
              </div>
            </div>
            <div className="space-y-5 pt-8">
              <div className="text-muted-foreground [&>svg]:size-6">
                {getSocialIcon("spotify", "size-6")}
              </div>
              <p className="font-medium text-2xl text-foreground/60">
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

function OpenSource() {
  return (
    <div className="flex h-28 flex-col space-y-3 border-b px-4 pt-4 pb-2">
      <Logo showText={false} imageClassName="size-6" />
      <p className="font-medium text-foreground/60">
        <span className="text-foreground">Efferd</span> is open source. <br />
        Star us to show your support!
      </p>
    </div>
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
        <span className="my-1 ps-1 font-medium text-muted-foreground text-xs">
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
      className="-translate-x-1/2 group/nav-content absolute top-0 left-1/2 w-full max-w-(--nav-max-w) overflow-hidden border-x"
      data-slot="navigation-menu-content"
      {...props}
    >
      <div
        className={cn(
          "w-full",
          "duration-250 group-data-[motion^=from-]/nav-content:animate-in group-data-[motion^=to-]/nav-content:animate-out",
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
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "absolute inset-x-0 top-[calc(3.5rem+1px)] isolate z-50 w-full overflow-hidden border-b bg-background",
        "transition-[height] duration-250 ease-in-out data-[state=closed]:h-0 data-[state=open]:h-(--radix-navigation-menu-viewport-height) data-[state=closed]:animate-out data-[state=open]:animate-in"
      )}
      data-slot="navigation-menu-viewport"
      {...props}
    />
  );
}

function NavigationMenuOverlay({
  className,
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
