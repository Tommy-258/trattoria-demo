import { formatTime, mapsQuery, restaurant } from "@/config/restaurant";
import { ClockIcon, PhoneIcon, PinIcon } from "./Icons";
import { MapEmbed } from "./MapEmbed";

export function Visit() {
  const { address } = restaurant;

  return (
    <section id="visit" aria-labelledby="visit-title" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div data-reveal className="max-w-2xl">
          <p className="eyebrow">Come by</p>
          <h2 id="visit-title" className="section-title">
            Hours &amp; location
          </h2>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
          <div data-reveal className="space-y-8">
            <div className="rounded-3xl bg-cream-50 p-6 shadow-[0_1px_0_rgba(43,33,28,0.06)] sm:p-8">
              <h3 className="flex items-center gap-2 text-2xl font-semibold">
                <ClockIcon className="text-olive-600" width={22} height={22} />
                Opening hours
              </h3>
              <dl className="mt-5 divide-y divide-cream-200">
                {restaurant.hours.map((h) => (
                  <div key={h.label} className="flex justify-between gap-4 py-3">
                    <dt className="font-medium text-ink">{h.label}</dt>
                    <dd className={h.opens && h.closes ? "text-ink-soft" : "font-medium text-tomato-600"}>
                      {h.opens && h.closes ? `${formatTime(h.opens)} – ${formatTime(h.closes)}` : "Closed"}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-sm text-ink-soft">Kitchen closes 30 minutes before closing time.</p>
            </div>

            <div className="rounded-3xl bg-cream-50 p-6 shadow-[0_1px_0_rgba(43,33,28,0.06)] sm:p-8">
              <h3 className="flex items-center gap-2 text-2xl font-semibold">
                <PinIcon className="text-olive-600" width={22} height={22} />
                Find us
              </h3>
              <address className="mt-4 text-lg leading-relaxed text-ink not-italic">
                {address.street}
                <br />
                {address.city}, {address.region} {address.postalCode}
              </address>
              <p className="mt-1 text-ink-soft">In the heart of {address.neighborhood}. F &amp; G trains to Bergen St.</p>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 font-semibold">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-tomato-600 underline decoration-2 underline-offset-4 hover:text-tomato-700"
                >
                  Get directions<span className="sr-only"> (opens in a new tab)</span>
                </a>
                <a
                  href={`tel:${restaurant.phone.e164}`}
                  className="inline-flex items-center gap-1.5 text-tomato-600 underline decoration-2 underline-offset-4 hover:text-tomato-700"
                >
                  <PhoneIcon width={16} height={16} />
                  {restaurant.phone.display}
                </a>
              </div>
            </div>
          </div>

          <div data-reveal>
            <MapEmbed />
          </div>
        </div>
      </div>
    </section>
  );
}
