import { Logo } from "@/components/shared/logo";
import { SocialIcon } from "@/components/shared/social-links";
import type { SocialMediaLink } from "@/components/shared/social-links";
import { DesktopNav } from "@/components/layout/desktop-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import type { RELEASES_LIST_QUERY_RESULT } from "@/types/cms";

type HeaderProps = {
  streamingLinks?: SocialMediaLink[];
  releases?: RELEASES_LIST_QUERY_RESULT;
};

export function Header({ streamingLinks = [], releases = [] }: HeaderProps) {
  return (
    <header className="bg-background sticky top-0 z-50 w-full border-b">
      <nav
        className="mx-auto flex h-14 w-full max-w-(--nav-max-w) items-center justify-between px-4 md:border-x"
        style={{ "--nav-max-w": "80rem" } as React.CSSProperties}
      >
        <div className="flex items-center gap-2">
          <div className="rounded-md p-2">
            <Logo />
          </div>
          <div className="bg-border hidden h-5 w-px md:block" />
          <DesktopNav streamingLinks={streamingLinks} releases={releases} />
        </div>
        <div className="flex items-center gap-2">
          {streamingLinks.length > 0 && (
            <div className="hidden items-center gap-3 md:flex">
              <span className="text-muted-foreground text-sm tracking-widest uppercase">
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
          <MobileNav streamingLinks={streamingLinks} releases={releases} />
        </div>
      </nav>
    </header>
  );
}
