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
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui";
import { ArrowRight, ArrowRightIcon, type LucideIcon } from "lucide-react";
import { useState } from "react";
import {
  featuresLinks,
  navLinks,
  resourcesLinks,
  useCasesLinks,
} from "@/constants/nav-links";
import { GithubIcon, LinkItem, VercelIcon } from "@/components/layout/sheard";

export function DesktopNav() {
  const [open, setOpen] = useState(false);
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
            Products
          </NavigationMenuTrigger>
          <CustomNavigationMenuContent className="grid w-full grid-cols-3">
            <Section className="border-r" title="Features">
              {featuresLinks.map((link, linkIndex) => (
                <NavigationMenuPrimitive.Link
                  asChild
                  key={`${link.label}-${linkIndex}`}
                >
                  <LinkItem {...link} />
                </NavigationMenuPrimitive.Link>
              ))}
            </Section>
            <Section className="border-r" title="Use Cases">
              {useCasesLinks.map((link, linkIndex) => (
                <NavigationMenuPrimitive.Link
                  asChild
                  key={`${link.label}-${linkIndex}`}
                >
                  <LinkItem {...link} />
                </NavigationMenuPrimitive.Link>
              ))}
            </Section>
            <Section title="Customer Stories">
              <CustomerStory />
              <NavigationMenuPrimitive.Link asChild>
                <LinkItem
                  description="Browse our success stories"
                  href="#"
                  icon={ArrowRight}
                  label="Customer Stories"
                />
              </NavigationMenuPrimitive.Link>
            </Section>
          </CustomNavigationMenuContent>
        </NavigationMenuItem>
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

function CustomerStory() {
  return (
    <NavigationMenuPrimitive.Link asChild>
      <a
        className="group flex h-56 cursor-pointer flex-col border-b px-8 py-4 hover:bg-accent dark:hover:bg-accent/50"
        href="#"
      >
        <div className="flex items-center justify-between">
          <div className="rounded-md bg-secondary px-2 py-1">
            <p className="font-medium text-foreground text-xs">
              Customer Story
            </p>
          </div>
          <div className="rounded-full border p-1.5">
            <ArrowRightIcon className="-rotate-45 size-3 transition-transform duration-300 group-hover:rotate-0" />
          </div>
        </div>
        <div className="space-y-5 pt-8">
          <VercelIcon className="size-6" />
          <p className="font-medium text-2xl text-foreground/60">
            How Vercel uses <br />{" "}
            <span className="text-foreground">Efferd</span> to build <br />
            their Web Design
          </p>
        </div>
      </a>
    </NavigationMenuPrimitive.Link>
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
