import React, { Suspense, lazy, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DigitalHomeHeader from "../components/home/DigitalHomeHeader";
import HeroSection from "../components/home/HeroSection";
import BestsellersSection from "../components/home/BestsellersSection";
import DigitalHomeFooter from "../components/home/DigitalHomeFooter";

/** Sous le fold : chargé après le 1er paint (moins de JS/images d’entrée) */
const DigitalEtapeSection = lazy(() => import("../components/home/DigitalEtapeSection"));
const InvitationsWebSection = lazy(() => import("../components/home/InvitationsWebSection"));
const FeaturesMarquee = lazy(() => import("../components/home/FeaturesMarquee"));
const ExperienceSection = lazy(() => import("../components/home/ExperienceSection"));
const SaveTheDatesSection = lazy(() => import("../components/home/SaveTheDatesSection"));
const PacksSection = lazy(() => import("../components/home/PacksSection"));
const CommunitySection = lazy(() => import("../components/home/CommunitySection"));
const ReviewsSection = lazy(() => import("../components/home/ReviewsSection"));
const FaqSection = lazy(() => import("../components/home/FaqSection"));

function SectionFallback({ minH = 180 }) {
  return <div className="bg-[#F7F2EC]" style={{ minHeight: minH }} aria-hidden />;
}

/** Main Page Digital — mobile + desktop responsive (no phone shell) */
function HomePage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return undefined;
    const id = hash.replace(/^#/, "");
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
    return () => window.clearTimeout(t);
  }, [hash]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F7F2EC] font-glacial text-lw-text">
      <div className="flex flex-col bg-[#F7F2EC] lg:min-h-[100dvh]">
        <DigitalHomeHeader mode="digitale" />
        <HeroSection />
      </div>
      <main>
        <BestsellersSection />
        <Suspense fallback={<SectionFallback minH={420} />}>
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
        </Suspense>
      </main>
      <DigitalHomeFooter />
    </div>
  );
}

export default HomePage;
