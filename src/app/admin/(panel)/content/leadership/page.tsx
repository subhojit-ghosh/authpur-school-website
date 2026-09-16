import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { getLeadership } from "@/lib/page-content";
import { saveLeadership } from "../actions";
import { ContentForm, Field, Section, TextField } from "@/components/admin/content-form";

export const metadata: Metadata = { title: "Chairman & Principal" };

export default async function LeadershipContentPage() {
  const people = await getLeadership();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Website Text"
        title="Chairman & Principal"
        description="Shown on the Chairman's Message and Principal's Message pages. Leave a blank line between paragraphs."
        actions={
          <Button asChild variant="outline" className="h-10">
            <Link href="/admin/content">
              <ArrowLeft className="size-4" />
              All text
            </Link>
          </Button>
        }
      />

      <ContentForm action={saveLeadership}>
        {(["chairman", "principal"] as const).map((who) => (
          <Section key={who} title={who === "chairman" ? "Chairman" : "Principal"}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name={`${who}.name`} label="Name" defaultValue={people[who].name} />
              <Field name={`${who}.role`} label="Role" defaultValue={people[who].role} />
              <Field
                name={`${who}.initials`}
                label="Initials"
                defaultValue={people[who].initials}
                maxLength={4}
                hint="Shown in the circle when there is no photograph."
              />
              <Field name={`${who}.photoTag`} label="Photo label" defaultValue={people[who].photoTag} />
            </div>
            <TextField
              name={`${who}.message`}
              label="Message"
              defaultValue={people[who].message}
              rows={10}
              hint="One blank line starts a new paragraph."
            />
          </Section>
        ))}
      </ContentForm>
    </div>
  );
}
