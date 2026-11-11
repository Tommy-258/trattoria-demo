"use client";

import { useEffect } from "react";

/**
 * Progressive enhancement: elements with [data-reveal] fade in as they enter the viewport.
 * Without JavaScript, or with reduced motion enabled, everything is simply visible.
 */
export function RevealOnScroll() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    // Anything already above the fold stays visible to avoid a flash.
    const vh = window.innerHeight;
    els.forEach((el) => {
      if (el.getBoundingClientRect().top < vh) el.classList.add("is-visible");
    });
    document.documentElement.classList.add("reveal-ready");

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    els.forEach((el) => {
      if (!el.classList.contains("is-visible")) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return null;
}
