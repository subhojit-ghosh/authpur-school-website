"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitEnquiry, type EnquiryState } from "@/lib/actions/enquiry";
import { defaultSchoolInfo, telHref } from "@/lib/settings-types";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-md border border-input bg-background px-4 py-3 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-brand focus:ring-2 focus:ring-brand/20 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="lg"
      disabled={pending}
      className="mt-1 h-12 rounded-md bg-gold text-base font-semibold text-gold-foreground hover:bg-gold/90"
    >
      <Send className="size-4" />
      {pending ? "Sending…" : "Send Enquiry"}
    </Button>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs font-medium text-destructive">{message}</p>;
}

export function ContactForm({ admissionsPhone = defaultSchoolInfo.admissionsPhone }: { admissionsPhone?: string }) {
  const [state, action] = useActionState<EnquiryState, FormData>(submitEnquiry, {});
  const fe = state.fieldErrors ?? {};

  if (state.ok) {
    return (
      <div role="status" className="rounded-lg border border-[oklch(0.8_0.1_150)] bg-[oklch(0.96_0.03_150)] p-6 text-center">
        <CheckCircle2 className="mx-auto size-10 text-[oklch(0.45_0.12_150)]" />
        <h3 className="mt-3 font-heading text-lg font-semibold text-brand">Thank you — we have received your enquiry.</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          A member of our admissions team will contact you shortly. For anything urgent, call{" "}
          <a href={telHref(admissionsPhone)} className="font-medium text-brand hover:underline">
            {admissionsPhone}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-4" noValidate>
      {/* Honeypot — hidden from people, filled by bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-[15px] font-semibold text-foreground">
            Full name <span className="text-destructive">*</span>
          </label>
          <input
            id="name"
            name="name"
            required
            placeholder="Your name"
            autoComplete="name"
            aria-invalid={fe.name ? true : undefined}
            className={fieldClass}
          />
          <FieldError message={fe.name} />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-[15px] font-semibold text-foreground">
            Phone <span className="text-destructive">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="+91 ..."
            autoComplete="tel"
            aria-invalid={fe.phone ? true : undefined}
            className={fieldClass}
          />
          <FieldError message={fe.phone} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-[15px] font-semibold text-foreground">
            Email <span className="text-muted-foreground">(optional)</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={fe.email ? true : undefined}
            className={fieldClass}
          />
          <FieldError message={fe.email} />
        </div>
        <div>
          <label htmlFor="grade" className="mb-1.5 block text-[15px] font-semibold text-foreground">
            Class of interest
          </label>
          <input id="grade" name="grade" placeholder="e.g. Class VI, or Class XI – Science" className={fieldClass} />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-[15px] font-semibold text-foreground">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="How can we help you?"
          className={cn(fieldClass, "resize-none")}
        />
      </div>

      {state.error ? (
        <p role="alert" className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm font-medium text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {state.error}
        </p>
      ) : null}

      <SubmitButton />
      <p className="text-sm text-muted-foreground">
        Your enquiry goes directly to the school office. You can also call us on{" "}
        <a href={telHref(admissionsPhone)} className="font-medium text-brand hover:underline">
          {admissionsPhone}
        </a>
        .
      </p>
    </form>
  );
}
