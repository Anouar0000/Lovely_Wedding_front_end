import React, { useEffect, useRef, useState } from "react";
import { toSafeHttpUrl } from "../lib/safeUrl";
import { isFirebaseConfigured } from "../lib/firebase";
import { submitRsvpResponse } from "../services/rsvp";
import {
  absolutePackLayerStyle,
  getAbsoluteSectionPacking,
  isSectionActive,
} from "../templates/digitalInviteSections";
import AudioPlayer from "../components/audio/AudioPlayer";
import DigitalInviteEntrance from "../components/digital/DigitalInviteEntrance";
import CelestialMoonSunReveal from "../components/animations/CelestialMoonSunReveal";
import CelestialOrbit from "../components/animations/CelestialOrbit";
import blackEnvelope from "../assets/digital/celestial/black-enveloppe.png";
import sunIcon from "../assets/digital/celestial/sun-icon.svg";
import ParticleEmitter from "../components/animations/ParticleEmitter";
import templateConfig from "../data/digital/templates/celestial.json";

// Assets for Celestial Template
import heroBg from "../assets/digital/celestial/hero-bg.png";
import storyPhoto from "../assets/digital/celestial/story-photo.png";
import venueDoor from "../assets/digital/celestial/venue-door.png";
import handsHolding from "../assets/digital/celestial/hands-holding.png";
import storyArchBg from "../assets/digital/celestial/story-arch-bg.svg";
import constellation1_1 from "../assets/digital/celestial/constellation-1-1.svg";
import constellation1_2 from "../assets/digital/celestial/constellation-1-2.svg";
import constellation2_1 from "../assets/digital/celestial/constellation-2-1.svg";
import constellation3_1 from "../assets/digital/celestial/constellation-3-1.svg";
import progIcon1 from "../assets/digital/celestial/programme-icon-1.svg";
import progIcon2 from "../assets/digital/celestial/programme-icon-2.svg";
import progIcon3 from "../assets/digital/celestial/programme-icon-3.svg";
import progIcon4 from "../assets/digital/celestial/programme-icon-4.svg";
import progIcon5 from "../assets/digital/celestial/programme-icon-5.svg";

// Exact 1:1 Vector Text from Figma
import heroNamesSvg from "../assets/digital/celestial/svg_text/hero-names-text.svg";
import ourStoryTitleSvg from "../assets/digital/celestial/svg_text/our-story-title.svg";
import revealTitleSvg from "../assets/digital/celestial/svg_text/reveal-title.svg";
import dateSvg from "../assets/digital/celestial/svg_text/date-text.svg";
import venueTitleSvg from "../assets/digital/celestial/svg_text/venue-title.svg";
import programmeTitleSvg from "../assets/digital/celestial/svg_text/programme-title.svg";
import principlesTitleSvg from "../assets/digital/celestial/svg_text/principles-title.svg";
import rsvpTitleSvg from "../assets/digital/celestial/svg_text/rsvp-title.svg";
import untillInfinitySvg from "../assets/digital/celestial/svg_text/untill-infinity.svg";
import footerNamesSvg from "../assets/digital/celestial/svg_text/footer-names.svg";

const CANVAS_WIDTH = 430;
const CANVAS_HEIGHT = 4604;

/** Welcome animation (star + moon + sun), shown before the invitation opens */
const ENTRANCE_VIDEO = "/assets/digital/celestial/entrance.mp4";

/**
 * Contiguous Y ranges (Figma 1268:90) — when an optional section is off,
 * the sections below move up and the canvas gets shorter.
 * Hero / Our story / Reveal are drawn as one piece (arch + orbit), so they stay required.
 * The RSVP card overlaps the top of the footer photo; footer starts where the photo starts.
 */
const CELESTIAL_PACK_RANGES = [
  { id: "hero", y0: 0, y1: 474 },
  { id: "our-story", y0: 474, y1: 891 },
  { id: "reveal", y0: 891, y1: 1400 },
  { id: "venue", y0: 1400, y1: 2094 },
  { id: "programme", y0: 2094, y1: 3033 },
  { id: "principles", y0: 3033, y1: 3716 },
  { id: "rsvp", y0: 3716, y1: 4130 },
  { id: "footer", y0: 4130, y1: CANVAS_HEIGHT },
];

const DEFAULT_PROGRAMME = [
  { time: "19:00", title: "Accueil" },
  { time: "19:15", title: "Contrat" },
  { time: "19:45", title: "Réception" },
  { time: "20:30", title: "Photos" },
  { time: "21:00", title: "Fin" },
];

/** Dashboard texts/media live in invite.texts / invite.media — flatten them over the invite. */
function pickFilled(bag) {
  const out = {};
  Object.entries(bag || {}).forEach(([key, value]) => {
    if (typeof value === "string" && value.trim() !== "") out[key] = value;
  });
  return out;
}

// Colors
const COLOR_WHITE = "#FFFFFF";
const COLOR_BLACK = "#000000";
const COLOR_SAND = "#ECE5DF";

// Typography
const FONT_ONIROM = "'Onirom', 'Bodoni Moda', 'Italiana', serif";
const FONT_ROSARIO = "'Rosario', sans-serif";
const FONT_BEAU_RIVAGE = "'Beau Rivage', cursive";

const figmaBox = ({ x, y, width, height, zIndex = 2, extra = {} }) => ({
  position: "absolute",
  left: `${x}px`,
  top: `${y}px`,
  width: width !== undefined ? `${width}px` : "auto",
  height: height !== undefined ? `${height}px` : "auto",
  maxWidth: "none",
  zIndex,
  boxSizing: "border-box",
  ...extra,
});

export default function CelestialInvitePage({
  invite,
  editable = false,
  /** Aperçu éditeur / démo mockup : le parent gère déjà l'échelle (zoom) → pas de scale viewport */
  previewMode = false,
  demoInMockup = false,
  /** Aperçu latéral éditeur — pas de welcome */
  editorPreview = false,
  onSelectElement = null,
  selectedElementId = null,
}) {
  const fixedScale = editable || previewMode || demoInMockup;
  const baseInvite = invite || templateConfig.sample;
  const currentInvite = {
    ...baseInvite,
    ...pickFilled(baseInvite.media),
    ...pickFilled(baseInvite.texts),
    template: baseInvite.template || templateConfig.id,
  };
  const overrides = currentInvite.styleOverrides || {};

  // Sections on/off (dashboard "Blocs") — optional sections collapse
  const { shifts: packShifts, packedHeight } = getAbsoluteSectionPacking(
    currentInvite,
    CELESTIAL_PACK_RANGES
  );
  const showSection = (id) => isSectionActive(currentInvite, id);
  const canvasHeight = packedHeight || CANVAS_HEIGHT;
  const sectionLayer = (id, zIndex) => ({
    ...absolutePackLayerStyle(packShifts[id] || 0, CANVAS_WIDTH, CANVAS_HEIGHT),
    zIndex,
    pointerEvents: "none",
  });

  // Welcome video (same behaviour as Sakura / Capri / Sidi)
  const welcomeEnabled = currentInvite.videoIntroEnabled !== false;
  const skipWelcome = !welcomeEnabled || Boolean(editorPreview) || editable;
  const [entered, setEntered] = useState(skipWelcome);
  useEffect(() => {
    setEntered(skipWelcome);
  }, [skipWelcome]);

  useEffect(() => {
    if (previewMode || entered) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    return () => {
      document.body.style.overflow = prev;
    };
  }, [entered, previewMode]);

  const getText = (id, fallback) => {
    const custom = overrides[id]?.text;
    if (custom !== undefined && custom !== null && custom !== "") {
      return custom;
    }
    return fallback;
  };

  // Responsive scale for mobile
  const [scale, setScale] = useState(1);
  const canvasRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        const availableWidth = Math.min(
          window.innerWidth,
          document.documentElement.clientWidth || window.innerWidth
        );
        if (!fixedScale && availableWidth > 0 && availableWidth < CANVAS_WIDTH) {
          setScale(availableWidth / CANVAS_WIDTH);
        } else {
          setScale(1);
        }
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [fixedScale]);

  // Style getter with user overrides
  const getStyle = (id, baseStyle) => {
    const user = overrides[id] || {};
    const computed = { ...baseStyle };

    if (user.color) computed.color = user.color;
    if (user.fontSize) computed.fontSize = `${user.fontSize}px`;
    if (user.fontFamily) computed.fontFamily = user.fontFamily;
    if (user.textAlign) computed.textAlign = user.textAlign;
    if (user.fontWeight) computed.fontWeight = user.fontWeight;
    if (user.letterSpacing) computed.letterSpacing = user.letterSpacing;
    if (user.lineHeight) computed.lineHeight = user.lineHeight;

    return computed;
  };

  // Click handler for editable elements
  const handleElementClick = (elementId, sectionId) => {
    if (editable && onSelectElement) {
      onSelectElement(elementId, sectionId);
    }
  };

  const getElementHighlightStyle = (elementId) => {
    if (!editable) return {};
    const isSelected = selectedElementId === elementId;
    return {
      outline: isSelected ? "2px solid #D48744" : "1px dashed rgba(212, 135, 68, 0.4)",
      outlineOffset: "2px",
      cursor: "pointer",
      transition: "outline 0.15s ease",
    };
  };

  // RSVP Form State
  const [selectedAttend, setSelectedAttend] = useState("yes");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [rsvpError, setRsvpError] = useState("");
  const [isMoonJoined, setIsMoonJoined] = useState(false);

  const inviteId = currentInvite.id || currentInvite.slug || "";
  const canSubmitRsvp = Boolean(
    currentInvite.ownerId && inviteId && isFirebaseConfigured && !previewMode && !editable
  );

  const handleRsvpSubmit = async (e) => {
    e?.preventDefault?.();
    setRsvpError("");
    setRsvpSuccess(false);
    if (!guestName.trim()) {
      setRsvpError("Veuillez indiquer votre nom.");
      return;
    }
    if (!canSubmitRsvp) {
      setRsvpError("RSVP disponible sur le lien publié de l'invitation.");
      return;
    }
    setRsvpSubmitting(true);
    try {
      await submitRsvpResponse({
        inviteId,
        ownerId: currentInvite.ownerId,
        clientUserId: currentInvite.clientUserId || "",
        clientEmail: currentInvite.clientEmail || "",
        inviteSlug: currentInvite.slug || inviteId,
        fullName: guestName,
        email: guestEmail,
        phone: guestPhone,
        guestCount: guestCount || 1,
        attending: selectedAttend === "yes",
      });
      setRsvpSuccess(true);
      setGuestName("");
      setGuestEmail("");
      setGuestPhone("");
      setGuestCount("");
      setSelectedAttend("yes");
    } catch (error) {
      setRsvpError(error?.message || "Impossible d'enregistrer le RSVP.");
    } finally {
      setRsvpSubmitting(false);
    }
  };

  // Dynamic values
  const coupleNames = currentInvite.coupleNames || "Jonathan & Marrisah";
  // Dashboard edits "coupleNames" → it wins over the sample's groomName / brideName
  const groomName = coupleNames.split("&")[0]?.trim() || currentInvite.groomName || "Jonathan";
  const brideName = coupleNames.split("&")[1]?.trim() || currentInvite.brideName || "Marrisah";
  const eventDate = currentInvite.eventDate || "2026-10-10";

  // Format date as "10 . 10 .2026"
  const formattedDate = (() => {
    if (!eventDate) return "10 . 10 .2026";
    const parts = eventDate.split("-");
    if (parts.length === 3) {
      return `${parts[2]} . ${parts[1]} .${parts[0]}`;
    }
    return eventDate;
  })();

  const venueName = currentInvite.venueName || "Kobbet Ennhas Manouba";
  const eventTime = currentInvite.eventTime || "19:00 - 21:00";
  const mapUrl = toSafeHttpUrl(
    currentInvite.mapUrl,
    "https://maps.google.com/?q=Kobbet+Ennhas+Manouba"
  );

  const storyImgSrc =
    overrides["story-photo"]?.image ||
    overrides["story-photo"]?.url ||
    currentInvite.storyPhoto ||
    storyPhoto;

  const venueImgSrc =
    overrides["venue-photo"]?.image ||
    overrides["venue-photo"]?.url ||
    currentInvite.venuePhoto ||
    venueDoor;

  const musicUrl = currentInvite.musicUrl || "";

  const programmeSteps = DEFAULT_PROGRAMME.map((fallback, index) => {
    const custom = currentInvite[`programmeStep${index + 1}`];
    if (custom) return custom;
    const event = Array.isArray(currentInvite.timelineEvents)
      ? currentInvite.timelineEvents[index]
      : null;
    const time = event?.time || fallback.time;
    const title = event?.title || fallback.title;
    return `${time}\n${title}`;
  });

  // Phone mockup on the product page: play the welcome video inside the phone first
  if (demoInMockup && !entered) {
    return (
      <div
        className="relative overflow-hidden"
        style={{ width: CANVAS_WIDTH, height: Math.ceil((CANVAS_WIDTH * 370) / 166), background: COLOR_BLACK }}
      >
        <DigitalInviteEntrance
          video={ENTRANCE_VIDEO}
          alt="Celestial invitation"
          background={COLOR_BLACK}
          autoOnly
          autoOpenAfterMs={7000}
          contained
          onOpen={() => setEntered(true)}
        />
      </div>
    );
  }

  return (
    <>
    {!entered ? (
      <DigitalInviteEntrance
        video={ENTRANCE_VIDEO}
        alt="Celestial invitation"
        background={COLOR_BLACK}
        autoOnly
        autoOpenAfterMs={7000}
        onOpen={() => {
          window.scrollTo(0, 0);
          setEntered(true);
        }}
      />
    ) : null}
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: fixedScale ? undefined : "100vh",
        backgroundColor: editable ? "transparent" : "#0F172A",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        overflowX: "hidden",
      }}
    >
      <style>
        {`
          @keyframes celestialTwinkle {
            0%, 100% { opacity: 0.35; transform: scale(0.98); }
            50% { opacity: 1; transform: scale(1.04); }
          }
          @keyframes celestialPulse {
            0%, 100% { transform: scale(1); filter: drop-shadow(0 0 2px rgba(232, 204, 51, 0.4)); }
            50% { transform: scale(1.08); filter: drop-shadow(0 0 10px rgba(232, 204, 51, 0.8)); }
          }
          @keyframes celestialSlowOrbit {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .celestial-twinkle-1 {
            animation: celestialTwinkle 4s ease-in-out infinite;
          }
          .celestial-twinkle-2 {
            animation: celestialTwinkle 5.5s ease-in-out infinite 1.5s;
          }
          .celestial-pulse {
            animation: celestialPulse 3.5s ease-in-out infinite;
          }
          .celestial-pack-layer > * {
            pointer-events: auto;
          }
        `}
      </style>

      {/* Music Player if configured */}
      {!demoInMockup && !editable && musicUrl ? (
        <AudioPlayer src={musicUrl} active={entered} themeColor="#D48744" />
      ) : null}

      {/* Scaling wrapper for mobile screen responsiveness */}
      <div
        style={{
          width: editable ? `${CANVAS_WIDTH}px` : `${CANVAS_WIDTH * scale}px`,
          height: editable ? `${canvasHeight}px` : `${canvasHeight * scale}px`,
          position: "relative",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          id="celestial-canvas-root"
          ref={canvasRef}
          style={{
            position: "relative",
            width: `${CANVAS_WIDTH}px`,
            height: `${canvasHeight}px`,
            backgroundColor: COLOR_WHITE,
            overflow: "hidden",
            boxShadow: editable ? "none" : "0 30px 80px rgba(0,0,0,0.6)",
            transform: editable ? "none" : `scale(${scale})`,
            transformOrigin: "top center",
          }}
        >
          {/* =========================================================================
              LAYER 0: GLOBAL BACKGROUNDS
              ========================================================================= */}
          {/* Top Hero BG */}
          <img
            src={heroBg}
            alt=""
            style={figmaBox({
              x: 0,
              y: 0,
              width: 430,
              height: 474,
              zIndex: 1,
              extra: { objectFit: "cover", filter: "grayscale(100%)" },
            })}
          />

          {/* Black BG Rectangle (y: 891 to 4007) */}
          <div
            style={figmaBox({
              x: -2,
              y: 891,
              width: 434,
              height: 3116,
              zIndex: 1,
              extra: { backgroundColor: COLOR_BLACK },
            })}
          />

          {/* Falling Celestial Sparkles Effect */}
          {currentInvite.enableStars !== false && currentInvite.enableSparkles !== false && (
            <ParticleEmitter
              type="sparkles"
              count={currentInvite.starsIntensity || currentInvite.sparklesIntensity || 250}
              color={currentInvite.starsColor || currentInvite.sparklesColor || "#E0E7FF"}
              active={true}
              style={{ zIndex: 7 }}
            />
          )}

          {/* =========================================================================
              SECTION 1: HERO & ENVELOPE (y: 0 - 474)
              ========================================================================= */}
          {/* Black Envelope */}
          <img
            src={blackEnvelope}
            alt=""
            style={figmaBox({
              x: 89,
              y: -81,
              width: 253,
              height: 450,
              zIndex: 2,
              extra: { objectFit: "cover", pointerEvents: "none" },
            })}
          />

          {/* Couple Names on Card */}
          <div
            id="preview-el-hero-names"
            data-element-id="hero-names"
            onClick={() => handleElementClick("hero-names", "hero")}
            style={figmaBox({
              x: 104,
              y: 157,
              width: 223,
              height: 107,
              zIndex: 3,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: "6px",
                paddingLeft: "1px",
                cursor: "pointer",
                ...getStyle("hero-names", {
                  fontFamily: FONT_ONIROM,
                  fontWeight: 400,
                  fontSize: "22px",
                  lineHeight: "1.15",
                  letterSpacing: "0.1333em",
                  textAlign: "center",
                  color: COLOR_BLACK,
                  textTransform: "uppercase",
                  flexDirection: "column",
                }),
                ...getElementHighlightStyle("hero-names"),
              },
            })}
          >
            {!overrides["hero-names"]?.text &&
            groomName.toLowerCase() === "jonathan" &&
            brideName.toLowerCase() === "marrisah" &&
            !overrides["hero-names"]?.fontFamily &&
            !overrides["hero-names"]?.fontSize ? (
              <img src={heroNamesSvg} alt="Jonathan & Marrisah" style={{ width: 106, height: 64, display: "block" }} />
            ) : (
              <>
                <span>{getText("hero-groom", groomName)}</span>
                <span style={{ fontSize: "22px", fontStyle: "italic", fontFamily: FONT_BEAU_RIVAGE, lineHeight: "1", margin: "2px 0" }}>&</span>
                <span>{getText("hero-bride", brideName)}</span>
              </>
            )}
          </div>

          {/* Star Icon Vector on Envelope Flap */}
          <img
            src={sunIcon}
            alt=""
            className="celestial-pulse"
            style={figmaBox({
              x: 200,
              y: 320,
              width: 30,
              height: 30,
              zIndex: 4,
              extra: { pointerEvents: "none" },
            })}
          />

          {/* =========================================================================
              SECTION 2: OUR STORY (y: 474 - 891)
              ========================================================================= */}
          {/* Arched Background */}
          <img
            src={storyArchBg}
            alt=""
            style={figmaBox({
              x: -2,
              y: 474,
              width: 434,
              height: 610,
              zIndex: 1,
              extra: { pointerEvents: "none" },
            })}
          />

          {/* Couple Story Portrait */}
          <div
            id="preview-el-story-photo"
            data-element-id="story-photo"
            onClick={() => handleElementClick("story-photo", "our-story")}
            style={figmaBox({
              x: 156,
              y: 512,
              width: 121,
              height: 205,
              zIndex: 2,
              extra: {
                borderRadius: "50px",
                overflow: "hidden",
                ...getElementHighlightStyle("story-photo"),
              },
            })}
          >
            <img
              src={storyImgSrc}
              alt="Couple Story"
              style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%)" }}
            />
          </div>

          {/* "Our Story" Title */}
          <div
            id="preview-el-story-title"
            data-element-id="story-title"
            onClick={() => handleElementClick("story-title", "our-story")}
            style={figmaBox({
              x: 69,
              y: 727,
              width: 293,
              height: 52,
              zIndex: 2,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: "6px",
                paddingLeft: "1px",
                ...getStyle("story-title", {
                  fontFamily: FONT_ONIROM,
                  fontWeight: 400,
                  fontSize: "35px",
                  letterSpacing: "0.08em",
                  textAlign: "center",
                  color: COLOR_BLACK,
                  textTransform: "uppercase",
                }),
                ...getElementHighlightStyle("story-title"),
              },
            })}
          >
            {(!overrides["story-title"]?.text || overrides["story-title"]?.text.trim().toUpperCase() === "OUR STORY") &&
            (!currentInvite.storyTitle || currentInvite.storyTitle.trim().toUpperCase() === "OUR STORY") &&
            !overrides["story-title"]?.fontFamily &&
            !overrides["story-title"]?.fontSize ? (
              <img src={ourStoryTitleSvg} alt="OUR STORY" style={{ width: 178, height: 26, display: "block" }} />
            ) : (
              getText("story-title", currentInvite.storyTitle || "OUR STORY")
            )}
          </div>

          {/* Subtitle: "To celebrate their wedding ceremony" */}
          <div
            id="preview-el-story-subtitle"
            data-element-id="story-subtitle"
            onClick={() => handleElementClick("story-subtitle", "our-story")}
            style={figmaBox({
              x: 104,
              y: 784,
              width: 223,
              height: 40,
              zIndex: 2,
              extra: {
                ...getStyle("story-subtitle", {
                  fontFamily: FONT_ROSARIO,
                  fontWeight: 700,
                  fontSize: "12px",
                  lineHeight: "20px",
                  letterSpacing: "0.3333em",
                  textAlign: "center",
                  color: COLOR_BLACK,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  whiteSpace: "pre-line",
                }),
                ...getElementHighlightStyle("story-subtitle"),
              },
            })}
          >
            {getText("story-subtitle", currentInvite.storySubtitle || "To celebrate their\nwedding ceremony")}
          </div>

          {/* Orbit Planetary Motion Graphic (Saturn & Orbit in front of Our Story at zIndex 4, with overflow visible) */}
          <CelestialOrbit
            themeBg={COLOR_SAND}
            style={figmaBox({
              x: 0,
              y: 861,
              width: 430,
              height: 479,
              zIndex: 4,
              extra: { pointerEvents: "none", overflow: "visible" },
            })}
          />

          {/* Reveal Section Horizon Occlusion Mask (zIndex 5: Hides orbiting bodies when they go into the bottom black area) */}
          <svg
            style={figmaBox({
              x: -2,
              y: 474,
              width: 434,
              height: 870,
              zIndex: 5,
              extra: { pointerEvents: "none" },
            })}
            viewBox="0 0 434 870"
            fill="none"
          >
            <path
              d="M0.441805 501.095 C197.679 698.332 371.345 583.277 433.524 501.095 V870 H0.441805 Z"
              fill={COLOR_BLACK}
            />
          </svg>

          {/* =========================================================================
              SECTION 3: REVEAL & DATE (y: 891 - 1400)
              ========================================================================= */}
          {/* "Reveal" Title */}
          <div
            id="preview-el-reveal-title"
            data-element-id="reveal-title"
            onClick={() => handleElementClick("reveal-title", "reveal")}
            style={figmaBox({
              x: 69,
              y: 1122,
              width: 293,
              height: 52,
              zIndex: 6,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: "7px",
                paddingLeft: "1px",
                ...getStyle("reveal-title", {
                  fontFamily: FONT_ONIROM,
                  fontWeight: 400,
                  fontSize: "35px",
                  letterSpacing: "0.08em",
                  textAlign: "center",
                  color: COLOR_WHITE,
                  textTransform: "uppercase",
                }),
                ...getElementHighlightStyle("reveal-title"),
              },
            })}
          >
            {(!overrides["reveal-title"]?.text || overrides["reveal-title"]?.text.trim().toUpperCase() === "REVEAL") &&
            (!currentInvite.revealTitle || currentInvite.revealTitle.trim().toUpperCase() === "REVEAL") &&
            !overrides["reveal-title"]?.fontFamily &&
            !overrides["reveal-title"]?.fontSize ? (
              <img src={revealTitleSvg} alt="REVEAL" style={{ width: 120, height: 25, display: "block" }} />
            ) : (
              getText("reveal-title", currentInvite.revealTitle || "REVEAL")
            )}
          </div>

          {/* "Join the moon  to the sun.." */}
          <div
            id="preview-el-reveal-subtitle"
            data-element-id="reveal-subtitle"
            onClick={() => handleElementClick("reveal-subtitle", "reveal")}
            style={figmaBox({
              x: 104,
              y: 1183,
              width: 223,
              height: 40,
              zIndex: 6,
              extra: {
                ...getStyle("reveal-subtitle", {
                  fontFamily: FONT_ROSARIO,
                  fontWeight: 700,
                  fontSize: "12px",
                  lineHeight: "20px",
                  letterSpacing: "0.3333em",
                  textAlign: "center",
                  color: COLOR_WHITE,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  whiteSpace: "pre-line",
                }),
                ...getElementHighlightStyle("reveal-subtitle"),
              },
            })}
          >
            {getText("reveal-subtitle", currentInvite.revealSubtitle || "Join the moon  to the\nsun..")}
          </div>

          {/* Interactive Moon to Sun Reveal */}
          <CelestialMoonSunReveal
            editable={editable}
            onJoinChange={setIsMoonJoined}
            onSelect={() => handleElementClick("reveal-arc", "reveal")}
            style={figmaBox({
              x: 43,
              y: 1194,
              width: 359,
              height: 189,
              zIndex: 6,
            })}
          />

          {/* Date: "10 . 10 .2026" (Revealed when moon joins sun) */}
          <div
            id="preview-el-date-text"
            data-element-id="date-text"
            onClick={() => handleElementClick("date-text", "reveal")}
            style={figmaBox({
              x: 104,
              y: 1332,
              width: 223,
              height: 52,
              zIndex: 6,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: "5px",
                opacity: isMoonJoined ? 1 : (editable ? 0.35 : 0),
                transform: isMoonJoined
                  ? "translateY(0px) scale(1)"
                  : "translateY(14px) scale(0.95)",
                filter: isMoonJoined
                  ? "drop-shadow(0 0 10px rgba(232, 204, 51, 0.45))"
                  : "none",
                transition:
                  "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s ease",
                pointerEvents: (isMoonJoined || editable) ? "auto" : "none",
                ...getStyle("date-text", {
                  fontFamily: FONT_ONIROM,
                  fontWeight: 400,
                  fontSize: "28px",
                  letterSpacing: "0.125em",
                  textAlign: "center",
                  color: COLOR_WHITE,
                }),
                ...getElementHighlightStyle("date-text"),
              },
            })}
          >
            {(!overrides["date-text"]?.text || overrides["date-text"]?.text.replace(/\s+/g, "") === "10.10.2026") &&
            (!eventDate || eventDate === "2026-10-10") &&
            !overrides["date-text"]?.fontFamily &&
            !overrides["date-text"]?.fontSize ? (
              <img src={dateSvg} alt="10 . 10 .2026" style={{ width: 188, height: 21, display: "block" }} />
            ) : (
              getText("date-text", formattedDate)
            )}
          </div>

          {/* =========================================================================
              SECTION 4: VENUE (y: 1400 - 2094)
              ========================================================================= */}
          {showSection("venue") ? (
          <div className="celestial-pack-layer" style={sectionLayer("venue", 2)}>
          {/* "Venue" Title */}
          <div
            id="preview-el-venue-title"
            data-element-id="venue-title"
            onClick={() => handleElementClick("venue-title", "venue")}
            style={figmaBox({
              x: 69,
              y: 1435,
              width: 293,
              height: 52,
              zIndex: 3,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: "7px",
                ...getStyle("venue-title", {
                  fontFamily: FONT_ONIROM,
                  fontWeight: 400,
                  fontSize: "35px",
                  letterSpacing: "0.08em",
                  textAlign: "center",
                  color: COLOR_WHITE,
                  textTransform: "uppercase",
                }),
                ...getElementHighlightStyle("venue-title"),
              },
            })}
          >
            {(!overrides["venue-title"]?.text || overrides["venue-title"]?.text.trim().toUpperCase() === "VENUE") &&
            (!currentInvite.venueTitle || currentInvite.venueTitle.trim().toUpperCase() === "VENUE") &&
            !overrides["venue-title"]?.fontFamily &&
            !overrides["venue-title"]?.fontSize ? (
              <img src={venueTitleSvg} alt="VENUE" style={{ width: 100, height: 25, display: "block" }} />
            ) : (
              getText("venue-title", currentInvite.venueTitle || "VENUE")
            )}
          </div>

          {/* Address: "Kobbet Ennhas Manouba" */}
          <div
            id="preview-el-venue-name"
            data-element-id="venue-name"
            onClick={() => handleElementClick("venue-name", "venue")}
            style={figmaBox({
              x: 104,
              y: 1504,
              width: 223,
              height: 40,
              zIndex: 3,
              extra: {
                ...getStyle("venue-name", {
                  fontFamily: FONT_ROSARIO,
                  fontWeight: 700,
                  fontSize: "14px",
                  lineHeight: "20px",
                  letterSpacing: "0.2857em",
                  textAlign: "center",
                  color: COLOR_WHITE,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  whiteSpace: "pre-line",
                }),
                ...getElementHighlightStyle("venue-name"),
              },
            })}
          >
            {getText("venue-name", venueName ? venueName.replace("Kobbet Ennhas Manouba", "Kobbet Ennhas\nManouba") : "Kobbet Ennhas\nManouba")}
          </div>

          {/* Venue Door Line Art */}
          <div
            id="preview-el-venue-photo"
            data-element-id="venue-photo"
            onClick={() => handleElementClick("venue-photo", "venue")}
            style={figmaBox({
              x: 118,
              y: 1560,
              width: 195,
              height: 349,
              zIndex: 3,
              extra: {
                ...getElementHighlightStyle("venue-photo"),
              },
            })}
          >
            <img
              src={venueImgSrc}
              alt="Venue Illustration"
              style={{ width: "100%", height: "100%", objectFit: "contain", filter: "grayscale(100%)" }}
            />
          </div>

          {/* Time: "19:00 - 21:00" */}
          <div
            id="preview-el-venue-time"
            data-element-id="venue-time"
            onClick={() => handleElementClick("venue-time", "venue")}
            style={figmaBox({
              x: 64,
              y: 1909,
              width: 302,
              height: 40,
              zIndex: 3,
              extra: {
                ...getStyle("venue-time", {
                  fontFamily: FONT_ROSARIO,
                  fontWeight: 700,
                  fontSize: "14px",
                  lineHeight: "20px",
                  letterSpacing: "0.2857em",
                  textAlign: "center",
                  color: COLOR_WHITE,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }),
                ...getElementHighlightStyle("venue-time"),
              },
            })}
          >
            {getText("venue-time", eventTime)}
          </div>

          {/* Button Pill: Open in maps */}
          <div
            style={figmaBox({
              x: 104,
              y: 1975,
              width: 219,
              height: 53,
              zIndex: 3,
              extra: {
                backgroundColor: COLOR_SAND,
                borderRadius: "50px",
              },
            })}
          />
          <a
            id="preview-el-venue-map-btn"
            data-element-id="venue-map-btn"
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (editable) {
                e.preventDefault();
                handleElementClick("venue-map-btn", "venue");
              }
            }}
            style={figmaBox({
              x: 62,
              y: 1982,
              width: 302,
              height: 40,
              zIndex: 4,
              extra: {
                fontFamily: FONT_ROSARIO,
                fontWeight: 700,
                fontSize: "14px",
                lineHeight: "20px",
                letterSpacing: "0.2857em",
                textAlign: "center",
                color: COLOR_BLACK,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                cursor: "pointer",
                ...getElementHighlightStyle("venue-map-btn"),
              },
            })}
          >
            {getText("venue-map-btn", currentInvite.mapButton || "Open in maps")}
          </a>
          </div>
          ) : null}

          {/* =========================================================================
              SECTION 5: PROGRAMME (y: 2094 - 3033)
              ========================================================================= */}
          {showSection("programme") ? (
          <div className="celestial-pack-layer" style={sectionLayer("programme", 2)}>
          {/* Rounded Beige Pill Container */}
          <div
            style={figmaBox({
              x: -2,
              y: 2094,
              width: 434,
              height: 939,
              zIndex: 2,
              extra: {
                backgroundColor: COLOR_SAND,
                borderRadius: "217px",
              },
            })}
          />

          {/* "programme" Title */}
          <div
            id="preview-el-programme-title"
            data-element-id="programme-title"
            onClick={() => handleElementClick("programme-title", "programme")}
            style={figmaBox({
              x: 69,
              y: 2192,
              width: 293,
              height: 52,
              zIndex: 3,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: "6px",
                ...getStyle("programme-title", {
                  fontFamily: FONT_ONIROM,
                  fontWeight: 400,
                  fontSize: "35px",
                  letterSpacing: "0.08em",
                  textAlign: "center",
                  color: COLOR_BLACK,
                  textTransform: "uppercase",
                }),
                ...getElementHighlightStyle("programme-title"),
              },
            })}
          >
            {(!overrides["programme-title"]?.text || overrides["programme-title"]?.text.trim().toUpperCase() === "PROGRAMME") &&
            (!currentInvite.programmeTitle || currentInvite.programmeTitle.trim().toUpperCase() === "PROGRAMME") &&
            !overrides["programme-title"]?.fontFamily &&
            !overrides["programme-title"]?.fontSize ? (
              <img src={programmeTitleSvg} alt="PROGRAMME" style={{ width: 194, height: 26, display: "block" }} />
            ) : (
              getText("programme-title", currentInvite.programmeTitle || "PROGRAMME")
            )}
          </div>

          {/* Timeline Items */}
          {[
            { id: "timeline-1", icon: progIcon1, text: programmeSteps[0], yIcon: 2287, yText: 2327 },
            { id: "timeline-2", icon: progIcon2, text: programmeSteps[1], yIcon: 2417, yText: 2457 },
            { id: "timeline-3", icon: progIcon3, text: programmeSteps[2], yIcon: 2547, yText: 2587 },
            { id: "timeline-4", icon: progIcon4, text: programmeSteps[3], yIcon: 2677, yText: 2717 },
            { id: "timeline-5", icon: progIcon5, text: programmeSteps[4], yIcon: 2807, yText: 2847 },
          ].map((item) => (
            <React.Fragment key={item.id}>
              <img
                src={item.icon}
                alt=""
                style={figmaBox({
                  x: 201,
                  y: item.yIcon,
                  width: 30,
                  height: 30,
                  zIndex: 3,
                  extra: { pointerEvents: "none" },
                })}
              />
              <div
                id={`preview-el-${item.id}`}
                data-element-id={item.id}
                onClick={() => handleElementClick(item.id, "programme")}
                style={figmaBox({
                  x: 133,
                  y: item.yText,
                  width: 166,
                  height: 40,
                  zIndex: 3,
                  extra: {
                    ...getStyle(item.id, {
                      fontFamily: FONT_ROSARIO,
                      fontWeight: 700,
                      fontSize: "12px",
                      lineHeight: "20px",
                      letterSpacing: "0.3333em",
                      textAlign: "center",
                      color: COLOR_BLACK,
                      whiteSpace: "pre-line",
                    }),
                    ...getElementHighlightStyle(item.id),
                  },
                })}
              >
                {getText(item.id, item.text)}
              </div>
            </React.Fragment>
          ))}
          </div>
          ) : null}

          {/* =========================================================================
              SECTION 6: PRINCIPLES & CONSTELLATIONS (y: 3033 - 3716)
              ========================================================================= */}
          {showSection("principles") ? (
          <div className="celestial-pack-layer" style={sectionLayer("principles", 2)}>
          {/* "principles" Title */}
          <div
            id="preview-el-principles-title"
            data-element-id="principles-title"
            onClick={() => handleElementClick("principles-title", "principles")}
            style={figmaBox({
              x: 69,
              y: 3083,
              width: 293,
              height: 52,
              zIndex: 3,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: "6px",
                ...getStyle("principles-title", {
                  fontFamily: FONT_ONIROM,
                  fontWeight: 400,
                  fontSize: "35px",
                  letterSpacing: "0.08em",
                  textAlign: "center",
                  color: COLOR_WHITE,
                  textTransform: "uppercase",
                }),
                ...getElementHighlightStyle("principles-title"),
              },
            })}
          >
            {(!overrides["principles-title"]?.text || overrides["principles-title"]?.text.trim().toUpperCase() === "PRINCIPLES") &&
            (!currentInvite.principlesTitle || currentInvite.principlesTitle.trim().toUpperCase() === "PRINCIPLES") &&
            !overrides["principles-title"]?.fontFamily &&
            !overrides["principles-title"]?.fontSize ? (
              <img src={principlesTitleSvg} alt="PRINCIPLES" style={{ width: 172, height: 26, display: "block" }} />
            ) : (
              getText("principles-title", currentInvite.principlesTitle || "PRINCIPLES")
            )}
          </div>

          {/* Paragraph 1 */}
          <div
            id="preview-el-principles-text-1"
            data-element-id="principles-text-1"
            onClick={() => handleElementClick("principles-text-1", "principles")}
            style={figmaBox({
              x: 103,
              y: 3165,
              width: 225,
              height: 261,
              zIndex: 3,
              extra: {
                ...getStyle("principles-text-1", {
                  fontFamily: FONT_ROSARIO,
                  fontWeight: 700,
                  fontSize: "12px",
                  lineHeight: "24px",
                  letterSpacing: "0.3333em",
                  textAlign: "center",
                  color: COLOR_WHITE,
                }),
                ...getElementHighlightStyle("principles-text-1"),
              },
            })}
          >
            {getText(
              "principles-text-1",
              currentInvite.principlesP1 ||
                "Voluptatum non fugiat qui ab non. At ut quasi dolorum numquam voluptas rerum qui. Non rem sunt fugiat numquam molestiae vero dolores dolores. Dolor ut sit quos accusantium vitae aliquid ducimus"
            )}
          </div>

          {/* Paragraph 2 */}
          <div
            id="preview-el-principles-text-2"
            data-element-id="principles-text-2"
            onClick={() => handleElementClick("principles-text-2", "principles")}
            style={figmaBox({
              x: 103,
              y: 3427,
              width: 225,
              height: 115,
              zIndex: 3,
              extra: {
                ...getStyle("principles-text-2", {
                  fontFamily: FONT_ROSARIO,
                  fontWeight: 700,
                  fontSize: "12px",
                  lineHeight: "24px",
                  letterSpacing: "0.3333em",
                  textAlign: "center",
                  color: COLOR_WHITE,
                }),
                ...getElementHighlightStyle("principles-text-2"),
              },
            })}
          >
            {getText(
              "principles-text-2",
              currentInvite.principlesP2 ||
                "Voluptatum non fugiat qui ab non. At ut quasi dolorum numquam voluptas rerum qui."
            )}
          </div>

          {/* Animated Constellations */}
          <img
            src={constellation1_1}
            alt=""
            className="celestial-twinkle-1"
            style={figmaBox({
              x: -52,
              y: 3186,
              width: 138,
              height: 97,
              zIndex: 3,
              extra: { pointerEvents: "none" },
            })}
          />
          <img
            src={constellation2_1}
            alt=""
            className="celestial-twinkle-2"
            style={figmaBox({
              x: 343,
              y: 3224,
              width: 117,
              height: 103,
              zIndex: 3,
              extra: { pointerEvents: "none" },
            })}
          />
          <img
            src={constellation1_2}
            alt=""
            className="celestial-twinkle-2"
            style={figmaBox({
              x: -69,
              y: 3461,
              width: 153,
              height: 168,
              zIndex: 3,
              extra: { pointerEvents: "none" },
            })}
          />
          <img
            src={constellation3_1}
            alt=""
            className="celestial-twinkle-1"
            style={figmaBox({
              x: 368,
              y: 3506,
              width: 123,
              height: 107,
              zIndex: 3,
              extra: { pointerEvents: "none" },
            })}
          />

          {/* Holding Hands Graphic */}
          <img
            src={handsHolding}
            alt="Hands Holding"
            style={figmaBox({
              x: 188,
              y: 3572,
              width: 54,
              height: 98,
              zIndex: 3,
              extra: { objectFit: "contain", filter: "grayscale(100%)" },
            })}
          />
          </div>
          ) : null}

          {/* =========================================================================
              SECTION 7: RSVP (y: 3716 - 4425) — card overlaps the footer photo, so it sits above it
              ========================================================================= */}
          {showSection("rsvp") ? (
          <div className="celestial-pack-layer" style={sectionLayer("rsvp", 3)}>
          {/* Rounded Beige Pill Container */}
          <div
            style={figmaBox({
              x: -2,
              y: 3716,
              width: 434,
              height: 709,
              zIndex: 2,
              extra: {
                backgroundColor: COLOR_SAND,
                borderRadius: "217px",
              },
            })}
          />

          {/* "RSVP" Title */}
          <div
            id="preview-el-rsvp-title"
            data-element-id="rsvp-title"
            onClick={() => handleElementClick("rsvp-title", "rsvp")}
            style={figmaBox({
              x: 69,
              y: 3786,
              width: 293,
              height: 52,
              zIndex: 3,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: "6px",
                paddingLeft: "1px",
                ...getStyle("rsvp-title", {
                  fontFamily: FONT_ONIROM,
                  fontWeight: 400,
                  fontSize: "35px",
                  letterSpacing: "0.08em",
                  textAlign: "center",
                  color: COLOR_BLACK,
                  textTransform: "uppercase",
                }),
                ...getElementHighlightStyle("rsvp-title"),
              },
            })}
          >
            {(!overrides["rsvp-title"]?.text || overrides["rsvp-title"]?.text.trim().toUpperCase() === "RSVP") &&
            (!currentInvite.rsvpTitle || currentInvite.rsvpTitle.trim().toUpperCase() === "RSVP") &&
            !overrides["rsvp-title"]?.fontFamily &&
            !overrides["rsvp-title"]?.fontSize ? (
              <img src={rsvpTitleSvg} alt="RSVP" style={{ width: 72, height: 26, display: "block" }} />
            ) : (
              getText("rsvp-title", currentInvite.rsvpTitle || "RSVP")
            )}
          </div>

          {/* "Will you attend" Label */}
          <div
            id="preview-el-rsvp-attend-label"
            data-element-id="rsvp-attend-label"
            onClick={() => handleElementClick("rsvp-attend-label", "rsvp")}
            style={figmaBox({
              x: 55,
              y: 3897,
              width: 152,
              height: 17,
              zIndex: 3,
              extra: {
                ...getStyle("rsvp-attend-label", {
                  fontFamily: FONT_ROSARIO,
                  fontWeight: 400,
                  fontSize: "14px",
                  letterSpacing: "0.2857em",
                  textAlign: "left",
                  color: COLOR_BLACK,
                }),
                ...getElementHighlightStyle("rsvp-attend-label"),
              },
            })}
          >
            {getText("rsvp-attend-label", currentInvite.rsvpAttendLabel || "Will you attend")}
          </div>

          {/* Radio Option 1: "Yes, I will be there" */}
          <div
            onClick={() => setSelectedAttend("yes")}
            style={figmaBox({
              x: 55,
              y: 3936,
              width: 14,
              height: 14,
              zIndex: 4,
              extra: {
                borderRadius: "50%",
                background: selectedAttend === "yes" ? COLOR_BLACK : "transparent",
                border: "1px solid transparent",
                boxShadow: "0 0 0 1px #D48744",
                cursor: "pointer",
              },
            })}
          />
          <div
            onClick={() => setSelectedAttend("yes")}
            style={figmaBox({
              x: 79,
              y: 3935,
              width: 133,
              height: 30,
              zIndex: 3,
              extra: {
                fontFamily: FONT_ROSARIO,
                fontWeight: 400,
                fontSize: "12px",
                lineHeight: "15px",
                letterSpacing: "0.3333em",
                textAlign: "left",
                color: COLOR_BLACK,
                cursor: "pointer",
                whiteSpace: "pre-line",
              },
            })}
          >
            {"Yes, I will be\nthere"}
          </div>

          {/* Radio Option 2: "Sorry, I can't make it" */}
          <div
            onClick={() => setSelectedAttend("no")}
            style={figmaBox({
              x: 216,
              y: 3936,
              width: 14,
              height: 14,
              zIndex: 4,
              extra: {
                borderRadius: "50%",
                background: selectedAttend === "no" ? COLOR_BLACK : "transparent",
                border: "1px solid transparent",
                boxShadow: "0 0 0 1px #D48744",
                cursor: "pointer",
              },
            })}
          />
          <div
            onClick={() => setSelectedAttend("no")}
            style={figmaBox({
              x: 240,
              y: 3935,
              width: 135,
              height: 30,
              zIndex: 3,
              extra: {
                fontFamily: FONT_ROSARIO,
                fontWeight: 400,
                fontSize: "12px",
                lineHeight: "15px",
                letterSpacing: "0.3333em",
                textAlign: "left",
                color: COLOR_BLACK,
                cursor: "pointer",
                whiteSpace: "pre-line",
              },
            })}
          >
            {"Sorry, I can’t\nmake it"}
          </div>

          {/* RSVP Form Inputs */}
          <form onSubmit={handleRsvpSubmit}>
            {/* Field 1: Name */}
            <div style={figmaBox({ x: 55, y: 3982, width: 320, height: 70, zIndex: 3 })}>
              <div
                style={{
                  position: "relative",
                  width: "320px",
                  height: "40px",
                  borderBottom: "1px solid #000000",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type="text"
                  placeholder="Name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  disabled={editable}
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    fontFamily: FONT_ROSARIO,
                    fontWeight: 400,
                    fontSize: "14px",
                    letterSpacing: "0.2857em",
                    color: COLOR_BLACK,
                  }}
                />
              </div>
            </div>

            {/* Field 2: Email (Figma placeholder said "Password") */}
            <div style={figmaBox({ x: 55, y: 4052, width: 320, height: 70, zIndex: 3 })}>
              <div
                style={{
                  position: "relative",
                  width: "320px",
                  height: "40px",
                  borderBottom: "1px solid #000000",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type="email"
                  placeholder="Email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  disabled={editable}
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    fontFamily: FONT_ROSARIO,
                    fontWeight: 400,
                    fontSize: "14px",
                    letterSpacing: "0.2857em",
                    color: COLOR_BLACK,
                  }}
                />
              </div>
            </div>

            {/* Field 3: Phone Number */}
            <div style={figmaBox({ x: 55, y: 4122, width: 320, height: 70, zIndex: 3 })}>
              <div
                style={{
                  position: "relative",
                  width: "320px",
                  height: "40px",
                  borderBottom: "1px solid #000000",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  disabled={editable}
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    fontFamily: FONT_ROSARIO,
                    fontWeight: 400,
                    fontSize: "14px",
                    letterSpacing: "0.2857em",
                    color: COLOR_BLACK,
                  }}
                />
              </div>
            </div>

            {/* Field 4: Number of Guests */}
            <div style={figmaBox({ x: 55, y: 4192, width: 320, height: 70, zIndex: 3 })}>
              <div
                style={{
                  position: "relative",
                  width: "320px",
                  height: "40px",
                  borderBottom: "1px solid #000000",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type="number"
                  min="1"
                  placeholder="Number of Guests"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  disabled={editable}
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    fontFamily: FONT_ROSARIO,
                    fontWeight: 400,
                    fontSize: "14px",
                    letterSpacing: "0.2857em",
                    color: COLOR_BLACK,
                  }}
                />
              </div>
            </div>

            {/* Submit Button: "Send !" */}
            <button
              type="button"
              id="preview-el-rsvp-submit-btn"
              data-element-id="rsvp-submit-btn"
              onClick={(e) => {
                if (editable) {
                  handleElementClick("rsvp-submit-btn", "rsvp");
                } else {
                  handleRsvpSubmit(e);
                }
              }}
              style={figmaBox({
                x: 104,
                y: 4288,
                width: 223,
                height: 53,
                zIndex: 4,
                extra: {
                  backgroundColor: COLOR_WHITE,
                  borderRadius: "50px",
                  border: "none",
                  fontFamily: FONT_ROSARIO,
                  fontWeight: 700,
                  fontSize: "14px",
                  lineHeight: "20px",
                  letterSpacing: "0.2857em",
                  textAlign: "center",
                  color: COLOR_BLACK,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                  ...getElementHighlightStyle("rsvp-submit-btn"),
                },
              })}
            >
              {rsvpSubmitting
                ? "Envoi..."
                : rsvpSuccess
                ? "Merci !"
                : getText("rsvp-submit-btn", currentInvite.sendButton || "Send !")}
            </button>
          </form>

          {rsvpError || rsvpSuccess ? (
            <div
              role="status"
              style={figmaBox({
                x: 55,
                y: 4350,
                width: 320,
                height: 40,
                zIndex: 4,
                extra: {
                  fontFamily: FONT_ROSARIO,
                  fontSize: "12px",
                  lineHeight: "16px",
                  textAlign: "center",
                  color: rsvpError ? "#9F1239" : COLOR_BLACK,
                },
              })}
            >
              {rsvpError || "Merci ! Votre réponse a bien été enregistrée."}
            </div>
          ) : null}
          </div>
          ) : null}

          {/* =========================================================================
              SECTION 8: FOOTER (y: 4130 - 4604)
              ========================================================================= */}
          <div className="celestial-pack-layer" style={sectionLayer("footer", 2)}>
          {/* Footer photo (starts under the RSVP card) */}
          <img
            src={heroBg}
            alt=""
            style={figmaBox({
              x: 0,
              y: 4130,
              width: 430,
              height: 474,
              zIndex: 1,
              extra: { objectFit: "cover", filter: "grayscale(100%)", pointerEvents: "none" },
            })}
          />
          {/* "Untill infinity" Script */}
          <div
            id="preview-el-footer-infinity"
            data-element-id="footer-infinity"
            onClick={() => handleElementClick("footer-infinity", "footer")}
            style={figmaBox({
              x: 104,
              y: 4487,
              width: 223,
              height: 48,
              zIndex: 3,
              extra: {
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                ...getStyle("footer-infinity", {
                  fontFamily: FONT_BEAU_RIVAGE,
                  fontWeight: 400,
                  fontSize: "28px",
                  letterSpacing: "0.1667em",
                  textAlign: "center",
                  color: COLOR_WHITE,
                }),
                ...getElementHighlightStyle("footer-infinity"),
              },
            })}
          >
            {(!overrides["footer-infinity"]?.text || overrides["footer-infinity"]?.text.trim().toLowerCase() === "untill infinity") &&
            (!currentInvite.footerQuote || currentInvite.footerQuote.trim().toLowerCase() === "untill infinity") &&
            !overrides["footer-infinity"]?.fontFamily &&
            !overrides["footer-infinity"]?.fontSize ? (
              <img src={untillInfinitySvg} alt="Untill infinity" style={{ width: 179, height: 30, display: "block" }} />
            ) : (
              getText("footer-infinity", currentInvite.footerQuote || "Untill infinity")
            )}
          </div>

          {/* "Jonathan & Marrisah" Serif */}
          <div
            id="preview-el-footer-names"
            data-element-id="footer-names"
            onClick={() => handleElementClick("footer-names", "footer")}
            style={figmaBox({
              x: 104,
              y: 4528,
              width: 223,
              height: 48,
              zIndex: 3,
              extra: {
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                paddingTop: "2px",
                ...getStyle("footer-names", {
                  fontFamily: FONT_ONIROM,
                  fontWeight: 400,
                  fontSize: "14px",
                  letterSpacing: "0.25em",
                  textAlign: "center",
                  color: COLOR_WHITE,
                  textTransform: "uppercase",
                }),
                ...getElementHighlightStyle("footer-names"),
              },
            })}
          >
            {!overrides["footer-names"]?.text &&
            (!currentInvite.coupleNames || currentInvite.coupleNames.toLowerCase().includes("jonathan")) &&
            !overrides["footer-names"]?.fontFamily &&
            !overrides["footer-names"]?.fontSize ? (
              <img src={footerNamesSvg} alt="JONATHAN & MARRISAH" style={{ width: 211, height: 12, display: "block" }} />
            ) : (
              getText("footer-names", coupleNames)
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
