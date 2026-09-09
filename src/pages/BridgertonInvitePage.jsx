import React, { useEffect, useRef, useState } from "react";
import AudioPlayer from "../components/audio/AudioPlayer";
import ParticleEmitter from "../components/animations/ParticleEmitter";
import templateConfig from "../data/digital/templates/bridgerton.json";

// Assets for Bridgerton Template
import heroBg from "../assets/digital/bridgerton/hero-bg.png";
import heroCouplePhoto from "../assets/digital/bridgerton/hero-couple-photo.png";
import tornPaper1 from "../assets/digital/bridgerton/torn-paper-1.svg";
import tornPaper2 from "../assets/digital/bridgerton/torn-paper-2.svg";
import tornPaper3 from "../assets/digital/bridgerton/torn-paper-3.svg";
import tornPaper4 from "../assets/digital/bridgerton/torn-paper-4.svg";
import tornPaper5 from "../assets/digital/bridgerton/torn-paper-5.svg";
import tornPaper6 from "../assets/digital/bridgerton/torn-paper-6.svg";
import birdLeft from "../assets/digital/bridgerton/bird-left.svg";
import birdRight from "../assets/digital/bridgerton/bird-right.svg";
import middleBannerBg from "../assets/digital/bridgerton/middle-banner-bg-751265.png";
import messageBannerBg from "../assets/digital/bridgerton/message-banner-bg-781f9f.png";
import stamp1 from "../assets/digital/bridgerton/stamp-1-4de4a6.png";
import stamp2 from "../assets/digital/bridgerton/stamp-2-201857.png";
import stamp3 from "../assets/digital/bridgerton/stamp-3-735f2a.png";
import stamp4 from "../assets/digital/bridgerton/stamp-4-4471f0.png";
import statueDoodle from "../assets/digital/bridgerton/statue-doodle.png";
import venuePhoto from "../assets/digital/bridgerton/venue-photo.png";
import flourishBorder from "../assets/digital/bridgerton/flourish-border.svg";
import laceSeal from "../assets/digital/bridgerton/lace-seal.svg";

const CANVAS_WIDTH = 430;
const CANVAS_HEIGHT = 3243;
const COLOR_MAUVE = "#917F7F";
const COLOR_OVERLAY = "rgba(200, 212, 208, 0.2)";
const COLOR_WHITE = "#FFFFFF";
const COLOR_BORDER = "#E5E5E5";

// Font stack definitions
const FONT_SCRIPT = "'Pinyon Script', cursive";
const FONT_SERIF = "'Black Mango', 'Cormorant Garamond', 'Antic Didone', serif";
const FONT_VOYAGER = "'MADE Voyager PERSONAL_USE', 'Playfair Display', 'Cormorant Garamond', 'Antic Didone', serif";

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

export default function BridgertonInvitePage({
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
      if (id === "hero-quote" && (custom.includes("L'amour") || custom.includes("quelqu'un"))) {
        return fallback;
      }
      if (id === "dress-text" && custom.includes("Outeya")) {
        return fallback;
      }
      if (id === "rsvp-deadline" && custom.toLowerCase().includes("fifteenth")) {
        return fallback;
      }
      return custom;
    }
    return fallback;
  };

  // Responsive scale for mobile devices
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
    const o = overrides[id];
    if (!o) return baseStyle;
    return {
      ...baseStyle,
      ...(o.fontFamily && o.fontFamily !== "Défaut du Template" ? { fontFamily: o.fontFamily } : {}),
      ...(o.fontSize ? { fontSize: typeof o.fontSize === "number" ? `${o.fontSize}px` : o.fontSize } : {}),
      ...(o.color ? { color: o.color } : {}),
    };
  };

  const makeSelectable = (id, baseStyle) => ({
    ...getStyle(id, baseStyle),
    cursor: editable ? "pointer" : undefined,
    outline: editable && selectedElementId === id ? "2px solid #3B82F6" : undefined,
    outlineOffset: "3px",
  });

  const handleElementClick = (id) => {
    if (editable && onSelectElement) {
      onSelectElement(id);
    }
  };

  // Scroll Reveal Animations Observer
  const animType = currentInvite.animationType || "fade-up";
  const animDuration = currentInvite.animationDuration || 1.2;

  useEffect(() => {
    if (animType === "none") {
      const els = document.querySelectorAll(".reveal");
      els.forEach((el) => el.classList.add("revealed"));
      return;
    }

    const elements = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
    );

    elements.forEach((el) => observer.observe(el));

    const handleScrollCheck = () => {
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      elements.forEach((el) => {
        if (!el.classList.contains("revealed")) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= windowHeight - 10 && rect.bottom >= 0) {
            el.classList.add("revealed");
          }
        }
      });
    };

    handleScrollCheck();
    window.addEventListener("scroll", handleScrollCheck, { passive: true });
    const scrollParent = document.querySelector(".overflow-y-auto");
    if (scrollParent) {
      scrollParent.addEventListener("scroll", handleScrollCheck, { passive: true });
    }

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      window.removeEventListener("scroll", handleScrollCheck);
      if (scrollParent) {
        scrollParent.removeEventListener("scroll", handleScrollCheck);
      }
    };
  }, [animType, animDuration]);

  // Couple names formatting
  const coupleText = (() => {
    if (!currentInvite.coupleNames) return "Karim\n&\nAzza";
    if (currentInvite.coupleNames.includes("\n")) return currentInvite.coupleNames;
    const parts = currentInvite.coupleNames.split(/&|and|\+/i).map((s) => s.trim());
    if (parts.length >= 2) {
      return `${parts[0]}\n&\n${parts[1]}`;
    }
    return currentInvite.coupleNames;
  })();

  // Date formatting for the 3-line vintage display (e.g. 23 / 11 / 26)
  const dateFormatted = (() => {
    if (!currentInvite.eventDate) return "23\n11\n26";
    if (typeof currentInvite.eventDate === "string" && currentInvite.eventDate.includes("-")) {
      const parts = currentInvite.eventDate.split("-");
      if (parts.length === 3) {
        const year = parts[0].slice(-2);
        const month = parts[1].padStart(2, "0");
        const day = parts[2].padStart(2, "0");
        return `${day}\n${month}\n${year}`;
      }
    }
    const d = new Date(currentInvite.eventDate);
    if (isNaN(d.getTime())) return "23\n11\n26";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);
    return `${day}\n${month}\n${year}`;
  })();

  // RSVP Form Interactive State
  const [rsvpData, setRsvpData] = useState({
    name: "",
    sirName: "",
    email: "",
    guests: "",
  });
  const [rsvpStatus, setRsvpStatus] = useState("idle"); // idle | sending | success

  const handleRsvpSubmit = (e) => {
    if (e) e.preventDefault();
    if (editable) return; // don't submit during editor mode
    setRsvpStatus("sending");
    setTimeout(() => {
      setRsvpStatus("success");
    }, 800);
  };

  // Guestbook Message Interactive State
  const [guestMessage, setGuestMessage] = useState("");
  const [messageSent, setMessageSent] = useState(false);

  const handleMessageSubmit = (e) => {
    if (e) e.preventDefault();
    if (!guestMessage.trim() || editable) return;
    setMessageSent(true);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#F8F6F2",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflowX: "hidden",
      }}
    >
      <style>{`
        .reveal {
          opacity: ${animType === "none" ? "1" : "0"} !important;
          transition: opacity ${animDuration}s cubic-bezier(0.16, 1, 0.3, 1), transform ${animDuration}s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
          ${animType === "fade-up" ? "transform: translate3d(0, 24px, 0) !important;" : ""}
          ${animType === "zoom-in" ? "transform: scale(0.94) !important;" : ""}
        }
        .reveal.revealed {
          opacity: 1 !important;
          ${animType === "fade-up" ? "transform: translate3d(0, 0, 0) !important;" : ""}
          ${animType === "zoom-in" ? "transform: scale(1) !important;" : ""}
        }

        /* Regency Birds Organic Hover Sway */
        @keyframes bird-sway-left {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          50% {
            transform: translate3d(3px, -7px, 0) rotate(2deg);
          }
        }
        .bird-float-left {
          will-change: transform;
          animation: bird-sway-left 5.5s ease-in-out infinite alternate !important;
        }

        @keyframes bird-sway-right {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          50% {
            transform: translate3d(-3px, -7px, 0) rotate(-2deg);
          }
        }
        .bird-float-right {
          will-change: transform;
          animation: bird-sway-right 6s ease-in-out infinite alternate !important;
        }

        /* Vintage Stamps Floating Sway (preserving base rotations) */
        @keyframes stamp1-sway {
          0%, 100% {
            transform: rotate(-15deg) translate3d(0, 0, 0);
          }
          50% {
            transform: rotate(-13deg) translate3d(2px, -6px, 0);
          }
        }
        .stamp-float-1 {
          will-change: transform;
          animation: stamp1-sway 4.8s ease-in-out infinite alternate !important;
        }

        @keyframes stamp2-sway {
          0%, 100% {
            transform: rotate(30deg) translate3d(0, 0, 0);
          }
          50% {
            transform: rotate(32.5deg) translate3d(-2px, -6px, 0);
          }
        }
        .stamp-float-2 {
          will-change: transform;
          animation: stamp2-sway 5.2s ease-in-out infinite alternate !important;
        }

        @keyframes stamp3-sway {
          0%, 100% {
            transform: rotate(-30deg) translate3d(0, 0, 0);
          }
          50% {
            transform: rotate(-28deg) translate3d(2px, -5px, 0);
          }
        }
        .stamp-float-3 {
          will-change: transform;
          animation: stamp3-sway 4.6s ease-in-out infinite alternate !important;
        }

        /* Butterfly Flutter & Flight Motion */
        @keyframes butterfly-flutter {
          0%, 100% {
            transform: rotate(-45deg) translate3d(0, 0, 0) scale(1);
          }
          25% {
            transform: rotate(-43deg) translate3d(2px, -5px, 0) scale(1.03);
          }
          50% {
            transform: rotate(-47deg) translate3d(-3px, -2px, 0) scale(0.97);
          }
          75% {
            transform: rotate(-43.5deg) translate3d(1px, -7px, 0) scale(1.02);
          }
        }
        .butterfly-float {
          will-change: transform;
          animation: butterfly-flutter 4.2s ease-in-out infinite alternate !important;
        }

        /* Statue Doodle Gentle Breathing Float */
        @keyframes statue-float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .statue-float {
          will-change: transform;
          animation: statue-float 6s ease-in-out infinite alternate !important;
        }

        /* Footer Monogram Lace Seal Continuous Slow Rotation & Pulse */
        @keyframes lace-rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .lace-spin {
          animation: lace-rotate 65s linear infinite !important;
          transform-origin: center center;
        }

        @keyframes seal-pulse {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 2px 8px rgba(114, 47, 55, 0.06));
          }
          50% {
            transform: scale(1.02);
            filter: drop-shadow(0 6px 18px rgba(114, 47, 55, 0.16));
          }
        }
        .seal-pulse {
          animation: seal-pulse 4.5s ease-in-out infinite alternate !important;
        }

        /* Hero Scroll Down Indicator Bounce */
        @keyframes hero-scroll-bounce {
          0%, 100% {
            transform: translateX(-50%) translateY(0);
            opacity: 0.6;
          }
          50% {
            transform: translateX(-50%) translateY(6px);
            opacity: 1;
          }
        }
        .hero-scroll-bounce {
          animation: hero-scroll-bounce 2.2s ease-in-out infinite !important;
        }

        .bridgerton-message-input,
        .bridgerton-message-input::placeholder {
          color: #FFFFFF !important;
          opacity: 1 !important;
          -webkit-text-fill-color: #FFFFFF !important;
        }
        .bridgerton-message-input:disabled,
        .bridgerton-message-input[readonly] {
          color: #FFFFFF !important;
          -webkit-text-fill-color: #FFFFFF !important;
          opacity: 1 !important;
        }
      `}</style>

      {/* Audio Player */}
      <AudioPlayer src={currentInvite.musicUrl} active={Boolean(currentInvite.musicUrl)} />

      {/* Scaled Canvas Container */}
      <div
        ref={canvasRef}
        id="bridgerton-canvas-root"
        style={{
          position: "relative",
          width: `${CANVAS_WIDTH}px`,
          height: `${CANVAS_HEIGHT}px`,
          backgroundColor: currentInvite.backgroundColor || COLOR_WHITE,
          overflow: "hidden",
          transform: scale < 1 ? `scale(${scale})` : undefined,
          transformOrigin: "top center",
          marginBottom: scale < 1 ? `-${(CANVAS_HEIGHT * (1 - scale))}px` : undefined,
          boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
        }}
      >
        {/* Falling Particles (Petals & Sparkles) Effect */}
        {currentInvite.enablePetals !== false && (
          <ParticleEmitter
            type={currentInvite.particleType === "sparkles" ? "sparkles" : "petals"}
            count={currentInvite.petalsIntensity || currentInvite.sparklesIntensity || 28}
            color={currentInvite.petalsColor || currentInvite.sparklesColor || "#FFFFFF"}
            withSparkles={currentInvite.particleType === "mixed"}
            sparkleRatio={currentInvite.particleType === "sparkles" ? 1 : 0.35}
            active={true}
          />
        )}

        {/* =========================================================================
            SECTION 1: HERO (0 - 649px)
           ========================================================================= */}
        {/* #1583:84 Hero Background */}
        <div
          style={figmaBox({
            x: 0,
            y: 0,
            width: 430,
            height: 649,
            zIndex: 1,
            extra: {
              backgroundImage: `url(${heroBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            },
          })}
        />

        {/* #1584:88 Hero Tint Overlay */}
        <div
          style={figmaBox({
            x: 0,
            y: 0,
            width: 430,
            height: 649,
            zIndex: 2,
            extra: {
              backgroundColor: COLOR_OVERLAY,
            },
          })}
        />

        {/* #1584:89 Hero Couple Photo Frame */}
        <div
          id="preview-el-hero-photo"
          data-element-id="hero-photo"
          className="reveal"
          onClick={() => handleElementClick("hero-photo")}
          style={makeSelectable(
            "hero-photo",
            figmaBox({
              x: 57,
              y: 121,
              width: 316,
              height: 421,
              zIndex: 3,
              extra: {
                backgroundImage: `url(${overrides["hero-photo"]?.image || overrides["hero-photo"]?.url || currentInvite.heroPhoto || heroCouplePhoto})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                overflow: "hidden",
                opacity: (overrides["hero-photo"]?.image || overrides["hero-photo"]?.url || currentInvite.heroPhoto) ? 1 : 0.8,
              },
            })
          )}
        />

        {/* #1583:85 Hero Couple Names */}
        <div
          id="preview-el-hero-names"
          data-element-id="hero-names"
          className="reveal"
          onClick={() => handleElementClick("hero-names")}
          style={makeSelectable(
            "hero-names",
            figmaBox({
              x: 137,
              y: 269,
              width: 157,
              height: 134,
              zIndex: 4,
              extra: {
                fontFamily: FONT_SCRIPT,
                fontSize: "40px",
                lineHeight: "44px",
                letterSpacing: "2px",
                textAlign: "center",
                color: COLOR_MAUVE,
                whiteSpace: "pre-line",
              },
            })
          )}
        >
          {getText("hero-names", coupleText)}
        </div>

        {/* #1584:90 "Our Happy Ever After" */}
        <div
          id="preview-el-hero-quote"
          data-element-id="hero-quote"
          className="reveal"
          onClick={() => handleElementClick("hero-quote")}
          style={makeSelectable(
            "hero-quote",
            figmaBox({
              x: 4,
              y: 515,
              width: 422,
              height: 57,
              zIndex: 4,
              extra: {
                fontFamily: FONT_SCRIPT,
                fontSize: "20px",
                lineHeight: "44px",
                letterSpacing: "1px",
                textAlign: "center",
                color: COLOR_WHITE,
              },
            })
          )}
        >
          {getText(
            "hero-quote",
            (!currentInvite.heroQuote || currentInvite.heroQuote.includes("L'amour") || currentInvite.heroQuote.includes("quelqu'un"))
              ? "Our Happy Ever After"
              : currentInvite.heroQuote
          )}
        </div>

        {/* Hero Scroll Down Indicator */}
        <div
          className="hero-scroll-bounce"
          style={{
            position: "absolute",
            left: "50%",
            top: "572px",
            zIndex: 4,
            pointerEvents: "none",
          }}
        >
          <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L10 10L19 1" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.85"/>
          </svg>
        </div>

        {/* #1585:91 Torn Paper 1 */}
        <img
          src={tornPaper1}
          alt=""
          style={figmaBox({
            x: -168,
            y: 615,
            width: 1556,
            height: 92,
            zIndex: 5,
            extra: { pointerEvents: "none" },
          })}
        />

        {/* #1586:717 TE_Bird-01 1 (Bird Left) */}
        <div
          className="bird-float-left"
          style={figmaBox({
            x: -33,
            y: 640,
            width: 129,
            height: 124,
            zIndex: 6,
            extra: { pointerEvents: "none" },
          })}
        >
          <img src={birdLeft} alt="" style={{ width: "100%", height: "100%" }} />
        </div>

        {/* =========================================================================
            SECTION 2: DATE & WAITING FOR YOU (649 - 931px)
           ========================================================================= */}
        {/* #1586:98 Date: 23 / 11 / 26 */}
        <div
          id="preview-el-event-date"
          data-element-id="event-date"
          className="reveal"
          onClick={() => handleElementClick("event-date")}
          style={makeSelectable(
            "event-date",
            figmaBox({
              x: 53,
              y: 674,
              width: 331,
              height: 189,
              zIndex: 6,
              extra: {
                fontFamily: FONT_VOYAGER,
                fontSize: "46px",
                lineHeight: "52px",
                letterSpacing: "9.2px",
                textAlign: "center",
                color: COLOR_MAUVE,
                whiteSpace: "pre-line",
              },
            })
          )}
        >
          {getText("event-date", dateFormatted)}
        </div>

        {/* #1586:99 "waiting for you..." */}
        <div
          id="preview-el-countdown-waiting"
          data-element-id="countdown-waiting"
          className="reveal"
          onClick={() => handleElementClick("countdown-waiting")}
          style={makeSelectable(
            "countdown-waiting",
            figmaBox({
              x: 50,
              y: 845,
              width: 331,
              height: 24,
              zIndex: 6,
              extra: {
                fontFamily: FONT_SERIF,
                fontSize: "12px",
                lineHeight: "18.2px",
                letterSpacing: "2.4px",
                textAlign: "center",
                color: COLOR_MAUVE,
              },
            })
          )}
        >
          {getText("countdown-waiting", "waiting for you...")}
        </div>

        {/* #1587:2015 TE_Border-15 1 (Flourish Border) */}
        <img
          src={flourishBorder}
          alt=""
          style={figmaBox({
            x: 183,
            y: 869,
            width: 72,
            height: 51,
            zIndex: 6,
            extra: { pointerEvents: "none" },
          })}
        />

        {/* #1586:106 Torn Paper 5 */}
        <img
          src={tornPaper5}
          alt=""
          style={figmaBox({
            x: -330,
            y: 874,
            width: 1556,
            height: 92,
            zIndex: 5,
            extra: { pointerEvents: "none" },
          })}
        />

        {/* #1586:100 Stamp 1 (Swan - Rotated -15deg) */}
        <img
          src={stamp1}
          alt="Stamp"
          className="stamp-float-1"
          style={figmaBox({
            x: 369,
            y: 833,
            width: 84,
            height: 106,
            zIndex: 6,
            extra: {
              transform: "rotate(-15deg)",
              transformOrigin: "center center",
              pointerEvents: "none",
            },
          })}
        />

        {/* =========================================================================
            SECTION 3: MIDDLE BANNER QUOTE (931 - 1255px)
           ========================================================================= */}
        {/* #1586:110 Middle Banner Background */}
        <div
          style={figmaBox({
            x: 0,
            y: 931,
            width: 430,
            height: 324,
            zIndex: 2,
            extra: {
              backgroundImage: `url(${middleBannerBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            },
          })}
        />

        {/* #1586:115 Middle Banner Overlay */}
        <div
          style={figmaBox({
            x: 1,
            y: 931,
            width: 430,
            height: 324,
            zIndex: 3,
            extra: {
              backgroundColor: COLOR_OVERLAY,
            },
          })}
        />

        {/* #1592:4171 "Join Us For The Best Day Ever" */}
        <div
          id="preview-el-banner-quote"
          data-element-id="banner-quote"
          className="reveal"
          onClick={() => handleElementClick("banner-quote")}
          style={makeSelectable(
            "banner-quote",
            figmaBox({
              x: 4,
              y: 1089,
              width: 422,
              height: 57,
              zIndex: 4,
              extra: {
                fontFamily: FONT_SCRIPT,
                fontSize: "20px",
                lineHeight: "24px",
                letterSpacing: "1px",
                textAlign: "center",
                color: COLOR_WHITE,
                whiteSpace: "pre-line",
              },
            })
          )}
        >
          {getText("banner-quote", currentInvite.bannerQuote || "Join Us For The \nBest Day Ever")}
        </div>

        {/* #1586:111 Torn Paper 2 */}
        <img
          src={tornPaper2}
          alt=""
          style={figmaBox({
            x: -159,
            y: 1231,
            width: 1556,
            height: 92,
            zIndex: 5,
            extra: { pointerEvents: "none" },
          })}
        />

        {/* =========================================================================
            SECTION 4: WEDDING VENUE (1255 - 1600px)
           ========================================================================= */}
        {/* #1587:2004 Statue Doodle */}
        <img
          src={statueDoodle}
          alt=""
          className="statue-float"
          style={figmaBox({
            x: 255,
            y: 1304,
            width: 123,
            height: 221,
            zIndex: 3,
          })}
        />

        {/* #1586:2002 Title: "Wedding Venue" */}
        <div
          id="preview-el-venue-title"
          data-element-id="venue-title"
          className="reveal"
          onClick={() => handleElementClick("venue-title")}
          style={makeSelectable(
            "venue-title",
            figmaBox({
              x: 36,
              y: 1327,
              width: 186,
              height: 82,
              zIndex: 4,
              extra: {
                fontFamily: FONT_SCRIPT,
                fontSize: "36px",
                lineHeight: "38px",
                letterSpacing: "1.8px",
                textAlign: "center",
                color: COLOR_MAUVE,
                whiteSpace: "pre-line",
              },
            })
          )}
        >
          {getText("venue-title", "Wedding\nVenue")}
        </div>

        {/* #1586:2003 Venue Address Text */}
        <div
          id="preview-el-venue-details"
          data-element-id="venue-details"
          className="reveal"
          onClick={() => handleElementClick("venue-details")}
          style={makeSelectable(
            "venue-details",
            figmaBox({
              x: 22,
              y: 1419,
              width: 213,
              height: 72,
              zIndex: 4,
              extra: {
                fontFamily: FONT_SERIF,
                fontSize: "12px",
                lineHeight: "18.2px",
                letterSpacing: "2.4px",
                textAlign: "center",
                color: COLOR_MAUVE,
                whiteSpace: "pre-line",
              },
            })
          )}
        >
          {getText(
            "venue-details",
            currentInvite.venueDetails || "Dar Bouraoui \nCarthage\nSalle Malaga\n18H - 20H"
          )}
        </div>

        {/* #1587:2013 Stamp 3 (Hummingbird - Rotated -30deg) */}
        <img
          src={stamp3}
          alt="Stamp"
          className="stamp-float-3"
          style={figmaBox({
            x: 363,
            y: 1452,
            width: 84,
            height: 106,
            zIndex: 4,
            extra: {
              transform: "rotate(-30deg)",
              transformOrigin: "center center",
              pointerEvents: "none",
            },
          })}
        />

        {/* #1587:3497 Venue Photo Group (Oval / Golden Baroque Frame - zIndex 6 on top of torn paper) */}
        <div
          id="preview-el-venue-photo"
          data-element-id="venue-photo"
          className="reveal"
          onClick={() => handleElementClick("venue-photo")}
          style={makeSelectable(
            "venue-photo",
            figmaBox({
              x: 43,
              y: 1531,
              width: 120,
              height: 180,
              zIndex: 6,
              extra: {
                position: "absolute",
              },
            })
          )}
        >
          {/* #1587:3496 White Ellipse Base / User Uploaded Venue Photo */}
          <div
            style={{
              position: "absolute",
              left: "15.95px",
              top: "26.58px",
              width: "88.86px",
              height: "126.84px",
              backgroundColor: COLOR_WHITE,
              borderRadius: "50%",
              overflow: "hidden",
            }}
          >
            {(overrides["venue-photo"]?.image || overrides["venue-photo"]?.url || currentInvite.venuePhoto) && (
              <img
                src={overrides["venue-photo"]?.image || overrides["venue-photo"]?.url || currentInvite.venuePhoto}
                alt="Venue"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
          </div>
          {/* #1587:3493 Golden Baroque Frame */}
          <img
            src={venuePhoto}
            alt="Venue Frame"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "120px",
              height: "180px",
              objectFit: "cover",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* #1587:2203 Torn Paper 4 (Sage green strip - zIndex 3 behind golden frame) */}
        <img
          src={tornPaper4}
          alt=""
          style={figmaBox({
            x: -168,
            y: 1579,
            width: 1556,
            height: 92,
            zIndex: 3,
            extra: { pointerEvents: "none" },
          })}
        />

        {/* =========================================================================
            SECTION 5: DRESS CODE & TRANSPORT (1600 - 2100px)
           ========================================================================= */}
        {/* #1586:95 Title: "Dress Code" */}
        <div
          id="preview-el-dress-title"
          data-element-id="dress-title"
          className="reveal"
          onClick={() => handleElementClick("dress-title")}
          style={makeSelectable(
            "dress-title",
            figmaBox({
              x: 133,
              y: 1711,
              width: 242,
              height: 43,
              zIndex: 4,
              extra: {
                fontFamily: FONT_SCRIPT,
                fontSize: "40px",
                lineHeight: "44px",
                letterSpacing: "2px",
                textAlign: "right",
                color: COLOR_MAUVE,
              },
            })
          )}
        >
          {getText("dress-title", "Dress Code")}
        </div>

        {/* #1586:96 Dress Code Text */}
        <div
          id="preview-el-dress-text"
          data-element-id="dress-text"
          className="reveal"
          onClick={() => handleElementClick("dress-text")}
          style={makeSelectable(
            "dress-text",
            figmaBox({
              x: 42,
              y: 1783,
              width: 331,
              height: 62,
              zIndex: 4,
              extra: {
                fontFamily: FONT_SERIF,
                fontSize: "12px",
                lineHeight: "18.2px",
                letterSpacing: "2.4px",
                textAlign: "right",
                color: COLOR_MAUVE,
              },
            })
          )}
        >
          {getText(
            "dress-text",
            (!currentInvite.dressCodeText || currentInvite.dressCodeText.includes("Outeya"))
              ? "We'd love for guests to embrace a formal look for our celebration."
              : currentInvite.dressCodeText
          )}
        </div>

        {/* #1586:126 Stamp 2 (Rose - Rotated 30deg) */}
        <img
          src={stamp2}
          alt="Stamp"
          className="stamp-float-2"
          style={figmaBox({
            x: -13,
            y: 1805,
            width: 84,
            height: 106,
            zIndex: 4,
            extra: {
              transform: "rotate(30deg)",
              transformOrigin: "center center",
              pointerEvents: "none",
            },
          })}
        />

        {/* #1587:2202 Group 13 - Dress Code Color Swatches */}
        <div
          className="reveal"
          style={figmaBox({
            x: 125,
            y: 1853,
            width: 181,
            height: 34,
            zIndex: 4,
            extra: {
              display: "flex",
              gap: "15px",
              alignItems: "center",
            },
          })}
        >
          <div className="hover:scale-110 transition-transform duration-300 cursor-pointer shadow-sm hover:shadow" style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: "#D9E5EB" }} />
          <div className="hover:scale-110 transition-transform duration-300 cursor-pointer shadow-sm hover:shadow" style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: "#F9F5D4" }} />
          <div className="hover:scale-110 transition-transform duration-300 cursor-pointer shadow-sm hover:shadow" style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: "#F2C1BE" }} />
          <div className="hover:scale-110 transition-transform duration-300 cursor-pointer shadow-sm hover:shadow" style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: "#C8D4D0" }} />
        </div>

        {/* #1587:2207 TE_Bird-01 2 (Bird Right) */}
        <div
          className="bird-float-right"
          style={figmaBox({
            x: 326,
            y: 1899,
            width: 129,
            height: 124,
            zIndex: 4,
            extra: { pointerEvents: "none" },
          })}
        >
          <img src={birdRight} alt="" style={{ width: "100%", height: "100%" }} />
        </div>

        {/* #1586:124 Title: "Transport" */}
        <div
          id="preview-el-transport-title"
          data-element-id="transport-title"
          className="reveal"
          onClick={() => handleElementClick("transport-title")}
          style={makeSelectable(
            "transport-title",
            figmaBox({
              x: 55,
              y: 1939,
              width: 186,
              height: 43,
              zIndex: 4,
              extra: {
                fontFamily: FONT_SCRIPT,
                fontSize: "40px",
                lineHeight: "44px",
                letterSpacing: "2px",
                textAlign: "left",
                color: COLOR_MAUVE,
              },
            })
          )}
        >
          {getText("transport-title", "Transport")}
        </div>

        {/* #1586:125 Transport Guidance Text */}
        <div
          id="preview-el-transport-text"
          data-element-id="transport-text"
          className="reveal"
          onClick={() => handleElementClick("transport-text")}
          style={makeSelectable(
            "transport-text",
            figmaBox({
              x: 55,
              y: 2011,
              width: 330,
              height: 78,
              zIndex: 4,
              extra: {
                fontFamily: FONT_SERIF,
                fontSize: "12px",
                lineHeight: "18.2px",
                letterSpacing: "2.4px",
                textAlign: "left",
                color: COLOR_MAUVE,
                whiteSpace: "pre-line",
              },
            })
          )}
        >
          {getText(
            "transport-text",
            currentInvite.transportText ||
              "Parking: On-site parking will be available at the venue.\nTaxis: We recommend booking taxis in advance."
          )}
        </div>

        {/* #1587:3504 Torn Paper 6 */}
        <img
          src={tornPaper6}
          alt=""
          style={figmaBox({
            x: -330,
            y: 2089,
            width: 1556,
            height: 92,
            zIndex: 5,
            extra: { pointerEvents: "none" },
          })}
        />

        {/* =========================================================================
            SECTION 6: LEAVE A MESSAGE / GUESTBOOK (2146 - 2450px)
           ========================================================================= */}
        {/* #1587:3498 Message Banner Background */}
        <div
          style={figmaBox({
            x: 0,
            y: 2146,
            width: 430,
            height: 324,
            zIndex: 2,
            extra: {
              backgroundImage: `url(${messageBannerBg})`,
              backgroundSize: "100% 100%",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            },
          })}
        />

        {/* #1587:3499 Message Banner Overlay */}
        <div
          style={figmaBox({
            x: 1,
            y: 2146,
            width: 430,
            height: 324,
            zIndex: 3,
            extra: {
              backgroundColor: COLOR_OVERLAY,
            },
          })}
        />

        {/* #1587:3511 Title: "Leave a message" */}
        <div
          id="preview-el-message-title"
          data-element-id="message-title"
          className="reveal"
          onClick={() => handleElementClick("message-title")}
          style={makeSelectable(
            "message-title",
            figmaBox({
              x: 189,
              y: 2209,
              width: 186,
              height: 82,
              zIndex: 4,
              extra: {
                fontFamily: FONT_SCRIPT,
                fontSize: "36px",
                lineHeight: "38px",
                letterSpacing: "1.8px",
                textAlign: "right",
                color: COLOR_WHITE,
                whiteSpace: "pre-line",
              },
            })
          )}
        >
          {getText("message-title", "Leave\na message")}
        </div>

        {/* #1587:3508 Subtitle: "Leave a heartfelt message to the brides" */}
        <div
          id="preview-el-message-subtitle"
          data-element-id="message-subtitle"
          className="reveal"
          onClick={() => handleElementClick("message-subtitle")}
          style={makeSelectable(
            "message-subtitle",
            figmaBox({
              x: 164,
              y: 2295,
              width: 208,
              height: 35,
              zIndex: 4,
              extra: {
                fontFamily: FONT_SERIF,
                fontSize: "12px",
                lineHeight: "18.2px",
                letterSpacing: "2.4px",
                textAlign: "right",
                color: COLOR_WHITE,
              },
            })
          )}
        >
          {getText("message-subtitle", currentInvite.messagePrompt || "Leave a heartfelt message to the brides")}
        </div>

        {/* #1602:3 Message Input Box */}
        <div
          className="reveal transition-all duration-300 focus-within:shadow-[0_0_12px_rgba(255,255,255,0.4)]"
          style={figmaBox({
            x: 86,
            y: 2348,
            width: 289,
            height: 40,
            zIndex: 4,
            extra: {
              border: `1px solid ${COLOR_WHITE}`,
              borderRadius: "7px",
              display: "flex",
              alignItems: "center",
              padding: "0 14px",
              backgroundColor: "transparent",
            },
          })}
        >
          {messageSent ? (
            <span
              style={{
                fontFamily: FONT_SERIF,
                fontSize: "12px",
                letterSpacing: "2.4px",
                color: COLOR_WHITE,
                fontWeight: 600,
                textAlign: "right",
                width: "100%",
              }}
            >
              ✓ Thank you for your warm wishes!
            </span>
          ) : (
            <form
              onSubmit={handleMessageSubmit}
              style={{ width: "100%", display: "flex", alignItems: "center" }}
            >
              <input
                type="text"
                placeholder="Enter text here"
                value={guestMessage}
                readOnly={editable}
                onChange={(e) => setGuestMessage(e.target.value)}
                className="bridgerton-message-input placeholder-white placeholder:text-white"
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontFamily: FONT_SERIF,
                  fontSize: "12px",
                  letterSpacing: "2.4px",
                  color: COLOR_WHITE,
                  WebkitTextFillColor: COLOR_WHITE,
                  textAlign: "right",
                }}
              />
            </form>
          )}
        </div>

        {/* #1587:3500 Torn Paper 3 */}
        <img
          src={tornPaper3}
          alt=""
          style={figmaBox({
            x: -168,
            y: 2439,
            width: 1556,
            height: 92,
            zIndex: 5,
            extra: { pointerEvents: "none" },
          })}
        />

        {/* =========================================================================
            SECTION 7: RSVP FORM (2450 - 3000px)
           ========================================================================= */}
        {/* #1587:3520 Title: "RSVP" */}
        <div
          id="preview-el-rsvp-title"
          data-element-id="rsvp-title"
          className="reveal"
          onClick={() => handleElementClick("rsvp-title")}
          style={makeSelectable(
            "rsvp-title",
            figmaBox({
              x: 132,
              y: 2496,
              width: 168,
              height: 42,
              zIndex: 6,
              extra: {
                fontFamily: FONT_SCRIPT,
                fontSize: "40px",
                letterSpacing: "2px",
                textAlign: "center",
                color: COLOR_MAUVE,
              },
            })
          )}
        >
          {getText("rsvp-title", "RSVP")}
        </div>

        {/* #1587:3521 RSVP Deadline */}
        <div
          id="preview-el-rsvp-deadline"
          data-element-id="rsvp-deadline"
          className="reveal"
          onClick={() => handleElementClick("rsvp-deadline")}
          style={makeSelectable(
            "rsvp-deadline",
            figmaBox({
              x: 55,
              y: 2555,
              width: 320,
              height: 43,
              zIndex: 6,
              extra: {
                fontFamily: FONT_SERIF,
                fontSize: "12px",
                lineHeight: "18.2px",
                letterSpacing: "2.4px",
                textAlign: "center",
                color: COLOR_MAUVE,
              },
            })
          )}
        >
          {getText(
            "rsvp-deadline",
            (!currentInvite.rsvpDeadline || currentInvite.rsvpDeadline.toLowerCase().includes("fifteenth"))
              ? "The favour of a reply is kindly requested by the 15th of June, 2026"
              : currentInvite.rsvpDeadline
          )}
        </div>

        {/* #1587:4168 Stamp 4 (Butterfly - Rotated -45deg) */}
        <img
          src={stamp4}
          alt="Stamp"
          className="butterfly-float"
          style={figmaBox({
            x: 374,
            y: 2552,
            width: 84,
            height: 106,
            zIndex: 4,
            extra: {
              transform: "rotate(-45deg)",
              transformOrigin: "center center",
              pointerEvents: "none",
            },
          })}
        />

        {/* #1587:4165 Form Group (Interactive) */}
        <form onSubmit={handleRsvpSubmit}>
          <div
            style={figmaBox({
              x: 16,
              y: 2641,
              width: 398,
              height: 282,
              zIndex: 4,
            })}
          >
            {/* Name Field */}
            <div style={{ position: "absolute", left: 0, top: "0px", width: "398px" }}>
              <label
                style={{
                  display: "block",
                  fontFamily: FONT_SERIF,
                  fontSize: "12px",
                  letterSpacing: "2.4px",
                  color: COLOR_MAUVE,
                  marginBottom: "5px",
                }}
              >
                Name
              </label>
              <input
                type="text"
                disabled={editable}
                value={rsvpData.name}
                onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
                required
                style={{
                  width: "398px",
                  height: "40px",
                  backgroundColor: COLOR_WHITE,
                  border: `1px solid ${COLOR_BORDER}`,
                  borderRadius: "7px",
                  padding: "0 12px",
                  fontFamily: FONT_SERIF,
                  fontSize: "13px",
                  color: "#333",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Sir Name Field */}
            <div style={{ position: "absolute", left: 0, top: "74px", width: "398px" }}>
              <label
                style={{
                  display: "block",
                  fontFamily: FONT_SERIF,
                  fontSize: "12px",
                  letterSpacing: "2.4px",
                  color: COLOR_MAUVE,
                  marginBottom: "5px",
                }}
              >
                Sir Name
              </label>
              <input
                type="text"
                disabled={editable}
                value={rsvpData.sirName}
                onChange={(e) => setRsvpData({ ...rsvpData, sirName: e.target.value })}
                required
                style={{
                  width: "398px",
                  height: "40px",
                  backgroundColor: COLOR_WHITE,
                  border: `1px solid ${COLOR_BORDER}`,
                  borderRadius: "7px",
                  padding: "0 12px",
                  fontFamily: FONT_SERIF,
                  fontSize: "13px",
                  color: "#333",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Email Field */}
            <div style={{ position: "absolute", left: 0, top: "149px", width: "398px" }}>
              <label
                style={{
                  display: "block",
                  fontFamily: FONT_SERIF,
                  fontSize: "12px",
                  letterSpacing: "2.4px",
                  color: COLOR_MAUVE,
                  marginBottom: "5px",
                }}
              >
                Email
              </label>
              <input
                type="email"
                disabled={editable}
                value={rsvpData.email}
                onChange={(e) => setRsvpData({ ...rsvpData, email: e.target.value })}
                required
                style={{
                  width: "398px",
                  height: "40px",
                  backgroundColor: COLOR_WHITE,
                  border: `1px solid ${COLOR_BORDER}`,
                  borderRadius: "7px",
                  padding: "0 12px",
                  fontFamily: FONT_SERIF,
                  fontSize: "13px",
                  color: "#333",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Number of guests Field */}
            <div style={{ position: "absolute", left: 0, top: "223px", width: "398px" }}>
              <label
                style={{
                  display: "block",
                  fontFamily: FONT_SERIF,
                  fontSize: "12px",
                  letterSpacing: "2.4px",
                  color: COLOR_MAUVE,
                  marginBottom: "5px",
                }}
              >
                Number of guests
              </label>
              <input
                type="number"
                min="1"
                disabled={editable}
                value={rsvpData.guests}
                onChange={(e) => setRsvpData({ ...rsvpData, guests: e.target.value })}
                placeholder=""
                style={{
                  width: "398px",
                  height: "40px",
                  backgroundColor: COLOR_WHITE,
                  border: `1px solid ${COLOR_BORDER}`,
                  borderRadius: "7px",
                  padding: "0 12px",
                  fontFamily: FONT_SERIF,
                  fontSize: "13px",
                  color: "#333",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* #1587:3529 Submit Button */}
          <button
            id="preview-el-rsvp-btn"
            data-element-id="rsvp-btn"
            type="submit"
            disabled={editable || rsvpStatus === "sending" || rsvpStatus === "success"}
            onClick={() => handleElementClick("rsvp-btn")}
            className="hover:scale-[1.015] active:scale-[0.985] transition-all duration-300 shadow-md hover:shadow-lg"
            style={makeSelectable(
              "rsvp-btn",
              figmaBox({
                x: 16,
                y: 2953,
                width: 398,
                height: 40,
                zIndex: 5,
                extra: {
                  backgroundColor: rsvpStatus === "success" ? "#10B981" : (overrides["rsvp-btn"]?.color || COLOR_MAUVE),
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: editable ? "pointer" : "pointer",
                  border: "none",
                  transition: "background-color 0.3s ease, transform 0.25s ease, box-shadow 0.25s ease",
                },
              })
            )}
          >
            <span
              style={{
                fontFamily: overrides["rsvp-btn"]?.fontFamily && overrides["rsvp-btn"]?.fontFamily !== "Défaut du Template" ? overrides["rsvp-btn"].fontFamily : FONT_SERIF,
                fontSize: overrides["rsvp-btn"]?.fontSize ? (typeof overrides["rsvp-btn"].fontSize === "number" ? `${overrides["rsvp-btn"].fontSize}px` : overrides["rsvp-btn"].fontSize) : "12px",
                lineHeight: "18px",
                letterSpacing: "2.4px",
                color: COLOR_WHITE,
              }}
            >
              {rsvpStatus === "success"
                ? "✓ Confirmation Sent!"
                : rsvpStatus === "sending"
                ? "Sending..."
                : getText("rsvp-btn", "Send Confirmation")}
            </span>
          </button>
        </form>

        {/* =========================================================================
            SECTION 8: FOOTER MONOGRAM SEAL (3034 - 3214px)
           ========================================================================= */}
        {/* #1583:14 Lace 1 Frame */}
        <div
          id="preview-el-footer-names"
          data-element-id="footer-names"
          className="reveal seal-pulse"
          onClick={() => handleElementClick("footer-names")}
          style={makeSelectable(
            "footer-names",
            figmaBox({
              x: 125,
              y: 3034,
              width: 180,
              height: 180,
              zIndex: 4,
            })
          )}
        >
          {/* #1583:15 Lace Seal SVG */}
          <img
            src={laceSeal}
            alt="Lace Seal"
            className="lace-spin"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "180px",
              height: "180px",
              pointerEvents: "none",
            }}
          />
          {/* #1587:4166 Couple Monogram Names */}
          <div
            style={{
              position: "absolute",
              left: "10px",
              top: "60px",
              width: "157px",
              height: "77px",
              fontFamily: overrides["footer-names"]?.fontFamily && overrides["footer-names"]?.fontFamily !== "Défaut du Template" ? overrides["footer-names"].fontFamily : FONT_SCRIPT,
              fontSize: overrides["footer-names"]?.fontSize ? (typeof overrides["footer-names"].fontSize === "number" ? `${overrides["footer-names"].fontSize}px` : overrides["footer-names"].fontSize) : "20px",
              lineHeight: "22px",
              letterSpacing: "1px",
              textAlign: "center",
              color: overrides["footer-names"]?.color || COLOR_MAUVE,
              whiteSpace: "pre-line",
            }}
          >
            {getText("footer-names", coupleText)}
          </div>
        </div>
      </div>
    </div>
  );
}
