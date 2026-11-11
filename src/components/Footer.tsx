import { restaurant } from "@/config/restaurant";
import { FacebookIcon, InstagramIcon } from "./Icons";

const socialLink =
  "flex h-11 w-11 items-center justify-center rounded-full border border-cream-200/30 transition-colors hover:border-cream-50 hover:bg-cream-50 hover:text-ink";

export function Footer() {
  const { address } = restaurant;
  return (
    <footer className="bg-ink pt-16 pb-28 text-cream-200 md:pb-12">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl font-semibold text-cream-50">
            <span className="text-[#ec8b78]">Bella</span> Napoli
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed">{restaurant.tagline}</p>
        </div>

        <div>
          <h2 className="font-sans text-sm font-semibold tracking-[0.2em] text-cream-50 uppercase">Visit</h2>
          <address className="mt-3 leading-relaxed not-italic">
            {address.street}
            <br />
            {address.city}, {address.region} {address.postalCode}
            <br />
            <a href={`tel:${restaurant.phone.e164}`} className="underline-offset-4 hover:text-cream-50 hover:underline">
              {restaurant.phone.display}
            </a>
          </address>
        </div>

        <div>
          <h2 className="font-sans text-sm font-semibold tracking-[0.2em] text-cream-50 uppercase">Follow us</h2>
          <ul className="mt-3 flex gap-3">
            <li>
              <a
                href={restaurant.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram (opens in a new tab)"
                className={socialLink}
              >
                <InstagramIcon />
              </a>
            </li>
            <li>
              <a
                href={restaurant.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook (opens in a new tab)"
                className={socialLink}
              >
                <FacebookIcon />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl border-t border-cream-200/15 px-4 pt-6 text-sm text-cream-300 sm:px-6">
        <p>
          © {new Date().getFullYear()} {restaurant.name}. A fictional restaurant created as a portfolio demo.
        </p>
      </div>
    </footer>
  );
}
