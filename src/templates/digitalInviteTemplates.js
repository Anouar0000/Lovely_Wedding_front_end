import DolceVitaInvitePage from "../pages/DolceVitaInvitePage";
import SidiBouSaidInvitePage from "../pages/SidiBouSaidInvitePage";
import BrezzaMarinaInvitePage from "../pages/BrezzaMarinaInvitePage";
import BridgertonInvitePage from "../pages/BridgertonInvitePage";
import CelestialInvitePage from "../pages/CelestialInvitePage";
import dolceVitaTemplate from "../data/digital/templates/dolce-vita.json";
import sidiBouSaidTemplate from "../data/digital/templates/sidi-bousaid.json";
import brezzaMarinaTemplate from "../data/digital/templates/brezza-marina.json";
import bridgertonTemplate from "../data/digital/templates/bridgerton.json";
import celestialTemplate from "../data/digital/templates/celestial.json";

export const DIGITAL_TEMPLATE_IDS = {
  DOLCE_VITA: dolceVitaTemplate.id,
  SIDI_BOUSAID: sidiBouSaidTemplate.id,
  BREZZA_MARINA: brezzaMarinaTemplate.id,
  BRIDGERTON: bridgertonTemplate.id,
  CELESTIAL: celestialTemplate.id,
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
  {
    id: brezzaMarinaTemplate.id,
    label: brezzaMarinaTemplate.label,
    description: brezzaMarinaTemplate.description,
    Component: BrezzaMarinaInvitePage,
    defaults: brezzaMarinaTemplate.defaults,
    fixedTimelineSteps: brezzaMarinaTemplate.fixedTimelineSteps,
  },
  {
    id: bridgertonTemplate.id,
    label: bridgertonTemplate.label,
    description: bridgertonTemplate.description,
    Component: BridgertonInvitePage,
    defaults: bridgertonTemplate.defaults,
    fixedTimelineSteps: bridgertonTemplate.fixedTimelineSteps,
  },
  {
    id: celestialTemplate.id,
    label: celestialTemplate.label,
    description: celestialTemplate.description,
    Component: CelestialInvitePage,
    defaults: celestialTemplate.defaults,
    fixedTimelineSteps: celestialTemplate.fixedTimelineSteps,
  },
];

export function getDigitalInviteTemplate(templateId) {
  return digitalInviteTemplates.find((template) => template.id === templateId) || null;
}

export function getDefaultDigitalInviteTemplate() {
  return digitalInviteTemplates[0];
}
