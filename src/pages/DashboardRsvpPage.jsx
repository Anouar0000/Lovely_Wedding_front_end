import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiRefreshCw, FiUsers } from "react-icons/fi";
import { useAuth } from "../components/auth/AuthProvider";
import { getDigitalInviteById } from "../services/digitalInvites";
import { listRsvpByInviteId } from "../services/rsvp";
import DigitalHomeHeader from "../components/home/DigitalHomeHeader";
import DigitalHomeFooter from "../components/home/DigitalHomeFooter";

function formatDate(value) {
  if (!value?.toDate) return "—";
  try {
    return value.toDate().toLocaleString("fr-FR");
  } catch {
    return "—";
  }
}

function canAccessInvite(invite, user, isAdmin) {
  if (!invite || !user) return false;
  if (isAdmin) return true;
  if (invite.ownerId === user.uid) return true;
  if (invite.clientUserId === user.uid) return true;
  if (
    invite.clientEmail &&
    user.email &&
    invite.clientEmail.toLowerCase() === user.email.toLowerCase()
  ) {
    return true;
  }
  return false;
}

function DashboardRsvpPage({ clientMode = false }) {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const [invite, setInvite] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const backPath = clientMode ? "/espace-client" : "/dashboard";

  const load = useCallback(async () => {
    if (!user?.uid || !id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const loadedInvite = await getDigitalInviteById(id);
      if (!canAccessInvite(loadedInvite, user, isAdmin)) {
        setError("Invitation introuvable ou accès refusé.");
        setInvite(null);
        setResponses([]);
        return;
      }

      setInvite(loadedInvite);
      let finalItems = [];

      if (isAdmin || loadedInvite.ownerId === user.uid) {
        finalItems = await listRsvpByInviteId(loadedInvite.id, {
          ownerId: loadedInvite.ownerId,
        });
      } else if (loadedInvite.clientUserId === user.uid) {
        finalItems = await listRsvpByInviteId(loadedInvite.id, {
          clientUserId: user.uid,
        });
      } else if (user.email) {
        finalItems = await listRsvpByInviteId(loadedInvite.id, {
          clientEmail: user.email,
        });
      }

      setResponses(finalItems);
    } catch {
      setError("Impossible de charger les réponses RSVP.");
    } finally {
      setLoading(false);
    }
  }, [id, user, isAdmin]);

  useEffect(() => {
    load();
  }, [load]);

  const attendingCount = responses.filter((item) => item.attending).length;
  const guestsTotal = responses.reduce(
    (sum, item) => sum + (item.attending ? Number(item.guestCount) || 0 : 0),
    0
  );

  const body = (
    <>
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-end justify-between gap-4 px-5 pt-10 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lw-accent">
            {clientMode ? "Espace client" : "Dashboard"}
          </p>
          <h1 className="mt-2 lw-page lg:text-[44px]">
            Réponses RSVP
          </h1>
          {invite ? (
            <p className="mt-2 lw-body">
              {invite.coupleNames || invite.slug} · /{invite.slug}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to={backPath}
            className="inline-flex items-center gap-2 rounded-[5px] border border-lw-line bg-white px-4 py-2 text-sm font-semibold"
          >
            <FiArrowLeft aria-hidden="true" /> Retour
          </Link>
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center gap-2 rounded-[5px] bg-lw-accent px-4 py-2 text-sm font-bold uppercase text-white hover:bg-lw-accentDark"
          >
            <FiRefreshCw aria-hidden="true" /> Actualiser
          </button>
        </div>
      </div>

      <section className="mx-auto w-full max-w-6xl px-5 py-8 lg:px-8">
        {error ? (
          <div className="mb-4 rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Réponses", value: responses.length },
            { label: "Oui", value: attendingCount },
            { label: "Invités (oui)", value: guestsTotal },
          ].map((stat) => (
            <div key={stat.label} className="rounded-[8px] border border-lw-line bg-lw-surface p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-lw-muted">{stat.label}</p>
              <p className="mt-2 lw-page-lg">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-[8px] border border-lw-line bg-white">
          {loading ? (
            <p className="px-5 py-10 text-center text-sm text-lw-muted">Chargement...</p>
          ) : responses.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <FiUsers className="mx-auto text-3xl text-lw-muted" />
              <h2 className="mt-3 lw-h1">Aucune réponse</h2>
              <p className="mt-2 lw-body">
                Les RSVP apparaîtront ici quand les invités valideront le formulaire.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-lw-line">
              {responses.map((item) => (
                <article
                  key={item.id}
                  className="grid gap-2 px-5 py-4 text-sm md:grid-cols-[1.2fr_1fr_0.6fr_0.6fr_1fr] md:items-center"
                >
                  <div>
                    <p className="font-semibold">{item.fullName}</p>
                    <p className="text-xs text-lw-muted">{item.email || "—"}</p>
                  </div>
                  <p className="text-lw-muted">{item.phone || "—"}</p>
                  <p>
                    <span
                      className={`inline-flex rounded px-2 py-1 text-xs font-semibold uppercase ${
                        item.attending
                          ? "bg-emerald-50 text-emerald-800"
                          : "bg-amber-50 text-amber-800"
                      }`}
                    >
                      {item.attending ? "Oui" : "Non"}
                    </span>
                  </p>
                  <p className="font-semibold">{item.guestCount || 1}</p>
                  <p className="text-xs text-lw-muted">{formatDate(item.createdAt)}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );

  if (clientMode) {
    return (
      <div className="flex min-h-screen flex-col overflow-x-hidden bg-white font-urbanist text-lw-text">
        <DigitalHomeHeader mode="none" />
        <div className="flex-1">{body}</div>
        <DigitalHomeFooter />
      </div>
    );
  }

  return <main className="min-h-screen bg-white font-urbanist text-lw-text">{body}</main>;
}

export default DashboardRsvpPage;
