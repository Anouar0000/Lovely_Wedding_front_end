import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import invites from "../data/digitalInviteInstances.json";
import { isFirebaseConfigured } from "../lib/firebase";
import { getDigitalInviteBySlug } from "../services/digitalInvites";
import { getDigitalInviteTemplate } from "../templates/digitalInviteTemplates";

function InviteMessage({ title, children }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F4F4F4] px-6 text-center font-urbanist">
      <div>
        <h1 className="font-abhaya text-3xl">{title}</h1>
        {children}
      </div>
    </main>
  );
}

function SharedDigitalInvitePage() {
  const { slug } = useParams();
  const [invite, setInvite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadInvite = async () => {
      setLoading(true);
      setError("");

      try {
        const loadedInvite = isFirebaseConfigured
          ? await getDigitalInviteBySlug(slug, { publishedOnly: true })
          : invites.find((item) => item.slug === slug && item.status === "published");

        if (isMounted) {
          setInvite(loadedInvite || null);
        }
      } catch (loadError) {
        if (isMounted) {
          setError("Impossible de charger cette invitation.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadInvite();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <InviteMessage title="Chargement">
        <p className="mt-3 text-sm text-gray-600">Nous preparons votre invitation.</p>
      </InviteMessage>
    );
  }

  if (error) {
    return (
      <InviteMessage title="Erreur">
        <p className="mt-3 text-sm text-gray-600">{error}</p>
      </InviteMessage>
    );
  }

  if (!invite) {
    return (
      <InviteMessage title="Invitation introuvable">
        <p className="mt-3 text-sm text-gray-600">
          Le lien est incorrect ou l'invitation n'est pas encore publiee.
        </p>
        <Link to="/invitations-digital" className="mt-6 inline-block border-b-2 border-black pb-1 text-sm">
          Voir les invitations digitales
        </Link>
      </InviteMessage>
    );
  }

  const template = getDigitalInviteTemplate(invite.template);

  if (template) {
    const TemplateComponent = template.Component;
    return <TemplateComponent invite={invite} />;
  }

  return (
    <InviteMessage title="Modele indisponible">
      <p className="mt-3 text-sm text-gray-600">
        Cette invitation existe, mais son modele n'est pas encore connecte.
      </p>
    </InviteMessage>
  );
}

export default SharedDigitalInvitePage;
