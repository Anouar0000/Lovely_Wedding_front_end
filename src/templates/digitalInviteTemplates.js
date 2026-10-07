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

export const DIGITAL_TEMPLATE_IDS = {
  DOLCE_VITA: dolceVitaTemplate.id,
  SIDI_BOUSAID: sidiBouSaidTemplate.id,
  CLUB_CAPRI: clubCapriTemplate.id,
  SAKURA_KOI: sakuraKoiTemplate.id,
  BRIDGERTON: bridgertonTemplate.id,
  MAJESTIC_WHITE: majesticWhiteTemplate.id,
};

export const digitalInviteTemplates = [
  {
    id: clubCapriTemplate.id,
    label: clubCapriTemplate.label,
    description: clubCapriTemplate.description,
    Component: ClubCapriInvitePage,
    defaults: clubCapriTemplate.sample,
    fixedTimelineSteps: clubCapriTemplate.fixedTimelineSteps || [],
  },
  {
    id: sakuraKoiTemplate.id,
    label: sakuraKoiTemplate.label,
    description: sakuraKoiTemplate.description,
    Component: SakuraKoiInvitePage,
    defaults: sakuraKoiTemplate.sample,
    fixedTimelineSteps: sakuraKoiTemplate.fixedTimelineSteps || [],
  },
  {
    id: bridgertonTemplate.id,
    label: bridgertonTemplate.label,
    description: bridgertonTemplate.description,
    Component: BridgertonInvitePage,
    defaults: bridgertonTemplate.sample || bridgertonTemplate.defaults,
    fixedTimelineSteps: bridgertonTemplate.fixedTimelineSteps || [],
  },
  {
    id: majesticWhiteTemplate.id,
    label: majesticWhiteTemplate.label,
    description: majesticWhiteTemplate.description,
    Component: MajesticWhiteInvitePage,
    defaults: majesticWhiteTemplate.sample || majesticWhiteTemplate.defaults,
    fixedTimelineSteps: majesticWhiteTemplate.fixedTimelineSteps || [],
  },
  {
    id: dolceVitaTemplate.id,
    label: dolceVitaTemplate.label,
    description: dolceVitaTemplate.description,
    Component: DolceVitaInvitePage,
    defaults: dolceVitaTemplate.defaults || dolceVitaTemplate.sample,
    fixedTimelineSteps: dolceVitaTemplate.fixedTimelineSteps,
  },
  {
    id: sidiBouSaidTemplate.id,
    label: sidiBouSaidTemplate.label,
    description: sidiBouSaidTemplate.description,
    Component: SidiBouSaidInvitePage,
    defaults: sidiBouSaidTemplate.defaults || sidiBouSaidTemplate.sample,
    fixedTimelineSteps: sidiBouSaidTemplate.fixedTimelineSteps,
  },
];

export function getDigitalInviteTemplate(templateId) {
  return digitalInviteTemplates.find((template) => template.id === templateId) || null;
}

export function getDefaultDigitalInviteTemplate() {
  return digitalInviteTemplates[0];
}
