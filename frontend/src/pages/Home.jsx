import Hero from "../components/Hero";
import DashboardPreview from "../components/DashboardPreview";
import Features from "../components/Features";
import WhyGuardian from "../components/WhyGuardian";
import TechStack from "../components/TechStack";

function Home() {
  return (
    <div className="w-full bg-[#F4F8F6]">
      <section className="w-full bg-[#F4F8F6]">
        <Hero />
      </section>

      <section className="w-full bg-[#F7FAF8] py-14 md:py-18">
        <DashboardPreview />
      </section>

      <section className="w-full bg-[#FCFDFC] py-16 md:py-20">
        <Features />
      </section>

      <section className="w-full bg-[#F1F8F4] py-16 md:py-20">
        <WhyGuardian />
      </section>

      <section className="w-full bg-[#F8FAF9] py-16 md:py-20">
        <TechStack />
      </section>
    </div>
  );
}

export default Home;