import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import AboutPillars from "@/components/about/AboutPillars";
import AboutJourney from "@/components/about/AboutJourney";
import AboutTeam from "@/components/about/AboutTeam";
import AboutCTA from "@/components/about/AboutCTA";

export const metadata = {
  title: "About Us | TechStore",
  description:
    "Learn about TechStore's story, mission, and the team behind your favorite tech destination.",
};

export default function AboutPage() {
  return (
    <div>
      <AboutHero />
      <AboutStory />
      <AboutPillars />
      <AboutJourney />
      <AboutTeam />
      <AboutCTA />
    </div>
  );
}
