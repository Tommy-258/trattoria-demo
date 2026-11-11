import { About } from "@/components/About";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Menu } from "@/components/Menu";
import { MobileReserveBar } from "@/components/MobileReserveBar";
import { Reserve } from "@/components/Reserve";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { Reviews } from "@/components/Reviews";
import { Visit } from "@/components/Visit";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <About />
        <Menu />
        <Visit />
        <Reserve />
        <Reviews />
      </main>
      <Footer />
      <MobileReserveBar />
      <RevealOnScroll />
    </>
  );
}
