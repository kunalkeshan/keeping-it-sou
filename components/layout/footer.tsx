import { Logo } from "@/components/shared/logo";
import { SocialIcon } from "@/components/shared/social-links";
import type { SITE_CONFIG_QUERY_RESULT } from "@/types/cms";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import { navLinks, resourcesLinks } from "@/constants/nav-links";
import {
  isStreamingPlatform,
  isSupportedPlatform,
  type SupportedSocialPlatform,
} from "@/lib/social-media";

type FooterProps = {
  siteConfig: SITE_CONFIG_QUERY_RESULT;
};

export default function Footer({ siteConfig }: FooterProps) {
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
      className="w-full border-t bg-background"
      id="footer"
      style={{ viewTransitionName: "footer" }}
    >
      <div className="container">
        <div className="py-14 grid grid-cols-12 gap-x-5 gap-y-8">
          {/* Brand Section */}
          <div className="col-span-full lg:col-span-3 relative bg-primary/10 rounded-2xl gap-6 p-6 flex flex-col justify-center items-center">
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
              <div className="flex gap-3 flex-wrap justify-center">
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

          {/* Links Section */}
          <div className="col-span-6 md:col-span-4 lg:col-span-3">
            <h3 className="font-semibold text-lg mb-4">Links</h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Section */}
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

          {/* Contact Section */}
          <div className="col-span-full md:col-span-4 lg:col-span-3">
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              {siteConfig?.phoneNumbers &&
                siteConfig.phoneNumbers.map((phone, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Phone className="size-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <a
                        href={`tel:${phone.number}`}
                        className="text-sm hover:text-primary transition-colors"
                      >
                        {phone.number}
                      </a>
                      {phone.label && (
                        <span className="text-xs ml-1">({phone.label})</span>
                      )}
                    </div>
                  </li>
                ))}

              {siteConfig?.emails &&
                siteConfig.emails.map((email, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Mail className="size-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <a
                        href={`mailto:${email.email}`}
                        className="text-sm hover:text-primary transition-colors"
                      >
                        {email.email}
                      </a>
                      {email.label && (
                        <span className="text-xs ml-1">({email.label})</span>
                      )}
                    </div>
                  </li>
                ))}

              {siteConfig?.address && (
                <li className="flex items-start gap-2">
                  <MapPin className="size-4 text-primary mt-0.5 shrink-0" />
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
                  <Clock className="size-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-sm">{siteConfig.sitetiming}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              {legalLinks.length > 0 ? (
                legalLinks
                  .filter((link) => link.slug?.current)
                  .map((link) => (
                    <Link
                      key={link._id}
                      href={`/legal/${link.slug?.current}`}
                      className="text-sm hover:text-primary transition-colors"
                    >
                      {link.title ?? "Legal"}
                    </Link>
                  ))
              ) : (
                <span className="text-sm">No legal documents</span>
              )}
            </div>

            <p className="text-sm text-center md:text-right">
              &copy; {copyrightYear} {siteConfig?.title ?? "Keeping it Sou"}.
              All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
