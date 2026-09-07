import React, { useState, useEffect, useRef } from "react";
import AudioPlayer from "../components/audio/AudioPlayer";
import templateConfig from "../data/digital/templates/brezza-marina.json";

// Figma Assets for Brezza Marina
import heroBg from "../assets/digital/brezza-marina/hero-bg.png";
import countdownPuddle from "../assets/digital/brezza-marina/countdown-puddle.png";
import oceanStripesTop from "../assets/digital/brezza-marina/ocean-stripes-top.png";
import oceanStripesBottom from "../assets/digital/brezza-marina/ocean-stripes-bottom.png";
import locationVenue from "../assets/digital/brezza-marina/location-venue.png";
import storyBg from "../assets/digital/brezza-marina/story-bg-74a0dd.png";
import storyCouplePhoto from "../assets/digital/brezza-marina/story-couple-photo-549b27.png";
import postcardWaves from "../assets/digital/brezza-marina/postcard-waves.png";
import timelineWave from "../assets/digital/brezza-marina/timeline-wave.png";
import timelinePearl from "../assets/digital/brezza-marina/timeline-pearl.png";
import dressCodeAttire from "../assets/digital/brezza-marina/dress-code-attire.png";

import shell1 from "../assets/digital/brezza-marina/shell-1.png";
import shell2 from "../assets/digital/brezza-marina/shell-2.png";
import shell3 from "../assets/digital/brezza-marina/shell-3.png";
import shell4 from "../assets/digital/brezza-marina/shell-4.png";

// Shared Theme Constants
const CANVAS_WIDTH = 430;
const CANVAS_HEIGHT = 3243;
const BLUE = "#0093D8";
const TEXT_MUTED = "#49606B";
const BLUE_BTN = "#AACFE1";
const WHITE = "#FFFFFF";

// Helper for exact Figma absolute placement
const figmaBox = ({ x, y, width, height, zIndex = 2, extra = {} }) => ({
  position: "absolute",
  left: `${x}px`,
  top: `${y}px`,
  width: width !== undefined ? `${width}px` : "auto",
  height: height !== undefined ? `${height}px` : "auto",
  zIndex,
  boxSizing: "border-box",
  ...extra
});

export default function BrezzaMarinaInvitePage({ invite, editable = false }) {
  const currentInvite = invite || templateConfig.sample;
  const overrides = currentInvite.styleOverrides || {};
  const getText = (id, fallback) => overrides[id]?.text || fallback;

  const canvasRef = useRef(null);

  // Interactive timeline pearl milestones & drag physics
  const [activeStage, setActiveStage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPos, setDragPos] = useState(null);

  const pearlStages = [
    { x: 54, y: 2102 },
    { x: 134, y: 2068 },
    { x: 211, y: 2102 },
    { x: 289, y: 2068 },
    { x: 362, y: 2102 },
  ];

  // Sinusoidal wave equation matching the timeline wave track
  const getWaveY = (x) => {
    return 2085 + 17 * Math.cos(((x - 54) / 77) * Math.PI);
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    setIsDragging(true);

    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    if (clientX !== undefined && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const scale = rect.width / CANVAS_WIDTH;
      const canvasX = Math.max(54, Math.min(362, (clientX - rect.left) / scale));
      setDragPos({ x: canvasX, y: getWaveY(canvasX) });
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e) => {
      const clientX = e.clientX ?? e.touches?.[0]?.clientX;
      if (clientX === undefined || !canvasRef.current) return;

      if (e.cancelable && e.touches) {
        e.preventDefault();
      }

      const rect = canvasRef.current.getBoundingClientRect();
      const scale = rect.width / CANVAS_WIDTH;
      const canvasX = Math.max(54, Math.min(362, (clientX - rect.left) / scale));
      const canvasY = getWaveY(canvasX);

      setDragPos({ x: canvasX, y: canvasY });

      // Highlight closest milestone while dragging
      let nearestIndex = 0;
      let minDiff = Infinity;
      pearlStages.forEach((stage, idx) => {
        const diff = Math.abs(stage.x - canvasX);
        if (diff < minDiff) {
          minDiff = diff;
          nearestIndex = idx;
        }
      });
      setActiveStage(nearestIndex);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      setDragPos(null);
    };

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("touchmove", handlePointerMove, { passive: false });
    window.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("touchend", handlePointerUp);
    window.addEventListener("touchcancel", handlePointerUp);

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchend", handlePointerUp);
      window.removeEventListener("touchcancel", handlePointerUp);
    };
  }, [isDragging]);

  // Live Countdown logic
  const [timeLeft, setTimeLeft] = useState({ days: 60, hours: 5, minutes: 32 });
  useEffect(() => {
    if (!currentInvite.eventDate) return;
    const calculateTime = () => {
      const difference = +new Date(currentInvite.eventDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      }
    };
    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [currentInvite.eventDate]);

  // Scroll reveal animation observer
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

    // Fallback scroll check for scrollable containers (e.g. editor iframe)
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
  }, [animType, animDuration, currentInvite.animationType, currentInvite.animationDuration]);

  const coupleText = (() => {
    if (!currentInvite.coupleNames) return "Houssem\n&\nDorra";
    if (currentInvite.coupleNames.includes("\n")) return currentInvite.coupleNames;
    const parts = currentInvite.coupleNames.split(/&|and|\+/i).map((s) => s.trim());
    if (parts.length >= 2) {
      return `${parts[0]}\n&\n${parts[1]}`;
    }
    return currentInvite.coupleNames;
  })();

  const getStyle = (id, baseStyle) => {
    const o = overrides[id];
    if (!o) return baseStyle;
    return {
      ...baseStyle,
      ...(o.fontFamily && o.fontFamily !== "Défaut du Template" ? { fontFamily: o.fontFamily } : {}),
      ...(o.fontSize ? { fontSize: typeof o.fontSize === 'number' ? `${o.fontSize}px` : o.fontSize } : {}),
      ...(o.color ? { color: o.color } : {})
    };
  };

  return (
    <div
      style={{
        backgroundColor: "#E2E8F0",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: editable ? "0" : "30px 0 100px",
        fontFamily: "'Bodoni Moda', serif"
      }}
    >
      <style>{`
        .reveal {
          opacity: ${animType === "none" ? "1" : "0"};
          transition: opacity ${animDuration}s cubic-bezier(0.16, 1, 0.3, 1),
                      transform ${animDuration}s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        .reveal:not(.revealed) {
          opacity: ${animType === "none" ? "1" : "0"} !important;
          ${animType === "fade-up" ? "transform: translate3d(0, 32px, 0) !important;" : ""}
          ${animType === "zoom-in" ? "transform: scale(0.92) !important;" : ""}
        }
        .reveal.revealed {
          opacity: 1 !important;
          ${animType === "fade-up" ? "transform: translate3d(0, 0, 0) !important;" : ""}
          ${animType === "zoom-in" ? "transform: scale(1) !important;" : ""}
        }

        /* Coastal Shells gentle organic floating sway */
        @keyframes shell-sway-left {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          50% {
            transform: translate3d(3px, -8px, 0) rotate(2deg);
          }
          100% {
            transform: translate3d(-2px, 5px, 0) rotate(-1deg);
          }
        }
        .shell-float-left {
          will-change: transform;
          animation: shell-sway-left 5s ease-in-out infinite alternate !important;
          display: block;
        }

        @keyframes shell-sway-right {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          50% {
            transform: translate3d(-3px, -8px, 0) rotate(-2deg);
          }
          100% {
            transform: translate3d(2px, 5px, 0) rotate(1.5deg);
          }
        }
        .shell-float-right {
          will-change: transform;
          animation: shell-sway-right 5.5s ease-in-out infinite alternate !important;
          display: block;
        }

        /* Hero Scroll Down Indicator gentle pulse/bounce */
        @keyframes hero-indicator-bounce {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.85;
          }
          50% {
            transform: translateY(7px);
            opacity: 1;
          }
        }
        .hero-indicator-bounce {
          animation: hero-indicator-bounce 2s ease-in-out infinite !important;
        }

        /* Timeline Pearl soft gentle glow & pulse */
        @keyframes pearl-pulse {
          0%, 100% {
            filter: drop-shadow(0 0 2px rgba(0, 147, 216, 0.25));
            transform: scale(1);
          }
          50% {
            filter: drop-shadow(0 0 7px rgba(0, 147, 216, 0.65));
            transform: scale(1.12);
          }
        }
        .pearl-glow {
          animation: pearl-pulse 2.8s ease-in-out infinite !important;
        }
      `}</style>

      {/* Background Music Audio Player */}
      <AudioPlayer src={currentInvite.musicUrl} active={Boolean(currentInvite.musicUrl)} />

      {/* 430px Canvas Container */}
      <div
        ref={canvasRef}
        id="brezza-marina-canvas"
        style={{
          position: "relative",
          width: `${CANVAS_WIDTH}px`,
          height: `${CANVAS_HEIGHT}px`,
          backgroundColor: WHITE,
          boxShadow: "0 25px 60px rgba(0,0,0,0.18)",
          overflow: "hidden"
        }}
      >
        {/* =========================================================================
            SECTION 1: HERO (0 - 654px)
            ========================================================================= */}
        {/* bg image #1554:5 */}
        <img
          src={heroBg}
          alt="Brezza Marina Hero"
          style={figmaBox({ x: 0, y: 0, width: 436, height: 654, zIndex: 1 })}
          draggable="false"
        />

        {/* Quote text #1518:521 */}
        <div
          className="reveal"
          style={{
            ...getStyle('hero-subtitle', {
              ...figmaBox({ x: 75, y: 90, width: 280, height: 49, zIndex: 3 }),
              fontFamily: "'Bodoni Moda', serif",
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "18px",
              textAlign: "center",
              color: WHITE
            }),
            transitionDelay: "150ms"
          }}
        >
          {getText('hero-subtitle', currentInvite.heroQuote || "L'amour n'est qu'un mot, jusqu'à ce que quelqu'un vienne lui donner un sens.")}
        </div>

        {/* Names #1518:520 */}
        <div
          className="reveal"
          style={{
            ...getStyle('hero-names', {
              ...figmaBox({ x: 137, y: 151, width: 157, height: 112, zIndex: 3 }),
              fontFamily: "'Beau Rivage', cursive",
              fontSize: "40px",
              fontWeight: 400,
              lineHeight: "44px",
              letterSpacing: "0.05em",
              textAlign: "center",
              color: WHITE,
              whiteSpace: "pre-line"
            }),
            transitionDelay: "300ms"
          }}
        >
          {getText('hero-names', coupleText)}
        </div>

        {/* Scroll down indicator (line with corner-connected rectangle/diamond) #1518:525 */}
        <div
          className="hero-indicator-bounce"
          onClick={() => {
            const countdownEl = document.getElementById("countdown-section");
            if (countdownEl) {
              countdownEl.scrollIntoView({ behavior: "smooth" });
            } else {
              window.scrollTo({ top: 654, behavior: "smooth" });
            }
          }}
          style={{
            ...figmaBox({ x: 210.5, y: 561, width: 9, height: 22, zIndex: 3 }),
            cursor: "pointer",
            display: "flex",
            justifyContent: "center"
          }}
          title="Défiler vers le bas"
        >
          <svg
            width="9"
            height="22"
            viewBox="0 0 9 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block" }}
          >
            <line x1="4.5" y1="0" x2="4.5" y2="15" stroke="#FFFFFF" strokeWidth="1" />
            <polygon points="4.5,15 7.5,18 4.5,21 1.5,18" fill="#FFFFFF" />
          </svg>
        </div>

        {/* =========================================================================
            SECTION 2: COUNTDOWN (717 - 950px)
            ========================================================================= */}
        <div id="countdown-section" style={figmaBox({ x: 0, y: 654, width: 430, height: 1, zIndex: 0 })} />

        {/* Shell 2 ornament #1520:52 */}
        <div
          className="reveal"
          style={{
            ...figmaBox({ x: 0, y: 662, width: 81.1, height: 141.2, zIndex: 1 }),
            transitionDelay: "100ms"
          }}
        >
          <img src={shell2} alt="Shell 2" className="shell-float-left" style={{ width: "100%", height: "100%" }} draggable="false" />
        </div>

        {/* Ocean puddle #1218:124 */}
        <img
          src={countdownPuddle}
          alt=""
          className="reveal"
          style={{
            ...figmaBox({ x: 49, y: 717, width: 350, height: 226, zIndex: 1 }),
            transitionDelay: "150ms"
          }}
          draggable="false"
        />

        {/* Title "Countdown" #1218:126 */}
        <div
          className="reveal"
          style={{
            ...getStyle('countdown-title', {
              ...figmaBox({ x: 131, y: 752, width: 168, height: 42, zIndex: 3 }),
              fontFamily: "'Beau Rivage', cursive",
              fontSize: "30px",
              fontWeight: 400,
              letterSpacing: "0.05em",
              lineHeight: 1,
              textAlign: "center",
              color: BLUE
            }),
            transitionDelay: "200ms"
          }}
        >
          {getText('countdown-title', "Countdown")}
        </div>

        {/* Arabic Title "العد التنازلي" #1218:163 */}
        <div
          className="reveal"
          style={{
            ...getStyle('countdown-title-ar', {
              ...figmaBox({ x: 134, y: 793, width: 162, height: 30, zIndex: 3 }),
              fontFamily: "'B Fantezy', 'Gulzar', 'Amiri', serif",
              fontSize: "20px",
              fontWeight: 400,
              lineHeight: 1,
              textAlign: "center",
              color: BLUE
            }),
            transitionDelay: "250ms"
          }}
        >
          {getText('countdown-title-ar', "العد التنازلي")}
        </div>

        {/* Group #1518:515: 3 countdown boxes with separators */}
        <div
          className="reveal"
          style={{
            ...figmaBox({ x: 121, y: 839, width: 188, height: 64, zIndex: 3 }),
            transitionDelay: "300ms"
          }}
        >
          {/* Days */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "44px",
              height: "35px",
              fontFamily: "'Cinzel', serif",
              fontSize: "30px",
              fontWeight: 400,
              color: TEXT_MUTED,
              textAlign: "center"
            }}
          >
            {String(timeLeft.days).padStart(2, '0')}
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: "40px",
              width: "44px",
              height: "24px",
              fontFamily: "'Bodoni Moda', serif",
              fontSize: "12px",
              fontWeight: 400,
              color: TEXT_MUTED,
              textAlign: "center"
            }}
          >
            Days
          </div>

          {/* Line separator 1 #1518:514 */}
          <div
            style={{
              position: "absolute",
              left: "56px",
              top: "3px",
              width: 0,
              height: "36px",
              borderLeft: "0.5px solid #49606B"
            }}
          />

          {/* Hours */}
          <div
            style={{
              position: "absolute",
              left: "72px",
              top: 0,
              width: "44px",
              height: "35px",
              fontFamily: "'Cinzel', serif",
              fontSize: "30px",
              fontWeight: 400,
              color: TEXT_MUTED,
              textAlign: "center"
            }}
          >
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <div
            style={{
              position: "absolute",
              left: "72px",
              top: "40px",
              width: "44px",
              height: "24px",
              fontFamily: "'Bodoni Moda', serif",
              fontSize: "12px",
              fontWeight: 400,
              color: TEXT_MUTED,
              textAlign: "center"
            }}
          >
            Hours
          </div>

          {/* Line separator 2 #1518:471 */}
          <div
            style={{
              position: "absolute",
              left: "133px",
              top: "3px",
              width: 0,
              height: "36px",
              borderLeft: "0.5px solid #49606B"
            }}
          />

          {/* Minutes */}
          <div
            style={{
              position: "absolute",
              left: "144px",
              top: 0,
              width: "44px",
              height: "35px",
              fontFamily: "'Cinzel', serif",
              fontSize: "30px",
              fontWeight: 400,
              color: TEXT_MUTED,
              textAlign: "center"
            }}
          >
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <div
            style={{
              position: "absolute",
              left: "144px",
              top: "40px",
              width: "44px",
              height: "24px",
              fontFamily: "'Bodoni Moda', serif",
              fontSize: "12px",
              fontWeight: 400,
              color: TEXT_MUTED,
              textAlign: "center"
            }}
          >
            Minutes
          </div>
        </div>

        {/* =========================================================================
            SECTION 3: LOCATION (991 - 1460px)
            ========================================================================= */}
        {/* Title "Location" #1518:516 */}
        <div
          className="reveal"
          style={{
            ...getStyle('location-title', {
              ...figmaBox({ x: 131, y: 996, width: 168, height: 42, zIndex: 3 }),
              fontFamily: "'Beau Rivage', cursive",
              fontSize: "30px",
              fontWeight: 400,
              letterSpacing: "0.05em",
              lineHeight: 1,
              textAlign: "center",
              color: BLUE
            }),
            transitionDelay: "150ms"
          }}
        >
          {getText('location-title', "Location")}
        </div>

        {/* Arabic Title "وين بش نتقابلو" #1518:517 */}
        <div
          className="reveal"
          style={{
            ...getStyle('location-title-ar', {
              ...figmaBox({ x: 134, y: 1037, width: 162, height: 30, zIndex: 3 }),
              fontFamily: "'B Fantezy', 'Gulzar', 'Amiri', serif",
              fontSize: "20px",
              fontWeight: 400,
              lineHeight: 1,
              textAlign: "center",
              color: BLUE
            }),
            transitionDelay: "200ms"
          }}
        >
          {getText('location-title-ar', "وين بش نتقابلو")}
        </div>

        {/* Ocean stripes top #1218:143 */}
        <div style={{
          ...figmaBox({ x: 323, y: 1036, width: 105, height: 219, zIndex: 1 }),
          transform: "rotate(90deg)",
          overflow: "hidden"
        }}>
          <img
            src={oceanStripesTop}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            draggable="false"
          />
        </div>

        {/* Ocean stripes bottom #1218:144 */}
        <div style={{
          ...figmaBox({ x: -22, y: 1148, width: 105, height: 219, zIndex: 1 }),
          transform: "rotate(90deg)",
          overflow: "hidden"
        }}>
          <img
            src={oceanStripesBottom}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            draggable="false"
          />
        </div>

        {/* Venue Illustration #1218:173 / #1218:176 */}
        <img
          src={locationVenue}
          alt="Dar Bouraoui Venue"
          className="reveal"
          style={{
            ...figmaBox({ x: 88, y: 1096, width: 255, height: 189, zIndex: 2 }),
            transitionDelay: "250ms"
          }}
          draggable="false"
        />

        {/* Shell 3 ornament */}
        <div
          className="reveal"
          style={{
            ...figmaBox({ x: 331, y: 1291, width: 99, height: 187.7, zIndex: 1 }),
            transitionDelay: "250ms"
          }}
        >
          <img src={shell3} alt="Shell 3" className="shell-float-right" style={{ width: "100%", height: "100%" }} draggable="false" />
        </div>

        {/* Text "The ceremony will take place at" #1218:146 */}
        <div
          className="reveal"
          style={{
            ...getStyle('location-intro', {
              ...figmaBox({ x: 101, y: 1336, width: 228, height: 24, zIndex: 3 }),
              fontFamily: "'Bodoni Moda', serif",
              fontSize: "12px",
              fontWeight: 400,
              textAlign: "center",
              color: TEXT_MUTED
            }),
            transitionDelay: "300ms"
          }}
        >
          {getText('location-intro', "The ceremony will take place at")}
        </div>

        {/* Text "{`" ${getText('location-venue', currentInvite.venueName || "Dar Bouraoui Carthage Malaga")} "`}" #1218:147 */}
        <div
          className="reveal"
          style={{
            ...figmaBox({ x: 100, y: 1359, width: 231, height: 23, zIndex: 3 }),
            fontFamily: "'Bodoni Moda', serif",
            fontSize: "12px",
            fontWeight: 400,
            textAlign: "center",
            color: TEXT_MUTED,
            transitionDelay: "350ms"
          }}
        >
          “ {getText('location-venue', currentInvite.venueName || "Dar Bouraoui Carthage Malaga")} ”
        </div>

        {/* Button "Open in maps" #1218:199 / #1218:200 */}
        <div
          onClick={() => {
            const rawAddress =
              overrides['location-btn']?.address ||
              currentInvite.mapAddress ||
              overrides['location-address']?.text ||
              currentInvite.mapUrl;

            let targetUrl = "https://maps.google.com";
            if (rawAddress) {
              if (rawAddress.startsWith("http://") || rawAddress.startsWith("https://")) {
                targetUrl = rawAddress;
              } else {
                targetUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(rawAddress)}`;
              }
            } else {
              const venue = getText('location-venue', currentInvite.venueName || "Dar Bouraoui Carthage Malaga");
              targetUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue)}`;
            }

            window.open(targetUrl, "_blank");
          }}
          className="reveal"
          style={{
            ...figmaBox({ x: 152, y: 1389, width: 126, height: 39, zIndex: 3 }),
            backgroundColor: "#FEFBF9",
            border: "1px solid #49606B",
            borderRadius: "8px",
            opacity: 0.9,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
            transitionDelay: "400ms"
          }}
        >
          <span
            style={getStyle('location-btn', {
              fontFamily: "'Bodoni Moda', serif",
              fontSize: "14px",
              fontWeight: 400,
              color: TEXT_MUTED
            })}
          >
            {getText('location-btn', "Open in maps")}
          </span>
        </div>

        {/* =========================================================================
            SECTION 4: OUR STORY (1479 - 1875px)
            ========================================================================= */}
        {/* Story background #1518:527 */}
        <img
          src={storyBg}
          alt="Our Story Background"
          className="reveal"
          style={{
            ...figmaBox({ x: 0, y: 1479, width: 430, height: 396, zIndex: 1 }),
            transitionDelay: "100ms"
          }}
          draggable="false"
        />

        {/* Title "Our Story" #1518:528 */}
        <div
          className="reveal"
          style={{
            ...getStyle('story-title', {
              ...figmaBox({ x: 131, y: 1508, width: 168, height: 34, zIndex: 3 }),
              fontFamily: "'Beau Rivage', cursive",
              fontSize: "30px",
              fontWeight: 400,
              letterSpacing: "0.05em",
              lineHeight: 1,
              textAlign: "center",
              color: WHITE
            }),
            transitionDelay: "150ms"
          }}
        >
          {getText('story-title', "Our Story")}
        </div>

        {/* Arabic Title "حكايتنا" #1518:537 */}
        <div
          className="reveal"
          style={{
            ...getStyle('story-title-ar', {
              ...figmaBox({ x: 135, y: 1544, width: 162, height: 30, zIndex: 3 }),
              fontFamily: "'B Fantezy', 'Gulzar', 'Amiri', serif",
              fontSize: "20px",
              fontWeight: 400,
              lineHeight: 1,
              textAlign: "center",
              color: WHITE
            }),
            transitionDelay: "200ms"
          }}
        >
          {getText('story-title-ar', "حكايتنا")}
        </div>

        {/* Couple photo #1518:529 */}
        <div
          className="reveal"
          style={{
            ...figmaBox({ x: 118.3, y: 1586, width: 193.18, height: 124.315, zIndex: 3 }),
            transitionDelay: "250ms"
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              transform: "rotate(1.217deg)",
              border: "3px solid #FFFFFF",
              overflow: "hidden"
            }}
          >
            <img
              src={overrides['story-photo']?.image || currentInvite.storyPhoto || storyCouplePhoto}
              alt="Couple"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              draggable="false"
            />
          </div>
        </div>

        {/* Postcard Group #1518:530 */}
        <div
          className="reveal"
          style={{
            ...figmaBox({ x: 117, y: 1713, width: 194.28, height: 126.03, zIndex: 3 }),
            backgroundColor: WHITE,
            borderRadius: "2px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
            transitionDelay: "300ms"
          }}
        >
          {/* Postcard inner border #1518:533 */}
          <div
            style={{
              position: "absolute",
              left: "9.87px",
              top: "8.32px",
              width: "174.95px",
              height: "108.55px",
              border: "0.25px solid #49606B",
              boxSizing: "border-box"
            }}
          />

          {/* Dividing vertical line #1518:532 */}
          <div
            style={{
              position: "absolute",
              left: "98px",
              top: "24.09px",
              width: "0.7px",
              height: "78px",
              backgroundColor: "rgba(0,0,0,0.25)"
            }}
          />

          {/* Left note "Hi, it's Us !" #1518:534 */}
          <div
            style={{
              position: "absolute",
              left: "24.18px",
              top: "44.17px",
              width: "65.6px",
              height: "68.58px",
              fontFamily: "'Beau Rivage', cursive",
              fontSize: "16px",
              lineHeight: "20px",
              color: TEXT_MUTED,
              textAlign: "center",
              whiteSpace: "pre-line"
            }}
          >
            {getText('our-story-title', currentInvite.ourStoryTitle || "Hi, it's\nUs !")}
          </div>

          {/* Postcard waves stamp #1518:535 */}
          <img
            src={postcardWaves}
            alt="Waves Stamp"
            style={{
              position: "absolute",
              left: "138.01px",
              top: "21.38px",
              width: "39.16px",
              height: "18.35px",
              objectFit: "cover"
            }}
            draggable="false"
          />

          {/* Right text note #1518:536 */}
          <div
            style={getStyle('story-card-quote', {
              position: "absolute",
              left: "103.2px",
              top: "47.34px",
              width: "75.56px",
              height: "47.67px",
              fontFamily: "'Bodoni Moda', serif",
              fontSize: "8px",
              fontWeight: 400,
              lineHeight: "normal",
              textAlign: "center",
              color: TEXT_MUTED,
              textDecorationLine: "underline",
              textDecorationStyle: "solid",
              textDecorationSkipInk: "none",
              textDecorationThickness: "auto",
              textUnderlineOffset: "auto",
              textUnderlinePosition: "from-font",
              whiteSpace: "pre-line"
            })}
          >
            {getText('story-card-quote', currentInvite.ourStoryText || "Placeat accusamus\n in rem a id et ad. \nAdipisci quia et eos ")}
          </div>
        </div>

        {/* =========================================================================
            SECTION 5: TIMELINE (1936 - 2230px)
            ========================================================================= */}
        {/* Title "Timeline" #1218:128 */}
        <div
          className="reveal"
          style={{
            ...getStyle('timeline-title', {
              ...figmaBox({ x: 131, y: 1941, width: 168, height: 42, zIndex: 3 }),
              fontFamily: "'Beau Rivage', cursive",
              fontSize: "30px",
              fontWeight: 400,
              letterSpacing: "0.05em",
              lineHeight: 1,
              textAlign: "center",
              color: BLUE
            }),
            transitionDelay: "150ms"
          }}
        >
          {getText('timeline-title', "Timeline")}
        </div>

        {/* Arabic Title "البرنامج" #1218:165 */}
        <div
          className="reveal"
          style={{
            ...getStyle('timeline-title-ar', {
              ...figmaBox({ x: 134, y: 1981, width: 162, height: 30, zIndex: 3 }),
              fontFamily: "'B Fantezy', 'Gulzar', 'Amiri', serif",
              fontSize: "20px",
              fontWeight: 400,
              lineHeight: 1,
              textAlign: "center",
              color: BLUE
            }),
            transitionDelay: "200ms"
          }}
        >
          {getText('timeline-title-ar', "البرنامج")}
        </div>

        {/* Stage 1: "Accueil" #1218:168 */}
        <div
          onClick={() => setActiveStage(0)}
          className="reveal"
          style={{
            ...getStyle('timeline-stage-1', {
              ...figmaBox({ x: 13, y: 2046, width: 101.84, height: 22.16, zIndex: 3 }),
              fontFamily: "'Sue Ellen Francisco', cursive",
              fontSize: "16px",
              lineHeight: "20px",
              color: activeStage === 0 ? BLUE : TEXT_MUTED,
              fontWeight: activeStage === 0 ? 600 : 400,
              textAlign: "center",
              cursor: "pointer",
              transition: "color 0.3s ease, font-weight 0.3s ease"
            }),
            transitionDelay: "250ms"
          }}
          title="Étape 1: Accueil"
        >
          {getText('timeline-stage-1', currentInvite.timeline?.[0]?.name || "Accueil")}
        </div>

        {/* Stage 2: "Contrat de mariage" #1218:169 */}
        <div
          onClick={() => setActiveStage(1)}
          className="reveal"
          style={{
            ...getStyle('timeline-stage-2', {
              ...figmaBox({ x: 93, y: 2116, width: 102.03, height: 43.01, zIndex: 3 }),
              fontFamily: "'Sue Ellen Francisco', cursive",
              fontSize: "16px",
              lineHeight: "20px",
              color: activeStage === 1 ? BLUE : TEXT_MUTED,
              fontWeight: activeStage === 1 ? 600 : 400,
              textAlign: "center",
              whiteSpace: "pre-line",
              cursor: "pointer",
              transition: "color 0.3s ease, font-weight 0.3s ease"
            }),
            transitionDelay: "280ms"
          }}
          title="Étape 2: Contrat de mariage"
        >
          {(() => {
            const val = getText('timeline-stage-2', currentInvite.timeline?.[1]?.name || "Contrat\nde mariage");
            return val.replace(/Contrat\s+de mariage/i, "Contrat\nde mariage");
          })()}
        </div>

        {/* Stage 3: "Fête" #1218:170 */}
        <div
          onClick={() => setActiveStage(2)}
          className="reveal"
          style={{
            ...getStyle('timeline-stage-3', {
              ...figmaBox({ x: 170, y: 2051, width: 101.88, height: 26.24, zIndex: 3 }),
              fontFamily: "'Sue Ellen Francisco', cursive",
              fontSize: "16px",
              lineHeight: "20px",
              color: activeStage === 2 ? BLUE : TEXT_MUTED,
              fontWeight: activeStage === 2 ? 600 : 400,
              textAlign: "center",
              cursor: "pointer",
              transition: "color 0.3s ease, font-weight 0.3s ease"
            }),
            transitionDelay: "310ms"
          }}
          title="Étape 3: Fête"
        >
          {getText('timeline-stage-3', currentInvite.timeline?.[2]?.name || "Fête")}
        </div>

        {/* Stage 4: "Photos" #1218:171 */}
        <div
          onClick={() => setActiveStage(3)}
          className="reveal"
          style={{
            ...getStyle('timeline-stage-4', {
              ...figmaBox({ x: 248, y: 2122, width: 101.88, height: 26.24, zIndex: 3 }),
              fontFamily: "'Sue Ellen Francisco', cursive",
              fontSize: "16px",
              lineHeight: "20px",
              color: activeStage === 3 ? BLUE : TEXT_MUTED,
              fontWeight: activeStage === 3 ? 600 : 400,
              textAlign: "center",
              cursor: "pointer",
              transition: "color 0.3s ease, font-weight 0.3s ease"
            }),
            transitionDelay: "340ms"
          }}
          title="Étape 4: Photos"
        >
          {getText('timeline-stage-4', currentInvite.timeline?.[3]?.name || "Photos")}
        </div>

        {/* Stage 5: "La fin" #1218:172 */}
        <div
          onClick={() => setActiveStage(4)}
          className="reveal"
          style={{
            ...getStyle('timeline-stage-5', {
              ...figmaBox({ x: 321, y: 2052, width: 101.88, height: 26.24, zIndex: 3 }),
              fontFamily: "'Sue Ellen Francisco', cursive",
              fontSize: "16px",
              lineHeight: "20px",
              color: activeStage === 4 ? BLUE : TEXT_MUTED,
              fontWeight: activeStage === 4 ? 600 : 400,
              textAlign: "center",
              cursor: "pointer",
              transition: "color 0.3s ease, font-weight 0.3s ease"
            }),
            transitionDelay: "370ms"
          }}
          title="Étape 5: La fin"
        >
          {getText('timeline-stage-5', currentInvite.timeline?.[4]?.name || "La fin")}
        </div>

        {/* Timeline wave track #1218:166 */}
        <div
          className="reveal"
          style={{
            ...figmaBox({ x: -8, y: 2057, width: 509, height: 90, zIndex: 2 }),
            background: `url(${timelineWave}) 50% / cover no-repeat`,
            aspectRatio: "509/90",
            transitionDelay: "250ms"
          }}
        />

        {/* Timeline pearl indicator #1218:167 */}
        {(() => {
          const currentPearlCoords = isDragging && dragPos ? dragPos : pearlStages[activeStage] || pearlStages[0];
          return (
            <div
              onMouseDown={handlePointerDown}
              onTouchStart={handlePointerDown}
              style={{
                ...figmaBox({
                  x: currentPearlCoords.x - 6,
                  y: currentPearlCoords.y - 6,
                  width: 31,
                  height: 32,
                  zIndex: 5
                }),
                cursor: isDragging ? "grabbing" : "grab",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                touchAction: "none",
                userSelect: "none",
                WebkitUserSelect: "none",
                transition: isDragging
                  ? "none"
                  : "left 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)",
                willChange: "left, top"
              }}
              title="Maintenez et glissez la perle le long du programme"
            >
              <img
                src={timelinePearl}
                alt="Pearl"
                className="pearl-glow"
                style={{
                  width: 19,
                  height: 20,
                  objectFit: "cover",
                  pointerEvents: "none",
                  transform: isDragging ? "scale(1.3)" : "scale(1)",
                  transition: "transform 0.2s ease"
                }}
                draggable="false"
              />
            </div>
          );
        })()}

        {/* Drag pearl instruction #1218:148 */}
        <div
          className="reveal"
          style={{
            ...getStyle('timeline-instructions', {
              ...figmaBox({ x: 100, y: 2182, width: 231, height: 17, zIndex: 3 }),
              fontFamily: "'Bodoni Moda', serif",
              fontSize: "12px",
              fontWeight: 400,
              textAlign: "center",
              color: TEXT_MUTED
            }),
            transitionDelay: "400ms"
          }}
        >
          {getText('timeline-instructions', "Drag the Pearl to complete the schedule")}
        </div>

        {/* =========================================================================
            SECTION 6: DRESS CODE (2272 - 2580px)
            ========================================================================= */}
        {/* Shell 1 ornament #1520:268 */}
        <div
          className="reveal"
          style={{
            ...figmaBox({ x: 0, y: 2285, width: 65, height: 112, zIndex: 1 }),
            transitionDelay: "200ms"
          }}
        >
          <img src={shell1} alt="Shell 1" className="shell-float-left" style={{ width: "100%", height: "100%" }} draggable="false" />
        </div>

        {/* Title "Dress Code" #1519:3 */}
        <div
          className="reveal"
          style={{
            ...getStyle('dress-title', {
              ...figmaBox({ x: 131, y: 2277, width: 168, height: 42, zIndex: 3 }),
              fontFamily: "'Beau Rivage', cursive",
              fontSize: "30px",
              fontWeight: 400,
              letterSpacing: "0.05em",
              lineHeight: 1,
              textAlign: "center",
              color: BLUE
            }),
            transitionDelay: "150ms"
          }}
        >
          {getText('dress-title', "Dress Code")}
        </div>

        {/* Arabic Title "الهندام" #1519:4 */}
        <div
          className="reveal"
          style={{
            ...getStyle('dress-title-ar', {
              ...figmaBox({ x: 134, y: 2317, width: 162, height: 30, zIndex: 3 }),
              fontFamily: "'B Fantezy', 'Gulzar', 'Amiri', serif",
              fontSize: "20px",
              fontWeight: 400,
              lineHeight: 1,
              textAlign: "center",
              color: BLUE
            }),
            transitionDelay: "200ms"
          }}
        >
          {getText('dress-title-ar', "الهندام")}
        </div>

        {/* Dress code attire image #1520:7 */}
        <img
          src={dressCodeAttire}
          alt="Dress Code Attire"
          className="reveal"
          style={{
            ...figmaBox({ x: 146, y: 2365, width: 139, height: 139, zIndex: 2 }),
            transitionDelay: "250ms"
          }}
          draggable="false"
        />

        {/* Instruction note #1520:5 */}
        <div
          className="reveal"
          style={{
            ...getStyle('dress-text', {
              ...figmaBox({ x: 100, y: 2531, width: 231, height: 35, zIndex: 3 }),
              fontFamily: "'Bodoni Moda', serif",
              fontSize: "12px",
              fontWeight: 400,
              lineHeight: "17px",
              textAlign: "center",
              color: TEXT_MUTED
            }),
            transitionDelay: "300ms"
          }}
        >
          {getText('dress-text', currentInvite.dressCodeText || "Nous prions nos invités d'éviter de porter du blanc et du noir")}
        </div>

        {/* =========================================================================
            SECTION 7: RSVP (2617 - 3130px)
            ========================================================================= */}
        {/* Title "RSVP" #1520:12 */}
        <div
          className="reveal"
          style={{
            ...getStyle('rsvp-title', {
              ...figmaBox({ x: 131, y: 2617, width: 168, height: 42, zIndex: 3 }),
              fontFamily: "'Beau Rivage', cursive",
              fontSize: "30px",
              fontWeight: 400,
              letterSpacing: "0.05em",
              textAlign: "center",
              color: BLUE
            }),
            transitionDelay: "150ms"
          }}
        >
          {getText('rsvp-title', "RSVP")}
        </div>

        {/* Shell 4 ornament #1520:998 */}
        <div
          className="reveal"
          style={{
            ...figmaBox({ x: 352, y: 2630, width: 78, height: 118.9, zIndex: 1 }),
            transitionDelay: "200ms"
          }}
        >
          <img src={shell4} alt="Shell 4" className="shell-float-right" style={{ width: "100%", height: "100%" }} draggable="false" />
        </div>

        {/* Subtitle deadline #1520:14 */}
        <div
          className="reveal"
          style={{
            ...figmaBox({ x: 100, y: 2676, width: 231, height: 35, zIndex: 3 }),
            fontFamily: "'Bodoni Moda', serif",
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: "17px",
            textAlign: "center",
            color: TEXT_MUTED,
            transitionDelay: "220ms"
          }}
        >
          {getText('rsvp-form', currentInvite.rsvpDeadline ? `The favour of a reply is kindly requested by ${currentInvite.rsvpDeadline}` : "The favour of a reply is kindly requested by the fifteenth of June, 2026")}
        </div>

        {/* Form Field 1: Name #1520:41 / #1520:43 */}
        <div
          className="reveal"
          style={{
            ...figmaBox({ x: 16, y: 2762, width: 397, height: 14, zIndex: 3 }),
            fontFamily: "'Cormorant', serif",
            fontSize: "14px",
            fontWeight: 700,
            color: TEXT_MUTED,
            transitionDelay: "260ms"
          }}
        >
          Name
        </div>
        <input
          type="text"
          readOnly
          placeholder=""
          className="reveal"
          style={{
            ...figmaBox({ x: 16, y: 2781, width: 397, height: 40, zIndex: 3 }),
            backgroundColor: WHITE,
            border: "1px solid #E5E5E5",
            borderRadius: "7px",
            padding: "0 12px",
            outline: "none",
            transitionDelay: "280ms"
          }}
        />

        {/* Form Field 2: Sir Name #1520:45 / #1520:47 */}
        <div
          className="reveal"
          style={{
            ...figmaBox({ x: 16, y: 2836, width: 397, height: 14, zIndex: 3 }),
            fontFamily: "'Cormorant', serif",
            fontSize: "14px",
            fontWeight: 700,
            color: TEXT_MUTED,
            transitionDelay: "300ms"
          }}
        >
          Sir Name
        </div>
        <input
          type="text"
          readOnly
          placeholder=""
          className="reveal"
          style={{
            ...figmaBox({ x: 16, y: 2855, width: 397, height: 40, zIndex: 3 }),
            backgroundColor: WHITE,
            border: "1px solid #E5E5E5",
            borderRadius: "7px",
            padding: "0 12px",
            outline: "none",
            transitionDelay: "320ms"
          }}
        />

        {/* Form Field 3: Email #1520:32 / #1520:34 */}
        <div
          className="reveal"
          style={{
            ...figmaBox({ x: 16, y: 2911, width: 397, height: 14, zIndex: 3 }),
            fontFamily: "'Cormorant', serif",
            fontSize: "14px",
            fontWeight: 700,
            color: TEXT_MUTED,
            transitionDelay: "340ms"
          }}
        >
          Email
        </div>
        <input
          type="email"
          readOnly
          placeholder=""
          className="reveal"
          style={{
            ...figmaBox({ x: 16, y: 2930, width: 397, height: 40, zIndex: 3 }),
            backgroundColor: WHITE,
            border: "1px solid #E5E5E5",
            borderRadius: "7px",
            padding: "0 12px",
            outline: "none",
            transitionDelay: "360ms"
          }}
        />

        {/* Form Field 4: Number of guests #1520:36 / #1520:38 */}
        <div
          className="reveal"
          style={{
            ...figmaBox({ x: 16, y: 2985, width: 397, height: 14, zIndex: 3 }),
            fontFamily: "'Cormorant', serif",
            fontSize: "14px",
            fontWeight: 700,
            color: TEXT_MUTED,
            transitionDelay: "380ms"
          }}
        >
          Number of guests
        </div>
        <input
          type="number"
          readOnly
          placeholder=""
          className="reveal"
          style={{
            ...figmaBox({ x: 16, y: 3004, width: 397, height: 40, zIndex: 3 }),
            backgroundColor: WHITE,
            border: "1px solid #E5E5E5",
            borderRadius: "7px",
            padding: "0 12px",
            outline: "none",
            transitionDelay: "400ms"
          }}
        />

        {/* Button "Send Confirmation" #1520:39 */}
        <div
          className="reveal"
          style={{
            ...figmaBox({ x: 16, y: 3074, width: 396, height: 40, zIndex: 3 }),
            backgroundColor: BLUE_BTN,
            borderRadius: "7px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
            transitionDelay: "420ms"
          }}
        >
          <span
            style={{
              fontFamily: "'Cormorant', serif",
              fontSize: "14px",
              fontWeight: 400,
              color: WHITE
            }}
          >
            Send Confirmation
          </span>
        </div>

        {/* =========================================================================
            SECTION 8: FOOTER (3158px+)
            ========================================================================= */}
        {/* Text "See you there!" #1520:49 */}
        <div
          className="reveal"
          style={{
            ...getStyle('footer-title', {
              ...figmaBox({ x: 131, y: 3158, width: 168, height: 42, zIndex: 3 }),
              fontFamily: "'Beau Rivage', cursive",
              fontSize: "30px",
              fontWeight: 400,
              letterSpacing: "0.05em",
              textAlign: "center",
              color: BLUE
            }),
            transitionDelay: "200ms"
          }}
        >
          {getText('footer-title', "See you there!")}
        </div>


      </div>
    </div>
  );
}


