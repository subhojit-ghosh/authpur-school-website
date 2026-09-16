import { redirect } from "next/navigation";

/**
 * Events are listed alongside notices, so `/events` on its own is not a page of
 * its own — it sends the visitor to the notice board rather than a dead end.
 */
export default function EventsIndex() {
  redirect("/notices");
}
