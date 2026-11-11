"use client";

import { useState } from "react";
import { fullAddress, mapsQuery, restaurant } from "@/config/restaurant";
import { PinIcon } from "./Icons";

/**
 * Click-to-load map. Nothing is requested from Google until the visitor asks for it,
 * which keeps the page fast and avoids third-party cookies on first load.
 */
export function MapEmbed() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-cream-300 bg-cream-200 sm:aspect-[16/10]">
      {loaded ? (
        <iframe
          title={`Map showing ${restaurant.name} at ${fullAddress}`}
          src={`https://www.google.com/maps?q=${mapsQuery}&z=16&output=embed`}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <>
          {/* stylized street grid, pure CSS */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(90deg,transparent_47%,#fffcf7_47%,#fffcf7_53%,transparent_53%),linear-gradient(0deg,transparent_47%,#fffcf7_47%,#fffcf7_53%,transparent_53%)] bg-[length:120px_90px] opacity-90"
          />
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-[38%] w-5 -skew-x-12 bg-[#fffcf7] shadow-[0_0_0_2px_rgba(234,219,194,0.9)]"
          />
          <div aria-hidden="true" className="absolute top-[12%] right-[8%] h-[30%] w-[26%] rounded-2xl bg-olive-500/25" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-cream-100/40 p-6 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-tomato-600 text-cream-50 shadow-lg">
              <PinIcon width={28} height={28} />
            </span>
            <button type="button" onClick={() => setLoaded(true)} className="btn-primary">
              Load interactive map
            </button>
            <p className="max-w-xs rounded-lg bg-cream-50/90 px-3 py-1.5 text-xs text-ink-soft">
              Loads content from Google Maps, which may set cookies.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
