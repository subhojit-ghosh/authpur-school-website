import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getIdentity, getNavigation } from "@/lib/page-content";
import { getSchoolInfo } from "@/lib/settings";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [info, identity, nav] = await Promise.all([getSchoolInfo(), getIdentity(), getNavigation()]);
  return (
    <>
      <SiteHeader info={info} identity={identity} nav={nav} />
      <main className="flex-1">{children}</main>
      <SiteFooter info={info} identity={identity} />
    </>
  );
}
