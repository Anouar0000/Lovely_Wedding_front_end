import React from "react";
import { Link, useLocation, useParams, useSearchParams } from "react-router-dom";
import DigitalHomeHeader from "../components/home/DigitalHomeHeader";

/** Dove + envelope — Figma 1432:315 / merciCheckout.png */
function MerciDove({ className = "" }) {
  return (
    <svg
      viewBox="0 0 220 180"
      className={className}
      aria-hidden
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="118" cy="108" rx="48" ry="38" fill="#FFF8F2" stroke="#4B4242" strokeWidth="2.2" />
      <path
        d="M70 100c-18-8-36-4-48 12 22 2 40 8 54 20 6-12 8-24-6-32z"
        fill="#FFF8F2"
        stroke="#4B4242"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle cx="152" cy="72" r="28" fill="#FFF8F2" stroke="#4B4242" strokeWidth="2.2" />
      <ellipse cx="162" cy="80" rx="7" ry="5" fill="#F2C4C0" opacity="0.9" />
      <circle cx="160" cy="68" r="3.2" fill="#4B4242" />
      <path
        d="M178 74 L198 78 L178 84 Z"
        fill="#E8B84A"
        stroke="#4B4242"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <rect
        x="188"
        y="70"
        width="28"
        height="20"
        rx="2"
        fill="#F2C4C0"
        stroke="#4B4242"
        strokeWidth="1.6"
      />
      <path d="M188 72 L202 82 L216 72" stroke="#4B4242" strokeWidth="1.4" fill="none" />
      <circle cx="202" cy="84" r="3" fill="#E23D48" />
      <path
        d="M78 120c-10 8-22 14-34 16 8 6 20 8 32 4 6-8 8-14 2-20z"
        fill="#FFF8F2"
        stroke="#4B4242"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Merci après checkout digital — Figma 1432:315 / merciCheckout.png
 */
function DigitalMerciPage() {
  const { slug } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const orderId = location.state?.orderId || searchParams.get("orderId") || "";

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white font-glacial text-lw-text">
      <DigitalHomeHeader mode="none" context="digitale" />

      <main className="mx-auto flex w-full max-w-[428px] flex-1 flex-col items-center justify-center px-6 py-16 text-center lg:max-w-xl">
        <MerciDove className="mb-10 h-[160px] w-[200px]" />

        <h1 className="font-lora text-[36px] font-medium leading-[42px] tracking-[-0.36px] text-[#4B4242]">
          Merci !
        </h1>
        <p className="mt-3 font-glacial text-[18px] leading-6 text-[#4B4242]">
          Merci pour votre achat
        </p>
        {orderId ? (
          <p className="mt-2 font-glacial text-[13px] text-[#7D6E66]">
            Commande <span className="font-semibold">{orderId}</span>
          </p>
        ) : null}

        <Link
          to="/espace-client"
          className="mt-14 inline-flex h-[48px] items-center justify-center rounded-full bg-[#A97C72] px-8 font-glacial text-[14px] font-bold text-white shadow-[0px_8px_10px_rgba(168,125,115,0.28)] hover:bg-[#966B62]"
        >
          Visiter votre espace client
        </Link>

        {slug ? (
          <Link
            to={`/invitations-digital/${slug}`}
            className="mt-4 font-glacial text-[14px] font-semibold text-[#A97C72] underline"
          >
            Retour au thème
          </Link>
        ) : null}
      </main>
    </div>
  );
}

export default DigitalMerciPage;
