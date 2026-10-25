import React from "react";
import { Link } from "react-router-dom";
import { homeDigitalAssets as a } from "./homeDigitalAssets";

/**
 * Écran Merci — Figma merciCheckout.png (430×714)
 * @param {string} [espaceTo="/espace-client"]
 */
function MerciCheckoutView({ espaceTo = "/espace-client" }) {
  return (
    <main className="relative mx-auto w-full max-w-[428px] flex-1 self-center lg:max-w-[430px]">
      {/* Cadre Figma 430×714 — positions % absolues */}
      <div className="relative mx-auto w-full max-w-[430px] aspect-[430/714] min-h-[min(714px,calc(100dvh-86px))]">
        <img
          src={a.merciPigeon}
          alt=""
          width={219}
          height={121}
          className="absolute left-1/2 top-[31.23%] h-[121px] w-[219px] -translate-x-1/2 object-contain"
          draggable={false}
        />

        {/* Merci ! — Figma absolute % */}
        <h1
          className="absolute left-[28.37%] right-[27.91%] top-[51.54%] bottom-[44.12%] flex items-center justify-center text-center font-lora text-[26px] font-medium leading-[36px] tracking-[-0.01em] text-[#4B4242]"
        >
          Merci !
        </h1>

        <div className="absolute left-0 right-0 top-[57.14%] flex flex-col items-center">
          <p className="w-[63.49%] text-center font-glacial text-[16px] font-normal leading-6 text-[#4B4242]">
            Merci pour votre achat
          </p>
          <Link
            to={espaceTo}
            className="mt-[191px] box-border flex h-[48px] w-[215px] shrink-0 flex-row items-center justify-center overflow-hidden rounded-full bg-[#A97C72] py-0 pl-6 pr-5 shadow-[0px_8px_20px_rgba(168,125,115,0.28)] transition-colors hover:bg-[#966B62]"
          >
            <span className="h-6 max-w-[171px] whitespace-nowrap font-glacial text-[14px] font-bold leading-6 text-white">
              Visiter votre espace client
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default MerciCheckoutView;
