import { restaurant } from "@/config/restaurant";

/** Decorative pizza drawn only with CSS gradients — no image download. */
function PizzaArt() {
  const basil = [
    "left-[22%] top-[30%] rotate-12",
    "left-[58%] top-[22%] -rotate-45",
    "left-[64%] top-[60%] rotate-[70deg]",
    "left-[30%] top-[64%] -rotate-12",
  ];
  const mozzarella = [
    "left-[38%] top-[20%] h-[18%] w-[20%]",
    "left-[20%] top-[46%] h-[16%] w-[18%]",
    "left-[48%] top-[42%] h-[20%] w-[22%]",
    "left-[66%] top-[38%] h-[14%] w-[15%]",
    "left-[44%] top-[70%] h-[14%] w-[17%]",
  ];
  return (
    <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-[26rem]">
      {/* plate */}
      <div className="absolute inset-0 rounded-full bg-cream-50 shadow-[0_30px_60px_-30px_rgba(43,33,28,0.45),inset_0_0_0_10px_rgba(234,219,194,0.6)]" />
      {/* crust */}
      <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_50%_50%,#e6b56c_60%,#c98a3f_75%,#8f5a26_100%)]" />
      {/* leopard spots on cornicione */}
      <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_12%_40%,rgba(60,30,10,0.55)_0_1.5%,transparent_2%),radial-gradient(circle_at_80%_15%,rgba(60,30,10,0.5)_0_1.2%,transparent_1.8%),radial-gradient(circle_at_88%_70%,rgba(60,30,10,0.5)_0_1.6%,transparent_2.2%),radial-gradient(circle_at_30%_90%,rgba(60,30,10,0.5)_0_1.3%,transparent_2%)]" />
      {/* sauce */}
      <div className="absolute inset-[17%] rounded-full bg-[radial-gradient(circle_at_40%_35%,#d9452c,#a92f1d_70%,#8c2416)]" />
      {mozzarella.map((c) => (
        <div
          key={c}
          className={`absolute rounded-[45%_55%_50%_50%] bg-[radial-gradient(circle_at_40%_35%,#fffcf7,#f3e6cc)] ${c}`}
        />
      ))}
      {basil.map((c) => (
        <div
          key={c}
          className={`absolute h-[9%] w-[6%] rounded-[0_100%_0_100%] bg-[linear-gradient(135deg,#6b7d3a,#414d21)] ${c}`}
        />
      ))}
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="bg-paper relative -mt-16 overflow-hidden pt-16">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.15fr_1fr] md:py-24 lg:py-28">
        <div>
          <p className="eyebrow">
            {restaurant.address.neighborhood}, {restaurant.address.city} · Since {restaurant.foundedYear}
          </p>
          <h1 id="hero-title" className="mt-4 text-5xl leading-[1.05] font-semibold text-ink sm:text-6xl lg:text-7xl">
            Trattoria <span className="text-tomato-600 italic">Bella</span> Napoli
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft sm:text-xl">{restaurant.tagline}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <a href="#reserve" className="btn-primary">
              Reserve a table
            </a>
            <a href="#menu" className="btn-secondary">
              View menu
            </a>
          </div>
          {/* tricolore rule */}
          <div aria-hidden="true" className="mt-12 flex h-1.5 w-28 overflow-hidden rounded-full ring-1 ring-cream-300">
            <span className="flex-1 bg-olive-600" />
            <span className="flex-1 bg-cream-50" />
            <span className="flex-1 bg-tomato-600" />
          </div>
        </div>

        <div className="relative isolate motion-safe:animate-fade-up">
          <div aria-hidden="true" className="absolute -inset-6 -z-10 rounded-full bg-gingham opacity-60 [mask-image:radial-gradient(circle,black_45%,transparent_70%)]" />
          <PizzaArt />
        </div>
      </div>
    </section>
  );
}
