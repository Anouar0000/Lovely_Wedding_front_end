import ClubCapriInvitePage from "../pages/ClubCapriInvitePage";
import DolceVitaInvitePage from "../pages/DolceVitaInvitePage";
import SakuraKoiInvitePage from "../pages/SakuraKoiInvitePage";
import SidiBouSaidInvitePage from "../pages/SidiBouSaidInvitePage";
import BridgertonInvitePage from "../pages/BridgertonInvitePage";
import MajesticWhiteInvitePage from "../pages/MajesticWhiteInvitePage";
import clubCapriTemplate from "../data/digital/templates/club-capri.json";
import dolceVitaTemplate from "../data/digital/templates/dolce-vita.json";
import sakuraKoiTemplate from "../data/digital/templates/sakura-koi.json";
import sidiBouSaidTemplate from "../data/digital/templates/sidi-bousaid.json";
import bridgertonTemplate from "../data/digital/templates/bridgerton.json";
import majesticWhiteTemplate from "../data/digital/templates/majestic-white.json";
import {
  TEMPLATE_SECTIONS,
  getDefaultActiveSections,
  getTemplateSections,
  isSectionActive,
  toggleInviteSection,
  withActiveSections,
} from "./digitalInviteSections";

export const DIGITAL_TEMPLATE_IDS = {
  DOLCE_VITA: dolceVitaTemplate.id,
  SIDI_BOUSAID: sidiBouSaidTemplate.id,
  CLUB_CAPRI: clubCapriTemplate.id,
  SAKURA_KOI: sakuraKoiTemplate.id,
  BRIDGERTON: bridgertonTemplate.id,
  MAJESTIC_WHITE: majesticWhiteTemplate.id,
};

export {
  getDefaultActiveSections,
  getTemplateSections,
  isSectionActive,
  toggleInviteSection,
};

export const digitalInviteTemplates = [
  {
    id: clubCapriTemplate.id,
    label: clubCapriTemplate.label,
    description: clubCapriTemplate.description,
    Component: ClubCapriInvitePage,
    defaults: withActiveSections(clubCapriTemplate.sample, clubCapriTemplate.id),
    sections: TEMPLATE_SECTIONS[clubCapriTemplate.id],
    fixedTimelineSteps: clubCapriTemplate.fixedTimelineSteps || [],
  },
  {
    id: sakuraKoiTemplate.id,
    label: sakuraKoiTemplate.label,
    description: sakuraKoiTemplate.description,
    Component: SakuraKoiInvitePage,
    defaults: withActiveSections(sakuraKoiTemplate.sample, sakuraKoiTemplate.id),
    sections: TEMPLATE_SECTIONS[sakuraKoiTemplate.id],
    fixedTimelineSteps: sakuraKoiTemplate.fixedTimelineSteps || [],
  },
  {
    id: bridgertonTemplate.id,
    label: bridgertonTemplate.label,
    description: bridgertonTemplate.description,
    Component: BridgertonInvitePage,
    defaults: withActiveSections(
      bridgertonTemplate.sample || bridgertonTemplate.defaults,
      bridgertonTemplate.id
    ),
    sections: TEMPLATE_SECTIONS[bridgertonTemplate.id],
    fixedTimelineSteps: bridgertonTemplate.fixedTimelineSteps || [],
  },
  {
    id: majesticWhiteTemplate.id,
    label: majesticWhiteTemplate.label,
    description: majesticWhiteTemplate.description,
    Component: MajesticWhiteInvitePage,
    defaults: withActiveSections(
      majesticWhiteTemplate.sample || majesticWhiteTemplate.defaults,
      majesticWhiteTemplate.id
    ),
    sections: TEMPLATE_SECTIONS[majesticWhiteTemplate.id],
    fixedTimelineSteps: majesticWhiteTemplate.fixedTimelineSteps || [],
  },
  {
    id: dolceVitaTemplate.id,
    label: dolceVitaTemplate.label,
    description: dolceVitaTemplate.description,
    Component: DolceVitaInvitePage,
    defaults: withActiveSections(
      dolceVitaTemplate.defaults || dolceVitaTemplate.sample,
      dolceVitaTemplate.id
    ),
    sections: TEMPLATE_SECTIONS[dolceVitaTemplate.id],
    fixedTimelineSteps: dolceVitaTemplate.fixedTimelineSteps,
  },
  {
    id: sidiBouSaidTemplate.id,
    label: sidiBouSaidTemplate.label,
    description: sidiBouSaidTemplate.description,
    Component: SidiBouSaidInvitePage,
    defaults: withActiveSections(
      sidiBouSaidTemplate.defaults || sidiBouSaidTemplate.sample,
      sidiBouSaidTemplate.id
    ),
    sections: TEMPLATE_SECTIONS[sidiBouSaidTemplate.id],
    fixedTimelineSteps: sidiBouSaidTemplate.fixedTimelineSteps,
  },
];

export function getDigitalInviteTemplate(templateId) {
  return digitalInviteTemplates.find((template) => template.id === templateId) || null;
}

export function getDefaultDigitalInviteTemplate() {
  return digitalInviteTemplates[0];
}
