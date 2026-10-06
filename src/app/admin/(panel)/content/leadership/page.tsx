import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ContentForm, Section } from "@/components/admin/content-form";
import { LeadersEditor } from "@/components/admin/leaders-editor";
import { Button } from "@/components/ui/button";
import { getLeaders } from "@/lib/page-content";
import { saveLeaders } from "../actions";

export const metadata: Metadata = { title: "Leadership" };

export default async function LeadershipContentPage() {
  const { people } = await getLeaders();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Website Text"
        title="Leadership"
        description="The people with a message on the website. Each one gets their own page, and appears in the menu where you link to it."
        actions={
          <Button asChild variant="outline" className="h-10">
            <Link href="/admin/content">
              <ArrowLeft className="size-4" />
              All text
            </Link>
          </Button>
        }
      />

      <ContentForm action={saveLeaders}>
        <Section
          title="People"
          description="Shown in this order wherever the site lists them. The web address is used for that person's page, so leave it alone once the link has been shared."
        >
          <LeadersEditor name="leaders" initial={people} />
        </Section>
      </ContentForm>
    </div>
  );
}
