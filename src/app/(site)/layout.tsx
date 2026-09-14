import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getSchoolInfo } from "@/lib/settings";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const info = await getSchoolInfo();
  return (
    <>
      <SiteHeader info={info} />
      <main className="flex-1">{children}</main>
      <SiteFooter info={info} />
    </>
  );
}
