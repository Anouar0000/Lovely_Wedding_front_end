import React, { useEffect, useRef, useState } from "react";
import templateConfig from "../data/digital/templates/dolce-vita.json";

// Fresh 1:1 Figma Assets
import heroArch from "../assets/digital/dolce-vita/hero_arch.png";
import heroDecor from "../assets/digital/dolce-vita/hero_decor.png";
import heroArrow from "../assets/digital/dolce-vita/hero_arrow.svg";
import countdownSun from "../assets/digital/dolce-vita/countdown_sun.png";
import locLineLeft from "../assets/digital/dolce-vita/loc_line_left.svg";
import locLineRight from "../assets/digital/dolce-vita/loc_line_right.svg";
import locLineLowerLeft from "../assets/digital/dolce-vita/loc_line_lower_left.svg";
import locLineLowerRight from "../assets/digital/dolce-vita/loc_line_lower_right.svg";
import locationPortrait from "../assets/digital/dolce-vita/location_portrait.png";
import locationLemons from "../assets/digital/dolce-vita/location_lemons.png";
import locationVenue from "../assets/digital/dolce-vita/location_venue.png";
import timelineFullSvg from "../assets/digital/dolce-vita/timeline_full.svg";
import tomatoesDish from "../assets/digital/dolce-vita/tomatoes_dish.png";
import menuFrame from "../assets/digital/dolce-vita/menu_frame.png";
import pastaDish from "../assets/digital/dolce-vita/pasta_dish.png";
import footerFrame from "../assets/digital/dolce-vita/footer_frame.png";

const CANVAS_WIDTH = 430;
const CANVAS_HEIGHT = 3050;

// Colors
const COLOR_WHITE = "#FFFFFF";
const COLOR_NAVY = "#130554";
const COLOR_GOLD = "#E8CC33";

// Fonts
const FONT_TAPROM = "'Taprom', 'Pinyon Script', cursive";
const FONT_CRIMSON = "'Crimson Text', serif";

const defaultInvite = templateConfig.sample;

export default function DolceVitaInvitePage({
  invite = defaultInvite,
  editable = false,
  selectedElementId = null,
  onSelectElement = null,
  onUpdateInvite = null,
}) {
  const currentInvite = invite || defaultInvite;
  const overrides = currentInvite.elementOverrides || {};
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  // Form state for RSVP
  const [attendance, setAttendance] = useState("yes");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guestCount, setGuestCount] = useState("1");
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  // Responsive scale handling
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
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

  const getText = (id, defaultText) => {
    return overrides[id]?.text !== undefined ? overrides[id].text : defaultText;
  };

  const handleElementClick = (elementId, sectionId) => {
    if (editable && onSelectElement) {
      onSelectElement(elementId, sectionId);
    }
  };

  const getElementHighlightStyle = (elementId) => {
    if (!editable) return {};
    const isSelected = selectedElementId === elementId;
    return {
      outline: isSelected ? "2px solid #130554" : "1px dashed rgba(19, 5, 84, 0.35)",
      outlineOffset: "2px",
      cursor: "pointer",
      transition: "outline 0.15s ease",
    };
  };

  // Dynamic values
  const coupleNames = currentInvite.coupleNames || "Bilel & Dorra";
  const inviteTitle = currentInvite.title || "La Dolce Vita";
  const eventDate = currentInvite.eventDate || "2026-08-12";
  const venueName = currentInvite.venueName || "Dar Bouraoui Carthage";
  const city = currentInvite.locationLabel || currentInvite.city || "MALAGA";
  const eventTime = currentInvite.time || "19H00";

  // Real-time Countdown
  const [timeLeft, setTimeLeft] = useState({
    days: "100",
    hours: "13",
    minutes: "42",
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(eventDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: "100", hours: "13", minutes: "42" });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, [eventDate]);

  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    setRsvpSubmitted(true);
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        backgroundColor: COLOR_WHITE,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: CANVAS_WIDTH,
          minWidth: CANVAS_WIDTH,
          maxWidth: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          position: "relative",
          backgroundColor: COLOR_WHITE,
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: "top center",
          overflow: "hidden",
        }}
      >
        {/* ============================================================
            HERO SECTION (y: 0 to ~337)
        ============================================================ */}
        {/* Arch Background */}
        <img
          src={heroArch}
          alt=""
          style={{
            position: "absolute",
            left: -22,
            top: -229,
            width: 474,
            height: 592,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Top Flourish Decor */}
        <img
          src={heroDecor}
          alt=""
          style={{
            position: "absolute",
            left: 23,
            top: -63,
            width: 385,
            height: 212,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* WE ARE GETTING MARRIED */}
        <div
          id="preview-el-hero-intro"
          data-element-id="hero-intro"
          onClick={() => handleElementClick("hero-intro", "hero")}
          style={{
            ...getElementHighlightStyle("hero-intro"),
            ...getStyle("hero-intro", {
              position: "absolute",
              left: 43,
              top: 104,
              width: 348,
              height: 13,
              fontFamily: FONT_CRIMSON,
              fontWeight: 400,
              fontSize: "8px",
              letterSpacing: "0.1em",
              textAlign: "center",
              textTransform: "uppercase",
              color: COLOR_NAVY,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }),
          }}
        >
          {getText("hero-intro", templateConfig.fixedText?.introLabel || "WE ARE GETTING MARRIED")}
        </div>

        {/* La Dolce Vita */}
        <h1
          id="preview-el-hero-title"
          data-element-id="hero-title"
          onClick={() => handleElementClick("hero-title", "hero")}
          style={{
            ...getElementHighlightStyle("hero-title"),
            ...getStyle("hero-title", {
              position: "absolute",
              left: 0,
              top: 121,
              width: 430,
              height: 58,
              margin: 0,
              padding: 0,
              fontFamily: FONT_TAPROM,
              fontWeight: 400,
              fontSize: "32px",
              lineHeight: 1,
              textAlign: "center",
              color: COLOR_NAVY,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }),
          }}
        >
          {getText("hero-title", inviteTitle)}
        </h1>

        {/* Bilel & Dorra */}
        <div
          id="preview-el-hero-names"
          data-element-id="hero-names"
          onClick={() => handleElementClick("hero-names", "hero")}
          style={{
            ...getElementHighlightStyle("hero-names"),
            ...getStyle("hero-names", {
              position: "absolute",
              left: 0,
              top: 189,
              width: 430,
              height: 18,
              fontFamily: FONT_CRIMSON,
              fontWeight: 400,
              fontSize: "14px",
              letterSpacing: "0.1em",
              textAlign: "center",
              color: COLOR_NAVY,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }),
          }}
        >
          {getText("hero-names", coupleNames)}
        </div>

        {/* Hero Down Arrow */}
        <img
          src={heroArrow}
          alt=""
          style={{
            position: "absolute",
            left: 215,
            top: 274,
            width: 6,
            height: 19,
            transform: "translateX(-50%)",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* ============================================================
            COUNTDOWN SECTION (y: 337 to ~595)
        ============================================================ */}
        {/* Sun Illustration */}
        <img
          src={countdownSun}
          alt=""
          style={{
            position: "absolute",
            left: 159,
            top: 337,
            width: 112,
            height: 112,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Countdown Title */}
        <div
          id="preview-el-countdown-title"
          data-element-id="countdown-title"
          onClick={() => handleElementClick("countdown-title", "countdown")}
          style={{
            ...getElementHighlightStyle("countdown-title"),
            ...getStyle("countdown-title", {
              position: "absolute",
              left: 0,
              top: 411,
              width: 430,
              height: 58,
              fontFamily: FONT_TAPROM,
              fontWeight: 400,
              fontSize: "32px",
              lineHeight: 1,
              textAlign: "center",
              color: COLOR_NAVY,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }),
          }}
        >
          {getText("countdown-title", "Countdown")}
        </div>

        {/* Invite Quote */}
        <div
          id="preview-el-countdown-text"
          data-element-id="countdown-text"
          onClick={() => handleElementClick("countdown-text", "countdown")}
          style={{
            ...getElementHighlightStyle("countdown-text"),
            ...getStyle("countdown-text", {
              position: "absolute",
              left: 103,
              top: 464,
              width: 224,
              height: 25,
              fontFamily: FONT_CRIMSON,
              fontWeight: 400,
              fontSize: "8px",
              lineHeight: "12px",
              letterSpacing: "0.1em",
              textAlign: "center",
              textTransform: "uppercase",
              color: COLOR_NAVY,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }),
          }}
        >
          {getText(
            "countdown-text",
            templateConfig.fixedText?.introText ||
              "WE WOULD LIKE TO INVITE YOU TO CELEBRATE WITH US THE MOST SPECIAL DAY OF OUR LIVES"
          )}
        </div>

        {/* Timer Numbers */}
        {/* Days */}
        <div
          style={{
            position: "absolute",
            left: 23,
            top: 511,
            width: 168,
            height: 18,
            fontFamily: FONT_CRIMSON,
            fontWeight: 400,
            fontSize: "14px",
            letterSpacing: "0.1em",
            textAlign: "center",
            color: COLOR_NAVY,
            zIndex: 2,
          }}
        >
          {timeLeft.days}
        </div>
        <div
          style={{
            position: "absolute",
            left: 65,
            top: 532,
            width: 83,
            height: 10,
            fontFamily: FONT_CRIMSON,
            fontWeight: 400,
            fontSize: "8px",
            letterSpacing: "0.1em",
            textAlign: "center",
            color: COLOR_NAVY,
            zIndex: 2,
          }}
        >
          Days
        </div>

        {/* Hours */}
        <div
          style={{
            position: "absolute",
            left: 131,
            top: 511,
            width: 168,
            height: 18,
            fontFamily: FONT_CRIMSON,
            fontWeight: 400,
            fontSize: "14px",
            letterSpacing: "0.1em",
            textAlign: "center",
            color: COLOR_NAVY,
            zIndex: 2,
          }}
        >
          {timeLeft.hours}
        </div>
        <div
          style={{
            position: "absolute",
            left: 173,
            top: 532,
            width: 83,
            height: 10,
            fontFamily: FONT_CRIMSON,
            fontWeight: 400,
            fontSize: "8px",
            letterSpacing: "0.1em",
            textAlign: "center",
            color: COLOR_NAVY,
            zIndex: 2,
          }}
        >
          Hours
        </div>

        {/* Minutes */}
        <div
          style={{
            position: "absolute",
            left: 239,
            top: 511,
            width: 168,
            height: 18,
            fontFamily: FONT_CRIMSON,
            fontWeight: 400,
            fontSize: "14px",
            letterSpacing: "0.1em",
            textAlign: "center",
            color: COLOR_NAVY,
            zIndex: 2,
          }}
        >
          {timeLeft.minutes}
        </div>
        <div
          style={{
            position: "absolute",
            left: 281,
            top: 532,
            width: 83,
            height: 10,
            fontFamily: FONT_CRIMSON,
            fontWeight: 400,
            fontSize: "8px",
            letterSpacing: "0.1em",
            textAlign: "center",
            color: COLOR_NAVY,
            zIndex: 2,
          }}
        >
          Minutes
        </div>

        {/* ============================================================
            LOCATION SECTION (y: 595 to ~946)
        ============================================================ */}
        {/* Curved decorative lines */}
        <img
          src={locLineLeft}
          alt=""
          style={{
            position: "absolute",
            left: 1.69,
            top: 661.36,
            width: 146.93,
            height: 90.86,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
        <img
          src={locLineRight}
          alt=""
          style={{
            position: "absolute",
            left: 284.65,
            top: 646.82,
            width: 143.82,
            height: 226.86,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
        <img
          src={locLineLowerLeft}
          alt=""
          style={{
            position: "absolute",
            left: 1.17,
            top: 744.74,
            width: 149.53,
            height: 139.88,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
        <img
          src={locLineLowerRight}
          alt=""
          style={{
            position: "absolute",
            left: 278.42,
            top: 738.72,
            width: 155.24,
            height: 118.89,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Location Portrait & Lemons */}
        <img
          src={locationPortrait}
          alt=""
          style={{
            position: "absolute",
            left: 51,
            top: 752,
            width: 104,
            height: 104,
            zIndex: 2,
          }}
        />
        <img
          src={locationLemons}
          alt=""
          style={{
            position: "absolute",
            left: 306.26,
            top: 711.86,
            width: 94.3,
            height: 94.3,
            zIndex: 2,
          }}
        />

        {/* Location Title */}
        <div
          id="preview-el-location-title"
          data-element-id="location-title"
          onClick={() => handleElementClick("location-title", "location")}
          style={{
            ...getElementHighlightStyle("location-title"),
            ...getStyle("location-title", {
              position: "absolute",
              left: 0,
              top: 595,
              width: 430,
              height: 58,
              fontFamily: FONT_TAPROM,
              fontWeight: 400,
              fontSize: "32px",
              lineHeight: 1,
              textAlign: "center",
              color: COLOR_NAVY,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }),
          }}
        >
          {getText("location-title", "Location")}
        </div>

        {/* Ceremony Intro */}
        <div
          id="preview-el-location-intro"
          data-element-id="location-intro"
          onClick={() => handleElementClick("location-intro", "location")}
          style={{
            ...getElementHighlightStyle("location-intro"),
            ...getStyle("location-intro", {
              position: "absolute",
              left: 41,
              top: 648,
              width: 348,
              height: 15,
              fontFamily: FONT_CRIMSON,
              fontWeight: 400,
              fontSize: "8px",
              letterSpacing: "0.1em",
              textAlign: "center",
              textTransform: "uppercase",
              color: COLOR_NAVY,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }),
          }}
        >
          {getText(
            "location-intro",
            templateConfig.fixedText?.locationIntro || "THE CEREMONY WILL TAKE PLACE AT"
          )}
        </div>

        {/* Venue Image (with soft blur backer) */}
        <img
          src={locationVenue}
          alt=""
          style={{
            position: "absolute",
            left: 148,
            top: 677,
            width: 135,
            height: 184,
            filter: "blur(2px)",
            opacity: 0.8,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
        <img
          id="preview-el-location-photo"
          data-element-id="location-photo"
          onClick={() => handleElementClick("location-photo", "location")}
          src={locationVenue}
          alt="Venue"
          style={{
            ...getElementHighlightStyle("location-photo"),
            position: "absolute",
            left: 152,
            top: 683,
            width: 126,
            height: 173,
            objectFit: "cover",
            zIndex: 2,
          }}
        />

        {/* Venue Name */}
        <div
          id="preview-el-location-venue"
          data-element-id="location-venue"
          onClick={() => handleElementClick("location-venue", "location")}
          style={{
            ...getElementHighlightStyle("location-venue"),
            ...getStyle("location-venue", {
              position: "absolute",
              left: 0,
              top: 872,
              width: 430,
              height: 18,
              fontFamily: FONT_CRIMSON,
              fontWeight: 400,
              fontSize: "14px",
              letterSpacing: "0.1em",
              textAlign: "center",
              color: COLOR_NAVY,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }),
          }}
        >
          {getText("location-venue", venueName)}
        </div>

        {/* City / Malaga */}
        <div
          id="preview-el-location-city"
          data-element-id="location-city"
          onClick={() => handleElementClick("location-city", "location")}
          style={{
            ...getElementHighlightStyle("location-city"),
            ...getStyle("location-city", {
              position: "absolute",
              left: 0,
              top: 893,
              width: 430,
              height: 13,
              fontFamily: FONT_CRIMSON,
              fontWeight: 400,
              fontSize: "8px",
              letterSpacing: "0.1em",
              textAlign: "center",
              textTransform: "uppercase",
              color: COLOR_NAVY,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }),
          }}
        >
          {getText("location-city", city)}
        </div>

        {/* Time */}
        <div
          id="preview-el-location-time"
          data-element-id="location-time"
          onClick={() => handleElementClick("location-time", "location")}
          style={{
            ...getElementHighlightStyle("location-time"),
            ...getStyle("location-time", {
              position: "absolute",
              left: 0,
              top: 906,
              width: 430,
              height: 13,
              fontFamily: FONT_CRIMSON,
              fontWeight: 400,
              fontSize: "8px",
              letterSpacing: "0.1em",
              textAlign: "center",
              textTransform: "uppercase",
              color: COLOR_NAVY,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }),
          }}
        >
          {getText("location-time", eventTime)}
        </div>

        {/* ============================================================
            TIMELINE SECTION (y: 946 to ~1458)
        ============================================================ */}
        {/* Timeline Title */}
        <div
          id="preview-el-timeline-title"
          data-element-id="timeline-title"
          onClick={() => handleElementClick("timeline-title", "timeline")}
          style={{
            ...getElementHighlightStyle("timeline-title"),
            ...getStyle("timeline-title", {
              position: "absolute",
              left: 0,
              top: 946,
              width: 430,
              height: 58,
              fontFamily: FONT_TAPROM,
              fontWeight: 400,
              fontSize: "32px",
              lineHeight: 1,
              textAlign: "center",
              color: COLOR_NAVY,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }),
          }}
        >
          {getText("timeline-title", "Timeline")}
        </div>

        {/* Timeline Graphic Block (1:1 Figma vector tree) */}
        <div
          style={{
            position: "absolute",
            left: 119,
            top: 1030,
            width: 196.8,
            height: 365.82,
            zIndex: 2,
          }}
        >
          <img
            src={timelineFullSvg}
            alt="Timeline"
            style={{
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* ============================================================
            MENU SECTION (y: 1458 to ~2163)
        ============================================================ */}
        {/* Menu Title */}
        <div
          id="preview-el-menu-title"
          data-element-id="menu-title"
          onClick={() => handleElementClick("menu-title", "menu")}
          style={{
            ...getElementHighlightStyle("menu-title"),
            ...getStyle("menu-title", {
              position: "absolute",
              left: 0,
              top: 1458,
              width: 430,
              height: 58,
              fontFamily: FONT_TAPROM,
              fontWeight: 400,
              fontSize: "32px",
              lineHeight: 1,
              textAlign: "center",
              color: COLOR_NAVY,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }),
          }}
        >
          {getText("menu-title", "Menu")}
        </div>

        {/* Culinary Travel Subtitle */}
        <div
          id="preview-el-menu-subtitle"
          data-element-id="menu-subtitle"
          onClick={() => handleElementClick("menu-subtitle", "menu")}
          style={{
            ...getElementHighlightStyle("menu-subtitle"),
            ...getStyle("menu-subtitle", {
              position: "absolute",
              left: 19,
              top: 1511,
              width: 392,
              height: 16,
              fontFamily: FONT_CRIMSON,
              fontWeight: 400,
              fontSize: "12px",
              letterSpacing: "0.1em",
              textAlign: "center",
              color: COLOR_NAVY,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }),
          }}
        >
          {getText("menu-subtitle", "Culinary Travel")}
        </div>

        {/* Tomatoes Plate Asset */}
        <img
          src={tomatoesDish}
          alt=""
          style={{
            position: "absolute",
            left: -53,
            top: 1552,
            width: 250,
            height: 250,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Ornate Vintage Menu Frame */}
        <img
          src={menuFrame}
          alt=""
          style={{
            position: "absolute",
            left: 26,
            top: 1577,
            width: 377,
            height: 528,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Pasta Plate Asset */}
        <img
          src={pastaDish}
          alt=""
          style={{
            position: "absolute",
            left: 270,
            top: 1929,
            width: 209,
            height: 209,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Course 1: Starter */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 1633,
            width: 430,
            height: 51,
            fontFamily: FONT_TAPROM,
            fontWeight: 400,
            fontSize: "28px",
            lineHeight: 1,
            textAlign: "center",
            color: COLOR_NAVY,
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Starter
        </div>
        <div
          id="preview-el-menu-starter-title"
          data-element-id="menu-starter-title"
          onClick={() => handleElementClick("menu-starter-title", "menu")}
          style={{
            ...getElementHighlightStyle("menu-starter-title"),
            ...getStyle("menu-starter-title", {
              position: "absolute",
              left: 0,
              top: 1684,
              width: 430,
              height: 18,
              fontFamily: FONT_CRIMSON,
              fontWeight: 600,
              fontSize: "14px",
              letterSpacing: "0.1em",
              textAlign: "center",
              color: COLOR_NAVY,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }),
          }}
        >
          {getText("menu-starter-title", "Insalata Caprese")}
        </div>
        <div
          id="preview-el-menu-starter-desc"
          data-element-id="menu-starter-desc"
          onClick={() => handleElementClick("menu-starter-desc", "menu")}
          style={{
            ...getElementHighlightStyle("menu-starter-desc"),
            ...getStyle("menu-starter-desc", {
              position: "absolute",
              left: 19,
              top: 1711,
              width: 392,
              height: 48,
              fontFamily: FONT_CRIMSON,
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "16px",
              letterSpacing: "0.1em",
              textAlign: "center",
              color: COLOR_NAVY,
              zIndex: 2,
              whiteSpace: "pre-line",
            }),
          }}
        >
          {getText(
            "menu-starter-desc",
            "Layers of creamy buffalo mozzarella,\nripe slices of tomato, and fragrant\nbasil leaves are elegantly arranged on a plate."
          )}
        </div>

        {/* Course 2: Main Course */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 1776,
            width: 430,
            height: 51,
            fontFamily: FONT_TAPROM,
            fontWeight: 400,
            fontSize: "28px",
            lineHeight: 1,
            textAlign: "center",
            color: COLOR_NAVY,
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Main Course
        </div>
        <div
          id="preview-el-menu-main-title"
          data-element-id="menu-main-title"
          onClick={() => handleElementClick("menu-main-title", "menu")}
          style={{
            ...getElementHighlightStyle("menu-main-title"),
            ...getStyle("menu-main-title", {
              position: "absolute",
              left: 0,
              top: 1827,
              width: 430,
              height: 18,
              fontFamily: FONT_CRIMSON,
              fontWeight: 600,
              fontSize: "14px",
              letterSpacing: "0.1em",
              textAlign: "center",
              color: COLOR_NAVY,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }),
          }}
        >
          {getText("menu-main-title", "Spaghetti alla Carbonara")}
        </div>
        <div
          id="preview-el-menu-main-desc"
          data-element-id="menu-main-desc"
          onClick={() => handleElementClick("menu-main-desc", "menu")}
          style={{
            ...getElementHighlightStyle("menu-main-desc"),
            ...getStyle("menu-main-desc", {
              position: "absolute",
              left: 19,
              top: 1854,
              width: 392,
              height: 32,
              fontFamily: FONT_CRIMSON,
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "16px",
              letterSpacing: "0.1em",
              textAlign: "center",
              color: COLOR_NAVY,
              zIndex: 2,
              whiteSpace: "pre-line",
            }),
          }}
        >
          {getText(
            "menu-main-desc",
            "Al dente spaghetti, lovingly coated\nin a velvety sauce, awaits your palate."
          )}
        </div>

        {/* Course 3: Dessert */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 1919,
            width: 430,
            height: 51,
            fontFamily: FONT_TAPROM,
            fontWeight: 400,
            fontSize: "28px",
            lineHeight: 1,
            textAlign: "center",
            color: COLOR_NAVY,
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Desert
        </div>
        <div
          id="preview-el-menu-dessert-title"
          data-element-id="menu-dessert-title"
          onClick={() => handleElementClick("menu-dessert-title", "menu")}
          style={{
            ...getElementHighlightStyle("menu-dessert-title"),
            ...getStyle("menu-dessert-title", {
              position: "absolute",
              left: 0,
              top: 1970,
              width: 430,
              height: 18,
              fontFamily: FONT_CRIMSON,
              fontWeight: 600,
              fontSize: "14px",
              letterSpacing: "0.1em",
              textAlign: "center",
              color: COLOR_NAVY,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }),
          }}
        >
          {getText("menu-dessert-title", "Tiramisu")}
        </div>
        <div
          id="preview-el-menu-dessert-desc"
          data-element-id="menu-dessert-desc"
          onClick={() => handleElementClick("menu-dessert-desc", "menu")}
          style={{
            ...getElementHighlightStyle("menu-dessert-desc"),
            ...getStyle("menu-dessert-desc", {
              position: "absolute",
              left: 19,
              top: 1997,
              width: 392,
              height: 48,
              fontFamily: FONT_CRIMSON,
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "16px",
              letterSpacing: "0.1em",
              textAlign: "center",
              color: COLOR_NAVY,
              zIndex: 2,
              whiteSpace: "pre-line",
            }),
          }}
        >
          {getText(
            "menu-dessert-desc",
            "Savor the finale of your Italian journey\nwith the epitome\nof dolce perfection – Tiramisu."
          )}
        </div>

        {/* ============================================================
            RSVP SECTION (y: 2163 to ~2796)
        ============================================================ */}
        {/* RSVP Title */}
        <div
          id="preview-el-rsvp-title"
          data-element-id="rsvp-title"
          onClick={() => handleElementClick("rsvp-title", "rsvp")}
          style={{
            ...getElementHighlightStyle("rsvp-title"),
            ...getStyle("rsvp-title", {
              position: "absolute",
              left: 0,
              top: 2163,
              width: 430,
              height: 58,
              fontFamily: FONT_TAPROM,
              fontWeight: 400,
              fontSize: "32px",
              lineHeight: 1,
              textAlign: "center",
              color: COLOR_NAVY,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }),
          }}
        >
          {getText("rsvp-title", "RSVP")}
        </div>

        {/* Form Container */}
        <form onSubmit={handleRsvpSubmit}>
          {/* Will you attend */}
          <div
            id="preview-el-rsvp-attend-label"
            data-element-id="rsvp-attend-label"
            onClick={() => handleElementClick("rsvp-attend-label", "rsvp")}
            style={{
              ...getElementHighlightStyle("rsvp-attend-label"),
              ...getStyle("rsvp-attend-label", {
                position: "absolute",
                left: 16,
                top: 2268,
                width: 200,
                height: 18,
                fontFamily: FONT_CRIMSON,
                fontWeight: 400,
                fontSize: "14px",
                letterSpacing: "0.1em",
                color: COLOR_NAVY,
                zIndex: 2,
              }),
            }}
          >
            {getText("rsvp-attend-label", "Will you attend")}
          </div>

          {/* Option 1: Yes */}
          <div
            onClick={() => setAttendance("yes")}
            style={{
              position: "absolute",
              left: 16,
              top: 2298,
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              zIndex: 2,
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                border: `1px solid ${COLOR_GOLD}`,
                backgroundColor: attendance === "yes" ? COLOR_NAVY : "transparent",
                boxSizing: "border-box",
                marginRight: 10,
                transition: "background-color 0.2s ease",
              }}
            />
            <span
              style={{
                fontFamily: FONT_CRIMSON,
                fontWeight: 400,
                fontSize: "14px",
                letterSpacing: "0.1em",
                color: COLOR_NAVY,
              }}
            >
              Yes, I will be there
            </span>
          </div>

          {/* Option 2: No */}
          <div
            onClick={() => setAttendance("no")}
            style={{
              position: "absolute",
              left: 198,
              top: 2298,
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              zIndex: 2,
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                border: `1px solid ${COLOR_GOLD}`,
                backgroundColor: attendance === "no" ? COLOR_NAVY : "transparent",
                boxSizing: "border-box",
                marginRight: 10,
                transition: "background-color 0.2s ease",
              }}
            />
            <span
              style={{
                fontFamily: FONT_CRIMSON,
                fontWeight: 400,
                fontSize: "14px",
                letterSpacing: "0.1em",
                color: COLOR_NAVY,
              }}
            >
              Sorry, I can’t make it
            </span>
          </div>

          {/* Field 1: Full Name */}
          <label
            style={{
              position: "absolute",
              left: 16,
              top: 2341,
              width: 200,
              height: 18,
              fontFamily: FONT_CRIMSON,
              fontWeight: 400,
              fontSize: "14px",
              letterSpacing: "0.1em",
              color: COLOR_NAVY,
              zIndex: 2,
            }}
          >
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name"
            style={{
              position: "absolute",
              left: 16,
              top: 2371,
              width: 398,
              height: 47,
              boxSizing: "border-box",
              border: `1px solid ${COLOR_GOLD}`,
              borderRadius: "5px",
              backgroundColor: "transparent",
              paddingLeft: 12,
              paddingRight: 12,
              fontFamily: FONT_CRIMSON,
              fontWeight: 400,
              fontSize: "14px",
              letterSpacing: "0.1em",
              color: COLOR_NAVY,
              outline: "none",
              zIndex: 2,
            }}
          />

          {/* Field 2: Email */}
          <label
            style={{
              position: "absolute",
              left: 16,
              top: 2443,
              width: 200,
              height: 18,
              fontFamily: FONT_CRIMSON,
              fontWeight: 400,
              fontSize: "14px",
              letterSpacing: "0.1em",
              color: COLOR_NAVY,
              zIndex: 2,
            }}
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="abc.xyz@contact.com"
            style={{
              position: "absolute",
              left: 16,
              top: 2473,
              width: 398,
              height: 47,
              boxSizing: "border-box",
              border: `1px solid ${COLOR_GOLD}`,
              borderRadius: "5px",
              backgroundColor: "transparent",
              paddingLeft: 12,
              paddingRight: 12,
              fontFamily: FONT_CRIMSON,
              fontWeight: 400,
              fontSize: "14px",
              letterSpacing: "0.1em",
              color: COLOR_NAVY,
              outline: "none",
              zIndex: 2,
            }}
          />

          {/* Field 3: Phone Number */}
          <label
            style={{
              position: "absolute",
              left: 16,
              top: 2545,
              width: 200,
              height: 18,
              fontFamily: FONT_CRIMSON,
              fontWeight: 400,
              fontSize: "14px",
              letterSpacing: "0.1em",
              color: COLOR_NAVY,
              zIndex: 2,
            }}
          >
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+216000111"
            style={{
              position: "absolute",
              left: 16,
              top: 2575,
              width: 398,
              height: 47,
              boxSizing: "border-box",
              border: `1px solid ${COLOR_GOLD}`,
              borderRadius: "5px",
              backgroundColor: "transparent",
              paddingLeft: 12,
              paddingRight: 12,
              fontFamily: FONT_CRIMSON,
              fontWeight: 400,
              fontSize: "14px",
              letterSpacing: "0.1em",
              color: COLOR_NAVY,
              outline: "none",
              zIndex: 2,
            }}
          />

          {/* Field 4: Number of guests */}
          <label
            style={{
              position: "absolute",
              left: 16,
              top: 2647,
              width: 200,
              height: 18,
              fontFamily: FONT_CRIMSON,
              fontWeight: 400,
              fontSize: "14px",
              letterSpacing: "0.1em",
              color: COLOR_NAVY,
              zIndex: 2,
            }}
          >
            Number of guests
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={guestCount}
            onChange={(e) => setGuestCount(e.target.value)}
            placeholder="3"
            style={{
              position: "absolute",
              left: 16,
              top: 2677,
              width: 398,
              height: 47,
              boxSizing: "border-box",
              border: `1px solid ${COLOR_GOLD}`,
              borderRadius: "5px",
              backgroundColor: "transparent",
              paddingLeft: 12,
              paddingRight: 12,
              fontFamily: FONT_CRIMSON,
              fontWeight: 400,
              fontSize: "14px",
              letterSpacing: "0.1em",
              color: COLOR_NAVY,
              outline: "none",
              zIndex: 2,
            }}
          />

          {/* Submit Button */}
          <button
            type="submit"
            id="preview-el-rsvp-btn"
            data-element-id="rsvp-btn"
            onClick={() => handleElementClick("rsvp-btn", "rsvp")}
            style={{
              ...getElementHighlightStyle("rsvp-btn"),
              ...getStyle("rsvp-btn", {
                position: "absolute",
                left: 16,
                top: 2755,
                width: 398,
                height: 40,
                boxSizing: "border-box",
                backgroundColor: COLOR_NAVY,
                borderRadius: "7px",
                border: "none",
                fontFamily: FONT_CRIMSON,
                fontWeight: 400,
                fontSize: "14px",
                color: COLOR_WHITE,
                cursor: "pointer",
                zIndex: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }),
            }}
          >
            {rsvpSubmitted
              ? "Confirmation reçue !"
              : getText("rsvp-btn", "Send Confirmation")}
          </button>
        </form>

        {/* ============================================================
            CLOSING / FOOTER SECTION (y: 2796 to 3050)
        ============================================================ */}
        {/* Footer Vintage Frame Card */}
        <img
          src={footerFrame}
          alt=""
          style={{
            position: "absolute",
            left: 34,
            top: 2796,
            width: 352,
            height: 251,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* We hope you can make it */}
        <div
          id="preview-el-footer-closing-text"
          data-element-id="footer-closing-text"
          onClick={() => handleElementClick("footer-closing-text", "footer")}
          style={{
            ...getElementHighlightStyle("footer-closing-text"),
            ...getStyle("footer-closing-text", {
              position: "absolute",
              left: 36,
              top: 2897,
              width: 348,
              height: 25,
              fontFamily: FONT_CRIMSON,
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "12px",
              letterSpacing: "0.1em",
              textAlign: "center",
              color: COLOR_NAVY,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }),
          }}
        >
          {getText(
            "footer-closing-text",
            templateConfig.fixedText?.closingText || "We hope you can make it"
          )}
        </div>

        {/* Bilel & Dorra Footer */}
        <div
          id="preview-el-footer-names"
          data-element-id="footer-names"
          onClick={() => handleElementClick("footer-names", "footer")}
          style={{
            ...getElementHighlightStyle("footer-names"),
            ...getStyle("footer-names", {
              position: "absolute",
              left: 34,
              top: 2910,
              width: 352,
              height: 58,
              fontFamily: FONT_TAPROM,
              fontWeight: 400,
              fontSize: "22px",
              lineHeight: 1,
              textAlign: "center",
              color: COLOR_NAVY,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }),
          }}
        >
          {getText("footer-names", coupleNames)}
        </div>
      </div>
    </div>
  );
}
