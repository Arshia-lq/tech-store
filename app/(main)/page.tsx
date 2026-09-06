
import Hero from "@/components/home/Hero";
import { BrandSection } from "@/components/home/Brands";
import { Featured } from "@/components/home/Featured";
import ProductSpotlight from "@/components/home/ProductSpotlight";
import Club from "@/components/home/Club";
import Journal from "@/components/home/Journal";
import InfoSection from "@/components/home/InfoSection";
import Benefits from "@/components/home/Benefits";



const Home = () => {
  return (
    <div className="space-y-20 lg:space-y-18">
    <Hero/>
    <BrandSection/>
    <Featured/>
    <Benefits/>
    <ProductSpotlight/>
    <Club/>
    <Journal/>
    <InfoSection/>
    </div>
  );
};

export default Home;
