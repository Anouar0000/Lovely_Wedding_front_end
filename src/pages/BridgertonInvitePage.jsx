import React, { useEffect, useRef, useState } from "react";
import AudioPlayer from "../components/audio/AudioPlayer";
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
import dividerFlourish from "../assets/digital/bridgerton/divider-flourish.svg";
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
const FONT_VOYAGER = "'MADE Voyager PERSONAL_USE', 'Cinzel', 'Playfair Display', serif";

const figmaBox = ({ x, y, width, height, zIndex = 2, extra = {} }) => ({
  position: "absolute",
  left: `${x}px`,
  top: `${y}px`,
  width: width !== undefined ? `${width}px` : "auto",
  height: height !== undefined ? `${height}px` : "auto",
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

  const getText = (id, fallback) => overrides[id]?.text || fallback;

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
    guests: "1",
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
          opacity: 0;
          transform: translateY(22px);
          transition: opacity 1.1s cubic-bezier(0.16, 1, 0.3, 1), transform 1.1s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        .reveal.revealed {
          opacity: 1;
          transform: translateY(0);
        }
        .soft-float {
          animation: bridgertonFloat 6s ease-in-out infinite;
        }
        @keyframes bridgertonFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
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
          backgroundColor: COLOR_WHITE,
          overflow: "hidden",
          transform: scale < 1 ? `scale(${scale})` : undefined,
          transformOrigin: "top center",
          marginBottom: scale < 1 ? `-${(CANVAS_HEIGHT * (1 - scale))}px` : undefined,
          boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
        }}
      >
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
                backgroundImage: `url(${overrides["hero-photo"]?.url || heroCouplePhoto})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              },
            })
          )}
        />

        {/* #1583:85 Hero Couple Names */}
        <div
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
                letterSpacing: "0.05em",
                textAlign: "center",
                color: COLOR_MAUVE,
                whiteSpace: "pre-line",
                textShadow: "0 1px 2px rgba(255,255,255,0.6)",
              },
            })
          )}
        >
          {getText("hero-names", coupleText)}
        </div>

        {/* #1584:90 "Our Happy Ever After" */}
        <div
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
                letterSpacing: "0.05em",
                textAlign: "center",
                color: COLOR_WHITE,
                textShadow: "0 1px 4px rgba(0,0,0,0.3)",
              },
            })
          )}
        >
          {getText("hero-quote", currentInvite.heroQuote || "Our Happy Ever After")}
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
          className="soft-float"
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
          className="reveal"
          onClick={() => handleElementClick("event-date")}
          style={makeSelectable(
            "event-date",
            figmaBox({
              x: 53,
              y: 674,
              width: 331,
              height: 189,
              zIndex: 4,
              extra: {
                fontFamily: FONT_VOYAGER,
                fontSize: "46px",
                lineHeight: "52px",
                letterSpacing: "0.2em",
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
          className="reveal"
          onClick={() => handleElementClick("countdown-waiting")}
          style={makeSelectable(
            "countdown-waiting",
            figmaBox({
              x: 50,
              y: 845,
              width: 331,
              height: 24,
              zIndex: 4,
              extra: {
                fontFamily: FONT_SERIF,
                fontSize: "12px",
                letterSpacing: "0.2em",
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
            zIndex: 4,
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

        {/* #1586:100 Stamp 1 */}
        <img
          src={stamp1}
          alt="Stamp"
          style={figmaBox({
            x: 357,
            y: 824,
            width: 108.67,
            height: 123.72,
            zIndex: 6,
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
                letterSpacing: "0.05em",
                textAlign: "center",
                color: COLOR_WHITE,
                whiteSpace: "pre-line",
                textShadow: "0 1px 3px rgba(0,0,0,0.3)",
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
                letterSpacing: "0.05em",
                textAlign: "center",
                color: COLOR_MAUVE,
              },
            })
          )}
        >
          {getText("venue-title", "Wedding Venue")}
        </div>

        {/* #1586:2003 Venue Address Text */}
        <div
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
                lineHeight: "1.5em",
                letterSpacing: "0.2em",
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

        {/* #1587:2013 Stamp 3 */}
        <img
          src={stamp3}
          alt="Stamp"
          style={figmaBox({
            x: 342,
            y: 1438,
            width: 125.71,
            height: 133.5,
            zIndex: 4,
          })}
        />

        {/* #1587:3497 Venue Photo Group (Oval / Frame) */}
        <div
          className="reveal"
          onClick={() => handleElementClick("venue-photo")}
          style={makeSelectable(
            "venue-photo",
            figmaBox({
              x: 43,
              y: 1531,
              width: 120,
              height: 180,
              zIndex: 4,
              extra: {
                position: "absolute",
              },
            })
          )}
        >
          {/* #1587:3496 White Ellipse Base */}
          <div
            style={{
              position: "absolute",
              left: "15.95px",
              top: "26.58px",
              width: "88.86px",
              height: "126.84px",
              backgroundColor: COLOR_WHITE,
              borderRadius: "50%",
            }}
          />
          {/* #1587:3493 Venue Photo */}
          <img
            src={overrides["venue-photo"]?.url || venuePhoto}
            alt="Venue"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "120px",
              height: "180px",
              objectFit: "cover",
            }}
          />
        </div>

        {/* #1587:2203 Torn Paper 4 */}
        <img
          src={tornPaper4}
          alt=""
          style={figmaBox({
            x: -168,
            y: 1579,
            width: 1556,
            height: 92,
            zIndex: 5,
            extra: { pointerEvents: "none" },
          })}
        />

        {/* =========================================================================
            SECTION 5: DRESS CODE & TRANSPORT (1600 - 2100px)
           ========================================================================= */}
        {/* #1586:95 Title: "Dress Code" */}
        <div
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
                letterSpacing: "0.05em",
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
                lineHeight: "1.5em",
                letterSpacing: "0.2em",
                textAlign: "right",
                color: COLOR_MAUVE,
              },
            })
          )}
        >
          {getText(
            "dress-text",
            currentInvite.dressCodeText ||
              "We'd love for guests to embrace a formal look for our celebration."
          )}
        </div>

        {/* #1586:126 Stamp 2 */}
        <img
          src={stamp2}
          alt="Stamp"
          style={figmaBox({
            x: -34,
            y: 1791,
            width: 125.71,
            height: 133.5,
            zIndex: 4,
          })}
        />

        {/* #1587:2202 Divider Flourish */}
        <img
          src={dividerFlourish}
          alt=""
          style={figmaBox({
            x: 125,
            y: 1853,
            width: 181,
            height: 34,
            zIndex: 4,
            extra: { pointerEvents: "none" },
          })}
        />

        {/* #1587:2207 TE_Bird-01 2 (Bird Right) */}
        <div
          className="soft-float"
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
                letterSpacing: "0.05em",
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
                lineHeight: "1.5em",
                letterSpacing: "0.2em",
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
              backgroundSize: "cover",
              backgroundPosition: "center",
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
                letterSpacing: "0.05em",
                textAlign: "right",
                color: COLOR_WHITE,
                whiteSpace: "pre-line",
                textShadow: "0 1px 3px rgba(0,0,0,0.3)",
              },
            })
          )}
        >
          {getText("message-title", "Leave\na message")}
        </div>

        {/* #1587:3508 Subtitle: "Leave a heartfelt message to the brides" */}
        <div
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
                lineHeight: "1.4em",
                letterSpacing: "0.2em",
                textAlign: "right",
                color: COLOR_WHITE,
                textShadow: "0 1px 2px rgba(0,0,0,0.3)",
              },
            })
          )}
        >
          {getText("message-subtitle", currentInvite.messagePrompt || "Leave a heartfelt message to the brides")}
        </div>

        {/* #1602:3 Message Input Box (Interactive) */}
        <div
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
              padding: "0 12px",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(4px)",
            },
          })}
        >
          {messageSent ? (
            <span
              style={{
                fontFamily: FONT_SERIF,
                fontSize: "12px",
                letterSpacing: "0.15em",
                color: COLOR_WHITE,
                fontWeight: 600,
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
                placeholder="Enter text here..."
                value={guestMessage}
                disabled={editable}
                onChange={(e) => setGuestMessage(e.target.value)}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontFamily: FONT_SERIF,
                  fontSize: "12px",
                  letterSpacing: "0.15em",
                  color: COLOR_WHITE,
                }}
              />
              <button
                type="submit"
                style={{
                  background: "transparent",
                  border: "none",
                  color: COLOR_WHITE,
                  cursor: "pointer",
                  fontSize: "14px",
                  padding: "0 4px",
                }}
              >
                ➔
              </button>
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
          className="reveal"
          onClick={() => handleElementClick("rsvp-title")}
          style={makeSelectable(
            "rsvp-title",
            figmaBox({
              x: 132,
              y: 2496,
              width: 168,
              height: 42,
              zIndex: 4,
              extra: {
                fontFamily: FONT_SCRIPT,
                fontSize: "40px",
                letterSpacing: "0.05em",
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
          className="reveal"
          onClick={() => handleElementClick("rsvp-deadline")}
          style={makeSelectable(
            "rsvp-deadline",
            figmaBox({
              x: 55,
              y: 2555,
              width: 320,
              height: 43,
              zIndex: 4,
              extra: {
                fontFamily: FONT_SERIF,
                fontSize: "12px",
                lineHeight: "1.4em",
                letterSpacing: "0.2em",
                textAlign: "center",
                color: COLOR_MAUVE,
              },
            })
          )}
        >
          {getText(
            "rsvp-deadline",
            currentInvite.rsvpDeadline ||
              "The favour of a reply is kindly requested by the 15th of June, 2026"
          )}
        </div>

        {/* #1587:4168 Stamp 4 */}
        <img
          src={stamp4}
          alt="Stamp"
          style={figmaBox({
            x: 349,
            y: 2538,
            width: 134.17,
            height: 134.17,
            zIndex: 4,
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
                  letterSpacing: "0.2em",
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
                  letterSpacing: "0.2em",
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
                  letterSpacing: "0.2em",
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
                  letterSpacing: "0.2em",
                  color: COLOR_MAUVE,
                  marginBottom: "5px",
                }}
              >
                Number of guests
              </label>
              <select
                disabled={editable}
                value={rsvpData.guests}
                onChange={(e) => setRsvpData({ ...rsvpData, guests: e.target.value })}
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
              >
                <option value="1">1 Person</option>
                <option value="2">2 Persons</option>
                <option value="3">3 Persons</option>
                <option value="4">4 Persons</option>
              </select>
            </div>
          </div>

          {/* #1587:3529 Submit Button */}
          <button
            type="submit"
            disabled={editable || rsvpStatus === "sending" || rsvpStatus === "success"}
            onClick={() => handleElementClick("rsvp-btn")}
            style={makeSelectable(
              "rsvp-btn",
              figmaBox({
                x: 16,
                y: 2953,
                width: 398,
                height: 40,
                zIndex: 5,
                extra: {
                  backgroundColor: rsvpStatus === "success" ? "#10B981" : COLOR_MAUVE,
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: editable ? "default" : "pointer",
                  border: "none",
                  transition: "background-color 0.3s ease",
                },
              })
            )}
          >
            <span
              style={{
                fontFamily: FONT_SERIF,
                fontSize: "12px",
                lineHeight: "1.5em",
                letterSpacing: "0.2em",
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
          className="reveal"
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
              fontFamily: FONT_SCRIPT,
              fontSize: "20px",
              lineHeight: "22px",
              letterSpacing: "0.05em",
              textAlign: "center",
              color: COLOR_MAUVE,
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
