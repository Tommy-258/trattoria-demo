import Image from "next/image";
import { restaurant } from "@/config/restaurant";

export function About() {
  const years = new Date().getFullYear() - restaurant.foundedYear;

  return (
    <section id="about" aria-labelledby="about-title" className="py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 md:grid-cols-2 md:items-center md:gap-16">
        <div data-reveal className="order-2 md:order-1">
          <div className="grid grid-cols-5 grid-rows-5 gap-4" style={{ aspectRatio: "1 / 1" }}>
            <div className="relative col-span-3 row-span-3 overflow-hidden rounded-3xl bg-cream-200">
              <Image
                src="/images/wood-fired-oven.webp"
                alt="A pizzaiolo sliding a pizza out of a tiled wood-fired oven, embers glowing inside"
                fill
                unoptimized
                sizes="(min-width: 1152px) 330px, (min-width: 768px) 30vw, 60vw"
                className="object-cover"
              />
            </div>
            <div className="col-span-2 row-span-2 rounded-3xl bg-gingham" aria-hidden="true" />
            <div className="col-span-2 row-span-3 flex flex-col justify-end rounded-3xl bg-olive-600 p-5 text-cream-50">
              <p className="font-serif text-5xl font-semibold">{years}+</p>
              <p className="mt-1 text-sm leading-snug">years of Sunday ragù on Court Street</p>
            </div>
            <div className="relative col-span-3 row-span-2 overflow-hidden rounded-3xl bg-cream-200">
              <Image
                src="/images/spaghetti-pomodoro.webp"
                alt="A plate of spaghetti in fresh tomato sauce topped with chopped parsley"
                fill
                unoptimized
                sizes="(min-width: 1152px) 330px, (min-width: 768px) 30vw, 60vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div data-reveal className="order-1 md:order-2">
          <p className="eyebrow">Our story</p>
          <h2 id="about-title" className="section-title">
            From a Naples side street to <span className="text-tomato-600 italic">Brooklyn</span>
          </h2>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink-soft">
            <p>
              In {restaurant.foundedYear}, Giuseppe and Anna Esposito left the Quartieri Spagnoli with a suitcase of
              recipes and a sourdough starter wrapped in a kitchen towel. They opened a twelve-seat trattoria on Court
              Street and cooked what they knew: the food of home.
            </p>
            <p>
              Today their grandchildren run the dining room and the kitchen, but very little has changed. Our dough
              rests for 48 hours, our pizzas spend 90 seconds in a 900°F wood-fired oven, and the ragù still simmers
              all Sunday morning.
            </p>
            <p className="font-serif text-xl text-ink italic">
              &ldquo;Simple ingredients, cooked with patience, shared with people you love.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
