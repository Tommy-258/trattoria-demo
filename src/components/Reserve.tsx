import { restaurant } from "@/config/restaurant";
import { CalendarIcon, PhoneIcon } from "./Icons";
import { ReservationForm } from "./ReservationForm";

export function Reserve() {
  return (
    <section id="reserve" aria-labelledby="reserve-title" className="bg-gingham relative py-20 sm:py-28">
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-cream-100 via-cream-100/85 to-cream-100" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
        <div data-reveal>
          <p className="eyebrow">Prenota</p>
          <h2 id="reserve-title" className="section-title">
            Reserve a table
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            Book up to 90 days ahead for parties of 1 to {restaurant.reservations.maxGuests}. We keep a few tables and
            the counter by the oven open for walk-ins every night.
          </p>
          <ul className="mt-8 space-y-4 text-ink">
            <li className="flex items-start gap-3">
              <CalendarIcon className="mt-0.5 shrink-0 text-olive-600" />
              <span>We&rsquo;ll confirm your table by email within a few hours.</span>
            </li>
            <li className="flex items-start gap-3">
              <PhoneIcon className="mt-0.5 shrink-0 text-olive-600" />
              <span>
                Larger group or same-day booking? Call{" "}
                <a
                  href={`tel:${restaurant.phone.e164}`}
                  className="font-semibold text-tomato-600 underline underline-offset-4"
                >
                  {restaurant.phone.display}
                </a>
                .
              </span>
            </li>
          </ul>
        </div>
        <div data-reveal>
          <ReservationForm />
        </div>
      </div>
    </section>
  );
}
