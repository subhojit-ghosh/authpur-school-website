import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  /**
   * Packages with native binaries must not be bundled: Vercel traces their
   * platform-specific `.node` files only when they are left external. Bundling
   * sharp made the upload function fail to start in production, which the
   * browser saw as a crash page rather than an upload error.
   */
  serverExternalPackages: ["pg", "sharp"],
  /**
   * sharp loads libvips from a sibling package at runtime, and the tracer does
   * not follow that hand-off, so the shared library was missing from the
   * deployed upload function and it failed to start. Naming the packages here
   * ships them with the routes that resize images.
   */
  outputFileTracingIncludes: {
    "/admin/upload": ["./node_modules/sharp/**", "./node_modules/@img/**"],
    "/admin/diagnostics": ["./node_modules/sharp/**", "./node_modules/@img/**"],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
