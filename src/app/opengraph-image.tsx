import { ImageResponse } from "next/og";
import { join } from "node:path";
import { readFile } from "node:fs/promises";

/**
 * The picture shown when a page of the site is shared on WhatsApp, Facebook
 * and elsewhere: the crest above the school's name on the site's navy, with
 * the four-colour stripe along the foot.
 */
export const alt = "Authpur National Model Higher Secondary School, Shyamnagar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const crest = `data:image/png;base64,${await readFile(join(process.cwd(), "public/crest.png"), "base64")}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#14304d" }}>
        {/* Everything is centred: WhatsApp's small chat preview crops the
            middle square out of this picture, and the crest must be in it. */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            textAlign: "center",
            padding: "0 60px",
          }}
        >
          {/* oxlint-disable-next-line nextjs/no-img-element -- rendered to a PNG, not a web page */}
          <img src={crest} width={320} height={320} alt="" />
          <div style={{ fontSize: 46, fontWeight: 700, lineHeight: 1.1, marginTop: 24 }}>
            Authpur National Model Higher Secondary School
          </div>
          <div style={{ fontSize: 28, marginTop: 14, color: "#e3b04a", fontWeight: 600 }}>
            Shyamnagar, North 24 Parganas · ICSE & ISC
          </div>
        </div>
        <div style={{ display: "flex", height: 16 }}>
          <div style={{ flex: 1, background: "#d23a2e" }} />
          <div style={{ flex: 1, background: "#e3b04a" }} />
          <div style={{ flex: 1, background: "#1f7a4c" }} />
          <div style={{ flex: 1, background: "#1d6fb8" }} />
        </div>
      </div>
    ),
    size,
  );
}
