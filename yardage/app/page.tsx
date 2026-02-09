import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { FeatureSection } from "@/components/FeatureSection";
import { VendorSection } from "@/components/VendorSection";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <div className="">
      <Navbar/>
      <Hero />
      <FeatureSection />
      <VendorSection />
      <Footer/>
    </div>
  );
}
