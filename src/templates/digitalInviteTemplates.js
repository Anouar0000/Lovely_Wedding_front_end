import { lazy } from "react";
import clubCapriTemplate from "../data/digital/templates/club-capri.json";
import dolceVitaTemplate from "../data/digital/templates/dolce-vita.json";
import sakuraKoiTemplate from "../data/digital/templates/sakura-koi.json";
import sidiBouSaidTemplate from "../data/digital/templates/sidi-bousaid.json";
import bridgertonTemplate from "../data/digital/templates/bridgerton.json";
import majesticWhiteTemplate from "../data/digital/templates/majestic-white.json";
import celestialTemplate from "../data/digital/templates/celestial.json";
import {
  TEMPLATE_SECTIONS,
  getDefaultActiveSections,
  getTemplateSections,
  isSectionActive,
  toggleInviteSection,
  withActiveSections,
} from "./digitalInviteSections";

/**
 * Components en lazy : une invitation ne charge plus toutes les autres
 * (évite le mega-chunk ~480 Ko + assets au premier aperçu).
 */
const ClubCapriInvitePage = lazy(() => import("../pages/ClubCapriInvitePage"));
const DolceVitaInvitePage = lazy(() => import("../pages/DolceVitaInvitePage"));
const SakuraKoiInvitePage = lazy(() => import("../pages/SakuraKoiInvitePage"));
const SidiBouSaidInvitePage = lazy(() => import("../pages/SidiBouSaidInvitePage"));
const BridgertonInvitePage = lazy(() => import("../pages/BridgertonInvitePage"));
const MajesticWhiteInvitePage = lazy(() => import("../pages/MajesticWhiteInvitePage"));
const CelestialInvitePage = lazy(() => import("../pages/CelestialInvitePage"));

export const DIGITAL_TEMPLATE_IDS = {
  DOLCE_VITA: dolceVitaTemplate.id,
  SIDI_BOUSAID: sidiBouSaidTemplate.id,
  CLUB_CAPRI: clubCapriTemplate.id,
  SAKURA_KOI: sakuraKoiTemplate.id,
  BRIDGERTON: bridgertonTemplate.id,
  MAJESTIC_WHITE: majesticWhiteTemplate.id,
  CELESTIAL: celestialTemplate.id,
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
      sidiBouSaidTemplate.sample || sidiBouSaidTemplate.defaults,
      sidiBouSaidTemplate.id
    ),
    sections: TEMPLATE_SECTIONS[sidiBouSaidTemplate.id],
    fixedTimelineSteps: sidiBouSaidTemplate.fixedTimelineSteps,
  },
  {
    id: celestialTemplate.id,
    label: celestialTemplate.label,
    description: celestialTemplate.description,
    Component: CelestialInvitePage,
    defaults: withActiveSections(
      celestialTemplate.sample || celestialTemplate.defaults,
      celestialTemplate.id
    ),
    sections: TEMPLATE_SECTIONS[celestialTemplate.id],
    // Programme steps are edited as texts (programmeStep1…5), not with the timeline editor
    fixedTimelineSteps: [],
  },
];

export function getDigitalInviteTemplate(templateId) {
  return digitalInviteTemplates.find((template) => template.id === templateId) || null;
}

export function getDefaultDigitalInviteTemplate() {
  return digitalInviteTemplates[0];
}
