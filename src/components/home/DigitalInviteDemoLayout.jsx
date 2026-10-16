import React from "react";
import { Outlet } from "react-router-dom";
import DigitalHomeHeader from "./DigitalHomeHeader";

/**
 * Shell vitrine pour les démos /digital-invitation/* —
 * garde le switcher Digitale / Imprimée visible sur mobile.
 * Les invitations partagées (/e/:slug) restent sans header.
 */
function DigitalInviteDemoLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F7F2EC]">
      <DigitalHomeHeader mode="none" />
      <div className="min-h-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}

export default DigitalInviteDemoLayout;
