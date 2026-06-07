import React from "react";
import { Link, useParams } from "react-router-dom";
import DolceVitaInvitePage from "./DolceVitaInvitePage";
import invites from "../data/digitalInviteInstances.json";

function SharedDigitalInvitePage() {
  const { slug } = useParams();
  const invite = invites.find((item) => item.slug === slug && item.status === "published");

  if (!invite) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4F4F4] px-6 text-center font-urbanist">
        <div>
          <h1 className="font-abhaya text-3xl">Invitation introuvable</h1>
          <p className="mt-3 text-sm text-gray-600">
            Le lien est incorrect ou l'invitation n'est pas encore publiee.
          </p>
          <Link to="/invitations-digital" className="mt-6 inline-block border-b-2 border-black pb-1 text-sm">
            Voir les invitations digitales
          </Link>
        </div>
      </main>
    );
  }

  if (invite.template === "dolce-vita") {
    return <DolceVitaInvitePage invite={invite} />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F4F4F4] px-6 text-center font-urbanist">
      <div>
        <h1 className="font-abhaya text-3xl">Modele indisponible</h1>
        <p className="mt-3 text-sm text-gray-600">
          Cette invitation existe, mais son modele n'est pas encore connecte.
        </p>
      </div>
    </main>
  );
}

export default SharedDigitalInvitePage;
