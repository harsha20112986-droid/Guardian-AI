import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import DashboardPreview from "../components/DashboardPreview";
import Features from "../components/Features";
import WhyGuardian from "../components/WhyGuardian";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />

      <Hero />

      <DashboardPreview />

      <Features />

      <WhyGuardian />

      <Footer />
    </>
  );
}

export default Home;