import React from "react";
import DigitalHomeHeader from "../components/home/DigitalHomeHeader";
import HeroSection from "../components/home/HeroSection";
import BestsellersSection from "../components/home/BestsellersSection";
import DigitalEtapeSection from "../components/home/DigitalEtapeSection";
import InvitationsWebSection from "../components/home/InvitationsWebSection";
import FeaturesMarquee from "../components/home/FeaturesMarquee";
import ExperienceSection from "../components/home/ExperienceSection";
import SaveTheDatesSection from "../components/home/SaveTheDatesSection";
import PacksSection from "../components/home/PacksSection";
import CommunitySection from "../components/home/CommunitySection";
import ReviewsSection from "../components/home/ReviewsSection";
import FaqSection from "../components/home/FaqSection";
import DigitalHomeFooter from "../components/home/DigitalHomeFooter";

/** Main Page Digital — mobile + desktop responsive (no phone shell) */
function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F7F2EC] font-urbanist text-lw-text">
      {/* Premier écran Figma : header + hero = une seule composition plein viewport */}
      <div className="flex min-h-[100dvh] flex-col bg-[#F7F2EC]">
        <DigitalHomeHeader mode="digitale" />
        <HeroSection />
      </div>
      <main>
        <BestsellersSection />
        <DigitalEtapeSection />
        <InvitationsWebSection />
        <FeaturesMarquee />
        <div className="h-10 bg-white lg:h-14" aria-hidden />
        <ExperienceSection />
        <SaveTheDatesSection />
        <PacksSection />
        <CommunitySection />
        <ReviewsSection />
        <FaqSection />
      </main>
      <DigitalHomeFooter />
    </div>
  );
}

export default HomePage;
