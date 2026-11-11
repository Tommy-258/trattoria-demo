"use client";

import { useEffect, useState } from "react";
import { restaurant } from "@/config/restaurant";
import { CloseIcon, MenuIcon } from "./Icons";

const links = [
  { href: "#about", label: "Our Story" },
  { href: "#menu", label: "Menu" },
  { href: "#visit", label: "Hours & Location" },
  { href: "#reviews", label: "Reviews" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Over the hero photo the bar is transparent with light text; it turns solid cream on scroll.
  const solid = scrolled || open;

  return (
    <header
      data-on-dark={solid ? undefined : ""}
      className={`sticky top-0 z-40 transition-[background-color,box-shadow,color] duration-300 ${
        solid ? "bg-cream-50/95 shadow-[0_1px_0_rgba(43,33,28,0.08)] backdrop-blur" : "bg-transparent"
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-cream-50"
      >
        Skip to content
      </a>
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className={`font-serif text-xl font-semibold tracking-tight transition-colors duration-300 ${solid ? "text-ink" : "text-cream-50"}`} onClick={() => setOpen(false)}>
          <span className={solid ? "text-tomato-600" : "text-[#f4a58f]"}>Bella</span> Napoli
        </a>

        <ul className="hidden items-center gap-8 text-[0.95rem] font-medium md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className={`transition-colors duration-300 ${solid ? "text-ink-soft hover:text-tomato-600" : "text-cream-100 hover:text-white"}`}>
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#reserve" className="btn-primary min-h-10 px-5 py-2 text-sm">
              Reserve a table
            </a>
          </li>
        </ul>

        <button
          type="button"
          className={`-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-300 md:hidden ${solid ? "text-ink" : "text-cream-50"}`}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon width={24} height={24} /> : <MenuIcon width={24} height={24} />}
        </button>
      </nav>

      <div id="mobile-nav" hidden={!open} className="border-t border-cream-300 bg-cream-50 md:hidden">
        <ul className="mx-auto flex max-w-6xl flex-col px-4 py-3">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="block rounded-lg px-2 py-3 text-lg font-medium text-ink hover:bg-cream-200"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            </li>
          ))}
          <li className="mt-2 border-t border-cream-300 pt-3 text-sm text-ink-soft">
            Call us:{" "}
            <a href={`tel:${restaurant.phone.e164}`} className="font-semibold text-tomato-600 underline-offset-2 hover:underline">
              {restaurant.phone.display}
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
