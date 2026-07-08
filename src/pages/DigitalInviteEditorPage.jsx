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
  getDefaultDigitalInviteTemplate,
  getDigitalInviteTemplate,
} from "../templates/digitalInviteTemplates";

const defaultTemplate = getDefaultDigitalInviteTemplate();

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
      <span className="mb-2 block text-sm font-semibold text-gray-700">{label}</span>
      {children}
    </label>
  );
}

function TextInput(props) {
  return (
    <input
      {...props}
      className="w-full border border-[#D8DDE2] bg-white px-4 py-3 text-base outline-none focus:border-black"
    />
  );
}

function SectionHeader({ icon: Icon, title, action }) {
  return (
    <div className="flex flex-col gap-3 border-b border-[#E4E8EA] bg-[#F9FAF8] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="inline-flex items-center gap-3 font-abhaya text-3xl leading-none">
        <span className="inline-flex h-9 w-9 items-center justify-center border border-[#D8DDE2] bg-white text-base">
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
      <div className="p-5">{children}</div>
    </div>
  );
}

function DigitalInviteEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [invite, setInvite] = useState(() =>
    createDigitalInviteDraft(defaultTemplate.defaults)
  );
  const [initialDocId, setInitialDocId] = useState(id || "");
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

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

        const loadedTemplate = getDigitalInviteTemplate(loadedInvite.template) || defaultTemplate;

        setInvite({
          ...createDigitalInviteDraft(loadedTemplate.defaults),
          ...loadedInvite,
          timeline: loadedInvite.timeline?.length
            ? loadedInvite.timeline
            : loadedTemplate.defaults.timeline,
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
  }, [id]);

  const publicPath = useMemo(() => {
    if (!invite.slug) {
      return "";
    }

    return `/e/${invite.slug}`;
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
  const isSidiBouSaid = invite.template === "sidi-bousaid";
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

  const updateTimelineItem = (index, key, value) => {
    setInvite((currentInvite) => ({
      ...currentInvite,
      timeline: currentInvite.timeline.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      ),
    }));
  };

  const addTimelineItem = () => {
    setInvite((currentInvite) => {
      const isSidi = currentInvite.template === "sidi-bousaid";
      const newItem = isSidi
        ? { title: "New Event", titleAr: "حدث جديد", date: currentInvite.eventDate || "", time: "19:00", venue: currentInvite.venueName || "", city: currentInvite.city || "", mapUrl: currentInvite.mapUrl || "" }
        : { step: getNextTimelineStepKey(currentInvite.timeline), time: "" };

      const maxLimit = isSidi ? 3 : maxTimelineItems;
      return {
        ...currentInvite,
        timeline:
          currentInvite.timeline.length >= maxLimit
            ? currentInvite.timeline
            : [...currentInvite.timeline, newItem],
      };
    });
  };

  const removeTimelineItem = (index) => {
    setInvite((currentInvite) => ({
      ...currentInvite,
      timeline: currentInvite.timeline.filter((item, itemIndex) => itemIndex !== index),
    }));
  };

  const handleTemplateChange = (templateId) => {
    const nextTemplate = getDigitalInviteTemplate(templateId);

    setInvite((currentInvite) => ({
      ...currentInvite,
      template: templateId,
      timeline: nextTemplate.defaults.timeline,
    }));
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
      const cleanedInvite = {
        ...inviteFields,
        slug: normalizedSlug,
        template: selectedTemplate.id,
        timeline: invite.timeline
          .slice(0, maxTimelineItems)
          .map((item, index) => ({
            step: getTimelineStepKey(item, index),
            time: item.time || "",
          })),
      };
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
            <h1 className="mt-2 font-abhaya text-4xl leading-none">
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
        className="mx-auto grid w-full max-w-6xl gap-6 px-5 py-8 lg:grid-cols-[1fr_360px]"
      >
        <section className="space-y-6">
          {error ? (
            <div className="border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          ) : null}

          <EditorSection icon={FiSettings} title="Informations">
            <div className="grid gap-4 md:grid-cols-2">
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
              <Field label="Template">
                <select
                  value={invite.template}
                  onChange={(event) => handleTemplateChange(event.target.value)}
                  className="w-full border border-[#D8DDE2] bg-white px-4 py-3 text-base outline-none focus:border-black"
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

          <EditorSection icon={FiEdit2} title="Contenu">
            <div className="grid gap-4 md:grid-cols-2">
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
                  className="w-full border border-[#D8DDE2] bg-white px-4 py-3 text-base outline-none focus:border-black"
                >
                  <option value="yes">Actif</option>
                  <option value="no">Masque</option>
                </select>
              </Field>
            </div>
          </EditorSection>

          <EditorSection icon={FiMapPin} title="Date et lieu">
            <div className="grid gap-4 md:grid-cols-2">
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

          <EditorSection
            icon={FiClock}
            title={isSidiBouSaid ? "Celebrations" : "Timeline"}
            action={
              <button
                type="button"
                onClick={addTimelineItem}
                disabled={invite.timeline.length >= maxTimelineItems}
                className="inline-flex items-center gap-2 border border-black px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
              >
                <FiPlus aria-hidden="true" /> {isSidiBouSaid ? "Add Event" : "Ajouter une etape"}
              </button>
            }
          >
            <div className="space-y-6">
              {invite.timeline.map((item, index) => (
                <div key={index} className="border border-[#E4E8EA] bg-[#FCFCFB] p-6 space-y-4 relative">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <h3 className="font-semibold text-lg">
                      {isSidiBouSaid ? `Event ${index + 1} : ${item.title || "New Event"}` : `Etape ${index + 1}`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeTimelineItem(index)}
                      disabled={invite.timeline.length <= 1}
                      title="Supprimer"
                      aria-label={`Supprimer l'etape ${index + 1}`}
                      className="inline-flex h-8 w-8 items-center justify-center border border-red-200 text-red-700 hover:border-red-500 disabled:cursor-not-allowed disabled:text-gray-400"
                    >
                      <FiTrash2 aria-hidden="true" className="w-4 h-4" />
                    </button>
                  </div>

                  {isSidiBouSaid ? (
                    <div className="grid gap-4 md:grid-cols-2">
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
                          className="w-full border border-[#D8DDE2] bg-white px-4 py-3 text-base outline-none focus:border-black"
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
                  )}
                </div>
              ))}
            </div>
          </EditorSection>
        </section>

        <aside className="h-fit border border-[#D8DDE2] bg-white p-5 shadow-sm lg:sticky lg:top-6">
          <h2 className="font-abhaya text-3xl">{selectedTemplate.label}</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">{selectedTemplate.description}</p>
          <div className="my-5 h-px bg-[#E4E8EA]" />
          <h3 className="inline-flex items-center gap-2 font-abhaya text-2xl">
            <FiLink aria-hidden="true" /> Lien public
          </h3>
          <p className="mt-3 break-all text-sm text-gray-600">
            {publicUrl || "Le lien apparaitra apres avoir ajoute un slug."}
          </p>
          <div className="mt-5 grid gap-3">
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
                  <FiExternalLink aria-hidden="true" /> Ouvrir l'apercu
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
                  {copied ? "Lien copie" : "Copier le lien"}
                </button>
              </>
            ) : null}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-gray-600">
              <div className="border border-[#E4E8EA] p-3">
                <div className="mb-1 flex items-center gap-2 font-semibold text-gray-900">
                  <FiCalendar aria-hidden="true" /> Date
                </div>
                {formatDateLabel(invite.eventDate) || "Non definie"}
              </div>
              <div className="border border-[#E4E8EA] p-3">
                <div className="mb-1 flex items-center gap-2 font-semibold text-gray-900">
                  <FiMapPin aria-hidden="true" /> Lieu
                </div>
                {invite.city || "Non defini"}
              </div>
            </div>
          </div>
        </aside>
      </form>
    </main>
  );
}

export default DigitalInviteEditorPage;
