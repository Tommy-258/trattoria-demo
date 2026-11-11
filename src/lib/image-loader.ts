import hero from "@/generated/hero-image.json";

type LoaderParams = { src: string; width: number; quality?: number };

const responsive: Record<string, number[]> = hero.responsive;

/**
 * next/image loader for a static export.
 *
 * Images listed in src/generated/hero-image.json were pre-rendered at several widths
 * (see scripts/optimize-hero.mjs). For those, return the smallest file that is at least
 * as wide as requested, e.g. "/images/hero/mobile.avif" at 800w → "/images/hero/mobile-828.avif".
 * Any other image is served as-is.
 */
export default function imageLoader({ src, width }: LoaderParams): string {
  const widths = responsive[src];
  if (!widths) return src;
  const best = widths.find((w) => w >= width) ?? widths[widths.length - 1];
  return src.replace(/\.(\w+)$/, `-${best}.$1`);
}
