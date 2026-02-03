import { Logo } from "@/components/shared/logo";
import { SocialIcon } from "@/components/shared/social-links";
import type { SocialMediaLink } from "@/components/shared/social-links";
import { DesktopNav } from "@/components/layout/desktop-nav";
import { MobileNav } from "@/components/layout/mobile-nav";

type HeaderProps = {
  streamingLinks?: SocialMediaLink[];
};

export function Header({ streamingLinks = [] }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <nav
        className="mx-auto flex h-14 w-full max-w-(--nav-max-w) items-center justify-between px-4 md:border-x"
        style={{ "--nav-max-w": "80rem" } as React.CSSProperties}
      >
        <div className="flex items-center gap-2">
          <div className="rounded-md p-2">
            <Logo />
          </div>
          <div className="hidden h-5 w-px bg-border md:block" />
          <DesktopNav />
        </div>
        <div className="flex items-center gap-2">
          {streamingLinks.length > 0 && (
            <div className="hidden md:flex gap-3 items-center">
              <span className="text-muted-foreground text-sm uppercase tracking-widest">
                Listen Now
              </span>
              {streamingLinks.map((link) => (
                <SocialIcon
                  key={link.platform}
                  href={link.url}
                  platform={link.platform}
                  label={link.label}
                />
              ))}
            </div>
          )}
          <MobileNav streamingLinks={streamingLinks} />
        </div>
      </nav>
    </header>
  );
}
