"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { school } from "@/lib/site";

const fieldClass =
  "w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-brand focus:ring-2 focus:ring-brand/20";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const cls = String(data.get("grade") ?? "");
    const message = String(data.get("message") ?? "");
    const phone = String(data.get("phone") ?? "");
    const body = `Name: ${name}%0APhone: ${phone}%0AClass of interest: ${cls}%0A%0A${message}`;
    window.location.href = `mailto:${school.email}?subject=Admission Enquiry — ${encodeURIComponent(
      name,
    )}&body=${body}`;
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
            Full name
          </label>
          <input id="name" name="name" required placeholder="Your name" className={fieldClass} />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-foreground">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="+91 ..."
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="grade" className="mb-1.5 block text-sm font-medium text-foreground">
          Class of interest
        </label>
        <input
          id="grade"
          name="grade"
          placeholder="e.g. Class VI, or Class XI – Science"
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="How can we help you?"
          className={`${fieldClass} resize-none`}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="mt-1 h-12 bg-gold text-[15px] font-semibold text-gold-foreground hover:bg-gold/90"
      >
        <Send className="size-4" />
        {sent ? "Opening your email…" : "Send Enquiry"}
      </Button>
      <p className="text-xs text-muted-foreground">
        This form opens your email app with the details pre-filled. You can also call us
        directly.
      </p>
    </form>
  );
}
