import { HeroSection } from "@/components/hero-section-1";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="h-full w-full p-2">
      <Navbar />
      <div className="pt-18 md:pt-22">
        <HeroSection />
      </div>
    </div>
  );
}
