import type { MetadataRoute } from "next";

/**
 * Lets phones add the site to the home screen with the school's crest as the
 * icon. The icons are made by scripts/build-logo.mjs.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Authpur National Model Higher Secondary School",
    short_name: "ANMS",
    description: "ICSE & ISC school in Authpur, Shyamnagar, North 24 Parganas.",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#14304d",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
