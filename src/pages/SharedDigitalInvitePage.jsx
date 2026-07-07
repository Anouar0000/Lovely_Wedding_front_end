import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import invites from "../data/digital/instances.json";
import { isFirebaseConfigured } from "../lib/firebase";
import { getDigitalInviteById, getDigitalInviteBySlug } from "../services/digitalInvites";
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

function SharedDigitalInvitePage({ allowDraft = false, previewMode = false, lookupById = false }) {
  const { id, slug } = useParams();
  const inviteKey = lookupById ? id : slug;
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
          ? lookupById
            ? (await getDigitalInviteById(inviteKey)) ||
              (await getDigitalInviteBySlug(inviteKey, { publishedOnly: !allowDraft }))
            : await getDigitalInviteBySlug(inviteKey, { publishedOnly: !allowDraft })
          : invites.find((item) => item.slug === inviteKey && (allowDraft || item.status === "published"));
        const visibleInvite =
          loadedInvite && (allowDraft || loadedInvite.status === "published") ? loadedInvite : null;

        if (isMounted) {
          setInvite(visibleInvite);
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
  }, [allowDraft, inviteKey, lookupById]);

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
    return (
      <>
        {previewMode ? (
          <div className="fixed left-0 right-0 top-0 z-[9999] bg-black px-4 py-2 text-center font-urbanist text-xs font-semibold uppercase tracking-[0.16em] text-white">
            Apercu dashboard / {invite.status === "published" ? "publiee" : "brouillon"}
          </div>
        ) : null}
        <TemplateComponent invite={invite} />
      </>
    );
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
