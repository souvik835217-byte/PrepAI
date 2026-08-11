import { useEffect } from "react";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();

  useEffect(() => {
    if (location.state?.resetPrepAIHistory !== true) {
      return undefined;
    }

    window.history.pushState(
      { prepAIHomeBoundary: true },
      "",
      window.location.href
    );

    const keepUserAtHome = () => {
      window.history.pushState(
        { prepAIHomeBoundary: true },
        "",
        window.location.href
      );
    };

    window.addEventListener("popstate", keepUserAtHome);

    return () => {
      window.removeEventListener("popstate", keepUserAtHome);
    };
  }, [location.state]);

  return (
    <>
      <Navbar />

      <main>
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
