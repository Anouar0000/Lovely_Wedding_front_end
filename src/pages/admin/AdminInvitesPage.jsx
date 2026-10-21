import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiCheck,
  FiCopy,
  FiEdit2,
  FiExternalLink,
  FiEye,
  FiEyeOff,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
  FiUploadCloud,
  FiUsers,
} from "react-icons/fi";
import { useAuth } from "../../components/auth/AuthProvider";
import sampleInvites from "../../data/digital/instances.json";
import { isAbortError } from "../../lib/firebase";
import {
  deleteDigitalInvite,
  listAllDigitalInvites,
  saveDigitalInvite,
  updateDigitalInvite,
} from "../../services/digitalInvites";
import { getDigitalInviteTemplate } from "../../templates/digitalInviteTemplates";

function inviteStatus(invite) {
  return invite?.status === "published" ? "published" : "draft";
}

function AdminInvitesPage() {
  const { user } = useAuth();
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [copiedId, setCopiedId] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredInvites = invites.filter((invite) => {
    const term = searchTerm.trim().toLowerCase();
    const status = inviteStatus(invite);
    const matchesStatus = statusFilter === "all" || status === statusFilter;
    const searchableText = [
      invite.coupleNames,
      invite.slug,
      invite.venueName,
      invite.city,
      invite.clientEmail,
      getDigitalInviteTemplate(invite.template)?.label,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return matchesStatus && (!term || searchableText.includes(term));
  });

  const statusCounts = invites.reduce(
    (counts, invite) => {
      const status = inviteStatus(invite);
      return {
        ...counts,
        [status]: (counts[status] || 0) + 1,
      };
    },
    { all: invites.length, draft: 0, published: 0 }
  );

  const loadInvites = useCallback(async () => {
    if (!user?.uid) {
      setInvites([]);
      setLoading(false);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const items = await listAllDigitalInvites();
      setInvites(items);
    } catch (loadError) {
      if (!isAbortError(loadError)) {
        setError("Impossible de charger les invitations depuis Firestore.");
      }
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    loadInvites();
  }, [loadInvites]);

  const handleAddSample = async () => {
    if (!user?.uid) {
      setError("Connexion requise.");
      return;
    }

    const sampleInvite = sampleInvites[0];
    setBusyId(sampleInvite.slug);
    setError("");

    try {
      await saveDigitalInvite(sampleInvite.slug, {
        ...sampleInvite,
        status: "draft",
        ownerId: user.uid,
      });
      await loadInvites();
    } catch (saveError) {
      setError("Impossible d'ajouter l'exemple dans Firestore.");
    } finally {
      setBusyId("");
    }
  };

  const handleDelete = async (invite) => {
    if (!window.confirm(`Supprimer l'invitation ${invite.coupleNames || invite.slug} ?`)) {
      return;
    }

    setBusyId(invite.id);
    setError("");

    try {
      await deleteDigitalInvite(invite.id);
      setInvites((current) => current.filter((item) => item.id !== invite.id));
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
      setInvites((current) =>
        current.map((item) => (item.id === invite.id ? { ...item, status: "published" } : item))
      );
    } catch (publishError) {
      setError("Impossible de publier cette invitation.");
    } finally {
      setBusyId("");
    }
  };

  const handleUnpublish = async (invite) => {
    setBusyId(invite.id);
    setError("");
    try {
      await updateDigitalInvite(invite.id, { status: "draft" });
      setInvites((current) =>
        current.map((item) => (item.id === invite.id ? { ...item, status: "draft" } : item))
      );
    } catch (unpublishError) {
      setError("Impossible de dépublier cette invitation.");
    } finally {
      setBusyId("");
    }
  };

  const getPublicInviteUrl = (slug) => `${window.location.origin}/${slug}`;

  const handleCopyLink = async (invite) => {
    if (inviteStatus(invite) !== "published") {
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
      setError("Impossible de copier le lien.");
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-lora text-[28px] font-medium text-[#4B4242] lg:text-[36px]">
            Invitations digitales
          </h2>
          <p className="mt-1 text-sm text-[#7D6E66]">Créer, publier et suivre les RSVP.</p>
        </div>
        <Link
          to="/dashboard/invitations/new"
          className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#A97C72] px-5 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-[#966B62]"
        >
          <FiPlus aria-hidden /> Nouvelle invitation
        </Link>
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center">
        <label className="relative block">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7D6E66]" aria-hidden />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher"
            className="w-full rounded-[5px] border border-[#E8E0D8] bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-[#A97C72]"
          />
        </label>

        <div className="flex overflow-hidden rounded-[5px] border border-[#E8E0D8] bg-white text-sm font-semibold">
          {[
            ["all", `Tout ${statusCounts.all}`],
            ["published", `Publiées ${statusCounts.published}`],
            ["draft", `Brouillons ${statusCounts.draft}`],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setStatusFilter(value)}
              className={`px-4 py-3 ${
                statusFilter === value ? "bg-[#A97C72] text-white" : "text-[#7D6E66]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={loadInvites}
          className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-[#E8E0D8] bg-white px-4 py-3 text-sm font-semibold"
        >
          <FiRefreshCw aria-hidden /> Actualiser
        </button>
      </div>

      <div className="overflow-hidden rounded-[8px] border border-[#E8E0D8] bg-white shadow-sm">
        <div className="grid grid-cols-1 gap-4 border-b border-[#E8E0D8] bg-[#F7F2EC] px-5 py-4 text-sm font-semibold text-[#7D6E66] md:grid-cols-[1.25fr_0.75fr_0.55fr_1fr]">
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
          <div className="px-5 py-12 text-center text-sm font-semibold uppercase tracking-[0.18em] text-[#7D6E66]">
            Chargement
          </div>
        ) : null}

        {!loading && invites.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <h3 className="font-lora text-[22px] font-medium">Aucune invitation</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#7D6E66]">
              Ajoute l&apos;exemple Dolce Vita pour tester le dashboard.
            </p>
            <button
              type="button"
              onClick={handleAddSample}
              disabled={Boolean(busyId)}
              className="mt-6 inline-flex items-center gap-2 rounded-[5px] bg-[#A97C72] px-5 py-3 text-sm font-bold uppercase text-white disabled:opacity-50"
            >
              <FiPlus aria-hidden /> {busyId ? "Ajout..." : "Ajouter l'exemple"}
            </button>
          </div>
        ) : null}

        {!loading && invites.length > 0 && filteredInvites.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <h3 className="font-lora text-[22px] font-medium">Aucun résultat</h3>
            <p className="mt-2 text-sm text-[#7D6E66]">Modifie la recherche ou le filtre.</p>
          </div>
        ) : null}

        {!loading && filteredInvites.length > 0 ? (
          <div className="divide-y divide-[#E8E0D8]">
            {filteredInvites.map((invite) => {
              const isPublished = inviteStatus(invite) === "published";
              const label = invite.coupleNames || invite.slug;

              return (
                <div
                  key={invite.id}
                  className="grid grid-cols-1 gap-4 px-5 py-4 text-sm hover:bg-[#FAFAF8] md:grid-cols-[1.25fr_0.75fr_0.55fr_1fr] md:items-center"
                >
                  <div>
                    <p className="font-semibold">{label}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-[#7D6E66]">
                      <FiExternalLink aria-hidden /> /{invite.slug}
                    </p>
                    {invite.clientEmail ? (
                      <p className="mt-1 text-xs text-[#7D6E66]">{invite.clientEmail}</p>
                    ) : null}
                  </div>
                  <span>{getDigitalInviteTemplate(invite.template)?.label || invite.template}</span>
                  <span>
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
                        isPublished
                          ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                          : "border border-amber-200 bg-amber-50 text-amber-800"
                      }`}
                    >
                      {isPublished ? "published" : "draft"}
                    </span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/dashboard/invitations/${invite.id}/rsvp`}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-[5px] border border-[#E8E0D8] text-[#4B4242] hover:border-[#A97C72]"
                      title="RSVP"
                    >
                      <FiUsers aria-hidden />
                    </Link>
                    <Link
                      to={`/dashboard/invitations/${invite.id}/edit`}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-[5px] border border-[#E8E0D8] text-[#4B4242] hover:border-[#A97C72]"
                      title="Modifier"
                    >
                      <FiEdit2 aria-hidden />
                    </Link>
                    <Link
                      to={`/dashboard/invitations/${invite.id}/preview`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-[5px] border border-[#E8E0D8] text-[#4B4242] hover:border-[#A97C72]"
                      title="Aperçu"
                    >
                      <FiEye aria-hidden />
                    </Link>
                    {!isPublished ? (
                      <button
                        type="button"
                        onClick={() => handlePublish(invite)}
                        disabled={busyId === invite.id}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-[5px] border border-emerald-200 text-emerald-700 disabled:opacity-40"
                        title="Publier"
                      >
                        <FiUploadCloud aria-hidden />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleUnpublish(invite)}
                        disabled={busyId === invite.id}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-[5px] border border-amber-200 text-amber-800 disabled:opacity-40"
                        title="Dépublier"
                      >
                        <FiEyeOff aria-hidden />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleCopyLink(invite)}
                      disabled={!isPublished}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-[5px] border border-[#E8E0D8] text-[#4B4242] disabled:opacity-30"
                      title="Copier le lien"
                    >
                      {copiedId === invite.id ? <FiCheck aria-hidden /> : <FiCopy aria-hidden />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(invite)}
                      disabled={busyId === invite.id}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-[5px] border border-red-200 text-red-700 disabled:opacity-40"
                      title="Supprimer"
                    >
                      <FiTrash2 aria-hidden />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default AdminInvitesPage;
