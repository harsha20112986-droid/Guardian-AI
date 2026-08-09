import Hero from "../components/Hero";
import DashboardPreview from "../components/DashboardPreview";
import Features from "../components/Features";
import WhyGuardian from "../components/WhyGuardian";
import TechStack from "../components/TechStack";

function Home() {
  return (
    <div className="w-full">

      {/* HERO */}
      <section className="w-full">
        <Hero />
      </section>

      {/* DASHBOARD */}
      <section className="w-full py-12 md:py-16">
        <DashboardPreview />
      </section>

      {/* FEATURES */}
      <section className="w-full py-16 md:py-20">
        <Features />
      </section>

      {/* WHY GUARDIAN */}
      <section className="w-full py-16 md:py-20">
        <WhyGuardian />
      </section>

      {/* TECHNOLOGY */}
      <section className="w-full py-16 md:py-20">
        <TechStack />
      </section>

    </div>
  );
}

export default Home;