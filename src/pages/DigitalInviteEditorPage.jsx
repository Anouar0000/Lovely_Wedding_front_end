import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiCheck,
  FiClock,
  FiCopy,
  FiEdit2,
  FiExternalLink,
  FiFileText,
  FiHome,
  FiLink,
  FiMapPin,
  FiPlus,
  FiSave,
  FiSettings,
  FiTrash2,
  FiUploadCloud,
  FiChevronDown,
  FiChevronRight,
  FiMove,
  FiLayers,
  FiImage,
  FiMusic,
} from "react-icons/fi";
import {
  createDigitalInviteDraft,
  deleteDigitalInvite,
  getDigitalInviteById,
  saveDigitalInvite,
  updateDigitalInvite,
} from "../services/digitalInvites";
import {
  digitalInviteTemplates,
  getDefaultActiveSections,
  getDefaultDigitalInviteTemplate,
  getDigitalInviteTemplate,
  getTemplateSections,
  isSectionActive,
  toggleInviteSection,
} from "../templates/digitalInviteTemplates";
import {
  getDefaultInviteTexts,
  getTemplateTextFields,
} from "../templates/digitalInviteTexts";
import {
  getDefaultInviteMedia,
  getTemplateMediaFields,
} from "../templates/digitalInviteMedia";
import { uploadInviteMediaFile } from "../services/inviteMediaUpload";
import { useAuth } from "../components/auth/AuthProvider";

const defaultTemplate = getDefaultDigitalInviteTemplate();

/** iPhone Pro Max ratio (440×956), scaled down for editor sidebar. */
const PREVIEW_PHONE_W = 270;
const PREVIEW_PHONE_H = Math.round(270 * (956 / 440)); // ≈587
const PREVIEW_DESIGN_W = 430;
const PREVIEW_SCALE = PREVIEW_PHONE_W / PREVIEW_DESIGN_W;
const PREVIEW_FRAME_BORDER = 4;

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " et ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatDateLabel(dateValue) {
  if (!dateValue) {
    return "";
  }

  const [year, month, day] = dateValue.split("-");

  if (!year || !month || !day) {
    return "";
  }

  return `${day}.${month}.${year}`;
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-gray-700">{label}</span>
      {children}
    </label>
  );
}

function TextInput(props) {
  return (
    <input
      {...props}
      className="w-full border border-[#D8DDE2] bg-white px-3 py-2 text-sm outline-none focus:border-black"
    />
  );
}

function SectionHeader({ icon: Icon, title, action }) {
  return (
    <div className="flex flex-col gap-2 border-b border-[#E4E8EA] bg-[#F9FAF8] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="inline-flex items-center gap-2 text-base font-semibold">
        <span className="inline-flex h-7 w-7 items-center justify-center border border-[#D8DDE2] bg-white text-sm">
          <Icon aria-hidden="true" />
        </span>
        {title}
      </h2>
      {action}
    </div>
  );
}

function EditorSection({ icon, title, children, action }) {
  return (
    <div className="border border-[#D8DDE2] bg-white shadow-sm">
      <SectionHeader icon={icon} title={title} action={action} />
      <div className="p-4">{children}</div>
    </div>
  );
}

function DigitalInviteEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const isEditing = Boolean(id);
  const [invite, setInvite] = useState(() => {
    const draft = createDigitalInviteDraft(defaultTemplate.defaults);
    const templateId = draft.template || defaultTemplate.id;
    return {
      ...draft,
      activeSections: Array.isArray(draft.activeSections)
        ? draft.activeSections
        : getDefaultActiveSections(templateId),
      texts: getDefaultInviteTexts(templateId),
      media: getDefaultInviteMedia(templateId),
    };
  });
  const [initialDocId, setInitialDocId] = useState(id || "");
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [uploadingKey, setUploadingKey] = useState("");
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [openEvents, setOpenEvents] = useState({});

  const toggleEvent = (index) => {
    setOpenEvents((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const timelineItems = Array.isArray(invite.timeline) ? invite.timeline : [];

  const handleDragStart = (event, index) => {
    setDraggedIndex(index);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event, index) => {
    event.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    setInvite((currentInvite) => {
      const currentTimeline = Array.isArray(currentInvite.timeline)
        ? currentInvite.timeline
        : [];
      const updatedTimeline = [...currentTimeline];
      const [removed] = updatedTimeline.splice(draggedIndex, 1);
      updatedTimeline.splice(index, 0, removed);

      setOpenEvents((prev) => {
        const nextOpen = {};
        updatedTimeline.forEach((item, idx) => {
          const oldIdx = currentTimeline.indexOf(item);
          nextOpen[idx] = prev[oldIdx] || false;
        });
        return nextOpen;
      });

      return {
        ...currentInvite,
        timeline: updatedTimeline,
      };
    });

    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  useEffect(() => {
    let isMounted = true;

    const loadInvite = async () => {
      if (!id) {
        return;
      }

      setLoading(true);
      setError("");

      try {
        const loadedInvite = await getDigitalInviteById(id);

        if (!isMounted) {
          return;
        }

        if (!loadedInvite) {
          setError("Invitation introuvable.");
          return;
        }

        if (
          user?.uid &&
          loadedInvite.ownerId &&
          loadedInvite.ownerId !== user.uid &&
          !isAdmin
        ) {
          setError("Tu n'as pas accès à cette invitation.");
          return;
        }

        const loadedTemplate = getDigitalInviteTemplate(loadedInvite.template) || defaultTemplate;

        const loadedTimeline = Array.isArray(loadedInvite.timeline)
          ? loadedInvite.timeline
          : Array.isArray(loadedTemplate.defaults?.timeline)
            ? loadedTemplate.defaults.timeline
            : [];

        const loadedSections = Array.isArray(loadedInvite.activeSections)
          ? loadedInvite.activeSections
          : Array.isArray(loadedTemplate.defaults?.activeSections)
            ? loadedTemplate.defaults.activeSections
            : getDefaultActiveSections(loadedInvite.template || loadedTemplate.id);

        const templateId = loadedInvite.template || loadedTemplate.id;
        const defaultTexts = getDefaultInviteTexts(templateId);
        const loadedTexts =
          loadedInvite.texts && typeof loadedInvite.texts === "object"
            ? { ...defaultTexts, ...loadedInvite.texts }
            : defaultTexts;
        const defaultMedia = getDefaultInviteMedia(templateId);
        const loadedMedia =
          loadedInvite.media && typeof loadedInvite.media === "object"
            ? { ...defaultMedia, ...loadedInvite.media }
            : defaultMedia;
        if (loadedInvite.musicUrl && !loadedMedia.musicUrl) {
          loadedMedia.musicUrl = loadedInvite.musicUrl;
        }

        setInvite({
          ...createDigitalInviteDraft(loadedTemplate.defaults),
          ...loadedInvite,
          timeline: loadedTimeline,
          activeSections: loadedSections,
          texts: loadedTexts,
          media: loadedMedia,
        });
        setInitialDocId(loadedInvite.id);
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
  }, [id, user?.uid, isAdmin]);

  const publicPath = useMemo(() => {
    if (!invite.slug) {
      return "";
    }

    return `/${invite.slug}`;
  }, [invite.slug]);

  const dashboardPreviewPath = useMemo(() => {
    const previewId = initialDocId || invite.slug;

    if (!previewId) {
      return "";
    }

    return `/dashboard/invitations/${previewId}/preview`;
  }, [initialDocId, invite.slug]);

  const publicUrl = useMemo(() => {
    if (!publicPath) {
      return "";
    }

    return `${window.location.origin}${publicPath}`;
  }, [publicPath]);

  const selectedTemplate = getDigitalInviteTemplate(invite.template) || defaultTemplate;
  const templateSections = getTemplateSections(invite.template || selectedTemplate.id);
  const templateTextFields = getTemplateTextFields(invite.template || selectedTemplate.id);
  const templateMediaFields = getTemplateMediaFields(invite.template || selectedTemplate.id);
  const PreviewComponent = selectedTemplate.Component;
  const isSidiBouSaid = invite.template === "sidi-bousaid";
  const previewInvite = useMemo(
    () => ({
      ...invite,
      id: invite.id || invite.slug || "preview",
      status: invite.status || "draft",
      activeSections: Array.isArray(invite.activeSections)
        ? invite.activeSections
        : getDefaultActiveSections(invite.template || selectedTemplate.id),
      texts: {
        ...getDefaultInviteTexts(invite.template || selectedTemplate.id),
        ...(invite.texts && typeof invite.texts === "object" ? invite.texts : {}),
      },
      media: {
        ...getDefaultInviteMedia(invite.template || selectedTemplate.id),
        ...(invite.media && typeof invite.media === "object" ? invite.media : {}),
      },
      musicUrl:
        (invite.media && invite.media.musicUrl) ||
        invite.musicUrl ||
        "",
    }),
    [invite, selectedTemplate.id]
  );
  const getNames = (coupleNames) => {
    if (!coupleNames) return { wife: "", husband: "" };
    const parts = coupleNames.split("&");
    return {
      wife: parts[0]?.trim() || "",
      husband: parts[1]?.trim() || "",
    };
  };
  const { wife, husband } = getNames(invite.coupleNames || "");

  const fixedTimelineSteps = selectedTemplate.fixedTimelineSteps || [];
  const maxTimelineItems = isSidiBouSaid ? 3 : (fixedTimelineSteps.length || Infinity);
  const getTimelineStepKey = (item, index) =>
    item.step || item.image || fixedTimelineSteps[index]?.image || fixedTimelineSteps[0]?.image || "";
  const getNextTimelineStepKey = (timeline) => {
    const usedKeys = new Set(timeline.map((item, index) => getTimelineStepKey(item, index)));
    return (
      fixedTimelineSteps.find((step) => !usedKeys.has(step.image))?.image ||
      fixedTimelineSteps[0]?.image ||
      ""
    );
  };

  const updateInvite = (key, value) => {
    setInvite((currentInvite) => ({
      ...currentInvite,
      [key]: value,
    }));
  };

  const updateInviteText = (key, value) => {
    setInvite((currentInvite) => ({
      ...currentInvite,
      texts: {
        ...(currentInvite.texts && typeof currentInvite.texts === "object"
          ? currentInvite.texts
          : getDefaultInviteTexts(currentInvite.template || selectedTemplate.id)),
        [key]: value,
      },
    }));
  };

  const updateInviteMedia = (key, value) => {
    setInvite((currentInvite) => {
      const nextMedia = {
        ...(currentInvite.media && typeof currentInvite.media === "object"
          ? currentInvite.media
          : getDefaultInviteMedia(currentInvite.template || selectedTemplate.id)),
        [key]: value,
      };
      return {
        ...currentInvite,
        media: nextMedia,
        ...(key === "musicUrl" ? { musicUrl: value } : {}),
        ...(key === "heroPhoto" ? { heroPhoto: value } : {}),
        ...(key === "venuePhoto" ? { venuePhoto: value } : {}),
        ...(key === "storyPhoto" ? { storyPhoto: value } : {}),
      };
    });
  };

  const handleMediaUpload = async (field, file) => {
    if (!file) return;
    if (!user?.uid) {
      setError("Connexion requise pour uploader un fichier.");
      return;
    }
    setError("");
    setUploadingKey(field.key);
    try {
      const url = await uploadInviteMediaFile({
        file,
        ownerId: invite.ownerId || user.uid,
        inviteId: invite.id || invite.slug || "draft",
        fieldKey: field.key,
        kind: field.kind,
      });
      updateInviteMedia(field.key, url);
    } catch (uploadError) {
      const code = uploadError?.code || "";
      const msg = String(uploadError?.message || "");
      if (code.includes("unauthorized") || msg.includes("permission") || msg.includes("unauthorized")) {
        setError(
          "Upload Storage refusé (règles Firebase). Colle une URL d’image/audio pour l’instant, ou déploie storage.rules."
        );
      } else {
        setError(uploadError.message || "Upload impossible. Tu peux coller une URL.");
      }
    } finally {
      setUploadingKey("");
    }
  };

  const updateTimelineItem = (index, key, value) => {
    setInvite((currentInvite) => {
      const currentTimeline = Array.isArray(currentInvite.timeline)
        ? currentInvite.timeline
        : [];
      return {
        ...currentInvite,
        timeline: currentTimeline.map((item, itemIndex) =>
          itemIndex === index ? { ...item, [key]: value } : item
        ),
      };
    });
  };

  const addTimelineItem = () => {
    setInvite((currentInvite) => {
      const currentTimeline = Array.isArray(currentInvite.timeline)
        ? currentInvite.timeline
        : [];
      const isSidi = currentInvite.template === "sidi-bousaid";
      let newItem;

      if (isSidi) {
        const count = currentTimeline.length;
        let title = "New Event";
        let titleAr = "حدث جديد";

        if (count === 0) {
          title = "Outeya";
          titleAr = "الوطية";
        } else if (count === 1) {
          title = "Mariage";
          titleAr = "العرس";
        } else if (count === 2) {
          title = "Dîner";
          titleAr = "عشاء";
        }

        const lastItem = currentTimeline[count - 1];
        newItem = {
          title,
          titleAr,
          date: lastItem?.date || currentInvite.eventDate || "",
          time: lastItem?.time || "19:00",
          venue: lastItem?.venue || currentInvite.venueName || "Dar Sidi Bou Said",
          city: lastItem?.city || currentInvite.city || "Sidi Bou Said",
          mapUrl: lastItem?.mapUrl || currentInvite.mapUrl || "https://maps.google.com",
        };
      } else {
        newItem = {
          step: getNextTimelineStepKey(currentTimeline),
          time: "",
        };
      }

      const maxLimit = isSidi ? 3 : maxTimelineItems;
      return {
        ...currentInvite,
        timeline:
          currentTimeline.length >= maxLimit
            ? currentTimeline
            : [...currentTimeline, newItem],
      };
    });
  };

  const removeTimelineItem = (index) => {
    setInvite((currentInvite) => {
      const currentTimeline = Array.isArray(currentInvite.timeline)
        ? currentInvite.timeline
        : [];
      return {
        ...currentInvite,
        timeline: currentTimeline.filter((item, itemIndex) => itemIndex !== index),
      };
    });
  };

  const handleTemplateChange = (templateId) => {
    const nextTemplate = getDigitalInviteTemplate(templateId);
    if (!nextTemplate) return;

    const defaults = nextTemplate.defaults || {};
    const nextTimeline = Array.isArray(defaults.timeline) ? defaults.timeline : [];
    const nextSections = Array.isArray(defaults.activeSections)
      ? defaults.activeSections
      : getDefaultActiveSections(templateId);

    setInvite((currentInvite) => ({
      ...currentInvite,
      template: templateId,
      title: defaults.title || nextTemplate.label || currentInvite.title,
      timeline: nextTimeline,
      activeSections: nextSections,
      texts: getDefaultInviteTexts(templateId),
      media: getDefaultInviteMedia(templateId),
      musicUrl: "",
    }));
  };

  const handleSectionToggle = (sectionId, enabled) => {
    setInvite((currentInvite) => ({
      ...currentInvite,
      activeSections: toggleInviteSection(currentInvite, sectionId, enabled),
    }));
    // Remet le mockup en haut pour éviter un aperçu « décalé »
    window.requestAnimationFrame(() => {
      const scroller = document.querySelector("[data-invite-preview-scroll]");
      if (scroller) scroller.scrollTop = 0;
    });
  };

  const handleCoupleBlur = () => {
    if (!invite.slug && invite.coupleNames) {
      updateInvite("slug", slugify(invite.coupleNames));
    }
  };

  const handleDateChange = (dateValue) => {
    setInvite((currentInvite) => ({
      ...currentInvite,
      eventDate: dateValue,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!user?.uid) {
      setError("Connexion requise pour enregistrer.");
      return;
    }

    const normalizedSlug = slugify(invite.slug || invite.coupleNames);

    if (!normalizedSlug) {
      setError("Ajoute un slug ou les noms du couple.");
      return;
    }

    setSaving(true);

    try {
      const inviteFields = { ...invite };
      delete inviteFields.id;
      delete inviteFields.createdAt;
      delete inviteFields.updatedAt;
      delete inviteFields.introLabel;
      delete inviteFields.introText;
      delete inviteFields.closingText;
      delete inviteFields.dateLabel;
      const safeTimeline = Array.isArray(invite.timeline) ? invite.timeline : [];
      const lastEvent = safeTimeline.length > 0 ? safeTimeline[safeTimeline.length - 1] : null;

      const cleanedInvite = {
        ...inviteFields,
        ownerId: invite.ownerId || user.uid,
        clientEmail: (invite.clientEmail || "").trim().toLowerCase(),
        clientUserId: (invite.clientUserId || "").trim(),
        slug: normalizedSlug,
        template: selectedTemplate.id,
        activeSections: Array.isArray(invite.activeSections)
          ? invite.activeSections
          : getDefaultActiveSections(selectedTemplate.id),
        texts: {
          ...getDefaultInviteTexts(selectedTemplate.id),
          ...(invite.texts && typeof invite.texts === "object" ? invite.texts : {}),
        },
        media: {
          ...getDefaultInviteMedia(selectedTemplate.id),
          ...(invite.media && typeof invite.media === "object" ? invite.media : {}),
        },
        musicUrl:
          (invite.media && invite.media.musicUrl) ||
          invite.musicUrl ||
          "",
        eventDate: isSidiBouSaid && lastEvent?.date ? lastEvent.date : invite.eventDate,
        time: isSidiBouSaid && lastEvent?.time ? lastEvent.time : invite.time,
        timeline: safeTimeline
          .slice(0, maxTimelineItems)
          .map((item, index) => {
            if (isSidiBouSaid) {
              return {
                title: item.title || "",
                titleAr: item.titleAr || "",
                date: item.date || "",
                time: item.time || "",
                venue: item.venue || "",
                city: item.city || "",
                mapUrl: item.mapUrl || "",
              };
            }
            return {
              step: getTimelineStepKey(item, index),
              time: item.time || "",
            };
          }),
      };

      if (cleanedInvite.ownerId !== user.uid && !isAdmin) {
        setError("Tu n'as pas accès à cette invitation.");
        setSaving(false);
        return;
      }

      const docId = normalizedSlug;

      await saveDigitalInvite(docId, cleanedInvite);

      if (initialDocId && initialDocId !== docId) {
        await deleteDigitalInvite(initialDocId);
      }

      navigate(`/dashboard/invitations/${docId}/edit`, { replace: true });
      setInitialDocId(docId);
      setInvite(cleanedInvite);
    } catch (saveError) {
      setError("Impossible d'enregistrer cette invitation.");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setError("");

    const docId = initialDocId || invite.slug;

    if (!docId) {
      setError("Enregistre d'abord l'invitation avant de la publier.");
      return;
    }

    setSaving(true);

    try {
      await updateDigitalInvite(docId, { status: "published" });
      setInvite((currentInvite) => ({ ...currentInvite, status: "published" }));
    } catch (publishError) {
      setError("Impossible de publier cette invitation.");
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = async () => {
    if (!publicUrl) {
      return;
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(publicUrl);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = publicUrl;
        textArea.setAttribute("readonly", "");
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (copyError) {
      setError("Impossible de copier le lien.");
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F6F4EF] font-urbanist">
        <p className="text-sm uppercase tracking-[0.18em] text-gray-500">Chargement</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F7F5] font-urbanist text-[#141414]">
      <header className="border-b border-[#D8DDE2] bg-white px-5 py-4">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap gap-2 text-sm font-semibold">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 border border-[#D8DDE2] px-3 py-2 text-gray-600"
              >
                <FiArrowLeft aria-hidden="true" /> Retour
              </button>
              <Link to="/dashboard" className="inline-flex items-center gap-2 border border-[#D8DDE2] px-3 py-2 text-gray-600">
                <FiFileText aria-hidden="true" /> Dashboard
              </Link>
              <Link to="/" className="inline-flex items-center gap-2 border border-[#D8DDE2] px-3 py-2 text-gray-600">
                <FiHome aria-hidden="true" /> Site
              </Link>
            </div>
            <h1 className="mt-2 lw-page-lg">
              {isEditing ? "Modifier l'invitation" : "Nouvelle invitation"}
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            {dashboardPreviewPath ? (
              <Link
                to={dashboardPreviewPath}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-black px-4 py-2 text-sm font-semibold"
              >
                <FiExternalLink aria-hidden="true" /> Apercu
              </Link>
            ) : null}
            {isEditing && invite.status !== "published" ? (
              <button
                type="button"
                onClick={handlePublish}
                disabled={saving}
                className="inline-flex items-center gap-2 border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 disabled:cursor-not-allowed disabled:text-gray-400"
              >
                <FiUploadCloud aria-hidden="true" /> Publier
              </button>
            ) : null}
            <button
              type="submit"
              form="digital-invite-form"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-black px-5 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-white disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              <FiSave aria-hidden="true" /> {saving ? "Sauvegarde..." : "Enregistrer"}
            </button>
          </div>
        </div>
      </header>

      <form
        id="digital-invite-form"
        onSubmit={handleSubmit}
        className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-5 lg:grid-cols-[minmax(0,1fr)_310px]"
      >
        <section className="space-y-4">
          {error ? (
            <div className="border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          ) : null}

          <EditorSection icon={FiSettings} title="Informations">
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Prénom de la mariée (Épouse)">
                <TextInput
                  value={wife}
                  onChange={(event) => {
                    const newWife = event.target.value;
                    updateInvite("coupleNames", newWife || husband ? `${newWife} & ${husband}` : "");
                  }}
                  onBlur={handleCoupleBlur}
                  placeholder="Sarah"
                  required
                />
              </Field>
              <Field label="Prénom du marié (Époux)">
                <TextInput
                  value={husband}
                  onChange={(event) => {
                    const newHusband = event.target.value;
                    updateInvite("coupleNames", wife || newHusband ? `${wife} & ${newHusband}` : "");
                  }}
                  onBlur={handleCoupleBlur}
                  placeholder="Hedi"
                  required
                />
              </Field>
              <Field label="Slug du lien">
                <TextInput
                  value={invite.slug}
                  onChange={(event) => updateInvite("slug", slugify(event.target.value))}
                  placeholder="bilel-dorra"
                  required
                />
              </Field>
              <Field label="Email client (espace RSVP)">
                <TextInput
                  type="email"
                  value={invite.clientEmail || ""}
                  onChange={(event) =>
                    updateInvite("clientEmail", event.target.value.trim().toLowerCase())
                  }
                  placeholder="client@email.com"
                />
              </Field>
              <Field label="UID client Firebase (optionnel)">
                <TextInput
                  value={invite.clientUserId || ""}
                  onChange={(event) => updateInvite("clientUserId", event.target.value.trim())}
                  placeholder="uid Auth du client"
                />
              </Field>
              <Field label="Template">
                <select
                  value={invite.template}
                  onChange={(event) => handleTemplateChange(event.target.value)}
                  className="w-full border border-[#D8DDE2] bg-white px-3 py-2 text-sm outline-none focus:border-black"
                >
                  {digitalInviteTemplates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.label}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="flex items-end">
                <div className={`w-full border px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] ${
                  invite.status === "published"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-amber-200 bg-amber-50 text-amber-800"
                }`}>
                  {invite.status === "published" ? "Publiee" : "Brouillon"}
                </div>
              </div>
            </div>
          </EditorSection>

          <EditorSection icon={FiLayers} title="Blocs (choix client)">
            <p className="mb-3 text-xs text-gray-600">
              Active ou désactive les sections. L&apos;aperçu se met à jour tout de suite.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {templateSections.map((section) => {
                const enabled = isSectionActive(previewInvite, section.id);
                return (
                  <label
                    key={section.id}
                    className={`flex items-center justify-between gap-2 border px-3 py-2 ${
                      section.required
                        ? "border-[#E4E8EA] bg-[#F9FAF8] opacity-80"
                        : "border-[#D8DDE2] bg-white"
                    }`}
                  >
                    <span className="text-xs font-semibold text-gray-800">
                      {section.label}
                      {section.required ? (
                        <span className="ml-1.5 text-[10px] font-medium uppercase tracking-wide text-gray-400">
                          requis
                        </span>
                      ) : null}
                    </span>
                    <input
                      type="checkbox"
                      checked={enabled}
                      disabled={section.required}
                      onChange={(event) =>
                        handleSectionToggle(section.id, event.target.checked)
                      }
                      className="h-4 w-4 accent-black"
                    />
                  </label>
                );
              })}
            </div>
          </EditorSection>

          <EditorSection icon={FiEdit2} title="Contenu">
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Titre">
                <TextInput
                  value={invite.title}
                  onChange={(event) => updateInvite("title", event.target.value)}
                  required
                />
              </Field>
              <Field label="RSVP">
                <select
                  value={invite.rsvpEnabled ? "yes" : "no"}
                  onChange={(event) => updateInvite("rsvpEnabled", event.target.value === "yes")}
                  className="w-full border border-[#D8DDE2] bg-white px-3 py-2 text-sm outline-none focus:border-black"
                >
                  <option value="yes">Actif</option>
                  <option value="no">Masque</option>
                </select>
              </Field>
              {isSidiBouSaid && (
                <Field label="Ouverture Vidéo">
                  <select
                    value={invite.videoIntroEnabled !== false ? "yes" : "no"}
                    onChange={(event) => updateInvite("videoIntroEnabled", event.target.value === "yes")}
                    className="w-full border border-[#D8DDE2] bg-white px-3 py-2 text-sm outline-none focus:border-black"
                  >
                    <option value="yes">Actif</option>
                    <option value="no">Masque</option>
                  </select>
                </Field>
              )}
            </div>
          </EditorSection>

          {templateTextFields.length > 0 ? (
            <EditorSection icon={FiFileText} title="Textes de l'invitation">
              <p className="mb-3 text-xs text-gray-600">
                Modifie les libellés de ce template. Laisse un champ vide pour garder le texte d&apos;origine.
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                {templateTextFields.map((field) => {
                  const value =
                    invite.texts && typeof invite.texts === "object"
                      ? invite.texts[field.key] ?? ""
                      : "";
                  return (
                    <Field key={field.key} label={field.label}>
                      {field.multiline ? (
                        <textarea
                          value={value}
                          onChange={(event) => updateInviteText(field.key, event.target.value)}
                          rows={3}
                          className="w-full border border-[#D8DDE2] bg-white px-3 py-2 text-sm outline-none focus:border-black"
                        />
                      ) : (
                        <TextInput
                          value={value}
                          onChange={(event) => updateInviteText(field.key, event.target.value)}
                        />
                      )}
                    </Field>
                  );
                })}
              </div>
            </EditorSection>
          ) : null}

          {templateMediaFields.length > 0 ? (
            <EditorSection icon={FiImage} title="Images & son">
              <p className="mb-3 text-xs text-gray-600">
                Colle une URL ou uploade un fichier. Champ vide = média d&apos;origine du template.
              </p>
              <div className="grid gap-4">
                {templateMediaFields.map((field) => {
                  const value =
                    invite.media && typeof invite.media === "object"
                      ? invite.media[field.key] ?? ""
                      : "";
                  const isAudio = field.kind === "audio";
                  const busy = uploadingKey === field.key;
                  return (
                    <div
                      key={field.key}
                      className="grid gap-2 border border-[#E4E8EA] bg-[#FCFCFB] p-3 md:grid-cols-[1fr_auto] md:items-end"
                    >
                      <Field label={field.label}>
                        <div className="flex items-center gap-2">
                          {isAudio ? (
                            <FiMusic className="shrink-0 text-gray-400" aria-hidden />
                          ) : (
                            <FiImage className="shrink-0 text-gray-400" aria-hidden />
                          )}
                          <TextInput
                            value={value}
                            placeholder={isAudio ? "https://…/musique.mp3" : "https://…/photo.jpg"}
                            onChange={(event) => updateInviteMedia(field.key, event.target.value)}
                          />
                        </div>
                      </Field>
                      <label className="inline-flex cursor-pointer items-center justify-center gap-2 border border-[#D8DDE2] bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:border-black">
                        <FiUploadCloud aria-hidden />
                        {busy ? "Upload…" : "Fichier"}
                        <input
                          type="file"
                          accept={isAudio ? "audio/*" : "image/*"}
                          className="hidden"
                          disabled={busy}
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            handleMediaUpload(field, file);
                            event.target.value = "";
                          }}
                        />
                      </label>
                      {!isAudio && value ? (
                        <div className="md:col-span-2">
                          <img
                            src={value}
                            alt=""
                            className="mt-1 h-20 w-auto max-w-full rounded border border-[#E4E8EA] object-cover"
                          />
                        </div>
                      ) : null}
                      {isAudio && value ? (
                        <audio controls src={value} className="mt-1 w-full md:col-span-2" preload="none" />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </EditorSection>
          ) : null}

          {!isSidiBouSaid && (
            <EditorSection icon={FiMapPin} title="Date et lieu">
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Date">
                  <TextInput
                    type="date"
                    value={invite.eventDate}
                    onChange={(event) => handleDateChange(event.target.value)}
                    required
                  />
                </Field>
                <Field label="Heure">
                  <TextInput
                    value={invite.time}
                    onChange={(event) => updateInvite("time", event.target.value)}
                    placeholder="19H00"
                  />
                </Field>
                <Field label="Ville">
                  <TextInput
                    value={invite.city}
                    onChange={(event) => updateInvite("city", event.target.value)}
                  />
                </Field>
                <Field label="Nom du lieu">
                  <TextInput
                    value={invite.venueName}
                    onChange={(event) => updateInvite("venueName", event.target.value)}
                  />
                </Field>
                <Field label="Label lieu">
                  <TextInput
                    value={invite.locationLabel}
                    onChange={(event) => updateInvite("locationLabel", event.target.value)}
                    placeholder="MALAGA"
                  />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Lien Google Maps">
                    <TextInput
                      value={invite.mapUrl}
                      onChange={(event) => updateInvite("mapUrl", event.target.value)}
                      placeholder="https://maps.google.com"
                    />
                  </Field>
                </div>
              </div>
            </EditorSection>
          )}

          <EditorSection
            icon={FiClock}
            title={isSidiBouSaid ? "Celebrations" : "Timeline"}
            action={
              <button
                type="button"
                onClick={addTimelineItem}
                disabled={timelineItems.length >= maxTimelineItems}
                className="inline-flex items-center gap-2 border border-black px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
              >
                <FiPlus aria-hidden="true" /> {isSidiBouSaid ? "Add Event" : "Ajouter une etape"}
              </button>
            }
          >
            <div className="space-y-6">
              {timelineItems.map((item, index) => (
                <div 
                  key={index} 
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`border border-[#E4E8EA] bg-[#FCFCFB] p-6 space-y-4 relative transition-all ${
                    draggedIndex === index ? "opacity-40 border-dashed border-blue-500 scale-[0.98]" : ""
                  }`}
                >
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <div 
                      className="flex items-center gap-2 cursor-pointer select-none grow"
                      onClick={() => toggleEvent(index)}
                    >
                      <FiMove className="text-gray-400 cursor-move shrink-0 hover:text-black animate-pulse" title="Faites glisser pour réorganiser" />
                      {openEvents[index] ? (
                        <FiChevronDown className="text-gray-500 shrink-0" />
                      ) : (
                        <FiChevronRight className="text-gray-500 shrink-0" />
                      )}
                      <h3 className="font-semibold text-lg">
                        {isSidiBouSaid
                          ? `Event ${index + 1} : ${item.title || "New Event"}`
                          : `Etape ${index + 1} : ${
                              fixedTimelineSteps.find(
                                (s) => s.image === getTimelineStepKey(item, index)
                              )?.title || "Nouvelle étape"
                            }`}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTimelineItem(index)}
                      disabled={timelineItems.length <= 1}
                      title="Supprimer"
                      aria-label={`Supprimer l'etape ${index + 1}`}
                      className="inline-flex h-8 w-8 items-center justify-center border border-red-200 text-red-700 hover:border-red-500 disabled:cursor-not-allowed disabled:text-gray-400"
                    >
                      <FiTrash2 aria-hidden="true" className="w-4 h-4" />
                    </button>
                  </div>

                  {openEvents[index] && (
                    isSidiBouSaid ? (
                      <div className="grid gap-3 md:grid-cols-2">
                        <Field label="Title (English)">
                          <TextInput
                            value={item.title || ""}
                            onChange={(event) => updateTimelineItem(index, "title", event.target.value)}
                          />
                        </Field>
                        <Field label="Title (Arabic)">
                          <TextInput
                            value={item.titleAr || ""}
                            onChange={(event) => updateTimelineItem(index, "titleAr", event.target.value)}
                          />
                        </Field>
                        <Field label="Date (YYYY-MM-DD)">
                          <TextInput
                            type="date"
                            value={item.date || ""}
                            onChange={(event) => updateTimelineItem(index, "date", event.target.value)}
                          />
                        </Field>
                        <Field label="Time">
                          <TextInput
                            value={item.time || ""}
                            onChange={(event) => updateTimelineItem(index, "time", event.target.value)}
                          />
                        </Field>
                        <Field label="Venue Name">
                          <TextInput
                            value={item.venue || ""}
                            onChange={(event) => updateTimelineItem(index, "venue", event.target.value)}
                          />
                        </Field>
                        <Field label="City">
                          <TextInput
                            value={item.city || ""}
                            onChange={(event) => updateTimelineItem(index, "city", event.target.value)}
                          />
                        </Field>
                        <div className="md:col-span-2">
                          <Field label="Google Maps URL">
                            <TextInput
                              value={item.mapUrl || ""}
                              onChange={(event) => updateTimelineItem(index, "mapUrl", event.target.value)}
                              placeholder="https://maps.google.com"
                            />
                          </Field>
                        </div>
                      </div>
                    ) : (
                      <div className="grid gap-3 md:grid-cols-[1fr_0.7fr] md:items-end">
                        <Field label="Etape">
                          <select
                            value={getTimelineStepKey(item, index)}
                            onChange={(event) => updateTimelineItem(index, "step", event.target.value)}
                            className="w-full border border-[#D8DDE2] bg-white px-3 py-2 text-sm outline-none focus:border-black"
                          >
                            {fixedTimelineSteps.map((step) => (
                              <option key={step.image} value={step.image}>
                                {step.title}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Heure">
                          <TextInput
                            value={item.time}
                            onChange={(event) => updateTimelineItem(index, "time", event.target.value)}
                          />
                        </Field>
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          </EditorSection>

          {isSidiBouSaid && (
            <>
              <EditorSection icon={FiFileText} title="Dress Code">
                <Field label="Description Dress Code">
                  <TextInput
                    value={invite.dressCodeText || "We Request Attending The Outeya\nWith A Traditional Attire"}
                    onChange={(event) => updateInvite("dressCodeText", event.target.value)}
                    placeholder="We Request Attending The Outeya\nWith A Traditional Attire"
                  />
                </Field>
              </EditorSection>

              <EditorSection icon={FiClock} title="Programme">
                <div className="grid gap-4">
                  {(invite.programmeSteps || [
                    { time: "17:00", name: "Sdek" },
                    { time: "18:00", name: "Reception" },
                    { time: "20:00", name: "Dinner" },
                    { time: "00:00", name: "Dance" },
                  ]).map((step, index) => (
                    <div key={index} className="border p-4 rounded-md grid gap-3 md:grid-cols-2 bg-gray-50/50">
                      <span className="font-semibold text-sm md:col-span-2 text-gray-700">Etape {index + 1}</span>
                      <Field label="Heure">
                        <TextInput
                          value={step.time}
                          onChange={(event) => {
                            const steps = [...(invite.programmeSteps || [
                              { time: "17:00", name: "Sdek" },
                              { time: "18:00", name: "Reception" },
                              { time: "20:00", name: "Dinner" },
                              { time: "00:00", name: "Dance" },
                            ])];
                            steps[index] = { ...steps[index], time: event.target.value };
                            updateInvite("programmeSteps", steps);
                          }}
                        />
                      </Field>
                      <Field label="Nom">
                        <TextInput
                          value={step.name}
                          onChange={(event) => {
                            const steps = [...(invite.programmeSteps || [
                              { time: "17:00", name: "Sdek" },
                              { time: "18:00", name: "Reception" },
                              { time: "20:00", name: "Dinner" },
                              { time: "00:00", name: "Dance" },
                            ])];
                            steps[index] = { ...steps[index], name: event.target.value };
                            updateInvite("programmeSteps", steps);
                          }}
                        />
                      </Field>
                    </div>
                  ))}
                </div>
              </EditorSection>
            </>
          )}
        </section>

        <aside className="flex h-fit flex-col gap-3 lg:sticky lg:top-3">
          <div className="border border-[#D8DDE2] bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                  Aperçu live
                </p>
                <h2 className="mt-0.5 text-sm font-semibold">{selectedTemplate.label}</h2>
              </div>
              <span
                className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                  invite.status === "published"
                    ? "bg-emerald-50 text-emerald-800"
                    : "bg-amber-50 text-amber-800"
                }`}
              >
                {invite.status === "published" ? "Publiée" : "Brouillon"}
              </span>
            </div>

            {/* Pro Max ratio, scaled ~270×587 — scroll sans barre */}
            <div className="mt-3 flex justify-center">
              <div
                className="overflow-hidden rounded-[28px] border-[#1a1a1a] bg-[#1a1a1a] shadow-md"
                style={{
                  width: PREVIEW_PHONE_W + PREVIEW_FRAME_BORDER * 2,
                  borderWidth: PREVIEW_FRAME_BORDER,
                }}
              >
                <div
                  data-invite-preview-scroll
                  className="hide-scrollbar overflow-x-hidden overflow-y-auto bg-white"
                  style={{
                    width: PREVIEW_PHONE_W,
                    height: PREVIEW_PHONE_H,
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  <div style={{ width: PREVIEW_DESIGN_W, zoom: PREVIEW_SCALE }}>
                    {PreviewComponent ? (
                      <PreviewComponent invite={previewInvite} previewMode />
                    ) : (
                      <p className="p-4 text-sm text-gray-500">Aperçu indisponible.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-[#D8DDE2] bg-white p-3 shadow-sm">
            <h3 className="inline-flex items-center gap-2 text-sm font-semibold">
              <FiLink aria-hidden="true" /> Lien public
            </h3>
            <p className="mt-2 break-all text-xs text-gray-600">
              {publicUrl || "Le lien apparaîtra après avoir ajouté un slug."}
            </p>
            <div className="mt-3 grid gap-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 bg-black px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                <FiSave aria-hidden="true" /> {saving ? "Sauvegarde..." : "Enregistrer"}
              </button>
              {publicPath ? (
                <>
                  <Link
                    to={dashboardPreviewPath}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 border border-black px-5 py-3 text-center text-sm font-semibold"
                  >
                    <FiExternalLink aria-hidden="true" /> Ouvrir l&apos;aperçu
                  </Link>
                  {invite.status !== "published" ? (
                    <button
                      type="button"
                      onClick={handlePublish}
                      disabled={saving}
                      className="inline-flex items-center justify-center gap-2 border border-emerald-600 px-5 py-3 text-sm font-semibold text-emerald-700 disabled:cursor-not-allowed disabled:text-gray-400"
                    >
                      <FiUploadCloud aria-hidden="true" /> Publier
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center justify-center gap-2 border border-[#D8DDE2] px-5 py-3 text-sm font-semibold"
                  >
                    {copied ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
                    {copied ? "Lien copié" : "Copier le lien"}
                  </button>
                </>
              ) : null}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-gray-600">
                <div className="border border-[#E4E8EA] p-3">
                  <div className="mb-1 flex items-center gap-2 font-semibold text-gray-900">
                    <FiCalendar aria-hidden="true" /> Date
                  </div>
                  {formatDateLabel(invite.eventDate) || "Non définie"}
                </div>
                <div className="border border-[#E4E8EA] p-3">
                  <div className="mb-1 flex items-center gap-2 font-semibold text-gray-900">
                    <FiMapPin aria-hidden="true" /> Lieu
                  </div>
                  {invite.city || "Non défini"}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </form>
    </main>
  );
}

export default DigitalInviteEditorPage;
