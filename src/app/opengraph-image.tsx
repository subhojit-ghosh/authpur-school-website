import { ImageResponse } from "next/og";
import { join } from "node:path";
import { readFile } from "node:fs/promises";

/**
 * The picture shown when a page of the site is shared on WhatsApp, Facebook
 * and elsewhere: the crest and the school's name on the site's navy, with the
 * four-colour stripe along the foot.
 */
export const alt = "Authpur National Model Higher Secondary School, Shyamnagar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const crest = `data:image/png;base64,${await readFile(join(process.cwd(), "public/crest.png"), "base64")}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#0b2545" }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 56, padding: "0 80px" }}>
          {/* oxlint-disable-next-line nextjs/no-img-element -- rendered to a PNG, not a web page */}
          <img src={crest} width={280} height={280} alt="" />
          <div style={{ display: "flex", flexDirection: "column", color: "white" }}>
            <div style={{ fontSize: 30, color: "#f2a516", fontWeight: 600 }}>Shyamnagar, North 24 Parganas</div>
            <div style={{ fontSize: 66, fontWeight: 700, lineHeight: 1.05, marginTop: 14, maxWidth: 720 }}>
              Authpur National Model Higher Secondary School
            </div>
            <div style={{ fontSize: 30, marginTop: 22, color: "rgba(255,255,255,0.8)" }}>
              ICSE & ISC, Lower Nursery to Class XII
            </div>
          </div>
        </div>
        <div style={{ display: "flex", height: 16 }}>
          <div style={{ flex: 1, background: "#d23a2e" }} />
          <div style={{ flex: 1, background: "#f2a516" }} />
          <div style={{ flex: 1, background: "#1f7a4c" }} />
          <div style={{ flex: 1, background: "#1d6fb8" }} />
        </div>
      </div>
    ),
    size,
  );
}
