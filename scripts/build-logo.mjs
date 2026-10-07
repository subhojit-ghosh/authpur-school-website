// Turns the school's master logo (logo-source.png, 1515x1600, ~1.4 MB) into
// the small files the site serves: the crest in pages, the favicon, the
// home-screen icons and the copy used for search engines and link previews.
// Run with: bun run build:logo
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const SOURCE = "scripts/logo-source.png";

// Crop away the empty margin round the circle, then square it up so the
// crest sits centred in every icon.
const trimmed = await sharp(SOURCE).trim({ threshold: 10 }).png().toBuffer();
const { width, height } = await sharp(trimmed).metadata();
const side = Math.max(width, height);
const square = await sharp(trimmed)
  .extend({
    top: Math.floor((side - height) / 2),
    bottom: Math.ceil((side - height) / 2),
    left: Math.floor((side - width) / 2),
    right: Math.ceil((side - width) / 2),
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

const png = (size, opts = {}) => {
  let img = sharp(square).resize(size, size, { kernel: "lanczos3" });
  if (opts.pad) {
    const inner = Math.round(size * (1 - opts.pad * 2));
    img = sharp(square)
      .resize(inner, inner)
      .extend({
        top: Math.floor((size - inner) / 2),
        bottom: Math.ceil((size - inner) / 2),
        left: Math.floor((size - inner) / 2),
        right: Math.ceil((size - inner) / 2),
        background: opts.background ?? { r: 0, g: 0, b: 0, alpha: 0 },
      });
  }
  if (opts.background) img = img.flatten({ background: opts.background });
  return img.png({ compressionLevel: 9, palette: opts.palette ?? true, quality: 90, effort: 10 }).toBuffer();
};

// favicon.ico holding 16, 32 and 48 pixel PNGs.
async function ico(sizes) {
  const images = await Promise.all(sizes.map((s) => png(s)));
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach((img, i) => {
    const e = 6 + i * 16;
    header.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], e);
    header.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], e + 1);
    header.writeUInt16LE(1, e + 4);
    header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(img.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += img.length;
  });
  return Buffer.concat([header, ...images]);
}

const white = { r: 255, g: 255, b: 255 };
const outputs = {
  // Shown in pages through next/image, which serves smaller WebP/AVIF copies.
  "public/crest.png": await png(512, { palette: true }),
  "src/app/favicon.ico": await ico([16, 32, 48]),
  "src/app/icon.png": await png(96),
  // iOS fills transparency with black, so the home-screen icon gets a white
  // ground and a little breathing room.
  "src/app/apple-icon.png": await png(180, { pad: 0.06, background: white }),
  // Android home-screen / install icons, listed in src/app/manifest.ts.
  "public/icon-192.png": await png(192, { palette: true }),
  "public/icon-512.png": await png(512, { palette: true }),
  "public/icon-maskable-512.png": await png(512, { pad: 0.1, background: white, palette: true }),
};
for (const [path, buf] of Object.entries(outputs)) {
  await writeFile(path, buf);
  console.log(path.padEnd(32), `${(buf.length / 1024).toFixed(1)} KB`);
}
