import DolceVitaInvitePage from "../pages/DolceVitaInvitePage";
import SidiBouSaidInvitePage from "../pages/SidiBouSaidInvitePage";
import dolceVitaTemplate from "../data/digital/templates/dolce-vita.json";
import sidiBouSaidTemplate from "../data/digital/templates/sidi-bousaid.json";

export const DIGITAL_TEMPLATE_IDS = {
  DOLCE_VITA: dolceVitaTemplate.id,
  SIDI_BOUSAID: sidiBouSaidTemplate.id,
};

export const digitalInviteTemplates = [
  {
    id: dolceVitaTemplate.id,
    label: dolceVitaTemplate.label,
    description: dolceVitaTemplate.description,
    Component: DolceVitaInvitePage,
    defaults: dolceVitaTemplate.defaults,
    fixedTimelineSteps: dolceVitaTemplate.fixedTimelineSteps,
  },
  {
    id: sidiBouSaidTemplate.id,
    label: sidiBouSaidTemplate.label,
    description: sidiBouSaidTemplate.description,
    Component: SidiBouSaidInvitePage,
    defaults: sidiBouSaidTemplate.defaults,
    fixedTimelineSteps: sidiBouSaidTemplate.fixedTimelineSteps,
  },
];

export function getDigitalInviteTemplate(templateId) {
  return digitalInviteTemplates.find((template) => template.id === templateId) || null;
}

export function getDefaultDigitalInviteTemplate() {
  return digitalInviteTemplates[0];
}
