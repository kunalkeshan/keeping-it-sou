import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { DesktopNav } from "@/components/layout/desktop-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { GithubIcon } from "@/components/layout/sheard";

export function Header() {
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
          <Button size="sm" variant="ghost">
            <GithubIcon />
            <span className="text-muted-foreground">99k+</span>
          </Button>
          <Button className="hidden md:flex" size="sm" variant="outline">
            Login
          </Button>
          <Button className="hidden md:flex" size="sm">
            Book a Demo
          </Button>
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
