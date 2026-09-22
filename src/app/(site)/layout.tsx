import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getIdentity, getNavigation } from "@/lib/page-content";
import { getSchoolInfo } from "@/lib/settings";
import { MotionProvider } from "@/components/motion";
import { siteUrl } from "@/lib/site-url";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [info, identity, nav] = await Promise.all([getSchoolInfo(), getIdentity(), getNavigation()]);
  return (
    <MotionProvider>
      {/* Structured data: lets search engines show the school's address,
          phone and pages accurately. Built from the same editable settings
          as the footer, and escaped so no saved text can end the script. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "School",
            name: identity.name,
            alternateName: [identity.shortName, "ANMS"],
            url: siteUrl,
            logo: `${siteUrl}/crest.png`,
            image: `${siteUrl}/opengraph-image`,
            telephone: info.phone,
            email: info.email,
            address: {
              "@type": "PostalAddress",
              streetAddress: info.address.line1,
              addressLocality: info.address.line2,
              addressRegion: info.address.state,
              postalCode: info.address.pin,
              addressCountry: "IN",
            },
            sameAs: identity.footerSocial.map((s) => s.href).filter((href) => href.startsWith("http")),
          }).replace(/</g, "\\u003c"),
        }}
      />
      <SiteHeader info={info} identity={identity} nav={nav} />
      <main className="flex-1">{children}</main>
      <SiteFooter info={info} identity={identity} />
    </MotionProvider>
  );
}
