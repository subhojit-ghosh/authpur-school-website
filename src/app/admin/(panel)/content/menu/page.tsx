import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ContentForm, Field, Section } from "@/components/admin/content-form";
import { MenuEditor } from "@/components/admin/menu-editor";
import { Button } from "@/components/ui/button";
import { getNavigation } from "@/lib/page-content";
import { saveNavigation } from "../actions";

export const metadata: Metadata = { title: "Header menu" };

export default async function MenuContentPage() {
  const nav = await getNavigation();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Website Text"
        title="Header menu"
        description="The menu across the top of every page, and the gold button beside it. The same menu is used inside the phone menu."
        actions={
          <>
            <Button asChild variant="outline" className="h-10">
              <Link href="/" target="_blank">
                <ExternalLink className="size-4" />
                View website
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-10">
              <Link href="/admin/content">
                <ArrowLeft className="size-4" />
                All text
              </Link>
            </Button>
          </>
        }
      />

      <ContentForm action={saveNavigation}>
        <Section
          title="Menu items"
          description="Addresses beginning with / stay on this website, for example /notices. Use /#about to jump to a section of the home page. A full address such as https://example.com opens another site."
        >
          <MenuEditor name="menu" initial={nav.items} />
        </Section>

        <Section title="Apply button" description="The gold button at the right of the menu.">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field name="applyLabel" label="Button text" defaultValue={nav.applyLabel} />
            <Field name="applyHref" label="Address" defaultValue={nav.applyHref} />
            <Field
              name="applyLabelMobile"
              label="Button text on a phone"
              defaultValue={nav.applyLabelMobile}
              hint="There is more room in the phone menu, so this can be longer."
            />
          </div>
        </Section>
      </ContentForm>
    </div>
  );
}
