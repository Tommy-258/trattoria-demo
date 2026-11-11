"use client";

import { useEffect, useState } from "react";
import { restaurant } from "@/config/restaurant";
import { PhoneIcon } from "./Icons";

/** Sticky "Reserve" bar on small screens. Hidden while the hero or the reservation form is on screen. */
export function MobileReserveBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const reserve = document.getElementById("reserve");
    if (!hero || !reserve || !("IntersectionObserver" in window)) return;

    const state = { hero: true, reserve: false };
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) state.hero = e.isIntersecting;
        if (e.target === reserve) state.reserve = e.isIntersecting;
      }
      setVisible(!state.hero && !state.reserve);
    });
    io.observe(hero);
    io.observe(reserve);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-cream-300 bg-cream-50/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
      inert={!visible}
    >
      <div className="flex gap-3">
        <a
          href={`tel:${restaurant.phone.e164}`}
          className="btn-secondary w-14 shrink-0 px-0"
          aria-label={`Call ${restaurant.phone.display}`}
        >
          <PhoneIcon />
        </a>
        <a href="#reserve" className="btn-primary flex-1">
          Reserve a table
        </a>
      </div>
    </div>
  );
}
