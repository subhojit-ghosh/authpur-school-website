"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CalendarDays, ClipboardList, FileText, GraduationCap, IndianRupee, Save } from "lucide-react";
import { FormError } from "@/components/admin/form-message";
import { Flash } from "@/components/admin/flash";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { RowsEditor } from "@/components/admin/rows-editor";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { AdmissionsContent } from "@/lib/settings-types";
import { saveAdmissions, type SaveState } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="h-10 bg-brand px-5 font-semibold text-brand-foreground hover:bg-brand-muted">
      <Save className="size-4" />
      {pending ? "Saving…" : "Save & publish"}
    </Button>
  );
}

function Section({ icon: Icon, title, description, children }: { icon: typeof CalendarDays; title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-card p-6">
      <h3 className="flex items-center gap-2 font-heading text-base font-semibold text-brand">
        <Icon className="size-4 text-gold" />
        {title}
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function AdmissionsForm({ initial }: { initial: AdmissionsContent }) {
  const [state, action] = useActionState<SaveState, FormData>(saveAdmissions, {});

  return (
    <form action={action} className="grid gap-6">
      <Section icon={CalendarDays} title="Important dates" description="Shown in the “Important dates” box on the Admissions page, top to bottom.">
        <RowsEditor
          name="dates"
          columns={[
            { key: "event", label: "Event", placeholder: "e.g. Last date to apply" },
            { key: "date", label: "Date", placeholder: "e.g. 31 August 2026" },
          ]}
          initial={initial.dates}
          addLabel="Add date"
        />
      </Section>

      <Section icon={GraduationCap} title="Eligibility" description="Class or level and the criteria a child must meet.">
        <RowsEditor
          name="eligibility"
          columns={[
            { key: "level", label: "Class / level", placeholder: "e.g. Class I" },
            { key: "criteria", label: "Criteria", placeholder: "e.g. 5+ years as on 1st April" },
          ]}
          initial={initial.eligibility}
          addLabel="Add level"
        />
      </Section>

      <Section icon={IndianRupee} title="Fee structure" description="Fee heads and amounts. Type the ₹ sign and formatting exactly as you want it displayed.">
        <RowsEditor
          name="fees"
          columns={[
            { key: "head", label: "Fee head", placeholder: "e.g. Monthly tuition — Primary" },
            { key: "amount", label: "Amount", placeholder: "e.g. ₹700" },
          ]}
          initial={initial.fees}
          addLabel="Add fee"
        />
        <div className="mt-4 grid gap-2">
          <Label htmlFor="feeNote">Note under the fee table</Label>
          <RichTextEditor
            name="feeNote"
            defaultValue={initial.feeNote}
            placeholder="e.g. Fees may be paid termly. Sibling concessions apply."
            ariaLabel="Note under the fee table"
          />
        </div>
      </Section>

      <Section icon={ClipboardList} title="How to apply" description="The four numbered steps at the top of the Admissions page.">
        <RowsEditor
          name="steps"
          columns={[
            { key: "title", label: "Step", placeholder: "e.g. Submit application" },
            { key: "text", label: "Description", placeholder: "One or two sentences" },
          ]}
          initial={initial.steps}
          addLabel="Add step"
        />
      </Section>

      <Section icon={FileText} title="Documents required" description="The checklist shown beside the fee table.">
        <RowsEditor
          name="documents"
          columns={[{ key: "item", label: "Document", placeholder: "e.g. Birth certificate of the child" }]}
          initial={initial.documents}
          addLabel="Add document"
        />
      </Section>

      <FormError message={state.error} />
      {state.success ? <Flash text={state.success} /> : null}

      <div>
        <SubmitButton />
      </div>
    </form>
  );
}
