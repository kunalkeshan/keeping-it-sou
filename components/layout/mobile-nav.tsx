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
import { UsersRound } from "lucide-react";
import React from "react";
import {
  featuresLinks,
  navLinks,
  resourcesLinks,
  useCasesLinks,
} from "@/constants/nav-links";
import { LinkItem } from "@/components/layout/sheard";

const sections = [
  {
    id: "features",
    name: "Features",
    list: featuresLinks,
  },
  {
    id: "use-cases",
    name: "Use Cases",
    list: useCasesLinks,
  },
  {
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
  },
];

export function MobileNav() {
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
              {sections.map((section) => (
                <AccordionItem
                  className="border-b-0"
                  key={section.id}
                  value={section.id}
                >
                  <AccordionTrigger className="rounded-none border-b px-6 hover:no-underline">
                    {section.name}
                  </AccordionTrigger>
                  <AccordionContent className="pb-0">
                    {section.list.map((link) => (
                      <LinkItem
                        className="px-8"
                        key={`mobile-${section.id}-${link.label}`}
                        {...link}
                      />
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            {navLinks.map((link, i) => (
              <LinkItem
                className="px-6"
                key={`mobile-${link.label}-${i}`}
                {...link}
              />
            ))}
            <div className="mt-5 grid gap-2 px-6">
              <Button className="w-full" variant="outline">
                Login
              </Button>
              <Button className="w-full">Book a Demo</Button>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
