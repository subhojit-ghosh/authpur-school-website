import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getIdentity } from "@/lib/page-content";
import { getSchoolInfo } from "@/lib/settings";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [info, identity] = await Promise.all([getSchoolInfo(), getIdentity()]);
  return (
    <>
      <SiteHeader info={info} identity={identity} />
      <main className="flex-1">{children}</main>
      <SiteFooter info={info} identity={identity} />
    </>
  );
}
