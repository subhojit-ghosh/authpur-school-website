import type { Metadata } from "next";
import { Outfit, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/lib/site-url";

// Outfit sets the headings: a sturdy geometric face that reads clearly at
// banner sizes. Source Sans 3 is the text face; being humanist rather than
// geometric it stays distinct from the headings and comfortable in long prose.
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

const SCHOOL_NAME = "Authpur National Model Higher Secondary School";
const SHORT_NAME = "Authpur National Model School";
const DESCRIPTION =
  "Co-educational, English-medium CISCE school in Authpur, Shyamnagar, North 24 Parganas, from Lower Nursery to Class XII (ICSE & ISC). Admissions open for 2026–27.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: SHORT_NAME,
  title: {
    default: `${SHORT_NAME} | ICSE & ISC School in Shyamnagar`,
    template: `%s | ${SHORT_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    "Authpur National Model School",
    "Authpur National Model Higher Secondary School",
    "ANMS Shyamnagar",
    "ICSE school Shyamnagar",
    "ISC school North 24 Parganas",
    "CISCE school Bhatpara",
    "English medium school Shyamnagar",
    "school admission 2026-27",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: SCHOOL_NAME,
    title: SCHOOL_NAME,
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: SCHOOL_NAME, description: DESCRIPTION },
  formatDetection: { telephone: true, email: true, address: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${sourceSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
