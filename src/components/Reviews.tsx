import { restaurant } from "@/config/restaurant";
import { StarIcon } from "./Icons";

export function Reviews() {
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="bg-cream-50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div data-reveal className="text-center">
          <p className="eyebrow">Kind words</p>
          <h2 id="reviews-title" className="section-title">
            What our guests say
          </h2>
          <p className="mx-auto mt-4 inline-block rounded-full border border-dashed border-ink-soft/40 px-4 py-1.5 text-sm text-ink-soft">
            Example reviews for demonstration purposes, not real customer feedback.
          </p>
        </div>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {restaurant.reviews.map((r, i) => (
            <li key={i} data-reveal style={{ transitionDelay: `${i * 90}ms` }}>
              <figure className="flex h-full flex-col rounded-3xl bg-cream-100 p-7 sm:p-8">
                <div className="flex gap-1 text-tomato-600" role="img" aria-label={`Rated ${r.rating} out of 5`}>
                  {Array.from({ length: r.rating }, (_, s) => (
                    <StarIcon key={s} width={18} height={18} />
                  ))}
                </div>
                <blockquote className="mt-5 flex-1 font-serif text-xl leading-relaxed text-ink">
                  <p>&ldquo;{r.quote}&rdquo;</p>
                </blockquote>
                <figcaption className="mt-6 text-sm font-semibold text-ink-soft">
                  {r.author} <span className="font-normal">· example review</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
