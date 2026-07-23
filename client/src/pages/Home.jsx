import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Features from "../components/Features";
import DashboardPreview from "../components/DashboardPreview";
import HowItWorks from "../components/HowItWorks";
import Reviews from "../components/Reviews";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />

      <main className="pt-20">
        <section id="home">
          <Hero />
        </section>

        <Stats />

        <section id="features" className="scroll-mt-24">
          <Features />
        </section>

        <DashboardPreview />

        <section id="how" className="scroll-mt-24">
          <HowItWorks />
        </section>

        <section id="reviews" className="scroll-mt-24">
          <Reviews />
        </section>

        <CTA />
      </main>

      <Footer />
    </>
  );
}

export default Home;