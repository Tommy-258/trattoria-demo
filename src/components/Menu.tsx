"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { restaurant, type DishCategory } from "@/config/restaurant";
import { ChiliIcon, LeafIcon } from "./Icons";

const price = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function VegBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-olive-600/10 px-2 py-0.5 text-xs font-semibold text-olive-700">
      <LeafIcon width={13} height={13} />
      Vegetarian
    </span>
  );
}

function SpicyBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-tomato-600/10 px-2 py-0.5 text-xs font-semibold text-tomato-700">
      <ChiliIcon width={13} height={13} />
      Spicy
    </span>
  );
}

export function Menu() {
  const categories = restaurant.menuCategories;
  const [active, setActive] = useState<DishCategory>(categories[0].id);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // WAI-ARIA tabs pattern: arrow keys / Home / End move between tabs.
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (index + 1) % categories.length;
    if (e.key === "ArrowLeft") next = (index - 1 + categories.length) % categories.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = categories.length - 1;
    if (next === null) return;
    e.preventDefault();
    setActive(categories[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="menu" aria-labelledby="menu-title" className="bg-cream-50 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div data-reveal className="text-center">
          <p className="eyebrow">Il menù</p>
          <h2 id="menu-title" className="section-title">
            Made in&#8209;house, every day
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-soft">
            A short menu of Neapolitan classics. Ask your server about today&rsquo;s specials and our all-Italian wine
            list.
          </p>
        </div>

        <div data-reveal className="mt-10">
          <div
            role="tablist"
            aria-label="Menu categories"
            className="mx-auto flex w-full max-w-xl gap-1 overflow-x-auto rounded-full bg-cream-200 p-1.5"
          >
            {categories.map((c, i) => {
              const selected = c.id === active;
              return (
                <button
                  key={c.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`tab-${c.id}`}
                  aria-selected={selected}
                  aria-controls={`panel-${c.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(c.id)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={`min-h-11 flex-1 rounded-full px-4 py-2 font-serif text-lg font-semibold whitespace-nowrap transition-colors duration-200 ${
                    selected ? "bg-tomato-600 text-cream-50 shadow-sm" : "text-ink-soft hover:bg-cream-300/60 hover:text-ink"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          <ul className="mt-5 flex flex-wrap justify-center gap-3 text-sm text-ink-soft" aria-label="Badge legend">
            <li className="flex items-center gap-2">
              <VegBadge /> no meat or fish
            </li>
            <li className="flex items-center gap-2">
              <SpicyBadge /> brings the heat
            </li>
          </ul>

          {categories.map((c) => (
            <div
              key={c.id}
              role="tabpanel"
              id={`panel-${c.id}`}
              aria-labelledby={`tab-${c.id}`}
              hidden={c.id !== active}
              tabIndex={0}
              className="mt-10 rounded-3xl motion-safe:animate-fade-up"
            >
              <ul className="grid gap-x-12 gap-y-8 md:grid-cols-2">
                {restaurant.menu[c.id].map((dish) => (
                  <li key={dish.name} className="border-b border-dashed border-cream-300 pb-6">
                    <div className="flex items-baseline gap-3">
                      <h3 className="text-xl font-semibold text-ink">{dish.name}</h3>
                      <span aria-hidden="true" className="flex-1 translate-y-[-4px] border-b border-dotted border-ink/25" />
                      <p className="font-serif text-xl font-semibold text-tomato-600">
                        <span className="sr-only">Price: </span>
                        {price.format(dish.price)}
                      </p>
                    </div>
                    <p className="mt-2 leading-relaxed text-ink-soft">{dish.description}</p>
                    {("vegetarian" in dish || "spicy" in dish) && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {"vegetarian" in dish && dish.vegetarian && <VegBadge />}
                        {"spicy" in dish && dish.spicy && <SpicyBadge />}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <p className="mt-10 text-center text-sm text-ink-soft">
            Prices in USD, before tax and gratuity. Please tell your server about any allergies.
          </p>
        </div>
      </div>
    </section>
  );
}
