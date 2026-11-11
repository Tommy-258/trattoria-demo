#!/usr/bin/env node
/**
 * Generates the responsive hero images from one high-resolution source photo.
 *
 *   npm run images:hero -- path/to/source.jpg
 *
 * Output (committed to the repo):
 *   public/images/hero/desktop-<width>.{avif,webp}   landscape crop (full frame)
 *   public/images/hero/mobile-<width>.{avif,webp}    close-up crop of the pizza for phones
 *   src/generated/hero-image.json                    widths per image + tiny blur placeholder
 *
 * The site is a static export, so Next's on-demand image optimizer isn't available.
 * Instead, the custom loader in src/lib/image-loader.ts maps each width requested by
 * next/image to one of these pre-generated files.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const source = process.argv[2];
if (!source) {
  console.error("Usage: npm run images:hero -- <source-image>");
  process.exit(1);
}

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "public/images/hero");
const manifestPath = path.join(root, "src/generated/hero-image.json");

/** Must match images.deviceSizes in next.config.ts */
const DESKTOP_WIDTHS = [640, 828, 1080, 1280, 1920, 2560];
const MOBILE_WIDTHS = [640, 828, 1080, 1280];
/**
 * Portrait-ish crop for phones, as fractions of the source frame: a close-up of the pizza with the
 * flames in the top third and the dark oven floor at the bottom (it fades into the text area).
 */
const MOBILE_CROP = { left: 0.315, top: 0.26, width: 0.43, height: 0.71 };

const meta = await sharp(source).metadata();
const { width: W, height: H } = meta;
console.log(`Source: ${W}×${H}`);

const mobileRegion = {
  left: Math.round(MOBILE_CROP.left * W),
  top: Math.round(MOBILE_CROP.top * H),
  width: Math.round(MOBILE_CROP.width * W),
  height: Math.round(MOBILE_CROP.height * H),
};

const crops = {
  desktop: { region: { left: 0, top: 0, width: W, height: H }, widths: DESKTOP_WIDTHS },
  mobile: { region: mobileRegion, widths: MOBILE_WIDTHS },
};

await mkdir(outDir, { recursive: true });
await mkdir(path.dirname(manifestPath), { recursive: true });

const manifest = { responsive: {}, blurDataURL: "", width: W, height: H };

for (const [name, { region, widths }] of Object.entries(crops)) {
  for (const w of widths) {
    const base = sharp(source).rotate().extract(region).resize({ width: w, withoutEnlargement: true });
    const webp = path.join(outDir, `${name}-${w}.webp`);
    const avif = path.join(outDir, `${name}-${w}.avif`);
    await base.clone().webp({ quality: 70, effort: 6 }).toFile(webp);
    await base.clone().avif({ quality: 48, effort: 6 }).toFile(avif);
    console.log(`  ${name}-${w}.{webp,avif}`);
  }
  for (const ext of ["webp", "avif"]) manifest.responsive[`/images/hero/${name}.${ext}`] = widths;
}

const blur = await sharp(source).rotate().resize({ width: 24 }).webp({ quality: 40 }).toBuffer();
manifest.blurDataURL = `data:image/webp;base64,${blur.toString("base64")}`;

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(`Wrote ${path.relative(root, manifestPath)}`);
