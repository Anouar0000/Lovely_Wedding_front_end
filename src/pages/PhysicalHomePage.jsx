import React, { Suspense, lazy, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DigitalHomeHeader from "../components/home/DigitalHomeHeader";
import DigitalHomeFooter from "../components/home/DigitalHomeFooter";
import PhysicalHeroSection from "../components/home/physical/PhysicalHeroSection";
import PhysicalCollectionSection from "../components/home/physical/PhysicalCollectionSection";

const PhysicalLivraisonSection = lazy(() =>
  import("../components/home/physical/PhysicalLivraisonSection")
);
const PhysicalBestsellersSection = lazy(() =>
  import("../components/home/physical/PhysicalBestsellersSection")
);
const FeaturesMarquee = lazy(() => import("../components/home/FeaturesMarquee"));
const PhysicalExperienceSection = lazy(() =>
  import("../components/home/physical/PhysicalExperienceSection")
);
const PhysicalDrageesSection = lazy(() =>
  import("../components/home/physical/PhysicalDrageesSection")
);
const PhysicalSocialSection = lazy(() =>
  import("../components/home/physical/PhysicalSocialSection")
);
const PhysicalReviewsSection = lazy(() =>
  import("../components/home/physical/PhysicalReviewsSection")
);
const PhysicalFaqSection = lazy(() =>
  import("../components/home/physical/PhysicalFaqSection")
);

function SectionFallback({ minH = 180 }) {
  return <div className="bg-[#F7F2EC]" style={{ minHeight: minH }} aria-hidden />;
}

/** Main Page physical — Figma 155:169 · parity mobile/desktop avec Digitale */
function PhysicalHomePage() {
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
        <DigitalHomeHeader mode="imprimee" />
        <PhysicalHeroSection />
      </div>
      <main>
        <PhysicalCollectionSection />
        <Suspense fallback={<SectionFallback minH={420} />}>
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
        </Suspense>
      </main>
      <DigitalHomeFooter />
    </div>
  );
}

export default PhysicalHomePage;
