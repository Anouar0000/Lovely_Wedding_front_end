import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiCheck,
  FiCopy,
  FiEdit2,
  FiExternalLink,
  FiEye,
  FiHome,
  FiLogOut,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiUploadCloud,
  FiTrash2,
} from "react-icons/fi";
import { useAuth } from "../components/auth/AuthProvider";
import sampleInvites from "../data/digital/instances.json";
import {
  deleteDigitalInvite,
  listDigitalInvites,
  saveDigitalInvite,
  updateDigitalInvite,
} from "../services/digitalInvites";
import { getDigitalInviteTemplate } from "../templates/digitalInviteTemplates";

function DashboardPage() {
  const { user, logout } = useAuth();
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [copiedId, setCopiedId] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredInvites = invites.filter((invite) => {
    const term = searchTerm.trim().toLowerCase();
    const matchesStatus = statusFilter === "all" || invite.status === statusFilter;
    const searchableText = [
      invite.coupleNames,
      invite.slug,
      invite.venueName,
      invite.city,
      getDigitalInviteTemplate(invite.template)?.label,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return matchesStatus && (!term || searchableText.includes(term));
  });

  const statusCounts = invites.reduce(
    (counts, invite) => ({
      ...counts,
      [invite.status]: (counts[invite.status] || 0) + 1,
    }),
    { all: invites.length, draft: 0, published: 0 }
  );

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
      await saveDigitalInvite(sampleInvite.slug, { ...sampleInvite, status: "draft" });
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

  const handlePublish = async (invite) => {
    setBusyId(invite.id);
    setError("");

    try {
      await updateDigitalInvite(invite.id, { status: "published" });
      setInvites((currentInvites) =>
        currentInvites.map((item) =>
          item.id === invite.id ? { ...item, status: "published" } : item
        )
      );
    } catch (publishError) {
      setError("Impossible de publier cette invitation.");
    } finally {
      setBusyId("");
    }
  };

  const getPublicInviteUrl = (slug) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/e/${slug}`;
  };

  const handleCopyLink = async (invite) => {
    if (invite.status !== "published") {
      setError("Publie l'invitation avant de copier le lien public.");
      return;
    }

    const url = getPublicInviteUrl(invite.slug);
    setError("");

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.setAttribute("readonly", "");
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopiedId(invite.id);
      window.setTimeout(() => setCopiedId(""), 1800);
    } catch (copyError) {
      setError("Impossible de copier le lien. Ouvre l'apercu et copie l'URL manuellement.");
    }
  };

  return (
    <main className="min-h-screen bg-[#F6F7F5] font-urbanist text-[#141414]">
      <header className="border-b border-[#D8DDE2] bg-white px-5 py-4">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#42625B]">
              Lovely Wedding
            </p>
            <h1 className="font-abhaya text-3xl leading-none">Dashboard</h1>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 border border-[#D8DDE2] px-4 py-2 text-sm font-semibold"
            >
              <FiHome aria-hidden="true" /> Site
            </Link>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 border border-black px-4 py-2 text-sm font-semibold"
            >
              <FiLogOut aria-hidden="true" /> Deconnexion
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
            className="inline-flex items-center justify-center gap-2 bg-black px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white"
          >
            <FiPlus aria-hidden="true" /> Nouvelle invitation
          </Link>
        </div>

        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center">
          <label className="relative block">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Rechercher"
              className="w-full border border-[#D8DDE2] bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-black"
            />
          </label>

          <div className="flex overflow-hidden border border-[#D8DDE2] bg-white text-sm font-semibold">
            {[
              ["all", `Tout ${statusCounts.all}`],
              ["published", `Publiees ${statusCounts.published}`],
              ["draft", `Brouillons ${statusCounts.draft}`],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setStatusFilter(value)}
                className={`px-4 py-3 ${
                  statusFilter === value ? "bg-black text-white" : "text-gray-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={loadInvites}
            className="inline-flex items-center justify-center gap-2 border border-[#D8DDE2] bg-white px-4 py-3 text-sm font-semibold"
          >
            <FiRefreshCw aria-hidden="true" /> Actualiser
          </button>
        </div>

        <div className="border border-[#D8DDE2] bg-white shadow-sm">
          <div className="grid grid-cols-1 gap-4 border-b border-[#E4E8EA] bg-[#F9FAF8] px-5 py-4 text-sm font-semibold text-gray-500 md:grid-cols-[1.25fr_0.75fr_0.55fr_1fr]">
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
                className="mt-6 inline-flex items-center gap-2 bg-black px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                <FiPlus aria-hidden="true" /> {busyId ? "Ajout..." : "Ajouter l'exemple"}
              </button>
            </div>
          ) : null}

          {!loading && invites.length > 0 && filteredInvites.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <h3 className="font-abhaya text-3xl">Aucun resultat</h3>
              <p className="mt-2 text-sm text-gray-600">Modifie la recherche ou le filtre.</p>
            </div>
          ) : null}

          {!loading && filteredInvites.length > 0 ? (
            <div className="divide-y divide-[#E4E8EA]">
              {filteredInvites.map((invite) => {
                const isPublished = invite.status === "published";

                return (
                <div
                  key={invite.id}
                  className="grid grid-cols-1 gap-4 px-5 py-4 text-sm transition-colors hover:bg-[#FAFAF8] md:grid-cols-[1.25fr_0.75fr_0.55fr_1fr] md:items-center"
                >
                  <div>
                    <p className="font-semibold">{invite.coupleNames || invite.slug}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                      <FiExternalLink aria-hidden="true" /> /{invite.slug}
                    </p>
                  </div>
                  <span>{getDigitalInviteTemplate(invite.template)?.label || invite.template}</span>
                  <span>
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
                        isPublished
                          ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                          : "border border-amber-200 bg-amber-50 text-amber-800"
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${isPublished ? "bg-emerald-500" : "bg-amber-500"}`} />
                      {invite.status}
                    </span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/dashboard/invitations/${invite.id}/edit`}
                      title="Modifier"
                      aria-label={`Modifier ${invite.coupleNames || invite.slug}`}
                      className="inline-flex h-10 w-10 items-center justify-center border border-[#D8DDE2] text-gray-700 hover:border-black hover:text-black"
                    >
                      <FiEdit2 aria-hidden="true" />
                    </Link>
                    <Link
                      to={`/dashboard/invitations/${invite.id}/preview`}
                      target="_blank"
                      rel="noreferrer"
                      title="Apercu"
                      aria-label={`Apercu ${invite.coupleNames || invite.slug}`}
                      className="inline-flex h-10 w-10 items-center justify-center border border-[#D8DDE2] text-gray-700 hover:border-black hover:text-black"
                    >
                      <FiEye aria-hidden="true" />
                    </Link>
                    {!isPublished ? (
                      <button
                        type="button"
                        onClick={() => handlePublish(invite)}
                        disabled={busyId === invite.id}
                        title="Publier"
                        aria-label={`Publier ${invite.coupleNames || invite.slug}`}
                        className="inline-flex h-10 w-10 items-center justify-center border border-emerald-200 text-emerald-700 hover:border-emerald-500 disabled:cursor-not-allowed disabled:text-gray-400"
                      >
                        {busyId === invite.id ? "..." : <FiUploadCloud aria-hidden="true" />}
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => handleCopyLink(invite)}
                      disabled={!isPublished}
                      title={isPublished ? "Copier le lien public" : "Publier avant de copier le lien public"}
                      aria-label={`Copier le lien ${invite.coupleNames || invite.slug}`}
                      className="inline-flex h-10 w-10 items-center justify-center border border-[#D8DDE2] text-gray-700 hover:border-black hover:text-black disabled:cursor-not-allowed disabled:text-gray-300"
                    >
                      {copiedId === invite.id ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(invite)}
                      disabled={busyId === invite.id}
                      title="Supprimer"
                      aria-label={`Supprimer ${invite.coupleNames || invite.slug}`}
                      className="inline-flex h-10 w-10 items-center justify-center border border-red-200 text-red-700 hover:border-red-500 disabled:cursor-not-allowed disabled:text-gray-400"
                    >
                      {busyId === invite.id ? "..." : <FiTrash2 aria-hidden="true" />}
                    </button>
                  </div>
                </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

export default DashboardPage;
