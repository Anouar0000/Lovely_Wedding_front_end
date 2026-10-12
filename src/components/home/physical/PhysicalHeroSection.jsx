import React from "react";
import { useNavigate } from "react-router-dom";
import { homePhysicalAssets as a } from "../homePhysicalAssets";

const INVITES = [
  { name: "Sacré cœur", cover: a.heroCoverSacre },
  { name: "Passeport rosé", cover: a.heroCoverPasseport },
  { name: "Versailles", cover: a.heroCoverVersailles },
  { name: "Aimé", cover: a.heroCoverAime },
  { name: "Floral", cover: a.heroCoverFloral },
  { name: "With Love", cover: a.heroCoverEnvelopes },
];

// Copies en fin pour boucle invisible ; démarre à l'index 1 → cartes L + R visibles.
const RAIL = [...INVITES, INVITES[0], INVITES[1]];

function InviteCard({ invite, index }) {
  return (
    <div className="relative h-[377px] w-[182px] shrink-0 overflow-hidden rounded-[26px] bg-[#F7F2EC] lg:h-[464px] lg:w-[224px]">
      <img
        src={invite.cover}
        alt={index < 2 ? `Invitation ${invite.name}` : ""}
        className="pointer-events-none block h-full w-full object-cover object-center"
        loading={index > 2 ? "lazy" : undefined}
        draggable={false}
      />
    </div>
  );
}

/** Rail horizontal : aperçu décoratif (non cliquable) — même comportement que Digitale. */
function InviteRail() {
  return (
    <div className="relative h-[389px] w-full shrink-0 overflow-hidden lg:h-[478px]">
      <div className="lw-hero-rail absolute left-1/2 top-[6px] flex w-max gap-[15px] lg:top-[7px] lg:gap-[20px]">
        {RAIL.map((invite, i) => (
          <InviteCard key={`${invite.name}-${i}`} invite={invite} index={i} />
        ))}
      </div>

      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[389px] w-[194px] -translate-x-1/2 -translate-y-1/2 rounded-[32px] border-[6px] border-[#131313] shadow-[0_20px_45px_-20px_rgba(75,66,66,0.55)] lg:h-[478px] lg:w-[238px] lg:border-[7px]"
        aria-hidden
      >
        <span className="absolute left-1/2 top-[8px] h-[17px] w-[58px] -translate-x-1/2 rounded-full bg-[#131313] lg:top-[10px] lg:h-[20px] lg:w-[70px]" />
      </div>
    </div>
  );
}

/** Hero Figma Main Physical — rail animé comme Digitale */
function PhysicalHeroSection() {
  const navigate = useNavigate();

  return (
    <section className="flex flex-1 flex-col overflow-x-hidden bg-[#F7F2EC] lg:justify-center lg:pb-20 lg:pt-14">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col lg:grid lg:flex-none lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8">
        <div className="mx-auto flex w-full flex-col items-center px-6 pt-4 text-center lg:mx-0 lg:items-start lg:px-0 lg:pt-0 lg:text-left">
          <h1 className="lw-hero w-full text-center lg:text-left lg:text-[48px] lg:leading-[1.12]">
            <span className="block whitespace-nowrap">Pour tous les moments</span>
            <span className="block">qui comptent</span>
          </h1>
          <p className="lw-hero-sub mt-[9px] text-center lg:mt-4 lg:max-w-[420px] lg:text-left lg:text-[20px] lg:leading-6">
            Votre invitation de mariage,
            <br />
            à imprimer ou à partager.
          </p>
          <button
            type="button"
            onClick={() => navigate("/invitations-physique")}
            className="mt-10 hidden h-[48px] items-center justify-center gap-2 rounded-full bg-[#A97C72] px-7 font-urbanist text-[15px] font-medium leading-none text-white shadow-[0_8px_20px_rgba(75,66,66,0.18)] hover:bg-[#966B62] lg:inline-flex"
          >
            Découvrir la collection
            <span aria-hidden className="text-[18px] leading-none">
              →
            </span>
          </button>
        </div>

        <div className="mt-6 flex min-h-0 w-full flex-1 items-center justify-center lg:mt-0 lg:flex-none">
          <InviteRail />
        </div>

        <div className="mt-auto flex justify-center px-6 pb-8 pt-4 lg:hidden">
          <button
            type="button"
            onClick={() => navigate("/invitations-physique")}
            className="inline-flex h-[48px] w-auto items-center justify-center gap-2 rounded-full bg-[#A97C72] px-7 font-urbanist text-[15px] font-medium leading-none text-white shadow-[0_8px_20px_rgba(75,66,66,0.18)] hover:bg-[#966B62]"
          >
            Découvrir la collection
            <span aria-hidden className="text-[18px] leading-none">
              →
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default PhysicalHeroSection;
