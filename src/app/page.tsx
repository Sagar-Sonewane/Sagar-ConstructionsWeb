import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import WhyChooseUs from "@/components/WhyChooseUs";
import HowWeWork from "@/components/HowWeWork";
import PropertyAssistance from "@/components/PropertyAssistance";
import Testimonials from "@/components/Testimonials";
import Gallery from "@/components/Gallery";
import FounderStory from "@/components/FounderStory";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FormModals from "@/components/FormModals";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <Services />
        <WhyChooseUs />
        <HowWeWork />
        <PropertyAssistance />
        <Testimonials />
        <Gallery />
        <FounderStory />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <FormModals />
    </>
  );
}
