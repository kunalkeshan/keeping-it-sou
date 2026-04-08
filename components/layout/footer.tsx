/**
 * Site-wide footer with four sections: brand/social, latest releases,
 * more links, and contact info. Data comes from Sanity siteConfig and the
 * releases list. Streaming and social links are both shown in the brand
 * section (combined into allSocialLinks). Legal links in the bottom bar
 * are driven by siteConfig.footerLegalLinks, not hardcoded.
 */
import { Logo } from "@/components/shared/logo";
import { SocialIcon } from "@/components/shared/social-links";
import type {
  RELEASES_LIST_QUERY_RESULT,
  SITE_CONFIG_QUERY_RESULT,
} from "@/types/cms";
import { ArrowRightIcon, Mail, Phone, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import { APP_VERSION } from "@/config/version";
import {
  isStreamingPlatform,
  isSupportedPlatform,
  type SupportedSocialPlatform,
} from "@/lib/social-media";
import { mapReleasesToNavItems, type ReleaseNavItem } from "@/lib/releases-nav";

const FOOTER_RELEASES_LIMIT = 4;

function FooterReleaseLink({ item }: { item: ReleaseNavItem }) {
  return (
    <Link
      href={item.href}
      className="hover:text-primary text-sm transition-colors"
    >
      <span className="font-medium">{item.title}</span>
      {item.subText ? (
        <span className="text-muted-foreground"> · {item.subText}</span>
      ) : null}
    </Link>
  );
}

type FooterProps = {
  siteConfig: SITE_CONFIG_QUERY_RESULT;
  releases?: RELEASES_LIST_QUERY_RESULT;
};

export default function Footer({ siteConfig, releases = [] }: FooterProps) {
  const releaseItems = mapReleasesToNavItems(releases).slice(
    0,
    FOOTER_RELEASES_LIMIT
  );
  const currentYear = new Date().getFullYear();
  const startYear = 2026;
  const copyrightYear =
    currentYear > startYear ? `${startYear}-${currentYear}` : `${startYear}`;

  const legalLinks = siteConfig?.footerLegalLinks ?? [];

  const socialMedia = siteConfig?.socialMedia ?? [];
  const streamingLinks = socialMedia
    .filter(
      (
        item
      ): item is typeof item & {
        platform: SupportedSocialPlatform;
        url: string;
      } => isStreamingPlatform(item.platform ?? null) && !!item.url
    )
    .map((item) => ({
      platform: item.platform,
      url: item.url,
      label: item.label,
    }));
  const socialLinks = socialMedia
    .filter(
      (
        item
      ): item is typeof item & {
        platform: SupportedSocialPlatform;
        url: string;
      } =>
        isSupportedPlatform(item.platform ?? null) &&
        !isStreamingPlatform(item.platform ?? null) &&
        !!item.url
    )
    .map((item) => ({
      platform: item.platform,
      url: item.url,
      label: item.label,
    }));
  const allSocialLinks = [...streamingLinks, ...socialLinks];

  return (
    <footer
      className="bg-background w-full border-t"
      id="footer"
      style={{ viewTransitionName: "footer" }}
    >
      <div className="container">
        <div className="grid grid-cols-12 gap-x-5 gap-y-8 py-14">
          {/* Brand Section */}
          <div className="bg-primary/10 relative col-span-full flex flex-col items-center justify-center gap-6 rounded-2xl p-6 lg:col-span-3">
            <Logo
              textPosition="below"
              className="flex justify-center lg:justify-start"
              imageClassName="lg:h-32 w-auto"
              width={200}
              height={50}
              alt={siteConfig?.title ?? "Keeping it Sou"}
            />
            <p className="text-center text-sm">
              {siteConfig?.description ??
                "Your trusted partner for unforgettable experiences."}
            </p>

            {allSocialLinks.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {allSocialLinks.map((link) => (
                  <SocialIcon
                    key={link.platform}
                    href={link.url}
                    platform={link.platform}
                    label={link.label}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Releases Section */}
          <div className="col-span-6 md:col-span-4 lg:col-span-3">
            <h3 className="mb-4 text-lg font-semibold">Releases</h3>
            <ul className="space-y-3">
              {releaseItems.map((item) => (
                <li key={item.href}>
                  <FooterReleaseLink item={item} />
                </li>
              ))}
              <li>
                <Link
                  href="/releases"
                  className="hover:text-primary inline-flex items-center gap-1 text-sm transition-colors"
                >
                  View more
                  <ArrowRightIcon className="size-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Section commented out for now; restore when needed
          <div className="col-span-6 md:col-span-4 lg:col-span-3">
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              {resourcesLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-primary transition-colors flex items-center gap-2"
                  >
                    {link.icon && <link.icon className="size-4" />}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          */}

          {/* More Section */}
          <div className="col-span-6 md:col-span-4 lg:col-span-3">
            <h3 className="mb-4 text-lg font-semibold">More</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/#about"
                  className="hover:text-primary text-sm transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="col-span-full md:col-span-4 lg:col-span-3">
            <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-3">
              {siteConfig?.phoneNumbers &&
                siteConfig.phoneNumbers.map((phone, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Phone className="text-primary mt-0.5 size-4 shrink-0" />
                    <div>
                      <a
                        href={`tel:${phone.number}`}
                        className="hover:text-primary text-sm transition-colors"
                      >
                        {phone.number}
                      </a>
                      {phone.label && (
                        <span className="ml-1 text-xs">({phone.label})</span>
                      )}
                    </div>
                  </li>
                ))}

              {siteConfig?.emails &&
                siteConfig.emails.map((email, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Mail className="text-primary mt-0.5 size-4 shrink-0" />
                    <div>
                      <a
                        href={`mailto:${email.email}`}
                        className="hover:text-primary text-sm transition-colors"
                      >
                        {email.email}
                      </a>
                      {email.label && (
                        <span className="ml-1 text-xs">({email.label})</span>
                      )}
                    </div>
                  </li>
                ))}

              {siteConfig?.address && (
                <li className="flex items-start gap-2">
                  <MapPin className="text-primary mt-0.5 size-4 shrink-0" />
                  <address className="text-sm not-italic">
                    {siteConfig.address.street}
                    {siteConfig.address.street && <br />}
                    {siteConfig.address.city}
                    {siteConfig.address.state &&
                      `, ${siteConfig.address.state}`}
                    {siteConfig.address.postalCode &&
                      ` ${siteConfig.address.postalCode}`}
                    {(siteConfig.address.city || siteConfig.address.state) && (
                      <br />
                    )}
                    {siteConfig.address.country}
                  </address>
                </li>
              )}

              {siteConfig?.sitetiming && (
                <li className="flex items-start gap-2">
                  <Clock className="text-primary mt-0.5 size-4 shrink-0" />
                  <span className="text-sm">{siteConfig.sitetiming}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex flex-wrap justify-center gap-4 md:justify-start">
              {legalLinks.length > 0 ? (
                legalLinks
                  .filter((link) => link.slug?.current)
                  .map((link) => (
                    <Link
                      key={link._id}
                      href={`/legal/${link.slug?.current}`}
                      className="hover:text-primary text-sm transition-colors"
                    >
                      {link.title ?? "Legal"}
                    </Link>
                  ))
              ) : (
                <span className="text-sm">No legal documents</span>
              )}
            </div>

            <p className="text-center text-sm md:text-right">
              &copy; {copyrightYear} {siteConfig?.title ?? "Keeping it Sou"}.
              All rights reserved. <span aria-hidden="true">•</span>{" "}
              <Link
                className="text-muted-foreground hover:text-primary transition-colors"
                href="https://github.com/kunalkeshan/keeping-it-sou/releases/latest"
                prefetch={false}
                rel="noopener noreferrer"
                target="_blank"
              >
                v{APP_VERSION}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
