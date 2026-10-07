import React from "react";
import DigitalHomeHeader from "../components/home/DigitalHomeHeader";
import DigitalHomeFooter from "../components/home/DigitalHomeFooter";
import PhysicalHeroSection from "../components/home/physical/PhysicalHeroSection";
import PhysicalCollectionSection from "../components/home/physical/PhysicalCollectionSection";
import PhysicalLivraisonSection from "../components/home/physical/PhysicalLivraisonSection";
import PhysicalBestsellersSection from "../components/home/physical/PhysicalBestsellersSection";
import PhysicalExperienceSection from "../components/home/physical/PhysicalExperienceSection";
import PhysicalDrageesSection from "../components/home/physical/PhysicalDrageesSection";
import PhysicalPacksSection from "../components/home/physical/PhysicalPacksSection";
import PhysicalSocialSection from "../components/home/physical/PhysicalSocialSection";
import PhysicalReviewsSection from "../components/home/physical/PhysicalReviewsSection";
import PhysicalFaqSection from "../components/home/physical/PhysicalFaqSection";

/** Main Page physical — Figma 155:169 */
function PhysicalHomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-urbanist text-lw-text">
      <DigitalHomeHeader mode="imprimee" />
      <main>
        <PhysicalHeroSection />
        <PhysicalCollectionSection />
        <PhysicalLivraisonSection />
        <PhysicalBestsellersSection />
        <PhysicalExperienceSection />
        <PhysicalDrageesSection />
        <PhysicalPacksSection />
        <PhysicalSocialSection />
        <PhysicalReviewsSection />
        <PhysicalFaqSection />
      </main>
      <DigitalHomeFooter />
    </div>
  );
}

export default PhysicalHomePage;
