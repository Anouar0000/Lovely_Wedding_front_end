import React, { useEffect, useRef, useState } from "react";
import AudioPlayer from "../components/audio/AudioPlayer";
import ParticleEmitter from "../components/animations/ParticleEmitter";
import templateConfig from "../data/digital/templates/majestic-white.json";

// Assets for Majestic White Template
import heroBg from "../assets/digital/majestic-white/hero-bg.png";
import monogramLogo from "../assets/digital/majestic-white/monogram-logo.svg";
import separatorSvg from "../assets/digital/majestic-white/separator.svg";
import storyFrame from "../assets/digital/majestic-white/story-frame.png";
import storyPhotoDefault from "../assets/digital/majestic-white/story-photo.png";
import countdownBg from "../assets/digital/majestic-white/countdown-bg.png";
import envelopeImg from "../assets/digital/majestic-white/envelope.png";
import paperCard from "../assets/digital/majestic-white/paper-card.png";
import waxSeal from "../assets/digital/majestic-white/wax-seal.png";
import timelineVector from "../assets/digital/majestic-white/timeline-vector.svg";
import footerBg from "../assets/digital/majestic-white/footer-bg.png";
import bgGradient from "../assets/digital/majestic-white/bg-gradient.png";
import pearlRight from "../assets/digital/majestic-white/pearl-right.png";
import pearlLeft from "../assets/digital/majestic-white/pearl-left.png";

// Exact 1:1 Vector Text from Figma
import ourStoryTitleSvg from "../assets/digital/majestic-white/svg_text/our-story-title.svg";
import countdownTitleSvg from "../assets/digital/majestic-white/svg_text/countdown-title.svg";
import formalInviteTitleSvg from "../assets/digital/majestic-white/svg_text/formal-invite-title.svg";
import celebrationsTitleSvg from "../assets/digital/majestic-white/svg_text/celebrations-title.svg";
import timelineTitleSvg from "../assets/digital/majestic-white/svg_text/timeline-title.svg";
import leaveAMessageTitleSvg from "../assets/digital/majestic-white/svg_text/leave-a-message-title.svg";
import rsvpTitleSvg from "../assets/digital/majestic-white/svg_text/rsvp-title.svg";
import footerNamesSvg from "../assets/digital/majestic-white/svg_text/footer-names.svg";

const CANVAS_WIDTH = 430;
const CANVAS_HEIGHT = 4130;

// Colors
const COLOR_WHITE = "#FFFFFF";
const COLOR_TAUPE = "#977F6D";
const COLOR_BORDER = "#E5E5E5";

// Typography
const FONT_SLOOP = "'Sloop Script', 'Pinyon Script', 'Alex Brush', 'Beau Rivage', cursive";
const FONT_CORMORANT = "'Cormorant', serif";
const FONT_CORMORANT_INFANT = "'Cormorant Infant', 'Cormorant', serif";

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

export default function MajesticWhiteInvitePage({
  invite,
  editable = false,
  activeSection = null,
  onSelectElement = null,
  selectedElementId = null,
}) {
  const currentInvite = invite || templateConfig.sample;
  const overrides = currentInvite.styleOverrides || {};

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
        const availableWidth = window.innerWidth;
        if (!editable && availableWidth < CANVAS_WIDTH) {
          setScale(availableWidth / CANVAS_WIDTH);
        } else {
          setScale(1);
        }
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [editable]);

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
      outline: isSelected ? "2px solid #977F6D" : "1px dashed rgba(151, 127, 109, 0.4)",
      outlineOffset: "2px",
      cursor: "pointer",
      transition: "outline 0.15s ease",
    };
  };

  // RSVP Form State
  const [guestName, setGuestName] = useState("");
  const [guestSirName, setGuestSirName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  // Guestbook Message State
  const [guestMessage, setGuestMessage] = useState("");
  const [messageSent, setMessageSent] = useState(false);

  const handleRsvpSubmit = (e) => {
    e?.preventDefault?.();
    if (!guestName.trim()) {
      alert("Veuillez indiquer votre nom.");
      return;
    }
    setRsvpSubmitting(true);
    setTimeout(() => {
      setRsvpSubmitting(false);
      setRsvpSuccess(true);
      setTimeout(() => setRsvpSuccess(false), 5000);
    }, 700);
  };

  const handleMessageSubmit = (e) => {
    e?.preventDefault?.();
    if (!guestMessage.trim()) return;
    setMessageSent(true);
    setTimeout(() => {
      setGuestMessage("");
      setMessageSent(false);
    }, 4000);
  };

  // Dynamic values
  const coupleNames = currentInvite.coupleNames || "Damon & Alice";
  const eventDate = currentInvite.eventDate || "2026-09-15";

  // Format date as "15 . 09 . 2026"
  const formattedDate = (() => {
    if (!eventDate) return "15 . 09 . 2026";
    const parts = eventDate.split("-");
    if (parts.length === 3) {
      return `${parts[2]} . ${parts[1]} . ${parts[0]}`;
    }
    return eventDate;
  })();

  // Live Countdown Calculation
  const [timeLeft, setTimeLeft] = useState({ days: "60", hours: "05", minutes: "32" });

  useEffect(() => {
    const calculateCountdown = () => {
      if (!eventDate) return;
      const target = new Date(`${eventDate}T18:00:00`).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft({
          days: String(days).padStart(2, "0"),
          hours: String(hours).padStart(2, "0"),
          minutes: String(minutes).padStart(2, "0"),
        });
      } else {
        // Default sample if in the past
        setTimeLeft({ days: "60", hours: "05", minutes: "32" });
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 60000);
    return () => clearInterval(interval);
  }, [eventDate]);

  const storyImgSrc =
    overrides["story-photo"]?.image ||
    overrides["story-photo"]?.url ||
    currentInvite.storyPhoto ||
    storyPhotoDefault;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: editable ? "transparent" : "#F8F6F4",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        overflowX: "hidden",
      }}
    >
      {/* Music Player if configured */}
      {currentInvite.musicUrl && (
        <AudioPlayer
          musicUrl={currentInvite.musicUrl}
          autoPlay={!editable}
          themeColor="#977F6D"
        />
      )}

      {/* Scaling wrapper for mobile screen responsiveness */}
      <div
        style={{
          width: editable ? `${CANVAS_WIDTH}px` : `${CANVAS_WIDTH * scale}px`,
          height: editable ? `${CANVAS_HEIGHT}px` : `${CANVAS_HEIGHT * scale}px`,
          position: "relative",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          id="majestic-white-canvas-root"
          ref={canvasRef}
          style={{
            position: "relative",
            width: `${CANVAS_WIDTH}px`,
            height: `${CANVAS_HEIGHT}px`,
            backgroundColor: COLOR_WHITE,
            overflow: "hidden",
            boxShadow: editable ? "none" : "0 30px 80px rgba(0,0,0,0.12)",
            transform: editable ? "none" : `scale(${scale})`,
            transformOrigin: "top center",
          }}
        >
          {/* Subtle Shimmer / Falling Particles Effect */}
          {currentInvite.enablePetals !== false && (
            <ParticleEmitter
              type={currentInvite.particleType === "petals" ? "petals" : "sparkles"}
              count={currentInvite.petalsIntensity || currentInvite.sparklesIntensity || 25}
              color={currentInvite.petalsColor || currentInvite.sparklesColor || "#FFFFFF"}
              withSparkles={true}
              sparkleRatio={0.7}
              active={true}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 10 }}
            />
          )}

          {/* =========================================================================
              LAYER 0: GLOBAL BACKGROUNDS & GRADIENTS
              ========================================================================= */}
          {/* Top Hero BG (y: 0, x: -3, 436 x 654) */}
          <img
            src={heroBg}
            alt=""
            style={figmaBox({
              x: -3,
              y: 0,
              width: 436,
              height: 654,
              zIndex: 1,
              extra: { objectFit: "cover", pointerEvents: "none" },
            })}
          />

          {/* Global Soft Background Gradient (y: 652 to 4186, 430 x 3534) */}
          <img
            src={bgGradient}
            alt=""
            style={figmaBox({
              x: 0,
              y: 652,
              width: 430,
              height: 3534,
              zIndex: 1,
              extra: { pointerEvents: "none" },
            })}
          />

          {/* =========================================================================
              DECORATIVE SCATTERED PEARLS (z-index 2)
              ========================================================================= */}
          {/* Pearl 1 (Right, Our Story - y: 644, x: 323, 159 x 285) */}
          <img
            src={pearlRight}
            alt=""
            style={figmaBox({
              x: 323,
              y: 644,
              width: 159,
              height: 285,
              zIndex: 2,
              extra: { pointerEvents: "none" },
            })}
          />

          {/* Pearl 2 (Left, Story Portrait - y: 960, x: -70, 227.35 x 316.44) */}
          <img
            src={pearlLeft}
            alt=""
            style={figmaBox({
              x: -70,
              y: 960,
              width: 227.35,
              height: 316.44,
              zIndex: 2,
              extra: { pointerEvents: "none" },
            })}
          />

          {/* Pearl 3 (Right, Below Countdown - y: 1383, x: 323, 159 x 285) */}
          <img
            src={pearlRight}
            alt=""
            style={figmaBox({
              x: 323,
              y: 1383,
              width: 159,
              height: 285,
              zIndex: 2,
              extra: { pointerEvents: "none" },
            })}
          />

          {/* Pearl 4 (Left, Celebrations - y: 2215, x: -70, 227.35 x 316.44) */}
          <img
            src={pearlLeft}
            alt=""
            style={figmaBox({
              x: -70,
              y: 2215,
              width: 227.35,
              height: 316.44,
              zIndex: 2,
              extra: { pointerEvents: "none" },
            })}
          />

          {/* Pearl 5 (Right, Timeline - y: 2792, x: 323, 159 x 285) */}
          <img
            src={pearlRight}
            alt=""
            style={figmaBox({
              x: 323,
              y: 2792,
              width: 159,
              height: 285,
              zIndex: 2,
              extra: { pointerEvents: "none" },
            })}
          />

          {/* Pearl 6 (Left, Leave a Message - y: 3101, x: -70, 227.35 x 316.44) */}
          <img
            src={pearlLeft}
            alt=""
            style={figmaBox({
              x: -70,
              y: 3101,
              width: 227.35,
              height: 316.44,
              zIndex: 2,
              extra: { pointerEvents: "none" },
            })}
          />

          {/* Pearl 7 (Right, RSVP - y: 3677, x: 320, 159 x 285) */}
          <img
            src={pearlRight}
            alt=""
            style={figmaBox({
              x: 320,
              y: 3677,
              width: 159,
              height: 285,
              zIndex: 2,
              extra: { pointerEvents: "none" },
            })}
          />

          {/* =========================================================================
              SECTION 1: HERO (y: 0 - 654)
              ========================================================================= */}
          {/* Monogram Interlocking Logo "D & A" (y: 282.63, x: 140, 149.49 x 121.57) */}
          <div
            id="preview-el-hero-monogram"
            data-element-id="hero-monogram"
            onClick={() => handleElementClick("hero-monogram", "hero")}
            style={figmaBox({
              x: 140,
              y: 282.63,
              width: 149.49,
              height: 121.57,
              zIndex: 3,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                ...getElementHighlightStyle("hero-monogram"),
              },
            })}
          >
            <img
              src={
                overrides["hero-monogram"]?.image ||
                overrides["hero-monogram"]?.url ||
                currentInvite.monogramImg ||
                monogramLogo
              }
              alt="Damon & Alice Monogram"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>

          {/* Date: "15 . 09 . 2026" (y: 415 optical match, x: 121, 188 x 27) */}
          <div
            id="preview-el-hero-date"
            data-element-id="hero-date"
            onClick={() => handleElementClick("hero-date", "hero")}
            style={figmaBox({
              x: 121,
              y: 415,
              width: 188,
              height: 27,
              zIndex: 3,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                ...getStyle("hero-date", {
                  fontFamily: FONT_CORMORANT_INFANT,
                  fontWeight: 400,
                  fontSize: "20px",
                  lineHeight: "16px",
                  letterSpacing: "0.1em",
                  textAlign: "center",
                  color: COLOR_TAUPE,
                  textTransform: "capitalize",
                }),
                ...getElementHighlightStyle("hero-date"),
              },
            })}
          >
            {getText("hero-date", formattedDate)}
          </div>

          {/* Downward Diamond Arrow Separator (y: 561, x: 215, 6 x 19) */}
          <img
            src={separatorSvg}
            alt=""
            style={figmaBox({
              x: 215,
              y: 561,
              width: 6,
              height: 19,
              zIndex: 3,
            })}
          />

          {/* =========================================================================
              SECTION 2: OUR STORY (y: 654 - 1174)
              ========================================================================= */}
          {/* Title: "Our Story" (y: 709, x: 141, 148 x 46) */}
          <div
            id="preview-el-story-title"
            data-element-id="story-title"
            onClick={() => handleElementClick("story-title", "our-story")}
            style={figmaBox({
              x: 141,
              y: 709,
              width: 148,
              height: 46,
              zIndex: 3,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                ...getStyle("story-title", {
                  fontFamily: FONT_SLOOP,
                  fontWeight: 400,
                  fontSize: "34px",
                  lineHeight: "40px",
                  color: COLOR_TAUPE,
                  textAlign: "center",
                }),
                ...getElementHighlightStyle("story-title"),
              },
            })}
          >
            {!overrides["story-title"]?.text &&
            (!currentInvite.storyTitle || currentInvite.storyTitle.trim().toLowerCase() === "our story") &&
            !overrides["story-title"]?.fontFamily ? (
              <img src={ourStoryTitleSvg} alt="Our Story" style={{ width: 111, height: 41, display: "block" }} />
            ) : (
              getText("story-title", currentInvite.storyTitle || "Our Story")
            )}
          </div>

          {/* Story Text (y: 772, x: 61, 309 x 165) */}
          <div
            id="preview-el-story-text"
            data-element-id="story-text"
            onClick={() => handleElementClick("story-text", "our-story")}
            style={figmaBox({
              x: 61,
              y: 772,
              width: 309,
              height: 165,
              zIndex: 3,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                ...getStyle("story-text", {
                  fontFamily: FONT_CORMORANT,
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "20px",
                  textAlign: "center",
                  color: COLOR_TAUPE,
                  textTransform: "capitalize",
                  whiteSpace: "pre-line",
                }),
                ...getElementHighlightStyle("story-text"),
              },
            })}
          >
            {getText(
              "story-text",
              currentInvite.storyText ||
                "Voluptatum Non Fugiat Qui Ab Non.\nAt Ut Quasi Dolorum Numquam Voluptas\nRerum Qui. Non R Numquam Molestiae Vero\nDolores Dolores. Dolor Ut Sit Quos\nAccusantium Vitae Aliquid Ducimus"
            )}
          </div>

          {/* Story Frame: Sculpted White Oval Frame (y: 903, x: 143, 145 x 243) */}
          <img
            src={storyFrame}
            alt=""
            style={figmaBox({
              x: 143,
              y: 903,
              width: 145,
              height: 243,
              zIndex: 3,
              extra: { pointerEvents: "none" },
            })}
          />

          {/* Story Photo inside oval mask (y: 960, x: 172, 87 x 128) */}
          <div
            id="preview-el-story-photo"
            data-element-id="story-photo"
            onClick={() => handleElementClick("story-photo", "our-story")}
            style={figmaBox({
              x: 172,
              y: 960,
              width: 87,
              height: 128,
              zIndex: 4,
              extra: {
                borderRadius: "50%",
                overflow: "hidden",
                cursor: "pointer",
                ...getElementHighlightStyle("story-photo"),
              },
            })}
          >
            <img
              src={storyImgSrc}
              alt="Couple Portrait"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* =========================================================================
              SECTION 3: COUNTDOWN (y: 1174 - 1503)
              ========================================================================= */}
          {/* Background Banner (y: 1174, x: 0, 430 x 261) */}
          <img
            src={countdownBg}
            alt=""
            style={figmaBox({
              x: 0,
              y: 1174,
              width: 430,
              height: 261,
              zIndex: 2,
              extra: { objectFit: "cover", pointerEvents: "none" },
            })}
          />

          {/* Title: "Countdown" (y: 1235, x: 141, 148 x 46) */}
          <div
            id="preview-el-countdown-title"
            data-element-id="countdown-title"
            onClick={() => handleElementClick("countdown-title", "countdown")}
            style={figmaBox({
              x: 141,
              y: 1235,
              width: 148,
              height: 46,
              zIndex: 3,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                ...getStyle("countdown-title", {
                  fontFamily: FONT_SLOOP,
                  fontWeight: 400,
                  fontSize: "34px",
                  lineHeight: "40px",
                  color: COLOR_WHITE,
                  textAlign: "center",
                }),
                ...getElementHighlightStyle("countdown-title"),
              },
            })}
          >
            {!overrides["countdown-title"]?.text &&
            (!currentInvite.countdownTitle || currentInvite.countdownTitle.trim().toLowerCase() === "countdown") &&
            !overrides["countdown-title"]?.fontFamily ? (
              <img src={countdownTitleSvg} alt="Countdown" style={{ width: 107, height: 30, display: "block" }} />
            ) : (
              getText("countdown-title", currentInvite.countdownTitle || "Countdown")
            )}
          </div>

          {/* Countdown Numbers & Labels Group (y: 1298, x: 57, 319 x 64) */}
          <div
            style={figmaBox({
              x: 57,
              y: 1298,
              width: 319,
              height: 64,
              zIndex: 3,
            })}
          >
            {/* Days */}
            <div
              style={{
                position: "absolute",
                left: "5px",
                top: "0px",
                width: "44px",
                height: "35px",
                fontFamily: FONT_CORMORANT_INFANT,
                fontWeight: 500,
                fontSize: "30px",
                lineHeight: "40px",
                textAlign: "center",
                color: COLOR_WHITE,
              }}
            >
              {timeLeft.days}
            </div>
            <div
              style={{
                position: "absolute",
                left: "0px",
                top: "40px",
                width: "53px",
                height: "24px",
                fontFamily: FONT_CORMORANT,
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "18px",
                textAlign: "center",
                color: COLOR_WHITE,
                textTransform: "uppercase",
              }}
            >
              Days
            </div>

            {/* Hours */}
            <div
              style={{
                position: "absolute",
                left: "132px",
                top: "0px",
                width: "44px",
                height: "35px",
                fontFamily: FONT_CORMORANT_INFANT,
                fontWeight: 500,
                fontSize: "30px",
                lineHeight: "40px",
                textAlign: "center",
                color: COLOR_WHITE,
              }}
            >
              {timeLeft.hours}
            </div>
            <div
              style={{
                position: "absolute",
                left: "127px",
                top: "40px",
                width: "54px",
                height: "24px",
                fontFamily: FONT_CORMORANT,
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "18px",
                textAlign: "center",
                color: COLOR_WHITE,
                textTransform: "uppercase",
              }}
            >
              Hours
            </div>

            {/* Minutes */}
            <div
              style={{
                position: "absolute",
                left: "258px",
                top: "0px",
                width: "44px",
                height: "35px",
                fontFamily: FONT_CORMORANT_INFANT,
                fontWeight: 500,
                fontSize: "30px",
                lineHeight: "40px",
                textAlign: "center",
                color: COLOR_WHITE,
              }}
            >
              {timeLeft.minutes}
            </div>
            <div
              style={{
                position: "absolute",
                left: "240px",
                top: "40px",
                width: "79px",
                height: "24px",
                fontFamily: FONT_CORMORANT,
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "18px",
                textAlign: "center",
                color: COLOR_WHITE,
                textTransform: "uppercase",
              }}
            >
              Minutes
            </div>
          </div>

          {/* =========================================================================
              SECTION 4: FORMAL INVITE & ENVELOPE (y: 1503 - 2081)
              ========================================================================= */}
          {/* Title: "Formal Invite" (y: 1503, x: 135, 161 x 46) */}
          <div
            id="preview-el-formal-invite-title"
            data-element-id="formal-invite-title"
            onClick={() => handleElementClick("formal-invite-title", "formal-invite")}
            style={figmaBox({
              x: 135,
              y: 1503,
              width: 161,
              height: 46,
              zIndex: 3,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                ...getStyle("formal-invite-title", {
                  fontFamily: FONT_SLOOP,
                  fontWeight: 400,
                  fontSize: "34px",
                  lineHeight: "40px",
                  color: COLOR_TAUPE,
                  textAlign: "center",
                }),
                ...getElementHighlightStyle("formal-invite-title"),
              },
            })}
          >
            {!overrides["formal-invite-title"]?.text &&
            (!currentInvite.formalInviteTitle || currentInvite.formalInviteTitle.trim().toLowerCase() === "formal invite") &&
            !overrides["formal-invite-title"]?.fontFamily ? (
              <img src={formalInviteTitleSvg} alt="Formal Invite" style={{ width: 171, height: 30, display: "block" }} />
            ) : (
              getText("formal-invite-title", currentInvite.formalInviteTitle || "Formal Invite")
            )}
          </div>

          {/* Envelope: Open Satin Silk Envelope (y: 1549, x: 59, 312 x 559) */}
          <img
            src={envelopeImg}
            alt=""
            style={figmaBox({
              x: 59,
              y: 1549,
              width: 312,
              height: 559,
              zIndex: 2,
              extra: { objectFit: "cover" },
            })}
          />

          {/* Paper Card: Fine Art Textured Stationery (y: 1588, x: 103, 224 x 336) */}
          <img
            id="preview-el-paper-card-img"
            data-element-id="paper-card-img"
            onClick={() => handleElementClick("paper-card-img", "formal-invite")}
            src={
              overrides["paper-card-img"]?.image ||
              overrides["paper-card-img"]?.url ||
              currentInvite.paperCardImg ||
              paperCard
            }
            alt="Formal Invitation Paper Card"
            style={figmaBox({
              x: 103,
              y: 1588,
              width: 224,
              height: 336,
              zIndex: 3,
              extra: {
                boxShadow: "2px 2px 10px 0px rgba(0, 0, 0, 0.25)",
                objectFit: "cover",
                cursor: "pointer",
                ...getElementHighlightStyle("paper-card-img"),
              },
            })}
          />

          {/* Wax Seal / White Peony Blossom (y: 1918, x: 296, 100 x 108) */}
          <img
            src={waxSeal}
            alt=""
            style={figmaBox({
              x: 296,
              y: 1918,
              width: 100,
              height: 108,
              zIndex: 4,
              extra: { objectFit: "cover", pointerEvents: "none" },
            })}
          />

          {/* =========================================================================
              SECTION 5: CELEBRATIONS (y: 2081 - 2636)
              ========================================================================= */}
          {/* Title: "Celebrations" (y: 2081, x: 141, 148 x 46) */}
          <div
            id="preview-el-celebrations-title"
            data-element-id="celebrations-title"
            onClick={() => handleElementClick("celebrations-title", "celebrations")}
            style={figmaBox({
              x: 141,
              y: 2081,
              width: 148,
              height: 46,
              zIndex: 3,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                ...getStyle("celebrations-title", {
                  fontFamily: FONT_SLOOP,
                  fontWeight: 400,
                  fontSize: "34px",
                  lineHeight: "40px",
                  color: COLOR_TAUPE,
                  textAlign: "center",
                }),
                ...getElementHighlightStyle("celebrations-title"),
              },
            })}
          >
            {!overrides["celebrations-title"]?.text &&
            (!currentInvite.celebrationsTitle || currentInvite.celebrationsTitle.trim().toLowerCase() === "celebrations") &&
            !overrides["celebrations-title"]?.fontFamily ? (
              <img src={celebrationsTitleSvg} alt="Celebrations" style={{ width: 113, height: 30, display: "block" }} />
            ) : (
              getText("celebrations-title", currentInvite.celebrationsTitle || "Celebrations")
            )}
          </div>

          {/* Subtitle 1 (y: 2144, x: 82, 266 x 47) */}
          <div
            id="preview-el-celebrations-subtitle"
            data-element-id="celebrations-subtitle"
            onClick={() => handleElementClick("celebrations-subtitle", "celebrations")}
            style={figmaBox({
              x: 82,
              y: 2144,
              width: 266,
              height: 47,
              zIndex: 3,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                ...getStyle("celebrations-subtitle", {
                  fontFamily: FONT_CORMORANT,
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "20px",
                  textAlign: "center",
                  color: COLOR_TAUPE,
                  whiteSpace: "pre-line",
                }),
                ...getElementHighlightStyle("celebrations-subtitle"),
              },
            })}
          >
            {getText(
              "celebrations-subtitle",
              currentInvite.celebrationsSubtitle ||
                "Voluptatum Non Fugiat Qui Ab Non.\nAt Ut Quasi Dolorum Numquam Voluptas"
            )}
          </div>

          {/* Event 1 Venue Name: "Club Nautique" (y: 2201, x: 158, 115 x 28) */}
          <div
            id="preview-el-celebration1-title"
            data-element-id="celebration1-title"
            onClick={() => handleElementClick("celebration1-title", "celebrations")}
            style={figmaBox({
              x: 158,
              y: 2201,
              width: 115,
              height: 28,
              zIndex: 3,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                ...getStyle("celebration1-title", {
                  fontFamily: FONT_CORMORANT,
                  fontWeight: 700,
                  fontSize: "18px",
                  lineHeight: "20px",
                  textAlign: "center",
                  color: COLOR_TAUPE,
                  textTransform: "capitalize",
                }),
                ...getElementHighlightStyle("celebration1-title"),
              },
            })}
          >
            {getText("celebration1-title", currentInvite.celebration1Title || "Club Nautique")}
          </div>

          {/* Event 1 Address / Time: "Les Berges Du Lac 1 \nÀ 18h" (y: 2235, x: 136, 159 x 59) */}
          <div
            id="preview-el-celebration1-address"
            data-element-id="celebration1-address"
            onClick={() => handleElementClick("celebration1-address", "celebrations")}
            style={figmaBox({
              x: 136,
              y: 2235,
              width: 159,
              height: 59,
              zIndex: 3,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                ...getStyle("celebration1-address", {
                  fontFamily: FONT_CORMORANT,
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "20px",
                  textAlign: "center",
                  color: COLOR_TAUPE,
                  textTransform: "capitalize",
                  whiteSpace: "pre-line",
                }),
                ...getElementHighlightStyle("celebration1-address"),
              },
            })}
          >
            {getText("celebration1-address", currentInvite.celebration1Address || "Les Berges Du Lac 1\nÀ 18h")}
          </div>

          {/* Event 1 Button: "Open In Maps" (y: 2289, x: 136, 158 x 45) */}
          <a
            href={currentInvite.celebration1MapUrl || "https://maps.google.com/?q=Club+Nautique+Les+Berges+du+Lac"}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              ...figmaBox({
                x: 136,
                y: 2289,
                width: 158,
                height: 45,
                zIndex: 3,
                extra: {
                  backgroundColor: COLOR_WHITE,
                  border: `1px solid ${COLOR_TAUPE}`,
                  borderRadius: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: FONT_CORMORANT,
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "20px",
                  textAlign: "center",
                  color: COLOR_TAUPE,
                  textTransform: "capitalize",
                  textDecoration: "none",
                  cursor: "pointer",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                },
              }),
            }}
          >
            Open In Maps
          </a>

          {/* Subtitle 2 (y: 2370, x: 82, 266 x 47) */}
          <div
            id="preview-el-celebration2-subtitle"
            data-element-id="celebration2-subtitle"
            onClick={() => handleElementClick("celebration2-subtitle", "celebrations")}
            style={figmaBox({
              x: 82,
              y: 2370,
              width: 266,
              height: 47,
              zIndex: 3,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                ...getStyle("celebration2-subtitle", {
                  fontFamily: FONT_CORMORANT,
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "20px",
                  textAlign: "center",
                  color: COLOR_TAUPE,
                  textTransform: "capitalize",
                  whiteSpace: "pre-line",
                }),
                ...getElementHighlightStyle("celebration2-subtitle"),
              },
            })}
          >
            {getText(
              "celebration2-subtitle",
              currentInvite.celebration2Subtitle ||
                "Voluptatum Non Fugiat Qui Ab Non.\nAt Ut Quasi Dolorum Numquam Voluptas"
            )}
          </div>

          {/* Event 2 Venue Name: "Club Nautique" (y: 2427, x: 158, 115 x 28) */}
          <div
            id="preview-el-celebration2-title"
            data-element-id="celebration2-title"
            onClick={() => handleElementClick("celebration2-title", "celebrations")}
            style={figmaBox({
              x: 158,
              y: 2427,
              width: 115,
              height: 28,
              zIndex: 3,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                ...getStyle("celebration2-title", {
                  fontFamily: FONT_CORMORANT,
                  fontWeight: 700,
                  fontSize: "18px",
                  lineHeight: "20px",
                  textAlign: "center",
                  color: COLOR_TAUPE,
                  textTransform: "capitalize",
                }),
                ...getElementHighlightStyle("celebration2-title"),
              },
            })}
          >
            {getText("celebration2-title", currentInvite.celebration2Title || "Club Nautique")}
          </div>

          {/* Event 2 Address / Time: "Les Berges Du Lac 1 \nÀ 18h" (y: 2461, x: 136, 159 x 59) */}
          <div
            id="preview-el-celebration2-address"
            data-element-id="celebration2-address"
            onClick={() => handleElementClick("celebration2-address", "celebrations")}
            style={figmaBox({
              x: 136,
              y: 2461,
              width: 159,
              height: 59,
              zIndex: 3,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                ...getStyle("celebration2-address", {
                  fontFamily: FONT_CORMORANT,
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "20px",
                  textAlign: "center",
                  color: COLOR_TAUPE,
                  textTransform: "capitalize",
                  whiteSpace: "pre-line",
                }),
                ...getElementHighlightStyle("celebration2-address"),
              },
            })}
          >
            {getText("celebration2-address", currentInvite.celebration2Address || "Les Berges Du Lac 1\nÀ 18h")}
          </div>

          {/* Event 2 Button: "Open In Maps" (y: 2515, x: 136, 158 x 45) */}
          <a
            href={currentInvite.celebration2MapUrl || "https://maps.google.com/?q=Club+Nautique+Les+Berges+du+Lac"}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              ...figmaBox({
                x: 136,
                y: 2515,
                width: 158,
                height: 45,
                zIndex: 3,
                extra: {
                  backgroundColor: COLOR_WHITE,
                  border: `1px solid ${COLOR_TAUPE}`,
                  borderRadius: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: FONT_CORMORANT,
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "20px",
                  textAlign: "center",
                  color: COLOR_TAUPE,
                  textTransform: "capitalize",
                  textDecoration: "none",
                  cursor: "pointer",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                },
              }),
            }}
          >
            Open In Maps
          </a>

          {/* =========================================================================
              SECTION 6: TIMELINE (y: 2636 - 3069)
              ========================================================================= */}
          {/* Title: "Timeline" (y: 2636, x: 141, 148 x 46) */}
          <div
            id="preview-el-timeline-title"
            data-element-id="timeline-title"
            onClick={() => handleElementClick("timeline-title", "timeline")}
            style={figmaBox({
              x: 141,
              y: 2636,
              width: 148,
              height: 46,
              zIndex: 3,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                ...getStyle("timeline-title", {
                  fontFamily: FONT_SLOOP,
                  fontWeight: 400,
                  fontSize: "34px",
                  lineHeight: "40px",
                  color: COLOR_TAUPE,
                  textAlign: "center",
                }),
                ...getElementHighlightStyle("timeline-title"),
              },
            })}
          >
            {!overrides["timeline-title"]?.text &&
            (!currentInvite.timelineTitle || currentInvite.timelineTitle.trim().toLowerCase() === "timeline") &&
            !overrides["timeline-title"]?.fontFamily ? (
              <img src={timelineTitleSvg} alt="Timeline" style={{ width: 96, height: 30, display: "block" }} />
            ) : (
              getText("timeline-title", currentInvite.timelineTitle || "Timeline")
            )}
          </div>

          {/* Timeline Subtitle (y: 2699, x: 82, 266 x 47) */}
          <div
            id="preview-el-timeline-subtitle"
            data-element-id="timeline-subtitle"
            onClick={() => handleElementClick("timeline-subtitle", "timeline")}
            style={figmaBox({
              x: 82,
              y: 2699,
              width: 266,
              height: 47,
              zIndex: 3,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                ...getStyle("timeline-subtitle", {
                  fontFamily: FONT_CORMORANT,
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "20px",
                  textAlign: "center",
                  color: COLOR_TAUPE,
                  textTransform: "capitalize",
                  whiteSpace: "pre-line",
                }),
                ...getElementHighlightStyle("timeline-subtitle"),
              },
            })}
          >
            {getText(
              "timeline-subtitle",
              currentInvite.timelineSubtitle ||
                "Voluptatum Non Fugiat Qui Ab Non.\nAt Ut Quasi Dolorum Numquam Voluptas"
            )}
          </div>

          {/* Timeline Curved Vector Graphic (y: 2793, x: 84, 264 x 206) */}
          <img
            src={timelineVector}
            alt=""
            style={figmaBox({
              x: 84,
              y: 2793,
              width: 264,
              height: 206,
              zIndex: 3,
            })}
          />

          {/* =========================================================================
              SECTION 7: LEAVE A MESSAGE (y: 3069 - 3371)
              ========================================================================= */}
          {/* Title: "Leave a message" (y: 3069, x: 141, 148 x 46) */}
          <div
            id="preview-el-message-title"
            data-element-id="message-title"
            onClick={() => handleElementClick("message-title", "leave-a-message")}
            style={figmaBox({
              x: 141,
              y: 3069,
              width: 148,
              height: 46,
              zIndex: 3,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                ...getStyle("message-title", {
                  fontFamily: FONT_SLOOP,
                  fontWeight: 400,
                  fontSize: "34px",
                  lineHeight: "40px",
                  color: COLOR_TAUPE,
                  textAlign: "center",
                }),
                ...getElementHighlightStyle("message-title"),
              },
            })}
          >
            {!overrides["message-title"]?.text &&
            (!currentInvite.messageTitle || currentInvite.messageTitle.trim().toLowerCase() === "leave a message") &&
            !overrides["message-title"]?.fontFamily ? (
              <img src={leaveAMessageTitleSvg} alt="Leave a message" style={{ width: 151, height: 41, display: "block" }} />
            ) : (
              getText("message-title", currentInvite.messageTitle || "Leave a message")
            )}
          </div>

          {/* Subtitle: "Leave A Heartfelt Message To The Brides" (y: 3132, x: 82, 266 x 47) */}
          <div
            id="preview-el-message-subtitle"
            data-element-id="message-subtitle"
            onClick={() => handleElementClick("message-subtitle", "leave-a-message")}
            style={figmaBox({
              x: 82,
              y: 3132,
              width: 266,
              height: 47,
              zIndex: 3,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                ...getStyle("message-subtitle", {
                  fontFamily: FONT_CORMORANT,
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "20px",
                  textAlign: "center",
                  color: COLOR_TAUPE,
                  textTransform: "capitalize",
                }),
                ...getElementHighlightStyle("message-subtitle"),
              },
            })}
          >
            {getText(
              "message-subtitle",
              currentInvite.messageSubtitle || "Leave A Heartfelt Message To The Brides"
            )}
          </div>

          {/* Message Textarea Container (y: 3179, x: 16, 398 x 121, borderRadius: 50px) */}
          <div
            id="preview-el-message-box"
            data-element-id="message-box"
            onClick={() => handleElementClick("message-box", "leave-a-message")}
            style={figmaBox({
              x: 16,
              y: 3179,
              width: 398,
              height: 121,
              zIndex: 3,
              extra: {
                backgroundColor: COLOR_WHITE,
                border: `1px solid ${COLOR_TAUPE}`,
                borderRadius: "50px",
                padding: "16px 28px",
                display: "flex",
                flexDirection: "column",
                ...getElementHighlightStyle("message-box"),
              },
            })}
          >
            <textarea
              value={guestMessage}
              onChange={(e) => setGuestMessage(e.target.value)}
              placeholder={messageSent ? "✓ Merci pour votre doux message !" : "Write Something..."}
              disabled={editable}
              rows={3}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                outline: "none",
                backgroundColor: "transparent",
                resize: "none",
                fontFamily: FONT_CORMORANT,
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "20px",
                color: messageSent ? "#10B981" : COLOR_TAUPE,
              }}
            />
            {!editable && guestMessage.trim() && (
              <button
                type="button"
                onClick={handleMessageSubmit}
                style={{
                  alignSelf: "flex-end",
                  backgroundColor: COLOR_TAUPE,
                  color: COLOR_WHITE,
                  border: "none",
                  borderRadius: "20px",
                  padding: "4px 14px",
                  fontSize: "13px",
                  fontFamily: FONT_CORMORANT,
                  cursor: "pointer",
                  marginTop: "-10px",
                }}
              >
                Envoyer
              </button>
            )}
          </div>

          {/* =========================================================================
              SECTION 8: RSVP (y: 3371 - 3869)
              ========================================================================= */}
          {/* Title: "RSVP" (y: 3371, x: 141, 148 x 46) */}
          <div
            id="preview-el-rsvp-title"
            data-element-id="rsvp-title"
            onClick={() => handleElementClick("rsvp-title", "rsvp")}
            style={figmaBox({
              x: 141,
              y: 3371,
              width: 148,
              height: 46,
              zIndex: 3,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                ...getStyle("rsvp-title", {
                  fontFamily: FONT_SLOOP,
                  fontWeight: 400,
                  fontSize: "34px",
                  lineHeight: "40px",
                  color: COLOR_TAUPE,
                  textAlign: "center",
                }),
                ...getElementHighlightStyle("rsvp-title"),
              },
            })}
          >
            {!overrides["rsvp-title"]?.text &&
            (!currentInvite.rsvpTitle || currentInvite.rsvpTitle.trim().toLowerCase() === "rsvp") &&
            !overrides["rsvp-title"]?.fontFamily ? (
              <img src={rsvpTitleSvg} alt="RSVP" style={{ width: 114, height: 28, display: "block" }} />
            ) : (
              getText("rsvp-title", currentInvite.rsvpTitle || "RSVP")
            )}
          </div>

          {/* RSVP Form Inputs Group (y: 3447, x: 16, 398 x 282) */}
          <div
            id="preview-el-rsvp-form"
            data-element-id="rsvp-form"
            onClick={() => handleElementClick("rsvp-form", "rsvp")}
            style={figmaBox({
              x: 16,
              y: 3447,
              width: 398,
              height: 282,
              zIndex: 3,
              extra: getElementHighlightStyle("rsvp-form"),
            })}
          >
            {/* Name Field */}
            <div style={{ position: "absolute", left: 0, top: -6, width: 398, height: 14 }}>
              <span
                style={{
                  fontFamily: FONT_CORMORANT,
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "20px",
                  color: COLOR_TAUPE,
                  textTransform: "capitalize",
                }}
              >
                Name
              </span>
            </div>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              disabled={editable}
              placeholder="Votre Prénom"
              style={{
                position: "absolute",
                left: 0,
                top: 19,
                width: 398,
                height: 40,
                backgroundColor: COLOR_WHITE,
                border: `1px solid ${COLOR_BORDER}`,
                borderRadius: "7px",
                padding: "0 14px",
                fontFamily: FONT_CORMORANT,
                fontSize: "15px",
                color: COLOR_TAUPE,
                outline: "none",
                boxSizing: "border-box",
              }}
            />

            {/* Sir Name Field */}
            <div style={{ position: "absolute", left: 0, top: 68, width: 398, height: 14 }}>
              <span
                style={{
                  fontFamily: FONT_CORMORANT,
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "20px",
                  color: COLOR_TAUPE,
                  textTransform: "capitalize",
                }}
              >
                Sir Name
              </span>
            </div>
            <input
              type="text"
              value={guestSirName}
              onChange={(e) => setGuestSirName(e.target.value)}
              disabled={editable}
              placeholder="Votre Nom De Famille"
              style={{
                position: "absolute",
                left: 0,
                top: 93,
                width: 398,
                height: 40,
                backgroundColor: COLOR_WHITE,
                border: `1px solid ${COLOR_BORDER}`,
                borderRadius: "7px",
                padding: "0 14px",
                fontFamily: FONT_CORMORANT,
                fontSize: "15px",
                color: COLOR_TAUPE,
                outline: "none",
                boxSizing: "border-box",
              }}
            />

            {/* Email Field */}
            <div style={{ position: "absolute", left: 0, top: 142, width: 398, height: 14 }}>
              <span
                style={{
                  fontFamily: FONT_CORMORANT,
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "20px",
                  color: COLOR_TAUPE,
                  textTransform: "capitalize",
                }}
              >
                Email
              </span>
            </div>
            <input
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              disabled={editable}
              placeholder="Votre.email@exemple.com"
              style={{
                position: "absolute",
                left: 0,
                top: 168,
                width: 398,
                height: 40,
                backgroundColor: COLOR_WHITE,
                border: `1px solid ${COLOR_BORDER}`,
                borderRadius: "7px",
                padding: "0 14px",
                fontFamily: FONT_CORMORANT,
                fontSize: "15px",
                color: COLOR_TAUPE,
                outline: "none",
                boxSizing: "border-box",
              }}
            />

            {/* Number Of Guests Field */}
            <div style={{ position: "absolute", left: 0, top: 217, width: 398, height: 14 }}>
              <span
                style={{
                  fontFamily: FONT_CORMORANT,
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "20px",
                  color: COLOR_TAUPE,
                  textTransform: "capitalize",
                }}
              >
                Number Of Guests
              </span>
            </div>
            <input
              type="number"
              min="1"
              max="10"
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value)}
              disabled={editable}
              placeholder="1"
              style={{
                position: "absolute",
                left: 0,
                top: 242,
                width: 398,
                height: 40,
                backgroundColor: COLOR_WHITE,
                border: `1px solid ${COLOR_BORDER}`,
                borderRadius: "7px",
                padding: "0 14px",
                fontFamily: FONT_CORMORANT,
                fontSize: "15px",
                color: COLOR_TAUPE,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Send Button (y: 3770, x: 136, 158 x 45, borderRadius: 50px) */}
          <button
            type="button"
            onClick={handleRsvpSubmit}
            disabled={editable || rsvpSubmitting}
            style={figmaBox({
              x: 136,
              y: 3770,
              width: 158,
              height: 45,
              zIndex: 3,
              extra: {
                backgroundColor: rsvpSuccess ? "#10B981" : COLOR_WHITE,
                border: `1px solid ${rsvpSuccess ? "#10B981" : COLOR_TAUPE}`,
                borderRadius: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONT_CORMORANT,
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "20px",
                textAlign: "center",
                color: rsvpSuccess ? COLOR_WHITE : COLOR_TAUPE,
                cursor: editable ? "default" : "pointer",
                transition: "all 0.2s ease",
              },
            })}
          >
            {rsvpSubmitting ? "Envoi..." : rsvpSuccess ? "Confirmé ✓" : "Send"}
          </button>

          {/* =========================================================================
              SECTION 9: FOOTER (y: 3869 - 4130)
              ========================================================================= */}
          {/* Footer Background: Ballroom Chandelier Aisle (y: 3869, x: 0, 430 x 261) */}
          <img
            src={footerBg}
            alt=""
            style={figmaBox({
              x: 0,
              y: 3869,
              width: 430,
              height: 261,
              zIndex: 2,
              extra: { objectFit: "cover", pointerEvents: "none" },
            })}
          />

          {/* Footer Couple Names: "Damon & Alice" (y: 3939, x: 110, 210 x 46) */}
          <div
            id="preview-el-footer-names"
            data-element-id="footer-names"
            onClick={() => handleElementClick("footer-names", "footer")}
            style={figmaBox({
              x: 110,
              y: 3939,
              width: 210,
              height: 46,
              zIndex: 3,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                ...getStyle("footer-names", {
                  fontFamily: FONT_SLOOP,
                  fontWeight: 400,
                  fontSize: "34px",
                  lineHeight: "40px",
                  color: COLOR_WHITE,
                  textAlign: "center",
                }),
                ...getElementHighlightStyle("footer-names"),
              },
            })}
          >
            {!overrides["footer-names"]?.text &&
            (!currentInvite.footerCoupleNames || currentInvite.footerCoupleNames.trim().toLowerCase() === "damon & alice") &&
            (!currentInvite.coupleNames || currentInvite.coupleNames.trim().toLowerCase() === "damon & alice") &&
            !overrides["footer-names"]?.fontFamily ? (
              <img src={footerNamesSvg} alt="Damon & Alice" style={{ width: 189, height: 33, display: "block" }} />
            ) : (
              getText("footer-names", currentInvite.footerCoupleNames || coupleNames)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
