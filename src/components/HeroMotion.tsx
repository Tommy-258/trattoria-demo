"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** How much slower than the page the photo scrolls (0 = fixed to page, 1 = fixed to viewport). */
const PARALLAX = 0.35;
/** Max mouse-follow offset in px, desktop only. */
const MOUSE_RANGE = 10;
/** Easing factor per frame for the mouse-follow movement. */
const EASE = 0.06;

/**
 * Wraps the hero photo and moves it with CSS transforms driven by requestAnimationFrame:
 *  - parallax on scroll (all devices)
 *  - a few pixels of mouse-follow on desktop with a fine pointer
 * Both are off when the visitor prefers reduced motion. Work only happens while the hero is on screen.
 */
export function HeroMotion({ children }: { children: ReactNode }) {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parallaxEl = parallaxRef.current;
    const mouseEl = mouseRef.current;
    const section = parallaxEl?.closest("section");
    if (!parallaxEl || !mouseEl || !section) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Real mouse + large screen only: excludes phones, tablets and touch laptops in tablet mode.
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)");

    let raf = 0;
    let inView = true;
    let target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const mouseEnabled = () => finePointer.matches && !reduceMotion.matches;

    const frame = () => {
      raf = 0;
      if (reduceMotion.matches) {
        parallaxEl.style.transform = "";
        mouseEl.style.transform = "";
        return;
      }

      const offset = Math.min(window.scrollY, section.offsetHeight) * PARALLAX;
      parallaxEl.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;

      if (!mouseEnabled()) target = { x: 0, y: 0 };
      current.x += (target.x - current.x) * EASE;
      current.y += (target.y - current.y) * EASE;
      mouseEl.style.transform = `translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0)`;

      // Keep animating until the eased movement settles.
      if (Math.abs(target.x - current.x) > 0.05 || Math.abs(target.y - current.y) > 0.05) schedule();
    };

    const schedule = () => {
      if (!raf && inView) raf = requestAnimationFrame(frame);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !mouseEnabled()) return;
      // Move against the cursor for a subtle depth effect.
      target = {
        x: -((e.clientX / window.innerWidth) * 2 - 1) * MOUSE_RANGE,
        y: -((e.clientY / window.innerHeight) * 2 - 1) * MOUSE_RANGE,
      };
      schedule();
    };

    const onPreferenceChange = () => {
      target = { x: 0, y: 0 };
      schedule();
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) schedule();
    });
    observer.observe(section);

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    reduceMotion.addEventListener("change", onPreferenceChange);
    finePointer.addEventListener("change", onPreferenceChange);
    schedule();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pointermove", onPointerMove);
      reduceMotion.removeEventListener("change", onPreferenceChange);
      finePointer.removeEventListener("change", onPreferenceChange);
    };
  }, []);

  return (
    <div ref={parallaxRef} className="absolute inset-0 will-change-transform">
      {/* Oversized by a few % so mouse movement never reveals an edge */}
      <div ref={mouseRef} className="absolute -inset-[2%] will-change-transform">
        {children}
      </div>
    </div>
  );
}
