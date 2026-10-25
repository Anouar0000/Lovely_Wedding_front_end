import React from "react";
import DigitalHomeHeader from "../components/home/DigitalHomeHeader";
import MerciCheckoutView from "../components/home/MerciCheckoutView";

/** Merci après checkout digital — Figma merciCheckout.png */
function DigitalMerciPage() {
  return (
    <div className="flex min-h-screen flex-col items-center overflow-x-hidden bg-white font-glacial text-lw-text">
      <div className="w-full shrink-0">
        <DigitalHomeHeader mode="none" context="digitale" />
      </div>
      <MerciCheckoutView />
    </div>
  );
}

export default DigitalMerciPage;
