import React from "react";
import DigitalHomeHeader from "../components/home/DigitalHomeHeader";
import MerciCheckoutView from "../components/home/MerciCheckoutView";

/** Merci après checkout — Figma merciCheckout.png */
function OrderConfirmationPage() {
  return (
    <div className="flex min-h-screen flex-col items-center overflow-x-hidden bg-white font-glacial text-lw-text">
      <div className="w-full shrink-0">
        <DigitalHomeHeader mode="none" />
      </div>
      <MerciCheckoutView />
    </div>
  );
}

export default OrderConfirmationPage;
