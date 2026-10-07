import React from "react";
import { useNavigate } from "react-router-dom";
import { homeDigitalAssets as a } from "./homeDigitalAssets";

// Chaque invitation défile sur ses propres écrans ; le 1er est répété en fin
// de pile pour que la boucle verticale revienne au départ sans saut.
const DOLCE = [a.heroInvite1, a.heroInvite2, a.heroInvite3, a.heroInvite1];
const SIDI = [a.heroSidi1, a.heroSidi2, a.heroSidi3, a.heroSidi1];
const CAPRI = [a.heroCapri1, a.heroCapri2, a.heroCapri3, a.heroCapri1];
const SAKURA = [a.heroSakura1, a.heroSakura2, a.heroSakura3, a.heroSakura1];
const BRIDGERTON = [a.heroBridgerton1, a.heroBridgerton2, a.heroBridgerton3, a.heroBridgerton1];
const MAJESTIC = [a.heroMajestic1, a.heroMajestic2, a.heroMajestic3, a.heroMajestic1];

const INVITES = [
  { name: "Sidi Bou Said", screens: SIDI, to: "/digital-invitation/sidi-bousaid" },
  { name: "La Dolce Vita", screens: DOLCE, to: "/digital-invitation/dolce-vita" },
  { name: "Club Capri", screens: CAPRI, to: "/digital-invitation/club-capri" },
  { name: "Sakura Koi", screens: SAKURA, to: "/digital-invitation/sakura-koi" },
  { name: "Bridgerton", screens: BRIDGERTON, to: "/digital-invitation/bridgerton" },
  { name: "Majestic White", screens: MAJESTIC, to: "/digital-invitation/majestic-white" },
];

// Dernière carte = copie de la 1re : la boucle horizontale est invisible.
const RAIL = [...INVITES, INVITES[0]];

function InviteCard({ invite, index, onOpen }) {
  const slotClass = `lw-invite-s${index % 7}`;
  return (
    <button
      type="button"
      onClick={() => onOpen(invite.to)}
      className="relative h-[377px] w-[182px] shrink-0 cursor-pointer overflow-hidden rounded-[26px] border-0 bg-[#f6f4ef] p-0 lg:h-[464px] lg:w-[224px]"
      aria-label={`Voir l'invitation ${invite.name}`}
    >
      <div className={`lw-invite-scroll ${slotClass} w-full`}>
        {invite.screens.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={i === 0 && index < 2 ? `Invitation ${invite.name}` : ""}
            className="pointer-events-none block w-full"
            loading={index > 2 ? "lazy" : undefined}
            draggable={false}
          />
        ))}
      </div>
    </button>
  );
}

/**
 * Rail horizontal : les invitations viennent tour à tour sous le cadre iPhone,
 * qui reste fixe au centre, et défilent verticalement pendant leur passage.
 */
function InviteRail() {
  const navigate = useNavigate();
  return (
    <div className="relative h-[389px] w-screen max-w-[428px] shrink-0 overflow-hidden lg:h-[478px] lg:w-full lg:max-w-none">
      <div className="lw-hero-rail absolute left-1/2 top-[6px] flex w-max gap-[15px] lg:top-[7px] lg:gap-[20px]">
        {RAIL.map((invite, i) => (
          <InviteCard
            key={`${invite.name}-${i}`}
            invite={invite}
            index={i}
            onOpen={(to) => navigate(to)}
          />
        ))}
      </div>

      {/* Cadre iPhone fixe : bordure seule, l'intérieur laisse passer le rail */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[389px] w-[194px] -translate-x-1/2 -translate-y-1/2 rounded-[32px] border-[6px] border-[#131313] shadow-[0_20px_45px_-20px_rgba(75,66,66,0.55)] lg:h-[478px] lg:w-[238px] lg:border-[7px]"
        aria-hidden
      >
        <span className="absolute left-1/2 top-[8px] h-[17px] w-[58px] -translate-x-1/2 rounded-full bg-[#131313] lg:top-[10px] lg:h-[20px] lg:w-[70px]" />
      </div>
    </div>
  );
}

/** Hero Figma Main Digital — rail d'invitations sous un cadre iPhone fixe */
function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="overflow-x-hidden bg-[#f4f4f4] pb-8 pt-2 lg:pb-20 lg:pt-10">
      <div className="mx-auto w-full max-w-6xl px-4 lg:px-8">
        <div className="flex flex-col items-center text-center lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:text-left">
          <div className="w-full">
            <h1 className="lw-hero lg:text-[52px] lg:leading-[1.15]">
              Pour tous les moments
              <br />
              qui comptent
            </h1>
            <p className="mx-auto mt-[18px] max-w-[338px] lw-sub leading-[30px] lg:mx-0 lg:mt-5 lg:max-w-[440px] lg:text-[20px] lg:leading-7">
              Votre invitation de mariage, à imprimer ou à partager.
            </p>
            <button
              type="button"
              onClick={() => navigate("/invitations-digital")}
              className="mt-10 hidden h-[42px] w-[163px] items-center justify-center gap-2 rounded-[5px] bg-white font-urbanist text-[14px] font-bold uppercase tracking-wide text-lw-accent shadow-sm ring-1 ring-lw-line hover:ring-lw-accent lg:inline-flex"
            >
              découvrir
              <span aria-hidden>→</span>
            </button>
          </div>

          <div className="mt-6 flex w-full justify-center lg:mt-0">
            <InviteRail />
          </div>
        </div>

        <div className="mt-6 flex justify-center lg:hidden">
          <button
            type="button"
            onClick={() => navigate("/invitations-digital")}
            className="inline-flex h-[42px] w-[163px] items-center justify-center gap-2 rounded-[5px] bg-white font-urbanist text-[14px] font-bold uppercase tracking-wide text-lw-accent shadow-sm ring-1 ring-lw-line"
          >
            découvrir
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
