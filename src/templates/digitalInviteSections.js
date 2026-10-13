/** Section catalogs per template — required sections cannot be toggled off. */
export const TEMPLATE_SECTIONS = {
  "club-capri": [
    { id: "hero", label: "Hero", required: true },
    { id: "intro", label: "Introduction", required: false },
    { id: "celebrations", label: "Celebrations", required: false },
    { id: "dress-code", label: "Dress code & arrivée", required: false },
    { id: "rsvp", label: "RSVP", required: false },
    { id: "footer", label: "Footer", required: true },
  ],
  "sakura-koi": [
    { id: "hero", label: "Hero", required: true },
    { id: "countdown", label: "Countdown", required: false },
    { id: "formal-invite", label: "Formal invite", required: false },
    { id: "our-story", label: "Our story", required: false },
    { id: "venue", label: "Lieu", required: false },
    { id: "rsvp", label: "RSVP", required: false },
    { id: "footer", label: "Footer", required: true },
  ],
  bridgerton: [
    { id: "hero", label: "Hero", required: true },
    { id: "countdown", label: "Countdown", required: false },
    { id: "celebrations", label: "Celebrations", required: false },
    { id: "location", label: "Lieu", required: false },
    { id: "dress-code", label: "Dress code", required: false },
    { id: "leave-a-message", label: "Leave a message", required: false },
    { id: "rsvp", label: "RSVP", required: false },
    { id: "footer", label: "Footer", required: true },
  ],
  "majestic-white": [
    { id: "hero", label: "Hero", required: true },
    { id: "our-story", label: "Our story", required: false },
    { id: "countdown", label: "Countdown", required: false },
    { id: "formal-invite", label: "Formal invite", required: false },
    { id: "celebrations", label: "Celebrations", required: false },
    { id: "timeline", label: "Timeline", required: false },
    { id: "leave-a-message", label: "Leave a message", required: false },
    { id: "rsvp", label: "RSVP", required: false },
    { id: "footer", label: "Footer", required: true },
  ],
  "dolce-vita": [
    { id: "hero", label: "Hero", required: true },
    { id: "countdown", label: "Countdown", required: false },
    { id: "location", label: "Location", required: false },
    { id: "timeline", label: "Timeline", required: false },
    { id: "menu", label: "Menu", required: false },
    { id: "rsvp", label: "RSVP", required: false },
    { id: "closing", label: "Closing", required: false },
    { id: "footer", label: "Footer", required: true },
  ],
  "sidi-bousaid": [
    { id: "hero", label: "Hero", required: true },
    { id: "story", label: "Story", required: false },
    { id: "countdown", label: "Countdown", required: false },
    { id: "celebrations", label: "Celebrations", required: false },
    { id: "dress-code", label: "Dress code", required: false },
    { id: "programme", label: "Programme", required: false },
    { id: "rsvp", label: "RSVP", required: false },
    { id: "footer", label: "Footer", required: true },
  ],
};

export function getTemplateSections(templateId) {
  return TEMPLATE_SECTIONS[templateId] || [];
}

export function getDefaultActiveSections(templateId) {
  return getTemplateSections(templateId).map((section) => section.id);
}

/**
 * Retro-compatible: missing activeSections → all sections visible.
 * Required sections always active.
 */
export function isSectionActive(invite, sectionId) {
  const sections = getTemplateSections(invite?.template);
  const meta = sections.find((section) => section.id === sectionId);
  if (meta?.required) return true;

  const active = invite?.activeSections;
  if (!Array.isArray(active) || active.length === 0) return true;
  return active.includes(sectionId);
}

export function toggleInviteSection(invite, sectionId, enabled) {
  const sections = getTemplateSections(invite?.template);
  const meta = sections.find((section) => section.id === sectionId);
  if (meta?.required) {
    return Array.isArray(invite?.activeSections)
      ? invite.activeSections
      : getDefaultActiveSections(invite?.template);
  }

  const current = Array.isArray(invite?.activeSections)
    ? [...invite.activeSections]
    : getDefaultActiveSections(invite?.template);

  if (enabled) {
    if (!current.includes(sectionId)) current.push(sectionId);
    return current;
  }
  return current.filter((id) => id !== sectionId);
}

export function withActiveSections(defaults, templateId) {
  const base = defaults || {};
  if (Array.isArray(base.activeSections) && base.activeSections.length > 0) {
    return base;
  }
  return {
    ...base,
    activeSections: getDefaultActiveSections(templateId),
  };
}

/**
 * Pack absolute-canvas sections: when optional sections are off, later
 * sections shift up and the canvas height shrinks (no empty holes).
 *
 * @param {object} invite
 * @param {{ id: string, y0: number, y1: number }[]} ranges Contiguous Y ranges in document order
 * @returns {{ shifts: Record<string, number>, collapsed: number, packedHeight: number }}
 */
export function getAbsoluteSectionPacking(invite, ranges) {
  let collapsed = 0;
  const shifts = {};
  (ranges || []).forEach((range) => {
    shifts[range.id] = collapsed;
    if (!isSectionActive(invite, range.id)) {
      collapsed += Math.max(0, range.y1 - range.y0);
    }
  });
  const fullHeight = ranges?.length ? Math.max(...ranges.map((r) => r.y1)) : 0;
  return {
    shifts,
    collapsed,
    packedHeight: Math.max(0, fullHeight - collapsed),
  };
}

/** Shift amount for a decorative element at absolute Y (same packing as sections). */
export function getPackShiftForY(y, ranges, shifts) {
  if (!ranges?.length) return 0;
  for (let i = 0; i < ranges.length; i += 1) {
    const range = ranges[i];
    if (y >= range.y0 && y < range.y1) return shifts[range.id] || 0;
  }
  const last = ranges[ranges.length - 1];
  return shifts[last.id] || 0;
}

/** Wrapper style: keeps absolute children at design coords, then translates the pack. */
export function absolutePackLayerStyle(shiftY, pageW, pageH) {
  return {
    position: "absolute",
    left: 0,
    top: 0,
    width: pageW,
    height: pageH,
    transform: shiftY ? `translateY(-${shiftY}px)` : undefined,
  };
}
