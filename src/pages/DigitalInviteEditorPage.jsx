import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createDigitalInviteDraft,
  deleteDigitalInvite,
  getDigitalInviteById,
  saveDigitalInvite,
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
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      {children}
    </label>
  );
}

function TextInput(props) {
  return (
    <input
      {...props}
      className="w-full border border-[#D7CEC3] bg-white px-4 py-3 text-base outline-none focus:border-black"
    />
  );
}

function TextArea(props) {
  return (
    <textarea
      {...props}
      className="min-h-28 w-full resize-y border border-[#D7CEC3] bg-white px-4 py-3 text-base outline-none focus:border-black"
    />
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

  const selectedTemplate = getDigitalInviteTemplate(invite.template) || defaultTemplate;

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
    setInvite((currentInvite) => ({
      ...currentInvite,
      timeline: [...currentInvite.timeline, { time: "", title: "", subtitle: "" }],
    }));
  };

  const removeTimelineItem = (index) => {
    setInvite((currentInvite) => ({
      ...currentInvite,
      timeline: currentInvite.timeline.filter((item, itemIndex) => itemIndex !== index),
    }));
  };

  const handleTemplateChange = (templateId) => {
    const nextTemplate = getDigitalInviteTemplate(templateId);

    if (!nextTemplate) {
      return;
    }

    setInvite((currentInvite) => ({
      ...nextTemplate.defaults,
      ...currentInvite,
      template: nextTemplate.id,
      timeline: currentInvite.timeline?.length
        ? currentInvite.timeline
        : nextTemplate.defaults.timeline,
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
      dateLabel: currentInvite.dateLabel || formatDateLabel(dateValue),
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
      const cleanedInvite = {
        ...inviteFields,
        slug: normalizedSlug,
        template: selectedTemplate.id,
        timeline: invite.timeline.filter(
          (item) => item.time || item.title || item.subtitle
        ),
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

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F6F4EF] font-urbanist">
        <p className="text-sm uppercase tracking-[0.18em] text-gray-500">Chargement</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F4EF] font-urbanist text-[#141414]">
      <header className="border-b border-[#D8C9B8] bg-white px-5 py-4">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap gap-3 text-sm font-semibold text-gray-500">
              <button type="button" onClick={() => navigate(-1)}>
                Retour
              </button>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/">Site Lovely Wedding</Link>
            </div>
            <h1 className="mt-2 font-abhaya text-4xl leading-none">
              {isEditing ? "Modifier l'invitation" : "Nouvelle invitation"}
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            {publicPath ? (
              <Link
                to={publicPath}
                target="_blank"
                rel="noreferrer"
                className="border border-black px-4 py-2 text-sm font-semibold"
              >
                Apercu
              </Link>
            ) : null}
            <button
              type="submit"
              form="digital-invite-form"
              disabled={saving}
              className="bg-black px-5 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-white disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {saving ? "Sauvegarde..." : "Enregistrer"}
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

          <div className="border border-[#D8C9B8] bg-white p-5">
            <h2 className="font-abhaya text-3xl">Informations</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field label="Noms du couple">
                <TextInput
                  value={invite.coupleNames}
                  onChange={(event) => updateInvite("coupleNames", event.target.value)}
                  onBlur={handleCoupleBlur}
                  placeholder="Bilel & Dorra"
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
                  className="w-full border border-[#D7CEC3] bg-white px-4 py-3 text-base outline-none focus:border-black"
                >
                  {digitalInviteTemplates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Status">
                <select
                  value={invite.status}
                  onChange={(event) => updateInvite("status", event.target.value)}
                  className="w-full border border-[#D7CEC3] bg-white px-4 py-3 text-base outline-none focus:border-black"
                >
                  <option value="draft">Brouillon</option>
                  <option value="published">Publiee</option>
                </select>
              </Field>
            </div>
          </div>

          <div className="border border-[#D8C9B8] bg-white p-5">
            <h2 className="font-abhaya text-3xl">Contenu</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field label="Titre">
                <TextInput
                  value={invite.title}
                  onChange={(event) => updateInvite("title", event.target.value)}
                  required
                />
              </Field>
              <Field label="Petit titre">
                <TextInput
                  value={invite.introLabel}
                  onChange={(event) => updateInvite("introLabel", event.target.value)}
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="Texte d'introduction">
                  <TextArea
                    value={invite.introText}
                    onChange={(event) => updateInvite("introText", event.target.value)}
                  />
                </Field>
              </div>
              <Field label="Texte final">
                <TextInput
                  value={invite.closingText}
                  onChange={(event) => updateInvite("closingText", event.target.value)}
                />
              </Field>
              <Field label="RSVP">
                <select
                  value={invite.rsvpEnabled ? "yes" : "no"}
                  onChange={(event) => updateInvite("rsvpEnabled", event.target.value === "yes")}
                  className="w-full border border-[#D7CEC3] bg-white px-4 py-3 text-base outline-none focus:border-black"
                >
                  <option value="yes">Actif</option>
                  <option value="no">Masque</option>
                </select>
              </Field>
            </div>
          </div>

          <div className="border border-[#D8C9B8] bg-white p-5">
            <h2 className="font-abhaya text-3xl">Date et lieu</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field label="Date">
                <TextInput
                  type="date"
                  value={invite.eventDate}
                  onChange={(event) => handleDateChange(event.target.value)}
                  required
                />
              </Field>
              <Field label="Date affichee">
                <TextInput
                  value={invite.dateLabel}
                  onChange={(event) => updateInvite("dateLabel", event.target.value)}
                  placeholder="12.08.2026"
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
          </div>

          <div className="border border-[#D8C9B8] bg-white p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-abhaya text-3xl">Timeline</h2>
              <button
                type="button"
                onClick={addTimelineItem}
                className="border border-black px-4 py-2 text-sm font-semibold"
              >
                Ajouter une etape
              </button>
            </div>
            <div className="mt-5 space-y-4">
              {invite.timeline.map((item, index) => (
                <div key={index} className="grid gap-3 md:grid-cols-[0.5fr_1fr_1fr_auto] md:items-end">
                  <Field label={`Heure ${index + 1}`}>
                    <TextInput
                      value={item.time}
                      onChange={(event) => updateTimelineItem(index, "time", event.target.value)}
                    />
                  </Field>
                  <Field label="Titre">
                    <TextInput
                      value={item.title}
                      onChange={(event) => updateTimelineItem(index, "title", event.target.value)}
                    />
                  </Field>
                  <Field label="Sous-titre">
                    <TextInput
                      value={item.subtitle}
                      onChange={(event) =>
                        updateTimelineItem(index, "subtitle", event.target.value)
                      }
                    />
                  </Field>
                  <button
                    type="button"
                    onClick={() => removeTimelineItem(index)}
                    disabled={invite.timeline.length <= 1}
                    className="border border-red-200 px-3 py-3 text-sm font-semibold text-red-700 disabled:cursor-not-allowed disabled:text-gray-400"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="h-fit border border-[#D8C9B8] bg-white p-5 lg:sticky lg:top-6">
          <h2 className="font-abhaya text-3xl">{selectedTemplate.label}</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">{selectedTemplate.description}</p>
          <div className="my-5 h-px bg-[#E5DCD1]" />
          <h3 className="font-abhaya text-2xl">Lien public</h3>
          <p className="mt-3 break-all text-sm text-gray-600">
            {publicPath || "Le lien apparaitra apres avoir ajoute un slug."}
          </p>
          <div className="mt-5 grid gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-black px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {saving ? "Sauvegarde..." : "Enregistrer"}
            </button>
            {publicPath ? (
              <Link
                to={publicPath}
                target="_blank"
                rel="noreferrer"
                className="border border-black px-5 py-3 text-center text-sm font-semibold"
              >
                Ouvrir l'apercu
              </Link>
            ) : null}
          </div>
        </aside>
      </form>
    </main>
  );
}

export default DigitalInviteEditorPage;
