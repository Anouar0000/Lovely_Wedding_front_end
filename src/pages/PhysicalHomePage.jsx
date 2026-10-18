import React from "react";
import DigitalHomeHeader from "../components/home/DigitalHomeHeader";
import DigitalHomeFooter from "../components/home/DigitalHomeFooter";
import PhysicalHeroSection from "../components/home/physical/PhysicalHeroSection";
import PhysicalCollectionSection from "../components/home/physical/PhysicalCollectionSection";
import PhysicalLivraisonSection from "../components/home/physical/PhysicalLivraisonSection";
import PhysicalBestsellersSection from "../components/home/physical/PhysicalBestsellersSection";
import FeaturesMarquee from "../components/home/FeaturesMarquee";
import PhysicalExperienceSection from "../components/home/physical/PhysicalExperienceSection";
import PhysicalDrageesSection from "../components/home/physical/PhysicalDrageesSection";
import PhysicalSocialSection from "../components/home/physical/PhysicalSocialSection";
import PhysicalReviewsSection from "../components/home/physical/PhysicalReviewsSection";
import PhysicalFaqSection from "../components/home/physical/PhysicalFaqSection";

/** Main Page physical — Figma 155:169 · parity mobile/desktop avec Digitale */
function PhysicalHomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F7F2EC] font-urbanist text-lw-text">
      <div className="flex flex-col bg-[#F7F2EC] lg:min-h-[100dvh]">
        <DigitalHomeHeader mode="imprimee" />
        <PhysicalHeroSection />
      </div>
      <main>
        <PhysicalCollectionSection />
        <PhysicalLivraisonSection />
        <PhysicalBestsellersSection />
        <FeaturesMarquee
          items={[
            "Papier Premium",
            "Enveloppes",
            "Cachets de cire",
            "Finitions",
            "Livraison",
            "Sur-mesure",
          ]}
        />
        <div className="h-10 bg-white lg:h-14" aria-hidden />
        <PhysicalExperienceSection />
        <PhysicalDrageesSection />
        <PhysicalSocialSection />
        <PhysicalReviewsSection />
        <PhysicalFaqSection />
      </main>
      <DigitalHomeFooter />
    </div>
  );
}

export default PhysicalHomePage;
