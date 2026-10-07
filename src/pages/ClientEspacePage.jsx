import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiExternalLink, FiHome, FiLogOut, FiUsers } from "react-icons/fi";
import { useAuth } from "../components/auth/AuthProvider";
import { listDigitalInvitesForClient } from "../services/digitalInvites";
import { getDigitalInviteTemplate } from "../templates/digitalInviteTemplates";
import DigitalHomeHeader from "../components/home/DigitalHomeHeader";
import DigitalHomeFooter from "../components/home/DigitalHomeFooter";

function ClientEspacePage() {
  const { user, logout, isAdmin } = useAuth();
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const items = await listDigitalInvitesForClient(user);
      setInvites(items);
    } catch {
      setError("Impossible de charger vos invitations.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white font-urbanist text-lw-text">
      <DigitalHomeHeader mode="none" />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 lg:px-8 lg:py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lw-accent">
              Espace client
            </p>
            <h1 className="mt-2 lw-page lg:text-[44px]">
              Mes RSVP
            </h1>
            <p className="mt-2 lw-body">{user?.email}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-[5px] border border-lw-line bg-white px-4 py-2 text-sm font-semibold"
            >
              <FiHome aria-hidden="true" /> Site
            </Link>
            {isAdmin ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-[5px] border border-lw-line bg-white px-4 py-2 text-sm font-semibold"
              >
                Admin
              </Link>
            ) : null}
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-[5px] bg-lw-accent px-4 py-2 text-sm font-bold uppercase text-white hover:bg-lw-accentDark"
            >
              <FiLogOut aria-hidden="true" /> Déconnexion
            </button>
          </div>
        </div>

        <p className="mt-6 max-w-2xl lw-body leading-6">
          Consultez les réponses RSVP de votre invitation. La modification du design est réservée
          à l&apos;équipe Lovely Wedding.
        </p>

        {error ? (
          <div className="mt-4 rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mt-8 overflow-hidden rounded-[8px] border border-lw-line bg-lw-surface">
          {loading ? (
            <p className="px-5 py-10 text-center text-sm text-lw-muted">Chargement...</p>
          ) : invites.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <FiUsers className="mx-auto text-3xl text-lw-muted" />
              <h2 className="mt-3 lw-h1">Aucune invitation liée</h2>
              <p className="mx-auto mt-2 max-w-md lw-body">
                Dès que votre invitation digitale est associée à votre email, elle apparaîtra ici.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-lw-line bg-white">
              {invites.map((invite) => (
                <article
                  key={invite.id}
                  className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold">{invite.coupleNames || invite.slug}</p>
                    <p className="mt-1 text-xs text-lw-muted">
                      {getDigitalInviteTemplate(invite.template)?.label || invite.template} · /
                      {invite.slug}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {invite.status === "published" ? (
                      <a
                        href={`/${invite.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-[5px] border border-lw-line px-3 py-2 text-sm"
                      >
                        <FiExternalLink aria-hidden="true" /> Voir le lien
                      </a>
                    ) : null}
                    <Link
                      to={`/espace-client/invitations/${invite.id}/rsvp`}
                      className="inline-flex items-center gap-2 rounded-[5px] bg-lw-accent px-3 py-2 text-sm font-bold uppercase text-white hover:bg-lw-accentDark"
                    >
                      <FiUsers aria-hidden="true" /> Gérer RSVP
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <DigitalHomeFooter />
    </div>
  );
}

export default ClientEspacePage;
