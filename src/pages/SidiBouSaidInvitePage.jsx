import React, { useState, useEffect, useMemo, useRef } from "react";
import ParticleEmitter from "../components/animations/ParticleEmitter";
import AudioPlayer from "../components/audio/AudioPlayer";
import templateConfig from "../data/digital/templates/sidi-bousaid.json";

// Fresh Figma Assets
import heroArchBg from "../assets/digital/sidi-bousaid/fresh-figma/hero-arch-bg.png";
import defaultHeroVideo from "../assets/videos/Mediterranean_Sea_harbor_bougain.mp4";
import revealCornerTop from "../assets/digital/sidi-bousaid/fresh-figma/reveal-corner-top.svg";
import revealCornerBottom from "../assets/digital/sidi-bousaid/fresh-figma/reveal-corner-bottom.svg";
import revealDoors from "../assets/digital/sidi-bousaid/fresh-figma/reveal-doors.svg";
import revealHand from "../assets/digital/sidi-bousaid/fresh-figma/reveal-hand.svg";

import storyTileTop from "../assets/digital/sidi-bousaid/fresh-figma/story-tile-top.svg";
import storyTileBottom from "../assets/digital/sidi-bousaid/fresh-figma/story-tile-bottom.svg";
import watercolorBougainvillea from "../assets/digital/sidi-bousaid/fresh-figma/watercolor-bougainvillea.png";
import storyTape from "../assets/digital/sidi-bousaid/fresh-figma/story-tape.png";
import storySketchCouple from "../assets/digital/sidi-bousaid/fresh-figma/story-sketch-couple.png";
import storyTornPaper from "../assets/digital/sidi-bousaid/fresh-figma/story-torn-paper.png";
import storyStampLeft from "../assets/digital/sidi-bousaid/fresh-figma/story-stamp-left.png";
import storyStampRight from "../assets/digital/sidi-bousaid/fresh-figma/story-stamp-right.png";

import countdownBg from "../assets/digital/sidi-bousaid/fresh-figma/countdown-bg.png";

import evilEyeOuteyaTop from "../assets/digital/sidi-bousaid/fresh-figma/evil-eye-outeya-top.svg";
import evilEyeOuteyaBottom from "../assets/digital/sidi-bousaid/fresh-figma/evil-eye-outeya-bottom.svg";
import fishOuteya from "../assets/digital/sidi-bousaid/fresh-figma/fish-outeya.svg";

import evilEyeMariageTop from "../assets/digital/sidi-bousaid/fresh-figma/evil-eye-mariage-top.svg";
import evilEyeMariageBottom from "../assets/digital/sidi-bousaid/fresh-figma/evil-eye-mariage-bottom.svg";
import fishMariage from "../assets/digital/sidi-bousaid/fresh-figma/fish-mariage.svg";

import dressCodeAttire from "../assets/digital/sidi-bousaid/fresh-figma/dress-code-attire.png";

import progIconSdek from "../assets/digital/sidi-bousaid/fresh-figma/prog-icon-sdek.png";
import progIconReception from "../assets/digital/sidi-bousaid/fresh-figma/prog-icon-reception.png";
import progIconDinner from "../assets/digital/sidi-bousaid/fresh-figma/prog-icon-dinner.png";
import progIconDance from "../assets/digital/sidi-bousaid/fresh-figma/prog-icon-dance.png";

import closingSmallOrnament from "../assets/digital/sidi-bousaid/fresh-figma/closing-small-ornament.png";

const BLUE = "rgba(0, 147, 216, 1)";
const CANVAS_WIDTH = 430;

const figmaBox = ({ x, y, width, height, zIndex = 2 }) => ({
  position: "absolute",
  left: `${x}px`,
  top: `${y}px`,
  width: width ? `${width}px` : "auto",
  height: height ? `${height}px` : "auto",
  zIndex
});

// Helper: Format event dates
const parseDateDetails = (dateStr, defaultValues) => {
  if (!dateStr) return defaultValues;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return defaultValues;
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return {
      weekday: weekdays[d.getDay()],
      day: String(d.getDate()).padStart(2, "0"),
      month: months[d.getMonth()],
      year: String(d.getFullYear()),
      dayNum: d.getDate(),
      monthNum: String(d.getMonth() + 1).padStart(2, "0"),
      yearShort: String(d.getFullYear()).slice(-2),
    };
  } catch {
    return defaultValues;
  }
};

const getOverride = (overrides, id, defaultStyle, defaultText) => {
  const o = overrides?.[id] || {};
  const posX = o.posX || 0;
  const posY = o.posY || 0;
  const transform = posX !== 0 || posY !== 0
    ? `${defaultStyle.transform || ''} translate(${posX}px, ${posY}px)`.trim()
    : defaultStyle.transform;

  const style = {
    ...defaultStyle,
    ...(o.color ? { color: o.color } : {}),
    ...(o.fontFamily && o.fontFamily !== "Défaut du Template" ? { fontFamily: o.fontFamily } : {}),
    ...(o.fontSize ? { fontSize: `${o.fontSize}px` } : {}),
    ...(transform ? { transform } : {}),
  };
  const text = o.text !== undefined && o.text !== "" ? o.text : defaultText;
  return { style, text };
};

const renderLines = (val) => {
  if (typeof val !== "string") return val;
  const parts = val.split("\n");
  if (parts.length === 1) return val;
  return parts.map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i < parts.length - 1 && <br />}
    </React.Fragment>
  ));
};

/* =========================================================================
   WAVY CIRCLE WATER ANIMATION (Liquid filling progress)
   ========================================================================= */
const WavyCircle = ({ percent = 0 }) => {
  if (percent === 0) {
    return (
      <div
        style={{
          width: "13px",
          height: "13px",
          borderRadius: "50%",
          border: "1px solid rgba(46, 136, 226, 1)",
          backgroundColor: "#FFFFFF",
          boxSizing: "border-box"
        }}
      />
    );
  }

  if (percent >= 1) {
    return (
      <div
        style={{
          width: "13px",
          height: "13px",
          borderRadius: "50%",
          border: "1px solid rgba(46, 136, 226, 1)",
          backgroundColor: "rgba(46, 136, 226, 1)",
          boxSizing: "border-box"
        }}
      />
    );
  }

  const y = 13 - (13 * percent);
  const wavePath = `M 0 ${y} Q 3.25 ${y - 1.8}, 6.5 ${y} T 13 ${y} Q 16.25 ${y - 1.8}, 19.5 ${y} T 26 ${y} L 26 13 L 0 13 Z`;

  return (
    <div
      style={{
        position: "relative",
        width: "13px",
        height: "13px",
        borderRadius: "50%",
        border: "1px solid rgba(46, 136, 226, 1)",
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
        boxSizing: "border-box"
      }}
    >
      <svg
        viewBox="0 0 26 13"
        className="wavy-liquid-svg"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "200%",
          height: "100%",
          display: "block",
          willChange: "transform",
        }}
      >
        <path d={wavePath} fill="rgba(46, 136, 226, 1)" />
      </svg>
    </div>
  );
};

/* =========================================================================
   BLOCK 1: HERO / OPENING (Height: 708px)
   ========================================================================= */
const HeroBlock = ({ partner1, partner2, initials, month, year, subtitle, overrides, onScrollDown }) => {
  const initialsGroup = getOverride(overrides, 'hero-initials', {
    position: "absolute", left: "194px", top: "202px", width: "43px", height: "66px", zIndex: 3
  }, "");

  const init1 = getOverride(overrides, 'hero-initial-1', {
    position: "absolute", left: "1px", top: "6px", width: "32px", height: "29px", fontFamily: "'Antic Didone', serif", fontSize: "30px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "32px", textAlign: "center", color: "rgba(255, 255, 255, 1)", zIndex: 3
  }, initials.initial1);

  const init2 = getOverride(overrides, 'hero-initial-2', {
    position: "absolute", left: "9px", top: "29px", width: "32px", height: "29px", fontFamily: "'Antic Didone', serif", fontSize: "30px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "32px", textAlign: "center", color: "rgba(255, 255, 255, 1)", zIndex: 3
  }, initials.initial2);

  const name1 = getOverride(overrides, 'hero-name-1', {}, partner1 || "Sarah");
  const name2 = getOverride(overrides, 'hero-name-2', {}, partner2 || "Hedi");

  const coupleNames = getOverride(overrides, 'hero-names', {
    position: "absolute", left: "165px", top: "272px", width: "105px", height: "71px", fontFamily: "'Antic Didone', serif", fontSize: "38px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "40px", textAlign: "center", color: "rgba(255, 255, 255, 1)", zIndex: 3
  }, `${name1.text}\n${name2.text}`);

  const monthText = getOverride(overrides, 'hero-date-month', {
    position: "absolute", left: "101px", top: "305px", width: "63px", height: "23px", fontFamily: "'Cormorant Infant', serif", fontSize: "20px", fontWeight: 400, fontStyle: "italic", letterSpacing: "2px", lineHeight: "18px", textAlign: "center", color: "rgba(255, 255, 255, 1)", textTransform: "uppercase", zIndex: 3
  }, month || "July");

  const yearText = getOverride(overrides, 'hero-date-year', {
    position: "absolute", left: "266px", top: "305px", width: "63px", height: "23px", fontFamily: "'Cormorant Infant', serif", fontSize: "20px", fontWeight: 400, fontStyle: "italic", letterSpacing: "2px", lineHeight: "18px", textAlign: "center", color: "rgba(255, 255, 255, 1)", textTransform: "uppercase", zIndex: 3
  }, year || "2026");

  const sub = getOverride(overrides, 'hero-subtitle', {
    position: "absolute", left: "121px", top: "360px", width: "188px", height: "27px", fontFamily: "'Cormorant', serif", fontSize: "16px", fontWeight: 400, fontStyle: "normal", letterSpacing: "1.6px", lineHeight: "16px", textAlign: "center", color: "rgba(255, 255, 255, 1)", textTransform: "capitalize", zIndex: 3
  }, subtitle || "Welcome to our \nmediterranean abode");

  const scrollBtn = getOverride(overrides, 'hero-btn', {
    position: "absolute", left: "100px", top: "437px", width: "231px", height: "17px", fontFamily: "'Cormorant', serif", fontSize: "14px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "17px", textAlign: "center", color: "rgba(46, 136, 226, 1)", zIndex: 4, cursor: "pointer"
  }, "Scroll down");

  const heroBg = overrides?.['hero-bg']?.image || overrides?.['hero-bg']?.video || defaultHeroVideo;
  const isVideoBg = typeof heroBg === "string" && (heroBg.includes(".mp4") || heroBg.includes(".webm") || heroBg.startsWith("data:video") || heroBg === defaultHeroVideo);
  const secPosY = overrides?.['sec-hero']?.posY || 0;

  return (
    <section id="block-hero" data-section-index="0" style={{ position: "relative", width: `${CANVAS_WIDTH}px`, height: "708px", overflow: "hidden", transform: secPosY ? `translateY(${secPosY}px)` : undefined }}>
      {/* Arch Background (Image or Video) */}
      {isVideoBg ? (
        <video
          src={heroBg}
          autoPlay
          loop
          muted
          playsInline
          className="reveal"
          style={{ ...figmaBox({ x: 0, y: 0, width: 430, height: 708, zIndex: 1 }), objectFit: "cover", transitionDelay: "100ms" }}
        />
      ) : (
        <img
          src={heroBg}
          alt="Hero Arch"
          className="reveal"
          style={{ ...figmaBox({ x: 0, y: 0, width: 430, height: 708, zIndex: 1 }), objectFit: "cover", transitionDelay: "100ms" }}
          draggable="false"
        />
      )}

      {/* Initials Oval Circle & Letters (Group Container) */}
      <div className="reveal" style={{ ...initialsGroup.style, transitionDelay: "200ms" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: "43px", height: "66px", borderRadius: "40px", border: "1px solid #FFFFFF", boxSizing: "border-box" }} />
        <div style={init1.style}>{init1.text}</div>
        <div style={init2.style}>{init2.text}</div>
      </div>

      {/* Names */}
      <div className="reveal" style={{ ...coupleNames.style, transitionDelay: "300ms" }}>{renderLines(coupleNames.text)}</div>

      {/* Dates */}
      <div className="reveal" style={{ ...monthText.style, transitionDelay: "400ms" }}>{monthText.text}</div>
      <div className="reveal" style={{ ...yearText.style, transitionDelay: "400ms" }}>{yearText.text}</div>

      {/* Subtitle */}
      <div className="reveal" style={{ ...sub.style, transitionDelay: "500ms" }}>{renderLines(sub.text)}</div>

      {/* Scroll Button */}
      <div onClick={onScrollDown} className="reveal" style={{ ...figmaBox({ x: 158, y: 430, width: 116, height: 32, zIndex: 3 }), backgroundColor: "#FFFFFF", borderRadius: "20px", cursor: "pointer", transitionDelay: "600ms" }} />
      <div onClick={onScrollDown} className="reveal" style={{ ...scrollBtn.style, transitionDelay: "600ms" }}>{scrollBtn.text}</div>
    </section>
  );
};


/* =========================================================================
   BLOCK 2: REVEAL SECTION (Height: 316px)
   ========================================================================= */
const RevealBlock = ({ dateDetails, overrides }) => {
  const BLOCK_Y = 708;

  const titleEn = getOverride(overrides, 'reveal-title', {
    position: "absolute", left: "131px", top: "32px", width: "168px", height: "30px", fontFamily: "'Antic Didone', serif", fontSize: "22px", fontWeight: 400, fontStyle: "normal", letterSpacing: "1.1px", lineHeight: "26px", textAlign: "center", color: BLUE
  }, "Reveal");

  const titleAr = getOverride(overrides, 'reveal-title-ar', {
    position: "absolute", left: "134px", top: "51px", width: "162px", height: "26px", fontFamily: "'Gulzar', serif", fontSize: "20px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "54px", textAlign: "center", color: BLUE
  }, "النهار جاء");

  const dateHidden = getOverride(overrides, 'reveal-date', {
    fontFamily: "'Antic Didone', serif", fontSize: "13px", color: BLUE, textAlign: "center"
  }, "");

  const doorsImg = overrides?.['reveal-doors']?.image || revealDoors;
  const handImg = overrides?.['reveal-hands']?.image || revealHand;
  const secPosY = overrides?.['sec-reveal']?.posY || 0;

  return (
    <section id="block-reveal" data-section-index="1" style={{ position: "relative", width: `${CANVAS_WIDTH}px`, height: "316px", overflow: "hidden", transform: secPosY ? `translateY(${secPosY}px)` : undefined }}>
      {/* Corner Ornaments */}
      <img src={revealCornerTop} alt="" className="reveal" style={{ ...figmaBox({ x: 369, y: 708 - BLOCK_Y, width: 63, height: 55 }), transitionDelay: "150ms" }} draggable="false" />
      <img src={revealCornerBottom} alt="" className="reveal" style={{ ...figmaBox({ x: -3, y: 932 - BLOCK_Y, width: 62, height: 55 }), transitionDelay: "150ms" }} draggable="false" />

      {/* Reveal Titles */}
      <div className="reveal" style={{ ...titleEn.style, transitionDelay: "200ms" }}>{titleEn.text}</div>
      <div className="reveal" style={{ ...titleAr.style, transitionDelay: "250ms" }}>{titleAr.text}</div>

      {/* Reveal Hand (x: 160, y: 800, w: 111, h: 132) */}
      <img src={handImg} alt="" className="reveal" style={{ ...figmaBox({ x: 160, y: 800 - BLOCK_Y, width: 111, height: 132, zIndex: 2 }), transitionDelay: "300ms" }} draggable="false" />

      {/* Hidden Date Behind Doors (y: 850) */}
      <div style={{ ...figmaBox({ x: 93, y: 850 - BLOCK_Y, width: 51, height: 18, zIndex: 3 }), ...dateHidden.style }}>{dateDetails.day || "20"}</div>
      <div style={{ ...figmaBox({ x: 190, y: 850 - BLOCK_Y, width: 51, height: 18, zIndex: 3 }), ...dateHidden.style }}>{dateDetails.monthNum || "07"}</div>
      <div style={{ ...figmaBox({ x: 287, y: 850 - BLOCK_Y, width: 51, height: 18, zIndex: 3 }), ...dateHidden.style }}>{dateDetails.yearShort || "26"}</div>

      {/* Reveal Doors SVG (x: 93, y: 810, w: 245, h: 99) */}
      <img
        src={doorsImg}
        alt="Doors"
        className="reveal"
        style={{
          ...figmaBox({ x: 93, y: 810 - BLOCK_Y, width: 245, height: 99, zIndex: 4 }),
          transitionDelay: "350ms"
        }}
        draggable="false"
      />
    </section>
  );
};

/* =========================================================================
   BLOCK 3: OUR STORY (Height: 357px)
   ========================================================================= */
const StoryBlock = ({ customPhoto, storyQuote, overrides }) => {
  const BLOCK_Y = 1024;

  const titleEn = getOverride(overrides, 'story-title', {
    position: "absolute", left: "131px", top: "0px", width: "168px", height: "30px", fontFamily: "'Antic Didone', serif", fontSize: "22px", fontWeight: 400, fontStyle: "normal", letterSpacing: "1.1px", lineHeight: "26px", textAlign: "center", color: BLUE
  }, "Our Story");

  const titleAr = getOverride(overrides, 'story-title-ar', {
    position: "absolute", left: "134px", top: "19px", width: "162px", height: "26px", fontFamily: "'Gulzar', serif", fontSize: "20px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "54px", textAlign: "center", color: BLUE
  }, "حكايتنا");

  const quote = getOverride(overrides, 'story-quote', {
    position: "absolute",
    left: "8.27px",
    top: "178.48px",
    width: "241px",
    height: "59px",
    transform: "rotate(-10deg)",
    transformOrigin: "center center",
    fontFamily: "'Cormorant', serif",
    fontSize: "12px",
    fontWeight: 400,
    fontStyle: "normal",
    letterSpacing: "1.2px",
    lineHeight: "18px",
    textAlign: "center",
    color: "rgba(73, 96, 107, 1)",
    zIndex: 4
  }, storyQuote || "Our Happy Ever After\nStarts\nNow");

  const couplePhoto = customPhoto || overrides?.['story-photo']?.image || storySketchCouple;
  const secPosY = overrides?.['sec-story']?.posY || 0;

  return (
    <section id="block-story" data-section-index="2" style={{ position: "relative", width: `${CANVAS_WIDTH}px`, height: "357px", overflow: "hidden", transform: secPosY ? `translateY(${secPosY}px)` : undefined }}>
      <div className="reveal" style={{ ...titleEn.style, transitionDelay: "150ms" }}>{titleEn.text}</div>
      <div className="reveal" style={{ ...titleAr.style, transitionDelay: "200ms" }}>{titleAr.text}</div>

      <img src={storyTileTop} alt="" className="reveal" style={{ ...figmaBox({ x: 400, y: 1056 - BLOCK_Y, width: 38, height: 38 }), transitionDelay: "250ms" }} draggable="false" />
      <img src={storyTileBottom} alt="" className="reveal" style={{ ...figmaBox({ x: -10, y: 1303 - BLOCK_Y, width: 38, height: 38 }), transitionDelay: "250ms" }} draggable="false" />

      <img src={watercolorBougainvillea} alt="" className="reveal" style={{ ...figmaBox({ x: 85, y: 48, width: 164, height: 164, zIndex: 2 }), transitionDelay: "300ms" }} draggable="false" />
      <img src={couplePhoto} alt="Couple" className="reveal" style={{ ...figmaBox({ x: 184.5, y: 79.3, width: 233.6, height: 179.3, zIndex: 3 }), transitionDelay: "350ms" }} draggable="false" />
      <img src={storyTape} alt="" className="reveal" style={{ ...figmaBox({ x: 260, y: 69, width: 114, height: 52, zIndex: 4 }), transitionDelay: "400ms" }} draggable="false" />
      <img src={storyTornPaper} alt="" className="reveal" style={{ ...figmaBox({ x: 15.5, y: 121.5, width: 222.6, height: 164.5, zIndex: 3 }), transitionDelay: "450ms" }} draggable="false" />

      <div
        className="reveal"
        style={{
          ...quote.style,
          transform: "rotate(-10deg)",
          transformOrigin: "center center",
          transitionDelay: "500ms"
        }}
      >
        {renderLines(quote.text)}
      </div>

      <img src={storyStampLeft} alt="" className="reveal" style={{ ...figmaBox({ x: 309, y: 213, width: 67.5, height: 101.4, zIndex: 5 }), transitionDelay: "550ms" }} draggable="false" />
      <img src={storyStampRight} alt="" className="reveal" style={{ ...figmaBox({ x: 314.2, y: 219.7, width: 57.1, height: 86.0, zIndex: 6 }), transitionDelay: "550ms" }} draggable="false" />
    </section>
  );
};

/* =========================================================================
   BLOCK 4: COUNTDOWN (Height: 243px)
   ========================================================================= */
const CountdownBlock = ({ targetDate, overrides }) => {
  const BLOCK_Y = 1381;
  const [timeLeft, setTimeLeft] = useState({ days: 100, hours: 13, minutes: 42 });

  useEffect(() => {
    if (!targetDate) return;

    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
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
  }, [targetDate]);

  const titleEn = getOverride(overrides, 'countdown-title', {
    position: "absolute", left: "131px", top: "27px", width: "168px", height: "42px", fontFamily: "'Antic Didone', serif", fontSize: "22px", fontWeight: 400, fontStyle: "normal", letterSpacing: "1.1px", lineHeight: "26px", textAlign: "center", color: "rgba(255, 255, 255, 1)", zIndex: 3
  }, "Countdown");

  const titleAr = getOverride(overrides, 'countdown-title-ar', {
    position: "absolute", left: "134px", top: "50px", width: "162px", height: "30px", fontFamily: "'Gulzar', serif", fontSize: "20px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "54px", textAlign: "center", color: "rgba(255, 255, 255, 1)", zIndex: 3
  }, "العد التنازلي");

  const dateStyle = getOverride(overrides, 'countdown-date', {
    fontFamily: "'Cormorant Infant', serif", fontSize: "14px", fontWeight: 500, color: "rgba(0, 147, 216, 1)"
  }, "");

  const secPosY = overrides?.['sec-countdown']?.posY || 0;

  return (
    <section id="block-countdown" data-section-index="3" style={{ position: "relative", width: `${CANVAS_WIDTH}px`, height: "243px", overflow: "hidden", transform: secPosY ? `translateY(${secPosY}px)` : undefined }}>
      <img src={countdownBg} alt="Countdown" className="reveal" style={{ ...figmaBox({ x: 0, y: 1381 - BLOCK_Y, width: 430, height: 212, zIndex: 1 }), transitionDelay: "150ms" }} draggable="false" />
      <div className="reveal" style={{ ...figmaBox({ x: 0, y: 1381 - BLOCK_Y, width: 430, height: 212, zIndex: 2 }), backgroundColor: "rgba(75, 198, 255, 0.07)", transitionDelay: "150ms" }} />

      <div className="reveal" style={{ ...titleEn.style, transitionDelay: "200ms" }}>{titleEn.text}</div>
      <div className="reveal" style={{ ...titleAr.style, transitionDelay: "250ms" }}>{titleAr.text}</div>

      <div className="reveal" style={{ ...figmaBox({ x: 78, y: 106, width: 56, height: 55, zIndex: 3 }), backgroundColor: "#F3F3F3", borderRadius: "12px", border: "1px solid rgba(0, 147, 216, 1)", boxSizing: "border-box", transitionDelay: "300ms" }} />
      <div className="reveal" style={{ ...figmaBox({ x: 187, y: 106, width: 56, height: 55, zIndex: 3 }), backgroundColor: "#F3F3F3", borderRadius: "12px", border: "1px solid rgba(0, 147, 216, 1)", boxSizing: "border-box", transitionDelay: "350ms" }} />
      <div className="reveal" style={{ ...figmaBox({ x: 296, y: 106, width: 56, height: 55, zIndex: 3 }), backgroundColor: "#F3F3F3", borderRadius: "12px", border: "1px solid rgba(0, 147, 216, 1)", boxSizing: "border-box", transitionDelay: "400ms" }} />

      <div className="reveal" style={{ position: "absolute", left: "23px", top: "116px", width: "168px", height: "18px", fontStyle: "normal", letterSpacing: "1.4px", lineHeight: "17px", textAlign: "center", zIndex: 4, transitionDelay: "300ms", ...dateStyle.style }}>
        {timeLeft.days}
      </div>
      <div className="reveal" style={{ position: "absolute", left: "65px", top: "138px", width: "83px", height: "13px", fontFamily: "'Cormorant Infant', serif", fontSize: "8px", fontWeight: 500, fontStyle: "normal", letterSpacing: "0.8px", lineHeight: "10px", textAlign: "center", color: "rgba(0, 147, 216, 1)", zIndex: 4, transitionDelay: "300ms" }}>
        Days
      </div>
      <div className="reveal" style={{ position: "absolute", left: "131px", top: "116px", width: "168px", height: "18px", fontStyle: "normal", letterSpacing: "1.4px", lineHeight: "17px", textAlign: "center", zIndex: 4, transitionDelay: "350ms", ...dateStyle.style }}>
        {timeLeft.hours}
      </div>
      <div className="reveal" style={{ position: "absolute", left: "173px", top: "138px", width: "83px", height: "13px", fontFamily: "'Cormorant Infant', serif", fontSize: "8px", fontWeight: 500, fontStyle: "normal", letterSpacing: "0.8px", lineHeight: "10px", textAlign: "center", color: "rgba(0, 147, 216, 1)", zIndex: 4, transitionDelay: "350ms" }}>
        Hours
      </div>
      <div className="reveal" style={{ position: "absolute", left: "239px", top: "116px", width: "168px", height: "18px", fontStyle: "normal", letterSpacing: "1.4px", lineHeight: "17px", textAlign: "center", zIndex: 4, transitionDelay: "400ms", ...dateStyle.style }}>
        {timeLeft.minutes}
      </div>
      <div className="reveal" style={{ position: "absolute", left: "281px", top: "138px", width: "83px", height: "13px", fontFamily: "'Cormorant Infant', serif", fontSize: "8px", fontWeight: 500, fontStyle: "normal", letterSpacing: "0.8px", lineHeight: "10px", textAlign: "center", color: "rgba(0, 147, 216, 1)", zIndex: 4, transitionDelay: "400ms" }}>
        Minutes
      </div>
    </section>
  );
};

/* =========================================================================
   BLOCK 5: THE CELEBRATIONS (Dynamic Events List with Floating/Swimming Waves)
   ========================================================================= */
const CelebrationsBlock = ({ timeline, overrides }) => {
  const events = (timeline && timeline.length > 0) ? timeline : [
    {
      title: "Outeya",
      titleAr: "الوطية",
      date: "2026-07-20",
      venue: "Haifa Palace",
      city: "Mornag",
      mapUrl: "https://maps.google.com/?q=Haifa+Palace+Mornag",
    },
    {
      title: "Mariage",
      titleAr: "العرس",
      date: "2026-07-20",
      venue: "Haifa Palace",
      city: "Mornag",
      mapUrl: "https://maps.google.com/?q=Haifa+Palace+Mornag",
    }
  ];

  const titleEn = getOverride(overrides, 'celeb-title', {
    position: "absolute", left: "131px", top: "0px", width: "168px", height: "34px", fontFamily: "'Antic Didone', serif", fontSize: "20px", fontWeight: 400, fontStyle: "normal", letterSpacing: "1px", lineHeight: "24px", textAlign: "center", color: BLUE
  }, "The Celebrations");

  const titleAr = getOverride(overrides, 'celeb-title-ar', {
    position: "absolute", left: "135px", top: "19px", width: "162px", height: "30px", fontFamily: "'Gulzar', serif", fontSize: "20px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "54px", textAlign: "center", color: BLUE
  }, "الليالي");

  const openMap = (url) => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  const secPosY = overrides?.['sec-celeb']?.posY || 0;
  const blockHeight = 90 + events.length * 427;

  return (
    <section id="block-celebrations" data-section-index="4" style={{ position: "relative", width: `${CANVAS_WIDTH}px`, height: `${blockHeight}px`, overflow: "hidden", transform: secPosY ? `translateY(${secPosY}px)` : undefined }}>
      <div className="reveal" style={{ ...titleEn.style, transitionDelay: "150ms" }}>{titleEn.text}</div>
      <div className="reveal" style={{ ...titleAr.style, transitionDelay: "200ms" }}>{titleAr.text}</div>

      {events.map((event, index) => {
        const d = parseDateDetails(event.date, { weekday: "Monday", day: "20", month: "July", year: "2026" });
        const cardY = 90 + index * 427;
        const isOdd = index % 2 === 1;

        return (
          <React.Fragment key={index}>
            <div className="reveal" style={{ ...figmaBox({ x: 54, y: cardY, width: 323, height: 383, zIndex: 2 }), backgroundColor: "#FFFFFF", borderRadius: "7px", border: "1.5px solid rgba(0, 147, 216, 1)", boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.25)", boxSizing: "border-box", transitionDelay: `${250 + index * 100}ms` }} />
            
            {/* Top Evil Eye with Wavy Floating Animation */}
            <div
              className="reveal"
              style={{
                ...figmaBox({ x: 328, y: cardY + 20, width: 143, height: 95, zIndex: 3 }),
                transitionDelay: `${300 + index * 100}ms`
              }}
            >
              <img
                src={isOdd ? evilEyeMariageTop : evilEyeOuteyaTop}
                alt=""
                className="celebration-decoration"
                style={{ width: "100%", height: "100%", animationDelay: `${index * 0.4}s` }}
                draggable="false"
              />
            </div>
            
            <div className="reveal" style={{ position: "absolute", left: "131px", top: `${cardY + 32}px`, width: "168px", height: "34px", fontFamily: "'Antic Didone', serif", fontSize: "22px", fontWeight: 400, fontStyle: "normal", letterSpacing: "1.1px", lineHeight: "26px", textAlign: "center", color: BLUE, zIndex: 4, transitionDelay: `${320 + index * 100}ms` }}>
              {event.title || (isOdd ? "Mariage" : "Outeya")}
            </div>
            <div className="reveal" style={{ position: "absolute", left: "135px", top: `${cardY + 52}px`, width: "162px", height: "30px", fontFamily: "'Gulzar', serif", fontSize: "20px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "54px", textAlign: "center", color: BLUE, zIndex: 4, transitionDelay: `${350 + index * 100}ms` }}>
              {event.titleAr || (isOdd ? "العرس" : "الوطية")}
            </div>

            <div className="reveal" style={{ position: "absolute", left: "90px", top: `${cardY + 134}px`, width: "108px", height: "25px", fontFamily: "'Cormorant Infant', serif", fontSize: "20px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "18px", textAlign: "center", color: "rgba(73, 96, 107, 1)", zIndex: 4, transitionDelay: `${400 + index * 100}ms` }}>
              {d.weekday}
            </div>
            <div className="reveal" style={{ position: "absolute", left: "181px", top: `${cardY + 124}px`, width: "66px", height: "25px", fontFamily: "'Cormorant Infant', serif", fontSize: "30px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "18px", textAlign: "center", color: "rgba(73, 96, 107, 1)", zIndex: 4, transitionDelay: `${400 + index * 100}ms` }}>
              {d.day}
            </div>
            <div className="reveal" style={{ position: "absolute", left: "232px", top: `${cardY + 133}px`, width: "108px", height: "25px", fontFamily: "'Cormorant Infant', serif", fontSize: "20px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "18px", textAlign: "center", color: "rgba(73, 96, 107, 1)", zIndex: 4, transitionDelay: `${400 + index * 100}ms` }}>
              {d.month}
            </div>
            <div className="reveal" style={{ position: "absolute", left: "176px", top: `${cardY + 149}px`, width: "77px", height: "25px", fontFamily: "'Cormorant Infant', serif", fontSize: "20px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "18px", textAlign: "center", color: "rgba(73, 96, 107, 1)", zIndex: 4, transitionDelay: `${400 + index * 100}ms` }}>
              {d.year}
            </div>

            <div className="reveal" style={{ ...figmaBox({ x: 111, y: cardY + 126, width: 67, height: 0.5, zIndex: 4 }), backgroundColor: "#000000", transitionDelay: `${420 + index * 100}ms` }} />
            <div className="reveal" style={{ ...figmaBox({ x: 253, y: cardY + 126, width: 67, height: 0.5, zIndex: 4 }), backgroundColor: "#000000", transitionDelay: `${420 + index * 100}ms` }} />
            <div className="reveal" style={{ ...figmaBox({ x: 111, y: cardY + 162, width: 67, height: 0.5, zIndex: 4 }), backgroundColor: "#000000", transitionDelay: `${420 + index * 100}ms` }} />
            <div className="reveal" style={{ ...figmaBox({ x: 253, y: cardY + 162, width: 67, height: 0.5, zIndex: 4 }), backgroundColor: "#000000", transitionDelay: `${420 + index * 100}ms` }} />

            {/* Bottom Evil Eye with Wavy Floating Animation */}
            <div
              className="reveal"
              style={{
                ...figmaBox({ x: -40, y: cardY + 164, width: 143, height: 95, zIndex: 3 }),
                transitionDelay: `${450 + index * 100}ms`
              }}
            >
              <img
                src={isOdd ? evilEyeMariageBottom : evilEyeOuteyaBottom}
                alt=""
                className="celebration-decoration"
                style={{ width: "100%", height: "100%", animationDelay: `${index * 0.4 + 0.5}s` }}
                draggable="false"
              />
            </div>

            <div className="reveal" style={{ position: "absolute", left: "121px", top: `${cardY + 194}px`, width: "188px", height: "52px", fontFamily: "'Cormorant', serif", fontSize: "12px", fontWeight: 400, fontStyle: "normal", letterSpacing: "1.2px", lineHeight: "14px", textAlign: "center", color: BLUE, textTransform: "uppercase", zIndex: 4, transitionDelay: `${480 + index * 100}ms` }}>
              <br />{event.venue || "Haifa Palace"}<br />{event.city || "Mornag"}
            </div>
            <div className="reveal" style={{ position: "absolute", left: "135px", top: `${cardY + 246}px`, width: "162px", height: "30px", fontFamily: "'Gulzar', serif", fontSize: "14px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "22px", textAlign: "center", color: BLUE, zIndex: 4, transitionDelay: `${500 + index * 100}ms` }}>
              هيفاء بالاص<br />مرناق
            </div>

            <button
              onClick={() => openMap(event.mapUrl)}
              className="reveal"
              style={{
                ...figmaBox({ x: 162, y: cardY + 309, width: 106, height: 40, zIndex: 5 }),
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E5E5",
                borderRadius: "7px",
                boxSizing: "border-box",
                cursor: "pointer",
                fontFamily: "'Cormorant', serif",
                fontSize: "12px",
                letterSpacing: "1.2px",
                color: "rgba(73, 96, 107, 1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transitionDelay: `${550 + index * 100}ms`
              }}
            >
              Open in maps
            </button>

            {/* Fish with Wavy Swimming Animation */}
            <div
              className="reveal"
              style={{
                ...figmaBox({ x: 343, y: cardY + 326, width: 57, height: 61, zIndex: 3 }),
                transitionDelay: `${580 + index * 100}ms`
              }}
            >
              <img
                src={isOdd ? fishMariage : fishOuteya}
                alt=""
                className="celebration-fish"
                style={{ width: "100%", height: "100%", animationDelay: `${index * 0.4 + 0.2}s` }}
                draggable="false"
              />
            </div>
          </React.Fragment>
        );
      })}
    </section>
  );
};

/* =========================================================================
   BLOCK 6: DRESS CODE (Height: 369px)
   ========================================================================= */
const DressCodeBlock = ({ dressCodeText, overrides }) => {
  const BLOCK_Y = 2568;

  const titleEn = getOverride(overrides, 'dress-title', {
    position: "absolute", left: "131px", top: "0px", width: "168px", height: "34px", fontFamily: "'Antic Didone', serif", fontSize: "20px", fontWeight: 400, fontStyle: "normal", letterSpacing: "1px", lineHeight: "24px", textAlign: "center", color: BLUE
  }, "Dress Code");

  const titleAr = getOverride(overrides, 'dress-title-ar', {
    position: "absolute", left: "134px", top: "20px", width: "162px", height: "30px", fontFamily: "'Gulzar', serif", fontSize: "20px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "54px", textAlign: "center", color: BLUE
  }, "التبديلة");

  const instructions = getOverride(overrides, 'dress-text', {
    position: "absolute", left: "95px", top: "286px", width: "241px", height: "41px", fontFamily: "'Cormorant', serif", fontSize: "12px", fontWeight: 400, fontStyle: "normal", letterSpacing: "1.2px", lineHeight: "18px", textAlign: "center", color: "rgba(73, 96, 107, 1)", display: "flex", flexDirection: "column", alignItems: "center"
  }, dressCodeText || "We Request Attending The Outeya With\nA Traditional Attire");

  const attireImg = overrides?.['dress-illustration']?.image || dressCodeAttire;
  const secPosY = overrides?.['sec-dress']?.posY || 0;

  return (
    <section id="block-dress-code" data-section-index="5" style={{ position: "relative", width: `${CANVAS_WIDTH}px`, height: "369px", overflow: "hidden", transform: secPosY ? `translateY(${secPosY}px)` : undefined }}>
      <div className="reveal" style={{ ...titleEn.style, transitionDelay: "150ms" }}>{titleEn.text}</div>
      <div className="reveal" style={{ ...titleAr.style, transitionDelay: "200ms" }}>{titleAr.text}</div>
      <img src={attireImg} alt="Attire" className="reveal" style={{ ...figmaBox({ x: 139, y: 2605 - BLOCK_Y, width: 153, height: 230 }), transitionDelay: "250ms" }} draggable="false" />
      <div className="reveal" style={{ ...instructions.style, transitionDelay: "300ms" }}>
        {typeof instructions.text === "string" ? instructions.text.split("\n").map((line, i) => (
          <span key={i} style={{ whiteSpace: "nowrap" }}>{line}</span>
        )) : instructions.text}
      </div>
    </section>
  );
};

/* =========================================================================
   BLOCK 7: PROGRAMME (Height: 430px)
   ========================================================================= */
const ProgrammeBlock = ({ programmeSteps, overrides, editable }) => {
  const BLOCK_Y = 2937;
  const [isActive, setIsActive] = useState(editable || false);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (editable) {
      setIsActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsActive(true);
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [editable]);

  const titleEn = getOverride(overrides, 'prog-title', {
    position: "absolute", left: "131px", top: "0px", width: "168px", height: "34px", fontFamily: "'Antic Didone', serif", fontSize: "20px", fontWeight: 400, fontStyle: "normal", letterSpacing: "1px", lineHeight: "24px", textAlign: "center", color: BLUE
  }, "Programme");

  const titleAr = getOverride(overrides, 'prog-title-ar', {
    position: "absolute", left: "134px", top: "20px", width: "162px", height: "30px", fontFamily: "'Gulzar', serif", fontSize: "20px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "54px", textAlign: "center", color: BLUE
  }, "البرنامج");

  const steps = (programmeSteps && programmeSteps.length >= 4) ? programmeSteps : [
    { time: "17:00", name: "Sdek" },
    { time: "18:00", name: "Reception" },
    { time: "20:00", name: "Dinner" },
    { time: "00:00", name: "Dance" }
  ];

  const secPosY = overrides?.['sec-prog']?.posY || 0;

  return (
    <section
      ref={sectionRef}
      id="block-programme"
      data-section-index="6"
      style={{
        position: "relative",
        width: `${CANVAS_WIDTH}px`,
        height: "430px",
        overflow: "hidden",
        transform: secPosY ? `translateY(${secPosY}px)` : undefined
      }}
    >
      <div className="reveal" style={{ ...titleEn.style, transitionDelay: "150ms" }}>{titleEn.text}</div>
      <div className="reveal" style={{ ...titleAr.style, transitionDelay: "200ms" }}>{titleAr.text}</div>

      {/* LINE SEGMENT 1 (Between Circle 1 and Circle 2) */}
      <div
        style={{
          position: "absolute",
          left: "203px",
          top: "123px",
          width: "1px",
          height: isActive ? "64px" : "0px",
          backgroundColor: "rgba(46, 136, 226, 1)",
          transition: "height 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.65s",
          zIndex: 1
        }}
      />

      {/* LINE SEGMENT 2 (Between Circle 2 and Circle 3) */}
      <div
        style={{
          position: "absolute",
          left: "203px",
          top: "200px",
          width: "1px",
          height: isActive ? "63px" : "0px",
          backgroundColor: "rgba(46, 136, 226, 1)",
          transition: "height 0.5s cubic-bezier(0.4, 0, 0.2, 1) 1.7s",
          zIndex: 1
        }}
      />

      {/* LINE SEGMENT 3 (Between Circle 3 and Circle 4) */}
      <div
        style={{
          position: "absolute",
          left: "203px",
          top: "276px",
          width: "1px",
          height: isActive ? "62px" : "0px",
          backgroundColor: "rgba(46, 136, 226, 1)",
          transition: "height 0.5s cubic-bezier(0.4, 0, 0.2, 1) 2.75s",
          zIndex: 1
        }}
      />

      {/* ================= STEP 1 (17:00 / Sdek) ================= */}
      {/* Circle 1 */}
      <div
        style={{
          ...figmaBox({ x: 197, y: 3047 - BLOCK_Y, width: 13, height: 13, zIndex: 3 }),
          opacity: isActive ? 1 : 0,
          transform: isActive ? "scale(1)" : "scale(0.3)",
          transition: "opacity 0.4s ease 0.1s, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.1s"
        }}
      >
        <WavyCircle percent={0} />
      </div>
      {/* Time 1 */}
      <div
        style={{
          position: "absolute",
          left: "131px",
          top: "110px",
          width: "54px",
          height: "60px",
          fontFamily: "'Cormorant Infant', serif",
          fontSize: "12px",
          fontWeight: 600,
          fontStyle: "normal",
          letterSpacing: "1.2px",
          lineHeight: "18px",
          textAlign: "left",
          color: "rgba(46, 136, 226, 1)",
          textTransform: "capitalize",
          zIndex: 3,
          opacity: isActive ? 1 : 0,
          transform: isActive ? "translateX(0)" : "translateX(-8px)",
          transition: "opacity 0.4s ease 0.35s, transform 0.4s ease 0.35s"
        }}
      >
        {steps[0]?.time || "17:00"}
      </div>
      {/* Icon 1 */}
      <img
        src={progIconSdek}
        alt=""
        style={{
          ...figmaBox({ x: 236, y: 3034 - BLOCK_Y, width: 37, height: 33, zIndex: 3 }),
          opacity: isActive ? 1 : 0,
          transform: isActive ? "translateX(0)" : "translateX(8px)",
          transition: "opacity 0.4s ease 0.35s, transform 0.4s ease 0.35s"
        }}
        draggable="false"
      />
      {/* Name 1 */}
      <div
        style={{
          position: "absolute",
          left: "219px",
          top: "135px",
          width: "71px",
          height: "21px",
          fontFamily: "'Cormorant', serif",
          fontSize: "12px",
          fontWeight: 400,
          fontStyle: "normal",
          letterSpacing: "1.2px",
          lineHeight: "18px",
          textAlign: "center",
          color: "rgba(73, 96, 107, 1)",
          textTransform: "capitalize",
          zIndex: 3,
          opacity: isActive ? 1 : 0,
          transform: isActive ? "translateX(0)" : "translateX(8px)",
          transition: "opacity 0.4s ease 0.35s, transform 0.4s ease 0.35s"
        }}
      >
        {steps[0]?.name || "Sdek"}
      </div>

      {/* ================= STEP 2 (18:00 / Reception) ================= */}
      {/* Circle 2 */}
      <div
        style={{
          ...figmaBox({ x: 197, y: 3124 - BLOCK_Y, width: 13, height: 13, zIndex: 3 }),
          opacity: isActive ? 1 : 0,
          transform: isActive ? "scale(1)" : "scale(0.3)",
          transition: "opacity 0.4s ease 1.15s, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) 1.15s"
        }}
      >
        <WavyCircle percent={0.35} />
      </div>
      {/* Time 2 */}
      <div
        style={{
          position: "absolute",
          left: "131px",
          top: "185px",
          width: "54px",
          height: "60px",
          fontFamily: "'Cormorant Infant', serif",
          fontSize: "12px",
          fontWeight: 600,
          fontStyle: "normal",
          letterSpacing: "1.2px",
          lineHeight: "18px",
          textAlign: "left",
          color: "rgba(46, 136, 226, 1)",
          textTransform: "capitalize",
          zIndex: 3,
          opacity: isActive ? 1 : 0,
          transform: isActive ? "translateX(0)" : "translateX(-8px)",
          transition: "opacity 0.4s ease 1.4s, transform 0.4s ease 1.4s"
        }}
      >
        {steps[1]?.time || "18:00"}
      </div>
      {/* Icon 2 */}
      <img
        src={progIconReception}
        alt=""
        style={{
          ...figmaBox({ x: 236, y: 3111 - BLOCK_Y, width: 37, height: 33, zIndex: 3 }),
          opacity: isActive ? 1 : 0,
          transform: isActive ? "translateX(0)" : "translateX(8px)",
          transition: "opacity 0.4s ease 1.4s, transform 0.4s ease 1.4s"
        }}
        draggable="false"
      />
      {/* Name 2 */}
      <div
        style={{
          position: "absolute",
          left: "219px",
          top: "208px",
          width: "71px",
          height: "21px",
          fontFamily: "'Cormorant', serif",
          fontSize: "12px",
          fontWeight: 400,
          fontStyle: "normal",
          letterSpacing: "1.2px",
          lineHeight: "18px",
          textAlign: "center",
          color: "rgba(73, 96, 107, 1)",
          textTransform: "capitalize",
          zIndex: 3,
          opacity: isActive ? 1 : 0,
          transform: isActive ? "translateX(0)" : "translateX(8px)",
          transition: "opacity 0.4s ease 1.4s, transform 0.4s ease 1.4s"
        }}
      >
        {steps[1]?.name || "Reception"}
      </div>

      {/* ================= STEP 3 (20:00 / Dinner) ================= */}
      {/* Circle 3 */}
      <div
        style={{
          ...figmaBox({ x: 197, y: 3200 - BLOCK_Y, width: 13, height: 13, zIndex: 3 }),
          opacity: isActive ? 1 : 0,
          transform: isActive ? "scale(1)" : "scale(0.3)",
          transition: "opacity 0.4s ease 2.2s, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) 2.2s"
        }}
      >
        <WavyCircle percent={0.70} />
      </div>
      {/* Time 3 */}
      <div
        style={{
          position: "absolute",
          left: "131px",
          top: "260px",
          width: "54px",
          height: "60px",
          fontFamily: "'Cormorant Infant', serif",
          fontSize: "12px",
          fontWeight: 600,
          fontStyle: "normal",
          letterSpacing: "1.2px",
          lineHeight: "18px",
          textAlign: "left",
          color: "rgba(46, 136, 226, 1)",
          textTransform: "capitalize",
          zIndex: 3,
          opacity: isActive ? 1 : 0,
          transform: isActive ? "translateX(0)" : "translateX(-8px)",
          transition: "opacity 0.4s ease 2.45s, transform 0.4s ease 2.45s"
        }}
      >
        {steps[2]?.time || "20:00"}
      </div>
      {/* Icon 3 */}
      <img
        src={progIconDinner}
        alt=""
        style={{
          ...figmaBox({ x: 236, y: 3182 - BLOCK_Y, width: 37, height: 33, zIndex: 3 }),
          opacity: isActive ? 1 : 0,
          transform: isActive ? "translateX(0)" : "translateX(8px)",
          transition: "opacity 0.4s ease 2.45s, transform 0.4s ease 2.45s"
        }}
        draggable="false"
      />
      {/* Name 3 */}
      <div
        style={{
          position: "absolute",
          left: "219px",
          top: "282px",
          width: "71px",
          height: "18px",
          fontFamily: "'Cormorant', serif",
          fontSize: "12px",
          fontWeight: 400,
          fontStyle: "normal",
          letterSpacing: "1.2px",
          lineHeight: "18px",
          textAlign: "center",
          color: "rgba(73, 96, 107, 1)",
          textTransform: "capitalize",
          zIndex: 3,
          opacity: isActive ? 1 : 0,
          transform: isActive ? "translateX(0)" : "translateX(8px)",
          transition: "opacity 0.4s ease 2.45s, transform 0.4s ease 2.45s"
        }}
      >
        {steps[2]?.name || "Dinner"}
      </div>

      {/* ================= STEP 4 (00:00 / Dance) ================= */}
      {/* Circle 4 */}
      <div
        style={{
          ...figmaBox({ x: 197, y: 3275 - BLOCK_Y, width: 13, height: 13, zIndex: 3 }),
          opacity: isActive ? 1 : 0,
          transform: isActive ? "scale(1)" : "scale(0.3)",
          transition: "opacity 0.4s ease 3.25s, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) 3.25s"
        }}
      >
        <WavyCircle percent={1.0} />
      </div>
      {/* Time 4 */}
      <div
        style={{
          position: "absolute",
          left: "131px",
          top: "335px",
          width: "54px",
          height: "60px",
          fontFamily: "'Cormorant Infant', serif",
          fontSize: "12px",
          fontWeight: 600,
          fontStyle: "normal",
          letterSpacing: "1.2px",
          lineHeight: "18px",
          textAlign: "left",
          color: "rgba(46, 136, 226, 1)",
          textTransform: "capitalize",
          zIndex: 3,
          opacity: isActive ? 1 : 0,
          transform: isActive ? "translateX(0)" : "translateX(-8px)",
          transition: "opacity 0.4s ease 3.5s, transform 0.4s ease 3.5s"
        }}
      >
        {steps[3]?.time || "00:00"}
      </div>
      {/* Icon 4 */}
      <img
        src={progIconDance}
        alt=""
        style={{
          ...figmaBox({ x: 236, y: 3254 - BLOCK_Y, width: 37, height: 33, zIndex: 3 }),
          opacity: isActive ? 1 : 0,
          transform: isActive ? "translateX(0)" : "translateX(8px)",
          transition: "opacity 0.4s ease 3.5s, transform 0.4s ease 3.5s"
        }}
        draggable="false"
      />
      {/* Name 4 */}
      <div
        style={{
          position: "absolute",
          left: "219px",
          top: "355px",
          width: "71px",
          height: "18px",
          fontFamily: "'Cormorant', serif",
          fontSize: "12px",
          fontWeight: 400,
          fontStyle: "normal",
          letterSpacing: "1.2px",
          lineHeight: "18px",
          textAlign: "center",
          color: "rgba(73, 96, 107, 1)",
          textTransform: "capitalize",
          zIndex: 3,
          opacity: isActive ? 1 : 0,
          transform: isActive ? "translateX(0)" : "translateX(8px)",
          transition: "opacity 0.4s ease 3.5s, transform 0.4s ease 3.5s"
        }}
      >
        {steps[3]?.name || "Dance"}
      </div>
    </section>
  );
};

/* =========================================================================
   BLOCK 8: RSVP SECTION (Height: 490px)
   ========================================================================= */
const RsvpBlock = ({ onSubmitRsvp, overrides }) => {
  const BLOCK_Y = 3367;
  const [formData, setFormData] = useState({ name: "", sirName: "", email: "", guests: "1" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const titleEn = getOverride(overrides, 'rsvp-title', {
    position: "absolute", left: "131px", top: "0px", width: "168px", height: "34px", fontFamily: "'Antic Didone', serif", fontSize: "20px", fontWeight: 400, fontStyle: "normal", letterSpacing: "1px", lineHeight: "24px", textAlign: "center", color: BLUE
  }, "RSVP");

  const subtitle = getOverride(overrides, 'rsvp-form', {
    position: "absolute", left: "55px", top: "39px", width: "320px", height: "41px", fontFamily: "'Cormorant', serif", fontSize: "12px", fontWeight: 400, fontStyle: "normal", letterSpacing: "1.2px", lineHeight: "18px", textAlign: "center", color: "rgba(73, 96, 107, 1)", display: "flex", flexDirection: "column", alignItems: "center"
  }, "The Favour Of A Reply Is Kindly\nRequested By The Fifteenth Of June, 2026");

  const secPosY = overrides?.['sec-rsvp']?.posY || 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      if (onSubmitRsvp) onSubmitRsvp(formData);
    }, 800);
  };

  return (
    <section id="block-rsvp" data-section-index="7" style={{ position: "relative", width: `${CANVAS_WIDTH}px`, height: "490px", overflow: "hidden", transform: secPosY ? `translateY(${secPosY}px)` : undefined }}>
      <div className="reveal" style={{ ...titleEn.style, transitionDelay: "150ms" }}>{titleEn.text}</div>
      <div className="reveal" style={{ ...subtitle.style, transitionDelay: "200ms" }}>
        {typeof subtitle.text === "string" ? subtitle.text.split("\n").map((line, i) => (
          <span key={i} style={{ whiteSpace: "nowrap" }}>{line}</span>
        )) : subtitle.text}
      </div>

      {submitted ? (
        <div className="reveal" style={{ ...figmaBox({ x: 16, y: 120, width: 398, height: 260, zIndex: 5 }), backgroundColor: "#FFFFFF", borderRadius: "12px", border: `1px solid ${BLUE}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", textAlign: "center", transitionDelay: "250ms" }}>
          <div style={{ fontFamily: "'Antic Didone', serif", fontSize: "22px", color: BLUE, marginBottom: "8px" }}>
            Thank You!
          </div>
          <div style={{ fontFamily: "'Cormorant', serif", fontSize: "16px", color: "rgba(73, 96, 107, 1)" }}>
            Your confirmation has been received. We look forward to celebrating with you!
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="reveal" style={{ position: "absolute", left: "16px", top: "108px", width: "50px", height: "14px", fontFamily: "'Cormorant', serif", fontSize: "14px", fontWeight: 700, fontStyle: "normal", letterSpacing: "0px", lineHeight: "17px", textAlign: "left", color: "rgba(73, 96, 107, 1)", transitionDelay: "250ms" }}>
            Name
          </div>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="reveal"
            style={{ ...figmaBox({ x: 16, y: 3494 - BLOCK_Y, width: 398, height: 40, zIndex: 3 }), backgroundColor: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "7px", padding: "0 12px", fontFamily: "'Cormorant', serif", fontSize: "14px", boxSizing: "border-box", outline: "none", transitionDelay: "250ms" }}
          />

          <div className="reveal" style={{ position: "absolute", left: "16px", top: "182px", width: "53px", height: "14px", fontFamily: "'Cormorant', serif", fontSize: "14px", fontWeight: 700, fontStyle: "normal", letterSpacing: "0px", lineHeight: "17px", textAlign: "left", color: "rgba(73, 96, 107, 1)", transitionDelay: "300ms" }}>
            Sir Name
          </div>
          <input
            type="text"
            value={formData.sirName}
            onChange={(e) => setFormData({ ...formData, sirName: e.target.value })}
            className="reveal"
            style={{ ...figmaBox({ x: 16, y: 3568 - BLOCK_Y, width: 398, height: 40, zIndex: 3 }), backgroundColor: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "7px", padding: "0 12px", fontFamily: "'Cormorant', serif", fontSize: "14px", boxSizing: "border-box", outline: "none", transitionDelay: "300ms" }}
          />

          <div className="reveal" style={{ position: "absolute", left: "16px", top: "257px", width: "50px", height: "14px", fontFamily: "'Cormorant', serif", fontSize: "14px", fontWeight: 700, fontStyle: "normal", letterSpacing: "0px", lineHeight: "17px", textAlign: "left", color: "rgba(73, 96, 107, 1)", transitionDelay: "350ms" }}>
            Email
          </div>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="reveal"
            style={{ ...figmaBox({ x: 16, y: 3643 - BLOCK_Y, width: 398, height: 40, zIndex: 3 }), backgroundColor: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "7px", padding: "0 12px", fontFamily: "'Cormorant', serif", fontSize: "14px", boxSizing: "border-box", outline: "none", transitionDelay: "350ms" }}
          />

          <div className="reveal" style={{ position: "absolute", left: "16px", top: "331px", width: "128px", height: "14px", fontFamily: "'Cormorant', serif", fontSize: "14px", fontWeight: 700, fontStyle: "normal", letterSpacing: "0px", lineHeight: "17px", textAlign: "left", color: "rgba(73, 96, 107, 1)", transitionDelay: "400ms" }}>
            Number of guests
          </div>
          <input
            type="number"
            min="1"
            max="10"
            value={formData.guests}
            onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
            className="reveal"
            style={{ ...figmaBox({ x: 16, y: 3717 - BLOCK_Y, width: 398, height: 40, zIndex: 3 }), backgroundColor: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "7px", padding: "0 12px", fontFamily: "'Cormorant', serif", fontSize: "14px", boxSizing: "border-box", outline: "none", transitionDelay: "400ms" }}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="reveal"
            style={{
              ...figmaBox({ x: 16, y: 3787 - BLOCK_Y, width: 398, height: 40, zIndex: 3 }),
              backgroundColor: BLUE,
              borderRadius: "7px",
              border: "none",
              cursor: isSubmitting ? "wait" : "pointer",
              fontFamily: "'Cormorant', serif",
              fontSize: "14px",
              fontWeight: 400,
              letterSpacing: "0px",
              textAlign: "center",
              color: "rgba(255, 255, 255, 1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              outline: "none",
              transitionDelay: "450ms"
            }}
          >
            {isSubmitting ? "Sending..." : "Send Confirmation"}
          </button>
        </form>
      )}
    </section>
  );
};

/* =========================================================================
   BLOCK 9: FOOTER SECTION (Height: 160px)
   ========================================================================= */
const FooterBlock = ({ initials, overrides }) => {
  const BLOCK_Y = 3857;

  const footerInitialsGroup = getOverride(overrides, 'footer-initials', {
    position: "absolute", left: "188px", top: "0px", width: "37px", height: "57px", zIndex: 3
  }, "");

  const init1 = getOverride(overrides, 'footer-initial-1', {
    position: "absolute", left: "-1px", top: "4px", width: "32px", height: "29px", fontFamily: "'Antic Didone', serif", fontSize: "24px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "32px", textAlign: "center", color: BLUE, zIndex: 3
  }, initials.initial1);

  const init2 = getOverride(overrides, 'footer-initial-2', {
    position: "absolute", left: "4px", top: "23px", width: "32px", height: "29px", fontFamily: "'Antic Didone', serif", fontSize: "24px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "32px", textAlign: "center", color: BLUE, zIndex: 3
  }, initials.initial2);

  const closingText = getOverride(overrides, 'footer-arabic', {
    position: "absolute", left: "125px", top: "67px", width: "162px", height: "26px", fontFamily: "'Gulzar', serif", fontSize: "18px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "49px", textAlign: "center", color: BLUE
  }, "ان شاء الله ليلتكم زينة");

  const secPosY = overrides?.['sec-footer']?.posY || 0;

  return (
    <section id="block-footer" data-section-index="8" style={{ position: "relative", width: `${CANVAS_WIDTH}px`, height: "160px", overflow: "hidden", transform: secPosY ? `translateY(${secPosY}px)` : undefined }}>
      {/* Initials Oval Circle & Letters (Group Container) */}
      <div className="reveal" style={{ ...footerInitialsGroup.style, transitionDelay: "150ms" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: "37px", height: "57px", borderRadius: "20px", border: `1px solid ${BLUE}`, boxSizing: "border-box" }} />
        <div style={init1.style}>{init1.text}</div>
        <div style={init2.style}>{init2.text}</div>
      </div>

      {/* Closing Arabic Text */}
      <div className="reveal" style={{ ...closingText.style, transitionDelay: "250ms" }}>{closingText.text}</div>

      {/* Small Closing Ornament with Float Animation */}
      <div style={{ ...figmaBox({ x: 192, y: 3964 - BLOCK_Y, width: 29, height: 12 }), pointerEvents: "none" }}>
        <img src={closingSmallOrnament} alt="" className="celebration-decoration" style={{ width: "100%", height: "100%", animationDelay: "0.2s" }} draggable="false" />
      </div>
    </section>
  );
};

/* =========================================================================
   MAIN COMPONENT: SIDI BOU SAID DIGITAL INVITATION PAGE (PRODUCTION ENGINE)
   ========================================================================= */
export default function SidiBouSaidInvitePage({ invite, editable = false }) {
  const currentInvite = invite || templateConfig.sample;

  const { partner1, partner2 } = useMemo(() => {
    if (!currentInvite.coupleNames) return { partner1: "Sarah", partner2: "Hedi" };
    const parts = currentInvite.coupleNames.split(/&|and|\+/i).map((s) => s.trim());
    return {
      partner1: parts[0] || "Sarah",
      partner2: parts[1] || "Hedi",
    };
  }, [currentInvite.coupleNames]);

  const initials = useMemo(() => ({
    initial1: partner1 ? partner1.charAt(0).toUpperCase() : "S",
    initial2: partner2 ? partner2.charAt(0).toUpperCase() : "H",
  }), [partner1, partner2]);

  const dateDetails = useMemo(() => parseDateDetails(currentInvite.eventDate, { weekday: "Monday", day: "20", month: "July", year: "2026", monthNum: "07", yearShort: "26" }), [currentInvite.eventDate]);

  const bgColor = currentInvite.backgroundColor || "#DCEBF0";
  const overrides = currentInvite.styleOverrides || {};

  // Compute total canvas height based on dynamic celebration event cards
  const eventsCount = currentInvite.timeline?.length || 2;
  const celebrationsHeight = 90 + eventsCount * 427;
  const totalCanvasHeight = 708 + 316 + 357 + 243 + celebrationsHeight + 369 + 430 + 490 + 160;

  // Responsive mobile scaling hook
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);

  useEffect(() => {
    if (editable) {
      setScale(1);
      return;
    }
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth < CANVAS_WIDTH) {
        setScale(windowWidth / CANVAS_WIDTH);
      } else {
        setScale(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [editable]);

  const handleScrollDown = () => {
    const revealEl = document.getElementById("block-reveal");
    if (revealEl) {
      revealEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleRsvpSubmit = (formData) => {
    console.log("RSVP Submitted for:", currentInvite.coupleNames, formData);
  };

  // Animation configuration
  const animType = currentInvite.animationType || "fade-up";
  const animDuration = currentInvite.animationDuration || 1.2;

  // IntersectionObserver for scroll-reveal animation
  useEffect(() => {
    if (editable || animType === "none") {
      const els = document.querySelectorAll(".reveal");
      els.forEach((el) => el.classList.add("revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" }
    );

    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [animType, currentInvite, editable]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: editable ? bgColor : "#2B3544",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: editable || scale < 1 ? "0" : "24px 0",
        fontFamily: "'Urbanist', sans-serif",
        overflowX: "hidden",
      }}
    >
      <style>{`
        .reveal {
          opacity: ${editable || animType === "none" ? "1" : "0"};
          transition: opacity ${animDuration}s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity;
        }
        .reveal.revealed {
          opacity: 1 !important;
        }

        /* Continuous Wavy Liquid Animation for Programme Dots */
        @keyframes waveFlow {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .wavy-liquid-svg {
          animation: waveFlow 1.6s linear infinite !important;
        }

        /* Evil Eyes Floating Sway Animation */
        @keyframes celebration-float {
          0% {
            transform: translate3d(0, 0px, 0) rotate(-1.5deg);
          }
          50% {
            transform: translate3d(0, -9px, 0) rotate(2deg);
          }
          100% {
            transform: translate3d(0, 7px, 0) rotate(-1deg);
          }
        }
        .celebration-decoration {
          pointer-events: none;
          will-change: transform;
          animation: celebration-float 3.5s ease-in-out infinite alternate !important;
          display: block;
        }

        /* Fish Swimming Wiggle Animation */
        @keyframes celebration-swim {
          0% {
            transform: translate3d(0, 0, 0) rotate(-2deg);
          }
          33% {
            transform: translate3d(-6px, -7px, 0) rotate(3deg);
          }
          66% {
            transform: translate3d(5px, 6px, 0) rotate(-2.5deg);
          }
          100% {
            transform: translate3d(0, 0, 0) rotate(-2deg);
          }
        }
        .celebration-fish {
          pointer-events: none;
          will-change: transform;
          animation: celebration-swim 2.6s ease-in-out infinite !important;
          display: block;
        }
      `}</style>

      {/* Background Music Audio Player */}
      <AudioPlayer src={currentInvite.musicUrl} active={Boolean(currentInvite.musicUrl)} />

      <div
        ref={containerRef}
        style={{
          width: `${CANVAS_WIDTH}px`,
          height: `${totalCanvasHeight * scale}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          transition: "transform 0.15s ease-out",
        }}
      >
        <div
          style={{
            position: "relative",
            width: `${CANVAS_WIDTH}px`,
            height: `${totalCanvasHeight}px`,
            backgroundColor: bgColor,
            boxShadow: editable || scale < 1 ? "none" : "0 20px 60px rgba(0,0,0,0.35)",
            borderRadius: editable || scale < 1 ? "0" : "8px",
            overflow: "hidden",
          }}
        >
          {/* Falling Petals Effect using ParticleEmitter */}
          {currentInvite.enablePetals !== false && (
            <ParticleEmitter
              type="petals"
              count={currentInvite.petalsIntensity || 30}
              active={true}
            />
          )}

          <HeroBlock
            partner1={partner1}
            partner2={partner2}
            initials={initials}
            month={dateDetails.month}
            year={dateDetails.year}
            subtitle={currentInvite.welcomeSubtitle}
            overrides={overrides}
            onScrollDown={handleScrollDown}
          />
          <RevealBlock dateDetails={dateDetails} overrides={overrides} />
          <StoryBlock
            customPhoto={currentInvite.storyPhoto}
            storyQuote={currentInvite.ourStoryQuote || currentInvite.quote}
            overrides={overrides}
          />
          <CountdownBlock targetDate={currentInvite.eventDate} overrides={overrides} />
          <CelebrationsBlock timeline={currentInvite.timeline} overrides={overrides} />
          <DressCodeBlock dressCodeText={currentInvite.dressCodeText} overrides={overrides} />
          <ProgrammeBlock programmeSteps={currentInvite.programmeSteps} overrides={overrides} editable={editable} />
          <RsvpBlock onSubmitRsvp={handleRsvpSubmit} overrides={overrides} />
          <FooterBlock initials={initials} overrides={overrides} />
        </div>
      </div>
    </div>
  );
}
