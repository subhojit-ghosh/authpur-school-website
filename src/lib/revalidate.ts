import "server-only";

import { revalidatePath } from "next/cache";

/** Public pages that show notices and events. Call after any notice/event change. */
export function revalidateNoticesAndEvents() {
  revalidatePath("/");
  revalidatePath("/notices");
}

/** Home page only (hero banners). */
export function revalidateHome() {
  revalidatePath("/");
}

export function revalidateGallery() {
  revalidatePath("/gallery");
}

export function revalidateAdmissions() {
  revalidatePath("/admissions");
  revalidatePath("/");
}

/** School info appears in the header and footer of every public page. */
export function revalidateWholeSite() {
  revalidatePath("/", "layout");
}
