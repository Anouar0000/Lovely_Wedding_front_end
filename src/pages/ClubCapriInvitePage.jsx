import React, { useEffect, useRef, useState } from "react";
import templateConfig from "../data/digital/templates/club-capri.json";

// Assets for Club Capri Template
import heroBg from "../assets/digital/club-capri/hero-bg.png";
import cassetteImg from "../assets/digital/club-capri/cassette.png";
import arrowDownSvg from "../assets/digital/club-capri/arrow-down.svg";
import boatImg from "../assets/digital/club-capri/boat.png";
import stripesLeft from "../assets/digital/club-capri/stripes-left.svg";
import stripesRight from "../assets/digital/club-capri/stripes-right.svg";
import stripesBottom from "../assets/digital/club-capri/stripes-bottom.svg";
import postcardPhoto1Default from "../assets/digital/club-capri/postcard-photo-1.png";
import postcardPhoto2Default from "../assets/digital/club-capri/postcard-photo-2.png";
import postmark1Svg from "../assets/digital/club-capri/postmark-1.svg";
import postmark2Svg from "../assets/digital/club-capri/postmark-2.svg";
import stampSunImg from "../assets/digital/club-capri/stamp-sun.png";
import stampCapriImg from "../assets/digital/club-capri/stamp-capri.png";
import stampCocktailImg from "../assets/digital/club-capri/stamp-cocktail.png";
import dressCodeFamilyDefault from "../assets/digital/club-capri/dress-code-family.png";
import rsvpBgImg from "../assets/digital/club-capri/rsvp-bg.png";
import stampFrameSvg from "../assets/digital/club-capri/stamp-frame.svg";
import maskingTapeImg from "../assets/digital/club-capri/masking-tape.png";
import lifebuoyImg from "../assets/digital/club-capri/lifebuoy.png";

// Exact 1:1 Vector Text from Figma
import heroTitleSvg from "../assets/digital/club-capri/svg_text/hero-title.svg";
import joinUsTitleSvg from "../assets/digital/club-capri/svg_text/join-us-title.svg";
import juneTitleSvg from "../assets/digital/club-capri/svg_text/june-title.svg";
import theDayTitleSvg from "../assets/digital/club-capri/svg_text/the-day-title.svg";
import celebrationsTitleSvg from "../assets/digital/club-capri/svg_text/celebrations-title.svg";
import dressCodeTitleSvg from "../assets/digital/club-capri/svg_text/dress-code-title.svg";
import casualChicTitleSvg from "../assets/digital/club-capri/svg_text/casual-chic-title.svg";
import arrivalTitleSvg from "../assets/digital/club-capri/svg_text/arrival-title.svg";
import rsvpTitleSvg from "../assets/digital/club-capri/svg_text/rsvp-title.svg";
import clubCapriTitleSvg from "../assets/digital/club-capri/svg_text/club-capri-title.svg";
import chedySvg from "../assets/digital/club-capri/svg_text/chedy.svg";
import helaSvg from "../assets/digital/club-capri/svg_text/hela.svg";
import postcardTitle1Svg from "../assets/digital/club-capri/svg_text/postcard-title-1.svg";
import weddingTitleSvg from "../assets/digital/club-capri/svg_text/wedding-title.svg";
import postcardWeddingTextSvg from "../assets/digital/club-capri/svg_text/postcard-wedding-text.svg";
import postcardTitle2Svg from "../assets/digital/club-capri/svg_text/postcard-title-2.svg";
import hennaTitleSvg from "../assets/digital/club-capri/svg_text/henna-title.svg";
import postcardHennaTextSvg from "../assets/digital/club-capri/svg_text/postcard-henna-text.svg";

const CANVAS_WIDTH = 430;
const CANVAS_HEIGHT = 3454;

// Colors
const COLOR_WHITE = "#FFFFFF";
const COLOR_CREAM = "#FFFBF0";
const COLOR_NAVY = "#083B50";
const COLOR_MUTED_GOLD = "#F7EDBC";
const COLOR_TAPE_TEXT = "#E5E2DD";
const COLOR_LIGHT_BLUE = "#C0D5D8";
const COLOR_TEAL = "#427D8D";

// Typography
const FONT_PERPETUA = "'Perpetua Titling MT', 'Perpetua', 'Cinzel', serif";
const FONT_IMPERIAL = "'Imperial Script', cursive";
const FONT_ROBOTO_MONO = "'Roboto Mono', monospace";

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

export default function ClubCapriInvitePage({
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
      outline: isSelected ? "2px solid #083B50" : "1px dashed rgba(8, 59, 80, 0.4)",
      outlineOffset: "2px",
      cursor: "pointer",
      transition: "outline 0.15s ease",
    };
  };

  // Dynamic values
  const groomName = currentInvite.groomName || "Chedy";
  const brideName = currentInvite.brideName || "HELA";
  const eventDate = currentInvite.eventDate || "2026-06-15";

  // Real-time Countdown state
  const [timeLeft, setTimeLeft] = useState({
    days: "60",
    hours: "05",
    minutes: "32",
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(eventDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const m = Math.floor((difference / 1000 / 60) % 60);
        setTimeLeft({
          days: String(d).padStart(2, "0"),
          hours: String(h).padStart(2, "0"),
          minutes: String(m).padStart(2, "0"),
        });
      } else {
        setTimeLeft({ days: "00", hours: "00", minutes: "00" });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000 * 60);
    return () => clearInterval(interval);
  }, [eventDate]);

  // Audio Cassette state
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const toggleCassetteAudio = () => {
    if (currentInvite.musicUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  // RSVP Form State
  const [guestAttendance, setGuestAttendance] = useState("yes"); // 'yes' or 'no'
  const [guestName, setGuestName] = useState("");
  const [guestPassword, setGuestPassword] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

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

  // Images with overrides
  const boatImgSrc = overrides["boat-photo"]?.image || overrides["boat-photo"]?.url || currentInvite.boatPhoto || boatImg;
  const photo1Src = overrides["postcard-photo-1"]?.image || overrides["postcard-photo-1"]?.url || currentInvite.postcard1Photo || postcardPhoto1Default;
  const photo2Src = overrides["postcard-photo-2"]?.image || overrides["postcard-photo-2"]?.url || currentInvite.postcard2Photo || postcardPhoto2Default;
  const dressCodeFamilySrc = overrides["dress-code-photo"]?.image || overrides["dress-code-photo"]?.url || currentInvite.dressCodePhoto || dressCodeFamilyDefault;

  // Volume indicator ticks
  const volumeTicks = [183, 193, 203, 213, 223, 233, 243, 253, 263, 273, 283];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: editable ? "transparent" : "#F4F0E8",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        overflowX: "hidden",
      }}
    >
      {/* Audio Element if configured */}
      {currentInvite.musicUrl && (
        <audio
          ref={audioRef}
          src={currentInvite.musicUrl}
          loop
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}

      {/* Outer Scaled Wrapper for responsive viewports */}
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
          id="club-capri-canvas-root"
          ref={canvasRef}
          style={{
            position: "relative",
            width: `${CANVAS_WIDTH}px`,
            height: `${CANVAS_HEIGHT}px`,
            backgroundColor: COLOR_WHITE,
            overflow: "hidden",
            boxShadow: editable ? "none" : "0 25px 60px rgba(0,0,0,0.12)",
            transform: editable ? "none" : `scale(${scale})`,
            transformOrigin: "top center",
          }}
        >
          {/* =========================================================================
              LAYER 0: GLOBAL BACKGROUNDS & GRADIENTS
              ========================================================================= */}
          {/* Cream Main Background (y: 508 to 3454, 430 x 2946) */}
          <div
            style={figmaBox({
              x: 0,
              y: 508,
              width: 430,
              height: 2946,
              zIndex: 1,
              extra: { backgroundColor: COLOR_CREAM },
            })}
          />

          {/* Top Hero Sea Photo (y: 0, x: 0, 432 x 601) */}
          <img
            src={heroBg}
            alt=""
            style={figmaBox({
              x: 0,
              y: 0,
              width: 432,
              height: 601,
              zIndex: 1,
              extra: { objectFit: "cover", pointerEvents: "none" },
            })}
          />

          {/* Hero to Cream Soft Gradient Transition (y: 517, x: -1, 432 x 95) */}
          <div
            style={figmaBox({
              x: -1,
              y: 517,
              width: 432,
              height: 95,
              zIndex: 1,
              extra: {
                background: "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 251, 240, 1) 89%)",
                pointerEvents: "none",
              },
            })}
          />

          {/* =========================================================================
              SECTION 1: HERO & CASSETTE (y: 0 - 601)
              ========================================================================= */}
          {/* Header Title: "POST Card \n FROM Summer" (y: 131, x: 93, 245 x 83) */}
          <div
            id="preview-el-hero-title"
            data-element-id="hero-title"
            onClick={() => handleElementClick("hero-title", "hero")}
            style={figmaBox({
              x: 93,
              y: 131,
              width: 245,
              height: 83,
              zIndex: 4,
              extra: {
                cursor: "pointer",
                ...getElementHighlightStyle("hero-title"),
              },
            })}
          >
            {!overrides["hero-title"]?.text && !overrides["hero-title"]?.fontFamily ? (
              <img src={heroTitleSvg} alt="POST Card FROM Summer" style={{ width: 227, height: 74, display: "block" }} />
            ) : (
              <div
                style={getStyle("hero-title", {
                  fontFamily: FONT_PERPETUA,
                  fontWeight: 300,
                  fontSize: "30px",
                  lineHeight: "36px",
                  color: COLOR_MUTED_GOLD,
                  textAlign: "center",
                })}
              >
                {getText("hero-title", "POST Card\nFROM Summer")}
              </div>
            )}
          </div>

          {/* Chedy Label on Cassette Header (y: 201, x: 125, 73 x 40) */}
          <div
            id="preview-el-groom-name"
            data-element-id="groom-name"
            onClick={() => handleElementClick("groom-name", "hero")}
            style={figmaBox({
              x: 125,
              y: 201,
              width: 73,
              height: 40,
              zIndex: 4,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                ...getElementHighlightStyle("groom-name"),
              },
            })}
          >
            {!overrides["groom-name"]?.text && (!currentInvite.groomName || currentInvite.groomName.toLowerCase() === "chedy") ? (
              <img src={chedySvg} alt={groomName} style={{ width: 47, height: 12, display: "block" }} />
            ) : (
              <span
                style={getStyle("groom-name", {
                  fontFamily: FONT_ROBOTO_MONO,
                  fontWeight: 400,
                  fontSize: "14px",
                  color: COLOR_TAPE_TEXT,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                })}
              >
                {getText("groom-name", groomName)}
              </span>
            )}
          </div>

          {/* HELA Label on Cassette Header (y: 201, x: 219, 73 x 40) */}
          <div
            id="preview-el-bride-name"
            data-element-id="bride-name"
            onClick={() => handleElementClick("bride-name", "hero")}
            style={figmaBox({
              x: 219,
              y: 201,
              width: 73,
              height: 40,
              zIndex: 4,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                ...getElementHighlightStyle("bride-name"),
              },
            })}
          >
            {!overrides["bride-name"]?.text && (!currentInvite.brideName || currentInvite.brideName.toLowerCase() === "hela") ? (
              <img src={helaSvg} alt={brideName} style={{ width: 37, height: 12, display: "block" }} />
            ) : (
              <span
                style={getStyle("bride-name", {
                  fontFamily: FONT_ROBOTO_MONO,
                  fontWeight: 400,
                  fontSize: "14px",
                  color: COLOR_TAPE_TEXT,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                })}
              >
                {getText("bride-name", brideName)}
              </span>
            )}
          </div>

          {/* Interactive Cassette Tape (y: 116, x: 78, 274 x 490) */}
          <div
            id="preview-el-cassette"
            data-element-id="cassette"
            onClick={toggleCassetteAudio}
            title={isPlaying ? "Cliquez pour mettre en pause" : "Cliquez pour écouter"}
            style={figmaBox({
              x: 78,
              y: 116,
              width: 274,
              height: 490,
              zIndex: 3,
              extra: {
                cursor: "pointer",
                ...getElementHighlightStyle("cassette"),
              },
            })}
          >
            <img
              src={cassetteImg}
              alt="Vintage Audio Cassette"
              style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
            />
            {/* Spinning Spool Reels indicator when playing */}
            {isPlaying && (
              <>
                <div
                  style={{
                    position: "absolute",
                    left: "70px",
                    top: "167px",
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    border: "2px dashed #427D8D",
                    animation: "spin 3s linear infinite",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: "176px",
                    top: "167px",
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    border: "2px dashed #427D8D",
                    animation: "spin 3s linear infinite",
                  }}
                />
              </>
            )}
          </div>

          {/* VOLUME Text (y: 427, x: 102, 73 x 40) */}
          <div
            id="preview-el-volume-label"
            data-element-id="volume-label"
            onClick={() => handleElementClick("volume-label", "hero")}
            style={figmaBox({
              x: 102,
              y: 427,
              width: 73,
              height: 40,
              zIndex: 4,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontFamily: FONT_ROBOTO_MONO,
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "20px",
                color: COLOR_TAPE_TEXT,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                ...getElementHighlightStyle("volume-label"),
              },
            })}
          >
            {getText("volume-label", "VOLUME")}
          </div>

          {/* Volume Gauge Ticks (11 ticks, y: 436, h: 21) */}
          {volumeTicks.map((tickX, idx) => (
            <div
              key={idx}
              style={figmaBox({
                x: tickX,
                y: 436,
                width: 0,
                height: 21,
                zIndex: 4,
                extra: {
                  borderLeft: `2px solid ${idx < (isPlaying ? 9 : 6) ? COLOR_TAPE_TEXT : "rgba(229, 226, 221, 0.4)"}`,
                  transition: "border-color 0.2s ease",
                },
              })}
            />
          ))}

          {/* =========================================================================
              SECTION 2: JOIN US IN JUNE (y: 626 - 810)
              ========================================================================= */}
          {/* "Join us in" (y: 626, x: 141, 148 x 46) */}
          <div
            id="preview-el-join-us-title"
            data-element-id="join-us-title"
            onClick={() => handleElementClick("join-us-title", "join-us")}
            style={figmaBox({
              x: 141,
              y: 626,
              width: 148,
              height: 46,
              zIndex: 2,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                ...getElementHighlightStyle("join-us-title"),
              },
            })}
          >
            {!overrides["join-us-title"]?.text &&
            (!currentInvite.joinUsTitle || currentInvite.joinUsTitle.toLowerCase() === "join us in") &&
            !overrides["join-us-title"]?.fontFamily ? (
              <img src={joinUsTitleSvg} alt="Join us in" style={{ width: 78, height: 22, display: "block" }} />
            ) : (
              <div
                style={getStyle("join-us-title", {
                  fontFamily: FONT_IMPERIAL,
                  fontWeight: 400,
                  fontSize: "26px",
                  lineHeight: "40px",
                  color: COLOR_NAVY,
                  textAlign: "center",
                })}
              >
                {getText("join-us-title", currentInvite.joinUsTitle || "Join us in")}
              </div>
            )}
          </div>

          {/* "JUNE" (y: 667, x: 96, 239 x 42) */}
          <div
            id="preview-el-join-us-month"
            data-element-id="join-us-month"
            onClick={() => handleElementClick("join-us-month", "join-us")}
            style={figmaBox({
              x: 96,
              y: 667,
              width: 239,
              height: 42,
              zIndex: 2,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                ...getElementHighlightStyle("join-us-month"),
              },
            })}
          >
            {!overrides["join-us-month"]?.text &&
            (!currentInvite.joinUsMonth || currentInvite.joinUsMonth.toLowerCase() === "june") &&
            !overrides["join-us-month"]?.fontFamily ? (
              <img src={juneTitleSvg} alt="JUNE" style={{ width: 89, height: 31, display: "block" }} />
            ) : (
              <div
                style={getStyle("join-us-month", {
                  fontFamily: FONT_PERPETUA,
                  fontWeight: 300,
                  fontSize: "36px",
                  lineHeight: "40px",
                  color: COLOR_NAVY,
                  textAlign: "center",
                  textTransform: "uppercase",
                })}
              >
                {getText("join-us-month", currentInvite.joinUsMonth || "JUNE")}
              </div>
            )}
          </div>

          {/* Invitation Text (y: 715, x: 102, 226 x 57) */}
          <div
            id="preview-el-join-us-text"
            data-element-id="join-us-text"
            onClick={() => handleElementClick("join-us-text", "join-us")}
            style={figmaBox({
              x: 102,
              y: 715,
              width: 226,
              height: 57,
              zIndex: 2,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                ...getStyle("join-us-text", {
                  fontFamily: FONT_ROBOTO_MONO,
                  fontWeight: 400,
                  fontSize: "12px",
                  lineHeight: "18px",
                  color: COLOR_NAVY,
                  textTransform: "uppercase",
                  textAlign: "center",
                }),
                ...getElementHighlightStyle("join-us-text"),
              },
            })}
          >
            {getText(
              "join-us-text",
              currentInvite.joinUsText || "We warmly invite you to celebrate our wedding day with us."
            )}
          </div>

          {/* Arrow Down SVG (y: 787, x: 215, 0 x 15) */}
          <img
            src={arrowDownSvg}
            alt=""
            style={figmaBox({
              x: 212,
              y: 787,
              width: 6,
              height: 19,
              zIndex: 2,
            })}
          />

          {/* =========================================================================
              SECTION 3: THE DAY & COUNTDOWN (y: 838 - 1345)
              ========================================================================= */}
          {/* "The Day" (y: 838, x: 141, 148 x 46) */}
          <div
            id="preview-el-the-day-title"
            data-element-id="the-day-title"
            onClick={() => handleElementClick("the-day-title", "the-day")}
            style={figmaBox({
              x: 141,
              y: 838,
              width: 148,
              height: 46,
              zIndex: 2,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                ...getElementHighlightStyle("the-day-title"),
              },
            })}
          >
            {!overrides["the-day-title"]?.text &&
            (!currentInvite.theDayTitle || currentInvite.theDayTitle.toLowerCase() === "the day") &&
            !overrides["the-day-title"]?.fontFamily ? (
              <img src={theDayTitleSvg} alt="The Day" style={{ width: 110, height: 32, display: "block" }} />
            ) : (
              <div
                style={getStyle("the-day-title", {
                  fontFamily: FONT_IMPERIAL,
                  fontWeight: 400,
                  fontSize: "36px",
                  lineHeight: "40px",
                  color: COLOR_NAVY,
                  textAlign: "center",
                })}
              >
                {getText("the-day-title", currentInvite.theDayTitle || "The Day")}
              </div>
            )}
          </div>

          {/* Countdown Group (y: 913, x: 62, 307 x 64) */}
          <div
            id="preview-el-countdown"
            data-element-id="countdown"
            onClick={() => handleElementClick("countdown", "the-day")}
            style={figmaBox({
              x: 62,
              y: 913,
              width: 307,
              height: 64,
              zIndex: 3,
              extra: {
                cursor: "pointer",
                ...getElementHighlightStyle("countdown"),
              },
            })}
          >
            {/* Days Number (x: 0, y: 0, 44 x 35) */}
            <div
              style={{
                position: "absolute",
                left: "0px",
                top: "0px",
                width: "44px",
                height: "35px",
                fontFamily: FONT_PERPETUA,
                fontWeight: 300,
                fontSize: "30px",
                lineHeight: "40px",
                textAlign: "center",
                color: COLOR_NAVY,
              }}
            >
              {timeLeft.days}
            </div>
            {/* Days Label (x: 0, y: 40, 44 x 24) */}
            <div
              style={{
                position: "absolute",
                left: "0px",
                top: "40px",
                width: "44px",
                height: "24px",
                fontFamily: FONT_ROBOTO_MONO,
                fontWeight: 400,
                fontSize: "12px",
                lineHeight: "18px",
                textAlign: "center",
                color: COLOR_NAVY,
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Days
            </div>

            {/* Hours Number (x: 127, y: 0, 44 x 35) */}
            <div
              style={{
                position: "absolute",
                left: "127px",
                top: "0px",
                width: "44px",
                height: "35px",
                fontFamily: FONT_PERPETUA,
                fontWeight: 300,
                fontSize: "30px",
                lineHeight: "40px",
                textAlign: "center",
                color: COLOR_NAVY,
              }}
            >
              {timeLeft.hours}
            </div>
            {/* Hours Label (x: 127, y: 40, 44 x 24) */}
            <div
              style={{
                position: "absolute",
                left: "127px",
                top: "40px",
                width: "44px",
                height: "24px",
                fontFamily: FONT_ROBOTO_MONO,
                fontWeight: 400,
                fontSize: "12px",
                lineHeight: "18px",
                textAlign: "center",
                color: COLOR_NAVY,
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Hours
            </div>

            {/* Minutes Number (x: 253, y: 0, 44 x 35) */}
            <div
              style={{
                position: "absolute",
                left: "253px",
                top: "0px",
                width: "44px",
                height: "35px",
                fontFamily: FONT_PERPETUA,
                fontWeight: 300,
                fontSize: "30px",
                lineHeight: "40px",
                textAlign: "center",
                color: COLOR_NAVY,
              }}
            >
              {timeLeft.minutes}
            </div>
            {/* Minutes Label (x: 242, y: 40, 65 x 24) */}
            <div
              style={{
                position: "absolute",
                left: "242px",
                top: "40px",
                width: "65px",
                height: "24px",
                fontFamily: FONT_ROBOTO_MONO,
                fontWeight: 400,
                fontSize: "12px",
                lineHeight: "18px",
                textAlign: "center",
                color: COLOR_NAVY,
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Minutes
            </div>
          </div>

          {/* Yacht / Boat Aerial Photo (y: 867, x: 162, 269 x 478) */}
          <div
            id="preview-el-boat-photo"
            data-element-id="boat-photo"
            onClick={() => handleElementClick("boat-photo", "the-day")}
            style={figmaBox({
              x: 162,
              y: 867,
              width: 269,
              height: 478,
              zIndex: 2,
              extra: {
                cursor: "pointer",
                ...getElementHighlightStyle("boat-photo"),
              },
            })}
          >
            <img
              src={boatImgSrc}
              alt="Luxury Yacht"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* =========================================================================
              SECTION 4: CELEBRATIONS & POSTCARDS (y: 1246 - 1950)
              ========================================================================= */}
          {/* "Celebrations" (y: 1246, x: 141, 148 x 46) */}
          <div
            id="preview-el-celebrations-title"
            data-element-id="celebrations-title"
            onClick={() => handleElementClick("celebrations-title", "celebrations")}
            style={figmaBox({
              x: 141,
              y: 1246,
              width: 148,
              height: 46,
              zIndex: 3,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                ...getElementHighlightStyle("celebrations-title"),
              },
            })}
          >
            {!overrides["celebrations-title"]?.text &&
            (!currentInvite.celebrationsTitle || currentInvite.celebrationsTitle.toLowerCase() === "celebrations") &&
            !overrides["celebrations-title"]?.fontFamily ? (
              <img src={celebrationsTitleSvg} alt="Celebrations" style={{ width: 132, height: 26, display: "block" }} />
            ) : (
              <div
                style={getStyle("celebrations-title", {
                  fontFamily: FONT_IMPERIAL,
                  fontWeight: 400,
                  fontSize: "36px",
                  lineHeight: "40px",
                  color: COLOR_NAVY,
                  textAlign: "center",
                })}
              >
                {getText("celebrations-title", currentInvite.celebrationsTitle || "Celebrations")}
              </div>
            )}
          </div>

          {/* Blue Nautical Stripes - Left (y: 1396, x: -324, 499 x 314) */}
          <img
            src={stripesLeft}
            alt=""
            style={figmaBox({
              x: -324,
              y: 1396,
              width: 499,
              height: 314,
              zIndex: 1,
              extra: { pointerEvents: "none" },
            })}
          />

          {/* Blue Nautical Stripes - Right (y: 1790, x: 281, 499 x 164) */}
          <img
            src={stripesRight}
            alt=""
            style={figmaBox({
              x: 281,
              y: 1790,
              width: 499,
              height: 164,
              zIndex: 1,
              extra: { pointerEvents: "none" },
            })}
          />

          {/* -------------------------------------------------------------------------
              POSTCARD 1: WEDDING (y: 1335, x: 26, 377 x 255)
              ------------------------------------------------------------------------- */}
          <div
            id="preview-el-postcard-1"
            data-element-id="postcard-1"
            onClick={() => handleElementClick("postcard-1", "celebrations")}
            style={figmaBox({
              x: 26,
              y: 1335,
              width: 377,
              height: 255,
              zIndex: 3,
              extra: {
                backgroundColor: COLOR_WHITE,
                borderRadius: "5px",
                boxShadow: "0px 1px 15px 0px rgba(0, 0, 0, 0.25)",
                ...getElementHighlightStyle("postcard-1"),
              },
            })}
          >
            {/* "Postcard" */}
            <div
              style={{
                position: "absolute",
                left: "26px",
                top: "29px",
                width: "148px",
                height: "39px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src={postcardTitle1Svg} alt="Postcard" style={{ width: 65, height: 16, display: "block" }} />
            </div>

            {/* "wedding" */}
            <div
              id="preview-el-postcard1-title"
              data-element-id="postcard1-title"
              onClick={(e) => {
                e.stopPropagation();
                handleElementClick("postcard1-title", "celebrations");
              }}
              style={{
                position: "absolute",
                left: "-20px",
                top: "59px",
                width: "239px",
                height: "42px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                ...getElementHighlightStyle("postcard1-title"),
              }}
            >
              {!overrides["postcard1-title"]?.text &&
              (!currentInvite.postcard1Title || currentInvite.postcard1Title.toLowerCase() === "wedding") ? (
                <img src={weddingTitleSvg} alt="wedding" style={{ width: 110, height: 17, display: "block" }} />
              ) : (
                <span
                  style={getStyle("postcard1-title", {
                    fontFamily: FONT_PERPETUA,
                    fontWeight: 300,
                    fontSize: "22px",
                    color: COLOR_NAVY,
                    textTransform: "uppercase",
                  })}
                >
                  {getText("postcard1-title", currentInvite.postcard1Title || "wedding")}
                </span>
              )}
            </div>

            {/* Photo 1 */}
            <div
              id="preview-el-postcard-photo-1"
              data-element-id="postcard-photo-1"
              onClick={(e) => {
                e.stopPropagation();
                handleElementClick("postcard-photo-1", "celebrations");
              }}
              style={{
                position: "absolute",
                left: "42px",
                top: "103px",
                width: "115px",
                height: "115px",
                cursor: "pointer",
                ...getElementHighlightStyle("postcard-photo-1"),
              }}
            >
              <img
                src={photo1Src}
                alt="Wedding Celebration Aperitif"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Vertical Divider Line */}
            <div
              style={{
                position: "absolute",
                left: "187px",
                top: "29px",
                width: "0px",
                height: "202px",
                borderLeft: `0.25px solid ${COLOR_NAVY}`,
              }}
            />

            {/* Circular Postmark Stamp SVG */}
            <img
              src={postmark1Svg}
              alt=""
              style={{
                position: "absolute",
                left: "250px",
                top: "18px",
                width: "95.72px",
                height: "95.72px",
                pointerEvents: "none",
              }}
            />

            {/* Stamp 1 - Sun */}
            <img
              src={stampSunImg}
              alt="Sun Stamp"
              style={{
                position: "absolute",
                left: "276.71px",
                top: "56px",
                width: "39px",
                height: "53px",
                objectFit: "cover",
              }}
            />

            {/* Stamp 2 - Capri */}
            <img
              src={stampCapriImg}
              alt="Capri Stamp"
              style={{
                position: "absolute",
                left: "311.71px",
                top: "22px",
                width: "39px",
                height: "53px",
                objectFit: "cover",
              }}
            />

            {/* "To:" Label */}
            <div
              style={{
                position: "absolute",
                left: "210px",
                top: "125px",
                width: "26px",
                height: "25px",
                fontFamily: FONT_ROBOTO_MONO,
                fontWeight: 400,
                fontSize: "10px",
                lineHeight: "18px",
                color: COLOR_NAVY,
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              To:
            </div>

            {/* Underlines */}
            <div style={{ position: "absolute", left: "214px", top: "142px", width: "137px", borderTop: `0.25px solid ${COLOR_NAVY}` }} />
            <div style={{ position: "absolute", left: "214px", top: "165px", width: "137px", borderTop: `0.25px solid ${COLOR_NAVY}` }} />
            <div style={{ position: "absolute", left: "214px", top: "188px", width: "137px", borderTop: `0.25px solid ${COLOR_NAVY}` }} />
            <div style={{ position: "absolute", left: "214px", top: "211px", width: "137px", borderTop: `0.25px solid ${COLOR_NAVY}` }} />

            {/* Address Text & Map Link */}
            <a
              id="preview-el-postcard1-address"
              data-element-id="postcard1-address"
              href={currentInvite.postcard1MapUrl || "https://maps.google.com/?q=Dar+Bouraoui+Carthage"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (editable) {
                  e.preventDefault();
                  handleElementClick("postcard1-address", "celebrations");
                }
              }}
              style={{
                position: "absolute",
                left: "206px",
                top: "146px",
                width: "148px",
                height: "117px",
                textDecoration: "none",
                cursor: "pointer",
                ...getElementHighlightStyle("postcard1-address"),
              }}
            >
              {!overrides["postcard1-address"]?.text &&
              (!currentInvite.postcard1Address || currentInvite.postcard1Address.includes("Dar Bouraoui")) ? (
                <img src={postcardWeddingTextSvg} alt="Dar Bouraoui Carthage Malaga 18h" style={{ width: 120, height: 59, display: "block" }} />
              ) : (
                <div
                  style={getStyle("postcard1-address", {
                    fontFamily: FONT_IMPERIAL,
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "23px",
                    color: COLOR_NAVY,
                    whiteSpace: "pre-line",
                  })}
                >
                  {getText("postcard1-address", currentInvite.postcard1Address || "Dar Bouraoui Carthage\nMalaga\n18h")}
                </div>
              )}
            </a>
          </div>

          {/* -------------------------------------------------------------------------
              POSTCARD 2: HENNA (y: 1631, x: 26, 377 x 255)
              ------------------------------------------------------------------------- */}
          <div
            id="preview-el-postcard-2"
            data-element-id="postcard-2"
            onClick={() => handleElementClick("postcard-2", "celebrations")}
            style={figmaBox({
              x: 26,
              y: 1631,
              width: 377,
              height: 255,
              zIndex: 3,
              extra: {
                backgroundColor: COLOR_WHITE,
                borderRadius: "5px",
                boxShadow: "0px 1px 15px 0px rgba(0, 0, 0, 0.25)",
                ...getElementHighlightStyle("postcard-2"),
              },
            })}
          >
            {/* "Postcard" */}
            <div
              style={{
                position: "absolute",
                left: "26px",
                top: "29px",
                width: "148px",
                height: "39px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src={postcardTitle2Svg} alt="Postcard" style={{ width: 65, height: 16, display: "block" }} />
            </div>

            {/* "henna" */}
            <div
              id="preview-el-postcard2-title"
              data-element-id="postcard2-title"
              onClick={(e) => {
                e.stopPropagation();
                handleElementClick("postcard2-title", "celebrations");
              }}
              style={{
                position: "absolute",
                left: "-20px",
                top: "59px",
                width: "239px",
                height: "42px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                ...getElementHighlightStyle("postcard2-title"),
              }}
            >
              {!overrides["postcard2-title"]?.text &&
              (!currentInvite.postcard2Title || currentInvite.postcard2Title.toLowerCase() === "henna") ? (
                <img src={hennaTitleSvg} alt="henna" style={{ width: 79, height: 17, display: "block" }} />
              ) : (
                <span
                  style={getStyle("postcard2-title", {
                    fontFamily: FONT_PERPETUA,
                    fontWeight: 300,
                    fontSize: "22px",
                    color: COLOR_NAVY,
                    textTransform: "uppercase",
                  })}
                >
                  {getText("postcard2-title", currentInvite.postcard2Title || "henna")}
                </span>
              )}
            </div>

            {/* Photo 2 */}
            <div
              id="preview-el-postcard-photo-2"
              data-element-id="postcard-photo-2"
              onClick={(e) => {
                e.stopPropagation();
                handleElementClick("postcard-photo-2", "celebrations");
              }}
              style={{
                position: "absolute",
                left: "42px",
                top: "103px",
                width: "115px",
                height: "115px",
                cursor: "pointer",
                ...getElementHighlightStyle("postcard-photo-2"),
              }}
            >
              <img
                src={photo2Src}
                alt="Henna Celebration"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Vertical Divider Line */}
            <div
              style={{
                position: "absolute",
                left: "187px",
                top: "29px",
                width: "0px",
                height: "202px",
                borderLeft: `0.25px solid ${COLOR_NAVY}`,
              }}
            />

            {/* Circular Postmark Stamp SVG */}
            <img
              src={postmark2Svg}
              alt=""
              style={{
                position: "absolute",
                left: "250px",
                top: "18px",
                width: "95.72px",
                height: "95.72px",
                pointerEvents: "none",
              }}
            />

            {/* Stamp 1 - Cocktail */}
            <img
              src={stampCocktailImg}
              alt="Cocktail Stamp"
              style={{
                position: "absolute",
                left: "276.71px",
                top: "56px",
                width: "39px",
                height: "53px",
                objectFit: "cover",
              }}
            />

            {/* Stamp 2 - Capri */}
            <img
              src={stampCapriImg}
              alt="Capri Stamp"
              style={{
                position: "absolute",
                left: "311.71px",
                top: "22px",
                width: "39px",
                height: "53px",
                objectFit: "cover",
              }}
            />

            {/* "To:" Label */}
            <div
              style={{
                position: "absolute",
                left: "210px",
                top: "125px",
                width: "26px",
                height: "25px",
                fontFamily: FONT_ROBOTO_MONO,
                fontWeight: 400,
                fontSize: "10px",
                lineHeight: "18px",
                color: COLOR_NAVY,
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              To:
            </div>

            {/* Underlines */}
            <div style={{ position: "absolute", left: "214px", top: "142px", width: "137px", borderTop: `0.25px solid ${COLOR_NAVY}` }} />
            <div style={{ position: "absolute", left: "214px", top: "165px", width: "137px", borderTop: `0.25px solid ${COLOR_NAVY}` }} />
            <div style={{ position: "absolute", left: "214px", top: "188px", width: "137px", borderTop: `0.25px solid ${COLOR_NAVY}` }} />
            <div style={{ position: "absolute", left: "214px", top: "211px", width: "137px", borderTop: `0.25px solid ${COLOR_NAVY}` }} />

            {/* Address Text & Map Link */}
            <a
              id="preview-el-postcard2-address"
              data-element-id="postcard2-address"
              href={currentInvite.postcard2MapUrl || "https://maps.google.com/?q=Dar+Bouraoui+Carthage"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (editable) {
                  e.preventDefault();
                  handleElementClick("postcard2-address", "celebrations");
                }
              }}
              style={{
                position: "absolute",
                left: "206px",
                top: "146px",
                width: "148px",
                height: "117px",
                textDecoration: "none",
                cursor: "pointer",
                ...getElementHighlightStyle("postcard2-address"),
              }}
            >
              {!overrides["postcard2-address"]?.text &&
              (!currentInvite.postcard2Address || currentInvite.postcard2Address.includes("Dar Bouraoui")) ? (
                <img src={postcardHennaTextSvg} alt="Dar Bouraoui Carthage Malaga 18h" style={{ width: 120, height: 59, display: "block" }} />
              ) : (
                <div
                  style={getStyle("postcard2-address", {
                    fontFamily: FONT_IMPERIAL,
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "23px",
                    color: COLOR_NAVY,
                    whiteSpace: "pre-line",
                  })}
                >
                  {getText("postcard2-address", currentInvite.postcard2Address || "Dar Bouraoui Carthage\nMalaga\n18h")}
                </div>
              )}
            </a>
          </div>

          {/* =========================================================================
              SECTION 5: DRESS CODE (y: 2005 - 2416)
              ========================================================================= */}
          {/* "Dress Code" (y: 2005, x: 141, 148 x 46) */}
          <div
            id="preview-el-dress-code-title"
            data-element-id="dress-code-title"
            onClick={() => handleElementClick("dress-code-title", "dress-code")}
            style={figmaBox({
              x: 141,
              y: 2005,
              width: 148,
              height: 46,
              zIndex: 2,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                ...getElementHighlightStyle("dress-code-title"),
              },
            })}
          >
            {!overrides["dress-code-title"]?.text &&
            (!currentInvite.dressCodeCategory || currentInvite.dressCodeCategory.toLowerCase() === "dress code") &&
            !overrides["dress-code-title"]?.fontFamily ? (
              <img src={dressCodeTitleSvg} alt="Dress Code" style={{ width: 94, height: 19, display: "block" }} />
            ) : (
              <div
                style={getStyle("dress-code-title", {
                  fontFamily: FONT_IMPERIAL,
                  fontWeight: 400,
                  fontSize: "26px",
                  lineHeight: "40px",
                  color: COLOR_NAVY,
                  textAlign: "center",
                })}
              >
                {getText("dress-code-title", currentInvite.dressCodeCategory || "Dress Code")}
              </div>
            )}
          </div>

          {/* "casual chic" (y: 2046, x: 89, 253 x 42) */}
          <div
            id="preview-el-dress-code-chic"
            data-element-id="dress-code-chic"
            onClick={() => handleElementClick("dress-code-chic", "dress-code")}
            style={figmaBox({
              x: 89,
              y: 2046,
              width: 253,
              height: 42,
              zIndex: 2,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                ...getElementHighlightStyle("dress-code-chic"),
              },
            })}
          >
            {!overrides["dress-code-chic"]?.text &&
            (!currentInvite.dressCodeTitle || currentInvite.dressCodeTitle.toLowerCase() === "casual chic") &&
            !overrides["dress-code-chic"]?.fontFamily ? (
              <img src={casualChicTitleSvg} alt="casual chic" style={{ width: 239, height: 28, display: "block" }} />
            ) : (
              <div
                style={getStyle("dress-code-chic", {
                  fontFamily: FONT_PERPETUA,
                  fontWeight: 300,
                  fontSize: "36px",
                  lineHeight: "40px",
                  color: COLOR_NAVY,
                  textAlign: "center",
                  textTransform: "uppercase",
                })}
              >
                {getText("dress-code-chic", currentInvite.dressCodeTitle || "CASUAL CHIC")}
              </div>
            )}
          </div>

          {/* Dress Code Instruction Copy (y: 2094, x: 102, 226 x 57) */}
          <div
            id="preview-el-dress-code-text"
            data-element-id="dress-code-text"
            onClick={() => handleElementClick("dress-code-text", "dress-code")}
            style={figmaBox({
              x: 102,
              y: 2094,
              width: 226,
              height: 57,
              zIndex: 2,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                ...getStyle("dress-code-text", {
                  fontFamily: FONT_ROBOTO_MONO,
                  fontWeight: 400,
                  fontSize: "12px",
                  lineHeight: "18px",
                  color: COLOR_NAVY,
                  textTransform: "uppercase",
                  textAlign: "center",
                }),
                ...getElementHighlightStyle("dress-code-text"),
              },
            })}
          >
            {getText(
              "dress-code-text",
              currentInvite.dressCodeText || "We warmly invite you to celebrate our wedding day with us."
            )}
          </div>

          {/* Dress Code Attire Photo (Family) (y: 2138, x: 80, 270 x 278) */}
          <div
            id="preview-el-dress-code-photo"
            data-element-id="dress-code-photo"
            onClick={() => handleElementClick("dress-code-photo", "dress-code")}
            style={figmaBox({
              x: 80,
              y: 2138,
              width: 270,
              height: 278,
              zIndex: 2,
              extra: {
                cursor: "pointer",
                ...getElementHighlightStyle("dress-code-photo"),
              },
            })}
          >
            <img
              src={dressCodeFamilySrc}
              alt="Casual Chic Attire"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* =========================================================================
              SECTION 6: ARRIVAL & RSVP (y: 2422 - 3227)
              ========================================================================= */}
          {/* "Arrival" (y: 2422, x: 141, 148 x 46) */}
          <div
            id="preview-el-arrival-title"
            data-element-id="arrival-title"
            onClick={() => handleElementClick("arrival-title", "rsvp")}
            style={figmaBox({
              x: 141,
              y: 2422,
              width: 148,
              height: 46,
              zIndex: 2,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                ...getElementHighlightStyle("arrival-title"),
              },
            })}
          >
            {!overrides["arrival-title"]?.text &&
            (!currentInvite.rsvpArrival || currentInvite.rsvpArrival.toLowerCase() === "arrival") &&
            !overrides["arrival-title"]?.fontFamily ? (
              <img src={arrivalTitleSvg} alt="Arrival" style={{ width: 71, height: 19, display: "block" }} />
            ) : (
              <div
                style={getStyle("arrival-title", {
                  fontFamily: FONT_IMPERIAL,
                  fontWeight: 400,
                  fontSize: "26px",
                  lineHeight: "40px",
                  color: COLOR_NAVY,
                  textAlign: "center",
                })}
              >
                {getText("arrival-title", currentInvite.rsvpArrival || "Arrival")}
              </div>
            )}
          </div>

          {/* "RSVP" (y: 2463, x: 89, 253 x 42) */}
          <div
            id="preview-el-rsvp-title"
            data-element-id="rsvp-title"
            onClick={() => handleElementClick("rsvp-title", "rsvp")}
            style={figmaBox({
              x: 89,
              y: 2463,
              width: 253,
              height: 42,
              zIndex: 2,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                ...getElementHighlightStyle("rsvp-title"),
              },
            })}
          >
            {!overrides["rsvp-title"]?.text &&
            (!currentInvite.rsvpTitle || currentInvite.rsvpTitle.toLowerCase() === "rsvp") &&
            !overrides["rsvp-title"]?.fontFamily ? (
              <img src={rsvpTitleSvg} alt="RSVP" style={{ width: 83, height: 28, display: "block" }} />
            ) : (
              <div
                style={getStyle("rsvp-title", {
                  fontFamily: FONT_PERPETUA,
                  fontWeight: 300,
                  fontSize: "36px",
                  lineHeight: "40px",
                  color: COLOR_NAVY,
                  textAlign: "center",
                  textTransform: "uppercase",
                })}
              >
                {getText("rsvp-title", currentInvite.rsvpTitle || "RSVP")}
              </div>
            )}
          </div>

          {/* RSVP Deadline (y: 2511, x: 102, 226 x 57) */}
          <div
            id="preview-el-rsvp-deadline"
            data-element-id="rsvp-deadline"
            onClick={() => handleElementClick("rsvp-deadline", "rsvp")}
            style={figmaBox({
              x: 102,
              y: 2511,
              width: 226,
              height: 57,
              zIndex: 2,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                ...getStyle("rsvp-deadline", {
                  fontFamily: FONT_ROBOTO_MONO,
                  fontWeight: 400,
                  fontSize: "12px",
                  lineHeight: "18px",
                  color: COLOR_NAVY,
                  textTransform: "uppercase",
                  textAlign: "center",
                }),
                ...getElementHighlightStyle("rsvp-deadline"),
              },
            })}
          >
            {getText(
              "rsvp-deadline",
              currentInvite.rsvpDeadline || "The favour of a reply is kindly requested by the fifteenth of June, 2026"
            )}
          </div>

          {/* RSVP Background Photo & Masking Tape (y: 2619, x: 0, 430 x 608) */}
          <img
            src={rsvpBgImg}
            alt=""
            style={figmaBox({
              x: 0,
              y: 2619,
              width: 430,
              height: 608,
              zIndex: 2,
              extra: { objectFit: "cover", pointerEvents: "none" },
            })}
          />

          {/* Stamp Frame Card SVG (y: 2664, x: 24, 382 x 517) */}
          <img
            src={stampFrameSvg}
            alt=""
            style={figmaBox({
              x: 24,
              y: 2664,
              width: 382,
              height: 517,
              zIndex: 3,
              extra: { pointerEvents: "none" },
            })}
          />

          {/* Masking Tape (y: 2652, x: 153, 124 x 37) */}
          <img
            src={maskingTapeImg}
            alt=""
            style={figmaBox({
              x: 153,
              y: 2652,
              width: 124,
              height: 37,
              zIndex: 5,
              extra: { pointerEvents: "none" },
            })}
          />

          {/* RSVP Form Content (Over Stamp Card) */}
          <form
            id="preview-el-rsvp-form"
            data-element-id="rsvp-form"
            onSubmit={handleRsvpSubmit}
            style={figmaBox({
              x: 55,
              y: 2732,
              width: 320,
              height: 410,
              zIndex: 4,
              extra: {
                ...getElementHighlightStyle("rsvp-form"),
              },
            })}
          >
            {/* "WILL YOU ATTEND" */}
            <div
              style={{
                fontFamily: FONT_ROBOTO_MONO,
                fontWeight: 400,
                fontSize: "12px",
                lineHeight: "18px",
                color: COLOR_NAVY,
                textTransform: "uppercase",
                marginBottom: "20px",
              }}
            >
              Will you attend
            </div>

            {/* Attendance Radio Options */}
            <div style={{ display: "flex", gap: "24px", marginBottom: "26px", alignItems: "center" }}>
              {/* Option 1: Yes */}
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="attendance"
                  value="yes"
                  checked={guestAttendance === "yes"}
                  onChange={() => setGuestAttendance("yes")}
                  style={{ display: "none" }}
                />
                <div
                  style={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    backgroundColor: guestAttendance === "yes" ? COLOR_LIGHT_BLUE : "transparent",
                    border: `1px solid ${COLOR_LIGHT_BLUE}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
                <span
                  style={{
                    fontFamily: FONT_ROBOTO_MONO,
                    fontWeight: 400,
                    fontSize: "12px",
                    lineHeight: "18px",
                    color: COLOR_NAVY,
                    textTransform: "uppercase",
                  }}
                >
                  Yes, I will be there
                </span>
              </label>

              {/* Option 2: No */}
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="attendance"
                  value="no"
                  checked={guestAttendance === "no"}
                  onChange={() => setGuestAttendance("no")}
                  style={{ display: "none" }}
                />
                <div
                  style={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    backgroundColor: guestAttendance === "no" ? COLOR_LIGHT_BLUE : "transparent",
                    border: `1px solid ${COLOR_LIGHT_BLUE}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
                <span
                  style={{
                    fontFamily: FONT_ROBOTO_MONO,
                    fontWeight: 400,
                    fontSize: "12px",
                    lineHeight: "18px",
                    color: COLOR_NAVY,
                    textTransform: "uppercase",
                  }}
                >
                  Sorry, I can’t make it
                </span>
              </label>
            </div>

            {/* Input Field 1: Name */}
            <div style={{ position: "relative", marginBottom: "26px", borderBottom: "1px solid #000000" }}>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="NAME"
                required
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontFamily: FONT_ROBOTO_MONO,
                  fontWeight: 400,
                  fontSize: "12px",
                  lineHeight: "18px",
                  color: COLOR_NAVY,
                  textTransform: "uppercase",
                  paddingBottom: "8px",
                }}
              />
            </div>

            {/* Input Field 2: Password / Code */}
            <div style={{ position: "relative", marginBottom: "26px", borderBottom: "1px solid #000000" }}>
              <input
                type="text"
                value={guestPassword}
                onChange={(e) => setGuestPassword(e.target.value)}
                placeholder="PASSWORD"
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontFamily: FONT_ROBOTO_MONO,
                  fontWeight: 400,
                  fontSize: "12px",
                  lineHeight: "18px",
                  color: COLOR_NAVY,
                  textTransform: "uppercase",
                  paddingBottom: "8px",
                }}
              />
            </div>

            {/* Input Field 3: Phone Number */}
            <div style={{ position: "relative", marginBottom: "26px", borderBottom: "1px solid #000000" }}>
              <input
                type="tel"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder="PHONE NUMBER"
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontFamily: FONT_ROBOTO_MONO,
                  fontWeight: 400,
                  fontSize: "12px",
                  lineHeight: "18px",
                  color: COLOR_NAVY,
                  textTransform: "uppercase",
                  paddingBottom: "8px",
                }}
              />
            </div>

            {/* Input Field 4: Number of Guests */}
            <div style={{ position: "relative", marginBottom: "26px", borderBottom: "1px solid #000000" }}>
              <input
                type="number"
                min="1"
                max="10"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                placeholder="NUMBER OF GUESTS"
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontFamily: FONT_ROBOTO_MONO,
                  fontWeight: 400,
                  fontSize: "12px",
                  lineHeight: "18px",
                  color: COLOR_NAVY,
                  textTransform: "uppercase",
                  paddingBottom: "8px",
                }}
              />
            </div>

            {/* Submit Confirmation Button */}
            <button
              type="submit"
              disabled={rsvpSubmitting}
              style={{
                width: "100%",
                height: "40px",
                backgroundColor: COLOR_LIGHT_BLUE,
                borderRadius: "7px",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "opacity 0.2s",
                opacity: rsvpSubmitting ? 0.7 : 1,
              }}
            >
              <span
                style={{
                  fontFamily: FONT_ROBOTO_MONO,
                  fontWeight: 400,
                  fontSize: "12px",
                  lineHeight: "18px",
                  color: COLOR_WHITE,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {rsvpSuccess ? "✓ Réponse enregistrée" : rsvpSubmitting ? "Envoi..." : "Send Confirmation"}
              </span>
            </button>
          </form>

          {/* =========================================================================
              SECTION 7: FOOTER & LIFEBUOY (y: 3239 - 3454)
              ========================================================================= */}
          {/* Nautical Lifebuoy Ring (y: 3239, x: 160, 111 x 200) */}
          <img
            src={lifebuoyImg}
            alt="Nautical Lifebuoy"
            style={figmaBox({
              x: 160,
              y: 3239,
              width: 111,
              height: 200,
              zIndex: 2,
              extra: { objectFit: "cover", pointerEvents: "none" },
            })}
          />

          {/* Blue Nautical Stripes - Bottom (y: 3339, x: -10, 499 x 164) */}
          <img
            src={stripesBottom}
            alt=""
            style={figmaBox({
              x: -10,
              y: 3339,
              width: 499,
              height: 164,
              zIndex: 1,
              extra: { pointerEvents: "none" },
            })}
          />

          {/* Signature: "club Capri" (y: 3320, x: 103, 221 x 41) */}
          <div
            id="preview-el-footer-title"
            data-element-id="footer-title"
            onClick={() => handleElementClick("footer-title", "footer")}
            style={figmaBox({
              x: 103,
              y: 3320,
              width: 221,
              height: 41,
              zIndex: 3,
              extra: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                ...getElementHighlightStyle("footer-title"),
              },
            })}
          >
            {!overrides["footer-title"]?.text && !overrides["footer-title"]?.fontFamily ? (
              <img src={clubCapriTitleSvg} alt="club Capri" style={{ width: 187, height: 44, display: "block" }} />
            ) : (
              <div
                style={getStyle("footer-title", {
                  fontFamily: FONT_PERPETUA,
                  fontWeight: 300,
                  fontSize: "36px",
                  lineHeight: "40px",
                  color: COLOR_TEAL,
                  textAlign: "center",
                  textTransform: "lowercase",
                })}
              >
                {getText("footer-title", "club Capri")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
