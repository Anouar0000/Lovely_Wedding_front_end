import React, { useState } from "react";
import CelestialMoonSunReveal from "../components/animations/CelestialMoonSunReveal";
import CelestialOrbit from "../components/animations/CelestialOrbit";
import blackEnvelope from "../assets/digital/celestial/black-enveloppe.png";
import sunIcon from "../assets/digital/celestial/sun-icon.svg";
import ParticleEmitter from "../components/animations/ParticleEmitter";

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
import fullReferenceImg from "../assets/digital/celestial/celestial-reference.png";

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

// Colors
const COLOR_WHITE = "#FFFFFF";
const COLOR_BLACK = "#000000";
const COLOR_SAND = "#ECE5DF";

// Typography
const FONT_ROSARIO = "'Rosario', sans-serif";

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

export default function CelestialFigmaMirror() {
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [isDiffMode, setIsDiffMode] = useState(false);
  const [selectedAttend, setSelectedAttend] = useState("yes");
  const [isMoonJoined, setIsMoonJoined] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#1E293B",
        padding: "32px 0 80px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* 430px Canvas Container */}
      <div
        id="celestial-canvas-root"
        style={{
          position: "relative",
          width: `${CANVAS_WIDTH}px`,
          height: `${CANVAS_HEIGHT}px`,
          backgroundColor: COLOR_WHITE,
          overflow: "hidden",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* =========================================================================
            LAYER 0: GLOBAL BACKGROUNDS
            ========================================================================= */}
        {/* Top Hero BG (y: 0 to 474) */}
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

        {/* Bottom Footer BG (y: 4130 to 4604) */}
        <img
          src={heroBg}
          alt=""
          style={figmaBox({
            x: 0,
            y: 4130,
            width: 430,
            height: 474,
            zIndex: 1,
            extra: { objectFit: "cover", filter: "grayscale(100%)" },
          })}
        />

        {/* Falling Celestial Sparkles Effect */}
        <ParticleEmitter
          type="sparkles"
          count={250}
          color="#E0E7FF"
          active={true}
          style={{ zIndex: 7 }}
        />

        {/* =========================================================================
            SECTION 1: HERO & ENVELOPE (y: 0 - 474)
            ========================================================================= */}
        {/* Black Envelope (y: -81, x: 89, 253 x 450) */}
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

        {/* Names on Card: "JONATHAN\n&\nMARRISAH" (y: 157, x: 104, 223 x 107) */}
        <div
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
            },
          })}
        >
          <img
            src={heroNamesSvg}
            alt="Jonathan & Marrisah"
            style={{ width: 106, height: 64, display: "block" }}
          />
        </div>

        {/* Star Icon Vector on Envelope Flap (y: 320, x: 200, 30 x 30) */}
        <img
          src={sunIcon}
          alt=""
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
        {/* Arched Beige Background (y: 474, x: -2, 433.44 x 609.88) */}
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

        {/* Couple Story Portrait (y: 512, x: 156, 121 x 205, borderRadius: 50px) */}
        <div
          style={figmaBox({
            x: 156,
            y: 512,
            width: 121,
            height: 205,
            zIndex: 2,
            extra: {
              borderRadius: "50px",
              overflow: "hidden",
            },
          })}
        >
          <img
            src={storyPhoto}
            alt="Couple"
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%)" }}
          />
        </div>

        {/* "Our Story" Title (y: 727, x: 69, 293 x 52) */}
        <div
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
            },
          })}
        >
          <img
            src={ourStoryTitleSvg}
            alt="OUR STORY"
            style={{ width: 178, height: 26, display: "block" }}
          />
        </div>

        {/* Subtitle: "To celebrate their wedding ceremony" (y: 784, x: 104, 223 x 40) */}
        <div
          style={figmaBox({
            x: 104,
            y: 784,
            width: 223,
            height: 40,
            zIndex: 2,
            extra: {
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
            },
          })}
        >
          {"To celebrate their\nwedding ceremony"}
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
        {/* "Reveal" Title (y: 1122, x: 69, 293 x 52) */}
        <div
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
            },
          })}
        >
          <img
            src={revealTitleSvg}
            alt="REVEAL"
            style={{ width: 120, height: 25, display: "block" }}
          />
        </div>

        {/* "Join the moon  to the sun.." (y: 1183, x: 104, 223 x 40) */}
        <div
          style={figmaBox({
            x: 104,
            y: 1183,
            width: 223,
            height: 40,
            zIndex: 6,
            extra: {
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
            },
          })}
        >
          {"Join the moon  to the\nsun.."}
        </div>

        {/* Moon to Sun Arc (y: 1194, x: 43, 359 x 189) */}
        <CelestialMoonSunReveal
          onJoinChange={setIsMoonJoined}
          style={figmaBox({
            x: 43,
            y: 1194,
            width: 359,
            height: 189,
            zIndex: 6,
          })}
        />

        {/* Date: "10 . 10 .2026" (y: 1332, x: 104, 223 x 52) */}
        <div
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
              opacity: isMoonJoined ? 1 : 0,
              transform: isMoonJoined
                ? "translateY(0px) scale(1)"
                : "translateY(14px) scale(0.95)",
              filter: isMoonJoined
                ? "drop-shadow(0 0 10px rgba(232, 204, 51, 0.45))"
                : "none",
              transition:
                "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s ease",
              pointerEvents: isMoonJoined ? "auto" : "none",
            },
          })}
        >
          <img
            src={dateSvg}
            alt="10 . 10 .2026"
            style={{ width: 188, height: 21, display: "block" }}
          />
        </div>

        {/* =========================================================================
            SECTION 4: VENUE (y: 1400 - 2094)
            ========================================================================= */}
        {/* "Venue" Title (y: 1435, x: 69, 293 x 52) */}
        <div
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
            },
          })}
        >
          <img
            src={venueTitleSvg}
            alt="VENUE"
            style={{ width: 100, height: 25, display: "block" }}
          />
        </div>

        {/* Address: "Kobbet Ennhas Manouba" (y: 1504, x: 104, 223 x 40) */}
        <div
          style={figmaBox({
            x: 104,
            y: 1504,
            width: 223,
            height: 40,
            zIndex: 3,
            extra: {
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
            },
          })}
        >
          {"Kobbet Ennhas\nManouba"}
        </div>

        {/* Venue Door Line Art (y: 1560, x: 118, 195 x 349) */}
        <img
          src={venueDoor}
          alt="Venue Illustration"
          style={figmaBox({
            x: 118,
            y: 1560,
            width: 195,
            height: 349,
            zIndex: 3,
            extra: { objectFit: "contain", filter: "grayscale(100%)" },
          })}
        />

        {/* Time: "19:00 - 21:00" (y: 1909, x: 64, 302 x 40) */}
        <div
          style={figmaBox({
            x: 64,
            y: 1909,
            width: 302,
            height: 40,
            zIndex: 3,
            extra: {
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
            },
          })}
        >
          19:00 - 21:00
        </div>

        {/* Button Pill: Open in maps (y: 1975, x: 104, 219 x 53) */}
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
        <div
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
              cursor: "pointer",
            },
          })}
        >
          Open in maps
        </div>

        {/* =========================================================================
            SECTION 5: PROGRAMME (y: 2094 - 3033)
            ========================================================================= */}
        {/* Rounded Beige Pill Container (y: 2094, x: -2, 434 x 939, borderRadius: 217px) */}
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

        {/* "programme" Title (y: 2192, x: 69, 293 x 52) */}
        <div
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
            },
          })}
        >
          <img
            src={programmeTitleSvg}
            alt="PROGRAMME"
            style={{ width: 194, height: 26, display: "block" }}
          />
        </div>

        {/* Timeline Items */}
        {/* Item 1: 19:00 Accueil */}
        <img
          src={progIcon1}
          alt=""
          style={figmaBox({
            x: 201,
            y: 2287,
            width: 30,
            height: 30,
            zIndex: 3,
            extra: { pointerEvents: "none" },
          })}
        />
        <div
          style={figmaBox({
            x: 133,
            y: 2327,
            width: 166,
            height: 40,
            zIndex: 3,
            extra: {
              fontFamily: FONT_ROSARIO,
              fontWeight: 700,
              fontSize: "12px",
              lineHeight: "20px",
              letterSpacing: "0.3333em",
              textAlign: "center",
              color: COLOR_BLACK,
              whiteSpace: "pre-line",
            },
          })}
        >
          {"19:00\nAccueil"}
        </div>

        {/* Item 2: 19:15 Contrat */}
        <img
          src={progIcon2}
          alt=""
          style={figmaBox({
            x: 201,
            y: 2417,
            width: 30,
            height: 30,
            zIndex: 3,
            extra: { pointerEvents: "none" },
          })}
        />
        <div
          style={figmaBox({
            x: 133,
            y: 2457,
            width: 166,
            height: 40,
            zIndex: 3,
            extra: {
              fontFamily: FONT_ROSARIO,
              fontWeight: 700,
              fontSize: "12px",
              lineHeight: "20px",
              letterSpacing: "0.3333em",
              textAlign: "center",
              color: COLOR_BLACK,
              whiteSpace: "pre-line",
            },
          })}
        >
          {"19:15\nContrat"}
        </div>

        {/* Item 3: 19:45 Réception */}
        <img
          src={progIcon3}
          alt=""
          style={figmaBox({
            x: 201,
            y: 2547,
            width: 30,
            height: 30,
            zIndex: 3,
            extra: { pointerEvents: "none" },
          })}
        />
        <div
          style={figmaBox({
            x: 133,
            y: 2587,
            width: 166,
            height: 40,
            zIndex: 3,
            extra: {
              fontFamily: FONT_ROSARIO,
              fontWeight: 700,
              fontSize: "12px",
              lineHeight: "20px",
              letterSpacing: "0.3333em",
              textAlign: "center",
              color: COLOR_BLACK,
              whiteSpace: "pre-line",
            },
          })}
        >
          {"19:45\nRéception"}
        </div>

        {/* Item 4: 20:30 Photos */}
        <img
          src={progIcon4}
          alt=""
          style={figmaBox({
            x: 201,
            y: 2677,
            width: 30,
            height: 30,
            zIndex: 3,
            extra: { pointerEvents: "none" },
          })}
        />
        <div
          style={figmaBox({
            x: 133,
            y: 2717,
            width: 166,
            height: 40,
            zIndex: 3,
            extra: {
              fontFamily: FONT_ROSARIO,
              fontWeight: 700,
              fontSize: "12px",
              lineHeight: "20px",
              letterSpacing: "0.3333em",
              textAlign: "center",
              color: COLOR_BLACK,
              whiteSpace: "pre-line",
            },
          })}
        >
          {"20:30\nPhotos"}
        </div>

        {/* Item 5: 21:00 Fin */}
        <img
          src={progIcon5}
          alt=""
          style={figmaBox({
            x: 201,
            y: 2807,
            width: 30,
            height: 30,
            zIndex: 3,
            extra: { pointerEvents: "none" },
          })}
        />
        <div
          style={figmaBox({
            x: 133,
            y: 2847,
            width: 166,
            height: 40,
            zIndex: 3,
            extra: {
              fontFamily: FONT_ROSARIO,
              fontWeight: 700,
              fontSize: "12px",
              lineHeight: "20px",
              letterSpacing: "0.3333em",
              textAlign: "center",
              color: COLOR_BLACK,
              whiteSpace: "pre-line",
            },
          })}
        >
          {"21:00\nFin"}
        </div>

        {/* =========================================================================
            SECTION 6: PRINCIPLES & CONSTELLATIONS (y: 3033 - 3716)
            ========================================================================= */}
        {/* "principles" Title (y: 3083, x: 69, 293 x 52) */}
        <div
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
            },
          })}
        >
          <img
            src={principlesTitleSvg}
            alt="PRINCIPLES"
            style={{ width: 172, height: 26, display: "block" }}
          />
        </div>

        {/* Paragraph 1 (y: 3165, x: 103, 225 x 261) */}
        <div
          style={figmaBox({
            x: 103,
            y: 3165,
            width: 225,
            height: 261,
            zIndex: 3,
            extra: {
              fontFamily: FONT_ROSARIO,
              fontWeight: 700,
              fontSize: "12px",
              lineHeight: "24px",
              letterSpacing: "0.3333em",
              textAlign: "center",
              color: COLOR_WHITE,
            },
          })}
        >
          Voluptatum non fugiat qui ab non. At ut quasi dolorum numquam voluptas rerum qui. Non rem sunt fugiat numquam molestiae vero dolores dolores. Dolor ut sit quos accusantium vitae aliquid ducimus
        </div>

        {/* Paragraph 2 (y: 3427, x: 103, 225 x 115) */}
        <div
          style={figmaBox({
            x: 103,
            y: 3427,
            width: 225,
            height: 115,
            zIndex: 3,
            extra: {
              fontFamily: FONT_ROSARIO,
              fontWeight: 700,
              fontSize: "12px",
              lineHeight: "24px",
              letterSpacing: "0.3333em",
              textAlign: "center",
              color: COLOR_WHITE,
            },
          })}
        >
          Voluptatum non fugiat qui ab non. At ut quasi dolorum numquam voluptas rerum qui.
        </div>

        {/* Constellations */}
        {/* 1 1: y: 3186, x: -52, 138 x 97 */}
        <img
          src={constellation1_1}
          alt=""
          style={figmaBox({
            x: -52,
            y: 3186,
            width: 138,
            height: 97,
            zIndex: 3,
            extra: { pointerEvents: "none" },
          })}
        />
        {/* 2 1: y: 3224, x: 343, 117 x 103 */}
        <img
          src={constellation2_1}
          alt=""
          style={figmaBox({
            x: 343,
            y: 3224,
            width: 117,
            height: 103,
            zIndex: 3,
            extra: { pointerEvents: "none" },
          })}
        />
        {/* 1 2: y: 3461, x: -69, 153 x 168.01 */}
        <img
          src={constellation1_2}
          alt=""
          style={figmaBox({
            x: -69,
            y: 3461,
            width: 153,
            height: 168,
            zIndex: 3,
            extra: { pointerEvents: "none" },
          })}
        />
        {/* 3 1: y: 3506, x: 368, 123 x 107 */}
        <img
          src={constellation3_1}
          alt=""
          style={figmaBox({
            x: 368,
            y: 3506,
            width: 123,
            height: 107,
            zIndex: 3,
            extra: { pointerEvents: "none" },
          })}
        />

        {/* Holding Hands Graphic (y: 3572, x: 188, 54 x 98) */}
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

        {/* =========================================================================
            SECTION 7: RSVP (y: 3716 - 4425)
            ========================================================================= */}
        {/* Rounded Beige Pill Container (y: 3716, x: -2, 434 x 709, borderRadius: 217px) */}
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

        {/* "RSVP" Title (y: 3786, x: 69, 293 x 52) */}
        <div
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
            },
          })}
        >
          <img
            src={rsvpTitleSvg}
            alt="RSVP"
            style={{ width: 72, height: 26, display: "block" }}
          />
        </div>

        {/* "Will you attend" Label (y: 3897, x: 55, 152 x 17) */}
        <div
          style={figmaBox({
            x: 55,
            y: 3897,
            width: 152,
            height: 17,
            zIndex: 3,
            extra: {
              fontFamily: FONT_ROSARIO,
              fontWeight: 400,
              fontSize: "14px",
              letterSpacing: "0.2857em",
              textAlign: "left",
              color: COLOR_BLACK,
            },
          })}
        >
          Will you attend
        </div>

        {/* Radio Option 1: "Yes, I will be there" */}
        {/* Ellipse (y: 3936, x: 55, 14 x 14) */}
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
              backgroundImage: selectedAttend === "yes"
                ? `radial-gradient(circle at center, ${COLOR_BLACK} 4px, transparent 5px)`
                : "none",
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
        {/* Ellipse (y: 3936, x: 216, 14 x 14) */}
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

        {/* Input Field 1: Name (y: 3982, x: 55, 320 x 70) */}
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
            <span
              style={{
                fontFamily: FONT_ROSARIO,
                fontWeight: 400,
                fontSize: "14px",
                letterSpacing: "0.2857em",
                color: COLOR_BLACK,
              }}
            >
              Name{" "}
            </span>
          </div>
        </div>

        {/* Input Field 2: Password (y: 4052, x: 55, 320 x 70) */}
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
            <span
              style={{
                fontFamily: FONT_ROSARIO,
                fontWeight: 400,
                fontSize: "14px",
                letterSpacing: "0.2857em",
                color: COLOR_BLACK,
              }}
            >
              Password
            </span>
          </div>
        </div>

        {/* Input Field 3: Phone Number (y: 4122, x: 55, 320 x 70) */}
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
            <span
              style={{
                fontFamily: FONT_ROSARIO,
                fontWeight: 400,
                fontSize: "14px",
                letterSpacing: "0.2857em",
                color: COLOR_BLACK,
              }}
            >
              Phone Number
            </span>
          </div>
        </div>

        {/* Input Field 4: Number of Guests (y: 4192, x: 55, 320 x 70) */}
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
            <span
              style={{
                fontFamily: FONT_ROSARIO,
                fontWeight: 400,
                fontSize: "14px",
                letterSpacing: "0.2857em",
                color: COLOR_BLACK,
              }}
            >
              Number of Guests
            </span>
          </div>
        </div>

        {/* Button Pill: Send ! (y: 4288, x: 104, 223 x 53) */}
        <div
          style={figmaBox({
            x: 104,
            y: 4288,
            width: 223,
            height: 53,
            zIndex: 3,
            extra: {
              backgroundColor: COLOR_WHITE,
              borderRadius: "50px",
            },
          })}
        />
        <div
          style={figmaBox({
            x: 67,
            y: 4295,
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
              cursor: "pointer",
            },
          })}
        >
          Send !
        </div>

        {/* =========================================================================
            SECTION 8: FOOTER (y: 4130 - 4604)
            ========================================================================= */}
        {/* "Untill infinity" Cursive (y: 4487, x: 104, 223 x 48) */}
        <div
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
            },
          })}
        >
          <img
            src={untillInfinitySvg}
            alt="Untill infinity"
            style={{ width: 179, height: 30, display: "block" }}
          />
        </div>

        {/* "Jonathan & Marrisah" Serif (y: 4528, x: 104, 223 x 48) */}
        <div
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
            },
          })}
        >
          <img
            src={footerNamesSvg}
            alt="JONATHAN & MARRISAH"
            style={{ width: 211, height: 12, display: "block" }}
          />
        </div>

        {/* =========================================================================
            QA INSPECTION OVERLAY
            ========================================================================= */}
        {/* Overlay QA reference */}
        {overlayOpacity > 0 && (
          <img
            src={fullReferenceImg}
            alt="Figma Reference"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              maxWidth: "none",
              opacity: overlayOpacity,
              pointerEvents: "none",
              zIndex: 9998,
              mixBlendMode: isDiffMode ? "difference" : "normal",
            }}
          />
        )}
      </div>

      {/* Floating QA Toolbar */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "rgba(15, 23, 42, 0.92)",
          backdropFilter: "blur(12px)",
          color: "#FFFFFF",
          padding: "10px 18px",
          borderRadius: "30px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          zIndex: 100000,
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          fontSize: "13px",
        }}
      >
        <span style={{ fontWeight: 600, color: "#38BDF8" }}>Figma Overlay QA:</span>
        <div style={{ display: "flex", gap: "6px" }}>
          {[0, 0.25, 0.5, 0.75, 1].map((op) => (
            <button
              key={op}
              type="button"
              onClick={() => setOverlayOpacity(op)}
              style={{
                backgroundColor: overlayOpacity === op ? "#38BDF8" : "#334155",
                color: overlayOpacity === op ? "#0F172A" : "#FFFFFF",
                border: "none",
                borderRadius: "14px",
                padding: "4px 10px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {op === 0 ? "Off" : `${op * 100}%`}
            </button>
          ))}
        </div>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            cursor: "pointer",
            fontSize: "12px",
            borderLeft: "1px solid #475569",
            paddingLeft: "12px",
          }}
        >
          <input
            type="checkbox"
            checked={isDiffMode}
            onChange={(e) => setIsDiffMode(e.target.checked)}
          />
          Diff Mode
        </label>
      </div>
    </div>
  );
}

