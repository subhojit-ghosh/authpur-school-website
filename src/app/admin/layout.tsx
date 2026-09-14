import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin Panel",
    template: "%s · Admin Panel",
  },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-svh flex-1 flex-col bg-muted/40">{children}</div>;
}
