import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});

const SCHOOL_NAME = "Authpur National Model Higher Secondary School";

export const metadata: Metadata = {
  metadataBase: new URL("https://authpurnationalmodel.edu.in"),
  title: {
    default: `${SCHOOL_NAME} | Shyamnagar, West Bengal`,
    template: `%s | ${SCHOOL_NAME}`,
  },
  description:
    "A co-educational higher secondary school in Authpur, Shyamnagar, nurturing curious minds from primary through Class 12 with academic excellence, strong values and holistic growth.",
  keywords: [
    "Authpur National Model School",
    "Higher Secondary School Shyamnagar",
    "school in Authpur",
    "West Bengal school",
    "admission 2026",
  ],
  openGraph: {
    title: `${SCHOOL_NAME}`,
    description:
      "Academic excellence, strong values and holistic growth for every child — from primary through Class 12.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
