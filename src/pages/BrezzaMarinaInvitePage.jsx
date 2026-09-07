import React, { useState } from "react";

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
import fullReferenceImg from "../assets/digital/brezza-marina/brezza_marina_full_reference.png";

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

// Coastal Seashell SVG Ornaments

export default function BrezzaMarinaInvitePage({ invite, editable = false }) {

  const templateConfig = require("../data/digital/templates/brezza-marina.json");
  const currentInvite = invite || templateConfig.sample;
  const overrides = currentInvite.styleOverrides || {};
  const getText = (id, fallback) => overrides[id]?.text || fallback;

  const coupleText = (() => {
    if (!currentInvite.coupleNames) return "Houssem\n&\nDorra";
    if (currentInvite.coupleNames.includes("\n")) return currentInvite.coupleNames;
    const parts = currentInvite.coupleNames.split(/&|and|\+/i).map((s) => s.trim());
    if (parts.length >= 2) {
      return `${parts[0]}\n&\n${parts[1]}`;
    }
    return currentInvite.coupleNames;
  })();

  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [isDiffMode, setIsDiffMode] = useState(false);

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
      {/* 430px Canvas Container */}
      <div
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
          style={{
            ...figmaBox({ x: 75, y: 90, width: 280, height: 49, zIndex: 3 }),
            fontFamily: "'Bodoni Moda', serif",
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "18px",
            textAlign: "center",
            color: WHITE
          }}
        >
          {getText('hero-subtitle', currentInvite.heroQuote || "L'amour n'est qu'un mot, jusqu'à ce que quelqu'un vienne lui donner un sens.")}
        </div>

        {/* Names #1518:520 */}
        <div
          style={{
            ...figmaBox({ x: 137, y: 151, width: 157, height: 112, zIndex: 3 }),
            fontFamily: "'Beau Rivage', cursive",
            fontSize: "40px",
            fontWeight: 400,
            lineHeight: "44px",
            letterSpacing: "0.05em",
            textAlign: "center",
            color: WHITE,
            whiteSpace: "pre-line"
          }}
        >
          {coupleText}
        </div>

        {/* Line indicator #1518:525 */}
        <div
          style={{
            ...figmaBox({ x: 215, y: 561, width: 0, height: 15, zIndex: 3 }),
            borderLeft: "1px solid #FFFFFF"
          }}
        />

        {/* =========================================================================
            SECTION 2: COUNTDOWN (717 - 950px)
            ========================================================================= */}

        {/* Shell 2 ornament #1520:52 */}
        <div style={figmaBox({ x: 0, y: 662, width: 81.1, height: 141.2, zIndex: 1 })}>
          <img src={shell2} alt="Shell 2" style={{ width: "100%", height: "100%" }} draggable="false" />
        </div>

        {/* Ocean puddle #1218:124 */}
        <img
          src={countdownPuddle}
          alt=""
          style={figmaBox({ x: 49, y: 717, width: 350, height: 226, zIndex: 1 })}
          draggable="false"
        />

        {/* Title "Countdown" #1218:126 */}
        <div
          style={{
            ...figmaBox({ x: 131, y: 752, width: 168, height: 42, zIndex: 3 }),
            fontFamily: "'Beau Rivage', cursive",
            fontSize: "30px",
            fontWeight: 400,
            letterSpacing: "0.05em",
            lineHeight: 1,
            textAlign: "center",
            color: BLUE
          }}
        >
          Countdown
        </div>

        {/* Arabic Title "العد التنازلي" #1218:163 */}
        <div
          style={{
            ...figmaBox({ x: 134, y: 793, width: 162, height: 30, zIndex: 3 }),
            fontFamily: "'B Fantezy', 'Gulzar', 'Amiri', serif",
            fontSize: "20px",
            fontWeight: 400,
            lineHeight: 1,
            textAlign: "center",
            color: BLUE
          }}
        >
          العد التنازلي
        </div>

        {/* Group #1518:515: 3 countdown boxes with separators */}
        <div style={figmaBox({ x: 121, y: 839, width: 188, height: 64, zIndex: 3 })}>
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
            60
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
            05
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
            32
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
          style={{
            ...figmaBox({ x: 131, y: 996, width: 168, height: 42, zIndex: 3 }),
            fontFamily: "'Beau Rivage', cursive",
            fontSize: "30px",
            fontWeight: 400,
            letterSpacing: "0.05em",
            lineHeight: 1,
            textAlign: "center",
            color: BLUE
          }}
        >
          Location
        </div>

        {/* Arabic Title "وين بش نتقابلو" #1518:517 */}
        <div
          style={{
            ...figmaBox({ x: 134, y: 1037, width: 162, height: 30, zIndex: 3 }),
            fontFamily: "'B Fantezy', 'Gulzar', 'Amiri', serif",
            fontSize: "20px",
            fontWeight: 400,
            lineHeight: 1,
            textAlign: "center",
            color: BLUE
          }}
        >
          وين بش نتقابلو
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
          style={figmaBox({ x: 88, y: 1096, width: 255, height: 189, zIndex: 2 })}
          draggable="false"
        />

        {/* Shell 3 ornament */}
        <div style={figmaBox({ x: 331, y: 1291, width: 99, height: 187.7, zIndex: 1 })}>
          <img src={shell3} alt="Shell 3" style={{ width: "100%", height: "100%" }} draggable="false" />
        </div>

        {/* Text "The ceremony will take place at" #1218:146 */}
        <div
          style={{
            ...figmaBox({ x: 101, y: 1336, width: 228, height: 24, zIndex: 3 }),
            fontFamily: "'Bodoni Moda', serif",
            fontSize: "12px",
            fontWeight: 400,
            textAlign: "center",
            color: TEXT_MUTED
          }}
        >
          The ceremony will take place at
        </div>

        {/* Text "{`" ${getText('location-venue', currentInvite.venueName || "Dar Bouraoui Carthage Malaga")} "`}" #1218:147 */}
        <div
          style={{
            ...figmaBox({ x: 100, y: 1359, width: 231, height: 23, zIndex: 3 }),
            fontFamily: "'Bodoni Moda', serif",
            fontSize: "12px",
            fontWeight: 400,
            textAlign: "center",
            color: TEXT_MUTED
          }}
        >
          “ Dar Bouraoui Carthage Malaga “
        </div>

        {/* Button "Open in maps" #1218:199 / #1218:200 */}
        <div
          onClick={() => {
            const url = currentInvite.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(currentInvite.venueName || "Dar Bouraoui Carthage Malaga")}`;
            window.open(url, "_blank");
          }}
          style={{
            ...figmaBox({ x: 152, y: 1389, width: 126, height: 39, zIndex: 3 }),
            backgroundColor: "#FEFBF9",
            border: "1px solid #49606B",
            borderRadius: "8px",
            opacity: 0.9,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
          }}
        >
          <span
            style={{
              fontFamily: "'Bodoni Moda', serif",
              fontSize: "14px",
              fontWeight: 400,
              color: TEXT_MUTED
            }}
          >
            Open in maps
          </span>
        </div>

        {/* =========================================================================
            SECTION 4: OUR STORY (1479 - 1875px)
            ========================================================================= */}
        {/* Story background #1518:527 */}
        <img
          src={storyBg}
          alt="Our Story Background"
          style={figmaBox({ x: 0, y: 1479, width: 430, height: 396, zIndex: 1 })}
          draggable="false"
        />

        {/* Title "Our Story" #1518:528 */}
        <div
          style={{
            ...figmaBox({ x: 131, y: 1508, width: 168, height: 34, zIndex: 3 }),
            fontFamily: "'Beau Rivage', cursive",
            fontSize: "30px",
            fontWeight: 400,
            letterSpacing: "0.05em",
            lineHeight: 1,
            textAlign: "center",
            color: WHITE
          }}
        >
          Our Story
        </div>

        {/* Arabic Title "حكايتنا" #1518:537 */}
        <div
          style={{
            ...figmaBox({ x: 135, y: 1544, width: 162, height: 30, zIndex: 3 }),
            fontFamily: "'B Fantezy', 'Gulzar', 'Amiri', serif",
            fontSize: "20px",
            fontWeight: 400,
            lineHeight: 1,
            textAlign: "center",
            color: WHITE
          }}
        >
          حكايتنا
        </div>

        {/* Couple photo #1518:529 */}
        <div
          style={{
            ...figmaBox({ x: 118.3, y: 1586, width: 193.18, height: 124.315, zIndex: 3 }),
            transform: "rotate(1.217deg)",
            border: "3px solid #FFFFFF",
            overflow: "hidden"
          }}
        >
          <img
            src={storyCouplePhoto}
            alt="Couple"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            draggable="false"
          />
        </div>

        {/* Postcard Group #1518:530 */}
        <div
          style={{
            ...figmaBox({ x: 117, y: 1713, width: 194.28, height: 126.03, zIndex: 3 }),
            backgroundColor: WHITE,
            borderRadius: "2px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.08)"
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
            style={{
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
            }}
          >
            {getText('our-story-text', currentInvite.ourStoryText || "Placeat accusamus\n in rem a id et ad. \nAdipisci quia et eos ")}
          </div>
        </div>

        {/* =========================================================================
            SECTION 5: TIMELINE (1936 - 2230px)
            ========================================================================= */}
        {/* Title "Timeline" #1218:128 */}
        <div
          style={{
            ...figmaBox({ x: 131, y: 1941, width: 168, height: 42, zIndex: 3 }),
            fontFamily: "'Beau Rivage', cursive",
            fontSize: "30px",
            fontWeight: 400,
            letterSpacing: "0.05em",
            lineHeight: 1,
            textAlign: "center",
            color: BLUE
          }}
        >
          Timeline
        </div>

        {/* Arabic Title "البرنامج" #1218:165 */}
        <div
          style={{
            ...figmaBox({ x: 134, y: 1981, width: 162, height: 30, zIndex: 3 }),
            fontFamily: "'B Fantezy', 'Gulzar', 'Amiri', serif",
            fontSize: "20px",
            fontWeight: 400,
            lineHeight: 1,
            textAlign: "center",
            color: BLUE
          }}
        >
          البرنامج
        </div>

        {/* Stage 1: "Accueil" #1218:168 */}
        <div
          style={{
            ...figmaBox({ x: 13, y: 2046, width: 101.84, height: 22.16, zIndex: 3 }),
            fontFamily: "'Sue Ellen Francisco', cursive",
            fontSize: "16px",
            lineHeight: "20px",
            color: TEXT_MUTED,
            textAlign: "center"
          }}
        >
          {currentInvite.timeline?.[0]?.name || "Accueil"}
        </div>

        {/* Stage 2: "Contrat de mariage" #1218:169 */}
        <div
          style={{
            ...figmaBox({ x: 93, y: 2116, width: 102.03, height: 43.01, zIndex: 3 }),
            fontFamily: "'Sue Ellen Francisco', cursive",
            fontSize: "16px",
            lineHeight: "20px",
            color: TEXT_MUTED,
            textAlign: "center",
            whiteSpace: "pre-line"
          }}
        >
          {currentInvite.timeline?.[1]?.name || "Contrat \nde mariage"}
        </div>

        {/* Stage 3: "Fête" #1218:170 */}
        <div
          style={{
            ...figmaBox({ x: 170, y: 2051, width: 101.88, height: 26.24, zIndex: 3 }),
            fontFamily: "'Sue Ellen Francisco', cursive",
            fontSize: "16px",
            lineHeight: "20px",
            color: TEXT_MUTED,
            textAlign: "center"
          }}
        >
          {currentInvite.timeline?.[2]?.name || "Fête"}
        </div>

        {/* Stage 4: "Photos" #1218:171 */}
        <div
          style={{
            ...figmaBox({ x: 248, y: 2122, width: 101.88, height: 26.24, zIndex: 3 }),
            fontFamily: "'Sue Ellen Francisco', cursive",
            fontSize: "16px",
            lineHeight: "20px",
            color: TEXT_MUTED,
            textAlign: "center"
          }}
        >
          {currentInvite.timeline?.[3]?.name || "Photos"}
        </div>

        {/* Stage 5: "La fin" #1218:172 */}
        <div
          style={{
            ...figmaBox({ x: 321, y: 2052, width: 101.88, height: 26.24, zIndex: 3 }),
            fontFamily: "'Sue Ellen Francisco', cursive",
            fontSize: "16px",
            lineHeight: "20px",
            color: TEXT_MUTED,
            textAlign: "center"
          }}
        >
          {currentInvite.timeline?.[4]?.name || "La fin"}
        </div>

        {/* Timeline wave track #1218:166 */}
        <div
          style={{
            ...figmaBox({ x: -8, y: 2057, width: 509, height: 90, zIndex: 2 }),
            background: `url(${timelineWave}) 50% / cover no-repeat`,
            aspectRatio: "509/90"
          }}
        />

        {/* Timeline pearl indicator #1218:167 */}
        <img
          src={timelinePearl}
          alt="Pearl"
          style={{ ...figmaBox({ x: 54, y: 2102, width: 19, height: 20, zIndex: 4 }), objectFit: "cover" }}
          draggable="false"
        />

        {/* Drag pearl instruction #1218:148 */}
        <div
          style={{
            ...figmaBox({ x: 100, y: 2182, width: 231, height: 17, zIndex: 3 }),
            fontFamily: "'Bodoni Moda', serif",
            fontSize: "12px",
            fontWeight: 400,
            textAlign: "center",
            color: TEXT_MUTED
          }}
        >
          Drag the Pearl to complete the schedule
        </div>

        {/* =========================================================================
            SECTION 6: DRESS CODE (2272 - 2580px)
            ========================================================================= */}
        {/* Title "Dress Code" #1519:3 */}
        <div
          style={{
            ...figmaBox({ x: 131, y: 2277, width: 168, height: 42, zIndex: 3 }),
            fontFamily: "'Beau Rivage', cursive",
            fontSize: "30px",
            fontWeight: 400,
            letterSpacing: "0.05em",
            lineHeight: 1,
            textAlign: "center",
            color: BLUE
          }}
        >
          Dress Code
        </div>

        {/* Arabic Title "الهندام" #1519:4 */}
        <div
          style={{
            ...figmaBox({ x: 134, y: 2317, width: 162, height: 30, zIndex: 3 }),
            fontFamily: "'B Fantezy', 'Gulzar', 'Amiri', serif",
            fontSize: "20px",
            fontWeight: 400,
            lineHeight: 1,
            textAlign: "center",
            color: BLUE
          }}
        >
          الهندام
        </div>

        {/* Dress code attire image #1520:7 */}
        <img
          src={dressCodeAttire}
          alt="Dress Code Attire"
          style={figmaBox({ x: 146, y: 2365, width: 139, height: 139, zIndex: 2 })}
          draggable="false"
        />

        {/* Instruction note #1520:5 */}
        <div
          style={{
            ...figmaBox({ x: 100, y: 2531, width: 231, height: 35, zIndex: 3 }),
            fontFamily: "'Bodoni Moda', serif",
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: "17px",
            textAlign: "center",
            color: TEXT_MUTED
          }}
        >
          {getText('dress-text', currentInvite.dressCodeText || "Nous prions nos invités d'éviter de porter du blanc et du noir")}
        </div>

        {/* =========================================================================
            SECTION 7: RSVP (2617 - 3130px)
            ========================================================================= */}
        {/* Title "RSVP" #1520:12 */}
        <div
          style={{
            ...figmaBox({ x: 131, y: 2617, width: 168, height: 42, zIndex: 3 }),
            fontFamily: "'Beau Rivage', cursive",
            fontSize: "30px",
            fontWeight: 400,
            letterSpacing: "0.05em",
            textAlign: "center",
            color: BLUE
          }}
        >
          RSVP
        </div>

        {/* Shell 4 ornament #1520:998 */}
        <div style={figmaBox({ x: 352, y: 2630, width: 78, height: 118.9, zIndex: 1 })}>
          <img src={shell4} alt="Shell 4" style={{ width: "100%", height: "100%" }} draggable="false" />
        </div>

        {/* Subtitle deadline #1520:14 */}
        <div
          style={{
            ...figmaBox({ x: 100, y: 2676, width: 231, height: 35, zIndex: 3 }),
            fontFamily: "'Bodoni Moda', serif",
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: "17px",
            textAlign: "center",
            color: TEXT_MUTED
          }}
        >
          {getText('rsvp-form', currentInvite.rsvpDeadline ? `The favour of a reply is kindly requested by ${currentInvite.rsvpDeadline}` : "The favour of a reply is kindly requested by the fifteenth of June, 2026")}
        </div>

        {/* Shell 1 ornament #1520:268 */}
        <div style={figmaBox({ x: 0, y: 2285, width: 65, height: 112, zIndex: 1 })}>
          <img src={shell1} alt="Shell 1" style={{ width: "100%", height: "100%" }} draggable="false" />
        </div>

        {/* Form Field 1: Name #1520:41 / #1520:43 */}
        <div
          style={{
            ...figmaBox({ x: 16, y: 2762, width: 397, height: 14, zIndex: 3 }),
            fontFamily: "'Cormorant', serif",
            fontSize: "14px",
            fontWeight: 700,
            color: TEXT_MUTED
          }}
        >
          Name
        </div>
        <input
          type="text"
          readOnly
          placeholder=""
          style={{
            ...figmaBox({ x: 16, y: 2781, width: 397, height: 40, zIndex: 3 }),
            backgroundColor: WHITE,
            border: "1px solid #E5E5E5",
            borderRadius: "7px",
            padding: "0 12px",
            outline: "none"
          }}
        />

        {/* Form Field 2: Sir Name #1520:45 / #1520:47 */}
        <div
          style={{
            ...figmaBox({ x: 16, y: 2836, width: 397, height: 14, zIndex: 3 }),
            fontFamily: "'Cormorant', serif",
            fontSize: "14px",
            fontWeight: 700,
            color: TEXT_MUTED
          }}
        >
          Sir Name
        </div>
        <input
          type="text"
          readOnly
          placeholder=""
          style={{
            ...figmaBox({ x: 16, y: 2855, width: 397, height: 40, zIndex: 3 }),
            backgroundColor: WHITE,
            border: "1px solid #E5E5E5",
            borderRadius: "7px",
            padding: "0 12px",
            outline: "none"
          }}
        />

        {/* Form Field 3: Email #1520:32 / #1520:34 */}
        <div
          style={{
            ...figmaBox({ x: 16, y: 2911, width: 397, height: 14, zIndex: 3 }),
            fontFamily: "'Cormorant', serif",
            fontSize: "14px",
            fontWeight: 700,
            color: TEXT_MUTED
          }}
        >
          Email
        </div>
        <input
          type="email"
          readOnly
          placeholder=""
          style={{
            ...figmaBox({ x: 16, y: 2930, width: 397, height: 40, zIndex: 3 }),
            backgroundColor: WHITE,
            border: "1px solid #E5E5E5",
            borderRadius: "7px",
            padding: "0 12px",
            outline: "none"
          }}
        />

        {/* Form Field 4: Number of guests #1520:36 / #1520:38 */}
        <div
          style={{
            ...figmaBox({ x: 16, y: 2985, width: 397, height: 14, zIndex: 3 }),
            fontFamily: "'Cormorant', serif",
            fontSize: "14px",
            fontWeight: 700,
            color: TEXT_MUTED
          }}
        >
          Number of guests
        </div>
        <input
          type="number"
          readOnly
          placeholder=""
          style={{
            ...figmaBox({ x: 16, y: 3004, width: 397, height: 40, zIndex: 3 }),
            backgroundColor: WHITE,
            border: "1px solid #E5E5E5",
            borderRadius: "7px",
            padding: "0 12px",
            outline: "none"
          }}
        />

        {/* Button "Send Confirmation" #1520:39 */}
        <div
          style={{
            ...figmaBox({ x: 16, y: 3074, width: 396, height: 40, zIndex: 3 }),
            backgroundColor: BLUE_BTN,
            borderRadius: "7px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
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
          style={{
            ...figmaBox({ x: 131, y: 3158, width: 168, height: 42, zIndex: 3 }),
            fontFamily: "'Beau Rivage', cursive",
            fontSize: "30px",
            fontWeight: 400,
            letterSpacing: "0.05em",
            textAlign: "center",
            color: BLUE
          }}
        >
          See you there!
        </div>


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
              opacity: overlayOpacity,
              pointerEvents: "none",
              zIndex: 9998,
              mixBlendMode: isDiffMode ? "difference" : "normal"
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
          fontSize: "13px"
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
                cursor: "pointer"
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
            paddingLeft: "12px"
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


