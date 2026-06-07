import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/auth/AuthProvider";
import sampleInvites from "../data/digitalInviteInstances.json";
import {
  deleteDigitalInvite,
  listDigitalInvites,
  saveDigitalInvite,
} from "../services/digitalInvites";
import { getDigitalInviteTemplate } from "../templates/digitalInviteTemplates";

function DashboardPage() {
  const { user, logout } = useAuth();
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  const loadInvites = useCallback(async () => {
    setError("");
    setLoading(true);

    try {
      const items = await listDigitalInvites();
      setInvites(items);
    } catch (loadError) {
      setError("Impossible de charger les invitations depuis Firestore.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInvites();
  }, [loadInvites]);

  const handleAddSample = async () => {
    const sampleInvite = sampleInvites[0];
    setBusyId(sampleInvite.slug);
    setError("");

    try {
      await saveDigitalInvite(sampleInvite.slug, sampleInvite);
      await loadInvites();
    } catch (saveError) {
      setError("Impossible d'ajouter l'exemple dans Firestore.");
    } finally {
      setBusyId("");
    }
  };

  const handleDelete = async (invite) => {
    const shouldDelete = window.confirm(
      `Supprimer l'invitation ${invite.coupleNames || invite.slug} ?`
    );

    if (!shouldDelete) {
      return;
    }

    setBusyId(invite.id);
    setError("");

    try {
      await deleteDigitalInvite(invite.id);
      setInvites((currentInvites) => currentInvites.filter((item) => item.id !== invite.id));
    } catch (deleteError) {
      setError("Impossible de supprimer cette invitation.");
    } finally {
      setBusyId("");
    }
  };

  return (
    <main className="min-h-screen bg-[#F6F4EF] font-urbanist text-[#141414]">
      <header className="border-b border-[#D8C9B8] bg-white px-5 py-4">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8A6C4D]">
              Lovely Wedding
            </p>
            <h1 className="font-abhaya text-3xl leading-none">Dashboard</h1>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <Link to="/" className="border border-[#D8C9B8] px-4 py-2 text-sm font-semibold">
              Site Lovely Wedding
            </Link>
            <button
              type="button"
              onClick={logout}
              className="border border-black px-4 py-2 text-sm font-semibold"
            >
              Deconnexion
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-6xl px-5 py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-abhaya text-4xl leading-none">Invitations digitales</h2>
            <p className="mt-2 text-sm text-gray-600">
              Connecte en tant que {user?.email || "admin"}.
            </p>
          </div>

          <Link
            to="/dashboard/invitations/new"
            className="inline-flex items-center justify-center bg-black px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white"
          >
            Nouvelle invitation
          </Link>
        </div>

        <div className="border border-[#D8C9B8] bg-white">
          <div className="grid grid-cols-1 gap-4 border-b border-[#E5DCD1] px-5 py-4 text-sm font-semibold text-gray-500 md:grid-cols-[1.2fr_0.8fr_0.6fr_1fr]">
            <span>Client</span>
            <span>Template</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {error ? (
            <div className="border-b border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="px-5 py-12 text-center text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
              Chargement
            </div>
          ) : null}

          {!loading && invites.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <h3 className="font-abhaya text-3xl">Aucune invitation</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
                Ajoute l'exemple Dolce Vita dans Firestore pour tester le dashboard et le lien
                public.
              </p>
              <button
                type="button"
                onClick={handleAddSample}
                disabled={Boolean(busyId)}
                className="mt-6 bg-black px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {busyId ? "Ajout..." : "Ajouter l'exemple"}
              </button>
            </div>
          ) : null}

          {!loading && invites.length > 0 ? (
            <div className="divide-y divide-[#E5DCD1]">
              {invites.map((invite) => (
                <div
                  key={invite.id}
                  className="grid grid-cols-1 gap-4 px-5 py-4 text-sm md:grid-cols-[1.2fr_0.8fr_0.6fr_1fr] md:items-center"
                >
                  <div>
                    <p className="font-semibold">{invite.coupleNames || invite.slug}</p>
                    <p className="mt-1 text-xs text-gray-500">/{invite.slug}</p>
                  </div>
                  <span>{getDigitalInviteTemplate(invite.template)?.label || invite.template}</span>
                  <span>
                    <span className="inline-flex border border-[#D8C9B8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]">
                      {invite.status}
                    </span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/dashboard/invitations/${invite.id}/edit`}
                      className="border border-[#D8C9B8] px-3 py-2 font-semibold"
                    >
                      Modifier
                    </Link>
                    <Link
                      to={`/e/${invite.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="border border-[#D8C9B8] px-3 py-2 font-semibold"
                    >
                      Apercu
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(invite)}
                      disabled={busyId === invite.id}
                      className="border border-red-200 px-3 py-2 font-semibold text-red-700 disabled:cursor-not-allowed disabled:text-gray-400"
                    >
                      {busyId === invite.id ? "..." : "Supprimer"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

export default DashboardPage;
