import DolceVitaInvitePage from "../pages/DolceVitaInvitePage";

export const DIGITAL_TEMPLATE_IDS = {
  DOLCE_VITA: "dolce-vita",
};

export const defaultDolceVitaTimeline = [
  { time: "20h", title: "Accueil", subtitle: "des invites" },
  { time: "20h30", title: "Arrivee", subtitle: "des maries" },
  { time: "21h", title: "Contrat", subtitle: "de mariage" },
];

export const digitalInviteTemplates = [
  {
    id: DIGITAL_TEMPLATE_IDS.DOLCE_VITA,
    label: "Dolce Vita",
    description: "Landing page mobile avec compte a rebours, lieu, timeline et RSVP.",
    Component: DolceVitaInvitePage,
    defaults: {
      template: DIGITAL_TEMPLATE_IDS.DOLCE_VITA,
      status: "draft",
      title: "La Dolce Vita",
      coupleNames: "",
      introLabel: "We are getting married",
      introText: "",
      eventDate: "",
      dateLabel: "",
      venueName: "",
      city: "",
      locationLabel: "",
      time: "",
      mapUrl: "",
      rsvpEnabled: true,
      closingText: "",
      timeline: defaultDolceVitaTimeline,
    },
  },
];

export function getDigitalInviteTemplate(templateId) {
  return digitalInviteTemplates.find((template) => template.id === templateId) || null;
}

export function getDefaultDigitalInviteTemplate() {
  return digitalInviteTemplates[0];
}
