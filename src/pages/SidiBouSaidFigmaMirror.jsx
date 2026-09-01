import React, { useState } from "react";

// Fresh Figma Assets (Imported from src/assets/digital/sidi-bousaid/fresh-figma/)
import fullReferenceImg from "../assets/digital/sidi-bousaid/fresh-figma/sidi_bou_said_full_reference.png";
import heroArchBg from "../assets/digital/sidi-bousaid/fresh-figma/hero-arch-bg.png";
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

// Shared Theme Colors
const BLUE = "rgba(0, 147, 216, 1)";
const BLUE_ACCENT = "rgba(46, 136, 226, 1)";
const TEXT_MUTED = "rgba(73, 96, 107, 1)";
const CANVAS_WIDTH = 430;

const figmaBox = ({ x, y, width, height, zIndex = 2 }) => ({
  position: "absolute",
  left: `${x}px`,
  top: `${y}px`,
  width: width ? `${width}px` : "auto",
  height: height ? `${height}px` : "auto",
  zIndex
});

/* =========================================================================
   BLOCK 1: HERO / OPENING (Height: 708px, Absolute Y: 0)
   ========================================================================= */
const HeroBlock = () => (
  <section id="block-hero" style={{ position: "relative", width: `${CANVAS_WIDTH}px`, height: "708px", overflow: "hidden" }}>
    <img src={heroArchBg} alt="Hero Arch" style={figmaBox({ x: 0, y: 0, width: 432, height: 708, zIndex: 1 })} draggable="false" />

    <div style={{ ...figmaBox({ x: 194, y: 202, width: 43, height: 66, zIndex: 3 }), borderRadius: "40px", border: "1px solid #FFFFFF", boxSizing: "border-box" }} />
    <div style={{ position: "absolute", left: "195px", top: "208px", width: "32px", height: "29px", fontFamily: "'Antic Didone', serif", fontSize: "30px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "32px", textAlign: "center", color: "rgba(255, 255, 255, 1)", zIndex: 3 }}>
      S
    </div>
    <div style={{ position: "absolute", left: "203px", top: "231px", width: "32px", height: "29px", fontFamily: "'Antic Didone', serif", fontSize: "30px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "32px", textAlign: "center", color: "rgba(255, 255, 255, 1)", zIndex: 3 }}>
      H
    </div>

    <div style={{ position: "absolute", left: "165px", top: "272px", width: "105px", height: "71px", fontFamily: "'Antic Didone', serif", fontSize: "38px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "40px", textAlign: "center", color: "rgba(255, 255, 255, 1)", zIndex: 3 }}>
      Sarah<br />Hedi
    </div>

    <div style={{ position: "absolute", left: "101px", top: "305px", width: "63px", height: "23px", fontFamily: "'Cormorant Infant', serif", fontSize: "20px", fontWeight: 400, fontStyle: "italic", letterSpacing: "2px", lineHeight: "18px", textAlign: "center", color: "rgba(255, 255, 255, 1)", textTransform: "uppercase", zIndex: 3 }}>
      July
    </div>
    <div style={{ position: "absolute", left: "266px", top: "305px", width: "63px", height: "23px", fontFamily: "'Cormorant Infant', serif", fontSize: "20px", fontWeight: 400, fontStyle: "italic", letterSpacing: "2px", lineHeight: "18px", textAlign: "center", color: "rgba(255, 255, 255, 1)", textTransform: "uppercase", zIndex: 3 }}>
      2026
    </div>

    <div style={{ position: "absolute", left: "121px", top: "360px", width: "188px", height: "27px", fontFamily: "'Cormorant', serif", fontSize: "16px", fontWeight: 400, fontStyle: "normal", letterSpacing: "1.6px", lineHeight: "16px", textAlign: "center", color: "rgba(255, 255, 255, 1)", textTransform: "capitalize", zIndex: 3 }}>
      Welcome to our <br />mediterranean abode
    </div>

    <div style={{ ...figmaBox({ x: 158, y: 430, width: 116, height: 32, zIndex: 3 }), backgroundColor: "#FFFFFF", borderRadius: "20px", cursor: "pointer" }} />
    <div style={{ position: "absolute", left: "100px", top: "437px", width: "231px", height: "17px", fontFamily: "'Cormorant', serif", fontSize: "14px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "17px", textAlign: "center", color: "rgba(46, 136, 226, 1)", zIndex: 4, cursor: "pointer" }}>
      Scroll down
    </div>
  </section>
);

/* =========================================================================
   BLOCK 2: REVEAL SECTION (Height: 316px, Absolute Y: 708)
   ========================================================================= */
const RevealBlock = () => {
  const BLOCK_Y = 708;
  return (
    <section id="block-reveal" style={{ position: "relative", width: `${CANVAS_WIDTH}px`, height: "316px", overflow: "hidden" }}>
      <img src={revealCornerTop} alt="" style={figmaBox({ x: 369, y: 708 - BLOCK_Y, width: 63, height: 55 })} draggable="false" />
      <img src={revealCornerBottom} alt="" style={figmaBox({ x: -3, y: 932 - BLOCK_Y, width: 62, height: 55 })} draggable="false" />

      <div style={{ position: "absolute", left: "131px", top: "32px", width: "168px", height: "30px", fontFamily: "'Antic Didone', serif", fontSize: "22px", fontWeight: 400, fontStyle: "normal", letterSpacing: "1.1px", lineHeight: "26px", textAlign: "center", color: "rgba(0, 147, 216, 1)" }}>
        Reveal
      </div>
      <div style={{ position: "absolute", left: "134px", top: "51px", width: "162px", height: "26px", fontFamily: "'Gulzar', serif", fontSize: "20px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "54px", textAlign: "center", color: "rgba(0, 147, 216, 1)" }}>
        النهار جاء
      </div>

      <img src={revealHand} alt="" style={figmaBox({ x: 160, y: 800 - BLOCK_Y, width: 111, height: 132, zIndex: 2 })} draggable="false" />

      <div style={{ ...figmaBox({ x: 93, y: 850 - BLOCK_Y, width: 51, height: 18, zIndex: 3 }), fontFamily: "'Antic Didone', serif", fontSize: "13px", color: BLUE, textAlign: "center" }}>
        20
      </div>
      <div style={{ ...figmaBox({ x: 190, y: 850 - BLOCK_Y, width: 51, height: 18, zIndex: 3 }), fontFamily: "'Antic Didone', serif", fontSize: "13px", color: BLUE, textAlign: "center" }}>
        07
      </div>
      <div style={{ ...figmaBox({ x: 287, y: 850 - BLOCK_Y, width: 51, height: 18, zIndex: 3 }), fontFamily: "'Antic Didone', serif", fontSize: "13px", color: BLUE, textAlign: "center" }}>
        26
      </div>

      <img src={revealDoors} alt="Doors" style={figmaBox({ x: 93, y: 810 - BLOCK_Y, width: 245, height: 99, zIndex: 4 })} draggable="false" />
    </section>
  );
};

/* =========================================================================
   BLOCK 3: OUR STORY (Height: 357px, Absolute Y: 1024)
   ========================================================================= */
const StoryBlock = () => {
  const BLOCK_Y = 1024;
  return (
    <section id="block-story" style={{ position: "relative", width: `${CANVAS_WIDTH}px`, height: "357px", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: "131px", top: "0px", width: "168px", height: "30px", fontFamily: "'Antic Didone', serif", fontSize: "22px", fontWeight: 400, fontStyle: "normal", letterSpacing: "1.1px", lineHeight: "26px", textAlign: "center", color: "rgba(0, 147, 216, 1)" }}>
        Our Story
      </div>
      <div style={{ position: "absolute", left: "134px", top: "19px", width: "162px", height: "26px", fontFamily: "'Gulzar', serif", fontSize: "20px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "54px", textAlign: "center", color: "rgba(0, 147, 216, 1)" }}>
        حكايتنا
      </div>

      <img src={storyTileTop} alt="" style={figmaBox({ x: 400, y: 1056 - BLOCK_Y, width: 38, height: 38 })} draggable="false" />
      <img src={storyTileBottom} alt="" style={figmaBox({ x: -10, y: 1303 - BLOCK_Y, width: 38, height: 38 })} draggable="false" />

      <img src={watercolorBougainvillea} alt="" style={figmaBox({ x: 85, y: 48, width: 164, height: 164, zIndex: 2 })} draggable="false" />
      <img src={storySketchCouple} alt="Couple" style={figmaBox({ x: 184.5, y: 79.3, width: 233.6, height: 179.3, zIndex: 3 })} draggable="false" />
      <img src={storyTape} alt="" style={figmaBox({ x: 260, y: 69, width: 114, height: 52, zIndex: 4 })} draggable="false" />
      <img src={storyTornPaper} alt="" style={figmaBox({ x: 15.5, y: 121.5, width: 222.6, height: 164.5, zIndex: 3 })} draggable="false" />

      <div
        style={{
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
        }}
      >
        Our Happy Ever After<br />Starts<br />Now
      </div>

      <img src={storyStampLeft} alt="" style={figmaBox({ x: 309, y: 213, width: 67.5, height: 101.4, zIndex: 5 })} draggable="false" />
      <img src={storyStampRight} alt="" style={figmaBox({ x: 314.2, y: 219.7, width: 57.1, height: 86.0, zIndex: 6 })} draggable="false" />
    </section>
  );
};

/* =========================================================================
   BLOCK 4: COUNTDOWN (Height: 243px, Absolute Y: 1381)
   ========================================================================= */
const CountdownBlock = () => {
  const BLOCK_Y = 1381;
  return (
    <section id="block-countdown" style={{ position: "relative", width: `${CANVAS_WIDTH}px`, height: "243px", overflow: "hidden" }}>
      <img src={countdownBg} alt="Countdown" style={figmaBox({ x: 0, y: 1381 - BLOCK_Y, width: 430, height: 212, zIndex: 1 })} draggable="false" />
      <div style={{ ...figmaBox({ x: 0, y: 1381 - BLOCK_Y, width: 430, height: 212, zIndex: 2 }), backgroundColor: "rgba(75, 198, 255, 0.07)" }} />

      <div style={{ position: "absolute", left: "131px", top: "27px", width: "168px", height: "42px", fontFamily: "'Antic Didone', serif", fontSize: "22px", fontWeight: 400, fontStyle: "normal", letterSpacing: "1.1px", lineHeight: "26px", textAlign: "center", color: "rgba(255, 255, 255, 1)", zIndex: 3 }}>
        Countdown
      </div>
      <div style={{ position: "absolute", left: "134px", top: "50px", width: "162px", height: "30px", fontFamily: "'Gulzar', serif", fontSize: "20px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "54px", textAlign: "center", color: "rgba(255, 255, 255, 1)", zIndex: 3 }}>
        العد التنازلي
      </div>

      <div style={{ ...figmaBox({ x: 78, y: 106, width: 56, height: 55, zIndex: 3 }), backgroundColor: "#F3F3F3", borderRadius: "12px", border: "1px solid rgba(0, 147, 216, 1)", boxSizing: "border-box" }} />
      <div style={{ ...figmaBox({ x: 187, y: 106, width: 56, height: 55, zIndex: 3 }), backgroundColor: "#F3F3F3", borderRadius: "12px", border: "1px solid rgba(0, 147, 216, 1)", boxSizing: "border-box" }} />
      <div style={{ ...figmaBox({ x: 296, y: 106, width: 56, height: 55, zIndex: 3 }), backgroundColor: "#F3F3F3", borderRadius: "12px", border: "1px solid rgba(0, 147, 216, 1)", boxSizing: "border-box" }} />

      <div style={{ position: "absolute", left: "23px", top: "116px", width: "168px", height: "18px", fontFamily: "'Cormorant Infant', serif", fontSize: "14px", fontWeight: 500, fontStyle: "normal", letterSpacing: "1.4px", lineHeight: "17px", textAlign: "center", color: "rgba(0, 147, 216, 1)", zIndex: 4 }}>
        100
      </div>
      <div style={{ position: "absolute", left: "65px", top: "138px", width: "83px", height: "13px", fontFamily: "'Cormorant Infant', serif", fontSize: "8px", fontWeight: 500, fontStyle: "normal", letterSpacing: "0.8px", lineHeight: "10px", textAlign: "center", color: "rgba(0, 147, 216, 1)", zIndex: 4 }}>
        Days
      </div>
      <div style={{ position: "absolute", left: "131px", top: "116px", width: "168px", height: "18px", fontFamily: "'Cormorant Infant', serif", fontSize: "14px", fontWeight: 500, fontStyle: "normal", letterSpacing: "1.4px", lineHeight: "17px", textAlign: "center", color: "rgba(0, 147, 216, 1)", zIndex: 4 }}>
        13
      </div>
      <div style={{ position: "absolute", left: "173px", top: "138px", width: "83px", height: "13px", fontFamily: "'Cormorant Infant', serif", fontSize: "8px", fontWeight: 500, fontStyle: "normal", letterSpacing: "0.8px", lineHeight: "10px", textAlign: "center", color: "rgba(0, 147, 216, 1)", zIndex: 4 }}>
        Hours
      </div>
      <div style={{ position: "absolute", left: "239px", top: "116px", width: "168px", height: "18px", fontFamily: "'Cormorant Infant', serif", fontSize: "14px", fontWeight: 500, fontStyle: "normal", letterSpacing: "1.4px", lineHeight: "17px", textAlign: "center", color: "rgba(0, 147, 216, 1)", zIndex: 4 }}>
        42
      </div>
      <div style={{ position: "absolute", left: "281px", top: "138px", width: "83px", height: "13px", fontFamily: "'Cormorant Infant', serif", fontSize: "8px", fontWeight: 500, fontStyle: "normal", letterSpacing: "0.8px", lineHeight: "10px", textAlign: "center", color: "rgba(0, 147, 216, 1)", zIndex: 4 }}>
        Minutes
      </div>
    </section>
  );
};

/* =========================================================================
   BLOCK 5: THE CELEBRATIONS (Height: 944px, Absolute Y: 1624)
   ========================================================================= */
const CelebrationsBlock = () => {
  const BLOCK_Y = 1624;
  return (
    <section id="block-celebrations" style={{ position: "relative", width: `${CANVAS_WIDTH}px`, height: "944px", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: "131px", top: "0px", width: "168px", height: "34px", fontFamily: "'Antic Didone', serif", fontSize: "20px", fontWeight: 400, fontStyle: "normal", letterSpacing: "1px", lineHeight: "24px", textAlign: "center", color: "rgba(0, 147, 216, 1)" }}>
        The Celebrations
      </div>
      <div style={{ position: "absolute", left: "135px", top: "19px", width: "162px", height: "30px", fontFamily: "'Gulzar', serif", fontSize: "20px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "54px", textAlign: "center", color: "rgba(0, 147, 216, 1)" }}>
        الليالي
      </div>

      {/* EVENT 1: OUTEYA */}
      <div style={{ ...figmaBox({ x: 54, y: 1714 - BLOCK_Y, width: 323, height: 383, zIndex: 2 }), backgroundColor: "#FFFFFF", borderRadius: "7px", border: "1.5px solid rgba(0, 147, 216, 1)", boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.25)", boxSizing: "border-box" }} />
      <img src={evilEyeOuteyaTop} alt="" style={figmaBox({ x: 328, y: 1734 - BLOCK_Y, width: 143, height: 95, zIndex: 3 })} draggable="false" />
      <div style={{ position: "absolute", left: "131px", top: "122px", width: "168px", height: "34px", fontFamily: "'Antic Didone', serif", fontSize: "22px", fontWeight: 400, fontStyle: "normal", letterSpacing: "1.1px", lineHeight: "26px", textAlign: "center", color: "rgba(0, 147, 216, 1)", zIndex: 4 }}>
        Outeya
      </div>
      <div style={{ position: "absolute", left: "135px", top: "142px", width: "162px", height: "30px", fontFamily: "'Gulzar', serif", fontSize: "20px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "54px", textAlign: "center", color: "rgba(0, 147, 216, 1)", zIndex: 4 }}>
        الوطية
      </div>
      <div style={{ position: "absolute", left: "90px", top: "224px", width: "108px", height: "25px", fontFamily: "'Cormorant Infant', serif", fontSize: "20px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "18px", textAlign: "center", color: "rgba(73, 96, 107, 1)", zIndex: 4 }}>
        Monday
      </div>
      <div style={{ position: "absolute", left: "181px", top: "214px", width: "66px", height: "25px", fontFamily: "'Cormorant Infant', serif", fontSize: "30px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "18px", textAlign: "center", color: "rgba(73, 96, 107, 1)", zIndex: 4 }}>
        20
      </div>
      <div style={{ position: "absolute", left: "232px", top: "223px", width: "108px", height: "25px", fontFamily: "'Cormorant Infant', serif", fontSize: "20px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "18px", textAlign: "center", color: "rgba(73, 96, 107, 1)", zIndex: 4 }}>
        July
      </div>
      <div style={{ position: "absolute", left: "176px", top: "239px", width: "77px", height: "25px", fontFamily: "'Cormorant Infant', serif", fontSize: "20px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "18px", textAlign: "center", color: "rgba(73, 96, 107, 1)", zIndex: 4 }}>
        2026
      </div>
      <div style={{ ...figmaBox({ x: 111, y: 1840 - BLOCK_Y, width: 67, height: 0.5, zIndex: 4 }), backgroundColor: "#000000" }} />
      <div style={{ ...figmaBox({ x: 253, y: 1840 - BLOCK_Y, width: 67, height: 0.5, zIndex: 4 }), backgroundColor: "#000000" }} />
      <div style={{ ...figmaBox({ x: 111, y: 1876 - BLOCK_Y, width: 67, height: 0.5, zIndex: 4 }), backgroundColor: "#000000" }} />
      <div style={{ ...figmaBox({ x: 253, y: 1876 - BLOCK_Y, width: 67, height: 0.5, zIndex: 4 }), backgroundColor: "#000000" }} />
      <img src={evilEyeOuteyaBottom} alt="" style={figmaBox({ x: -40, y: 1878 - BLOCK_Y, width: 143, height: 95, zIndex: 3 })} draggable="false" />
      <div style={{ position: "absolute", left: "121px", top: "284px", width: "188px", height: "52px", fontFamily: "'Cormorant', serif", fontSize: "12px", fontWeight: 400, fontStyle: "normal", letterSpacing: "1.2px", lineHeight: "14px", textAlign: "center", color: "rgba(0, 147, 216, 1)", textTransform: "uppercase", zIndex: 4 }}>
        <br />Haifa Palace<br />Mornag
      </div>
      <div style={{ position: "absolute", left: "135px", top: "336px", width: "162px", height: "30px", fontFamily: "'Gulzar', serif", fontSize: "14px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "22px", textAlign: "center", color: "rgba(0, 147, 216, 1)", zIndex: 4 }}>
        هيفاء بالاص<br />مرناق
      </div>
      <button
        type="button"
        style={{ ...figmaBox({ x: 162, y: 2023 - BLOCK_Y, width: 106, height: 40, zIndex: 5 }), backgroundColor: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "7px", boxSizing: "border-box", cursor: "pointer", fontFamily: "'Cormorant', serif", fontSize: "12px", letterSpacing: "1.2px", color: "rgba(73, 96, 107, 1)", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        Open in maps
      </button>
      <img src={fishOuteya} alt="" style={figmaBox({ x: 343, y: 2040 - BLOCK_Y, width: 57, height: 61, zIndex: 3 })} draggable="false" />

      {/* EVENT 2: MARIAGE */}
      <div style={{ ...figmaBox({ x: 54, y: 2141 - BLOCK_Y, width: 323, height: 383, zIndex: 2 }), backgroundColor: "#FFFFFF", borderRadius: "7px", border: "1.5px solid rgba(0, 147, 216, 1)", boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.25)", boxSizing: "border-box" }} />
      <img src={evilEyeMariageTop} alt="" style={figmaBox({ x: 328, y: 2164 - BLOCK_Y, width: 143, height: 95, zIndex: 3 })} draggable="false" />
      <div style={{ position: "absolute", left: "131px", top: "552px", width: "168px", height: "34px", fontFamily: "'Antic Didone', serif", fontSize: "22px", fontWeight: 400, fontStyle: "normal", letterSpacing: "1.1px", lineHeight: "26px", textAlign: "center", color: "rgba(0, 147, 216, 1)", zIndex: 4 }}>
        Mariage
      </div>
      <div style={{ position: "absolute", left: "135px", top: "572px", width: "162px", height: "30px", fontFamily: "'Gulzar', serif", fontSize: "20px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "54px", textAlign: "center", color: "rgba(0, 147, 216, 1)", zIndex: 4 }}>
        العرس
      </div>
      <div style={{ position: "absolute", left: "90px", top: "654px", width: "108px", height: "25px", fontFamily: "'Cormorant Infant', serif", fontSize: "20px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "18px", textAlign: "center", color: "rgba(73, 96, 107, 1)", zIndex: 4 }}>
        Monday
      </div>
      <div style={{ position: "absolute", left: "181px", top: "644px", width: "66px", height: "25px", fontFamily: "'Cormorant Infant', serif", fontSize: "30px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "18px", textAlign: "center", color: "rgba(73, 96, 107, 1)", zIndex: 4 }}>
        20
      </div>
      <div style={{ position: "absolute", left: "232px", top: "653px", width: "108px", height: "25px", fontFamily: "'Cormorant Infant', serif", fontSize: "20px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "18px", textAlign: "center", color: "rgba(73, 96, 107, 1)", zIndex: 4 }}>
        July
      </div>
      <div style={{ position: "absolute", left: "176px", top: "669px", width: "77px", height: "25px", fontFamily: "'Cormorant Infant', serif", fontSize: "20px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "18px", textAlign: "center", color: "rgba(73, 96, 107, 1)", zIndex: 4 }}>
        2026
      </div>
      <div style={{ ...figmaBox({ x: 111, y: 2270 - BLOCK_Y, width: 67, height: 0.5, zIndex: 4 }), backgroundColor: "#000000" }} />
      <div style={{ ...figmaBox({ x: 253, y: 2270 - BLOCK_Y, width: 67, height: 0.5, zIndex: 4 }), backgroundColor: "#000000" }} />
      <div style={{ ...figmaBox({ x: 111, y: 2306 - BLOCK_Y, width: 67, height: 0.5, zIndex: 4 }), backgroundColor: "#000000" }} />
      <div style={{ ...figmaBox({ x: 253, y: 2306 - BLOCK_Y, width: 67, height: 0.5, zIndex: 4 }), backgroundColor: "#000000" }} />
      <img src={evilEyeMariageBottom} alt="" style={figmaBox({ x: -40, y: 2308 - BLOCK_Y, width: 143, height: 95, zIndex: 3 })} draggable="false" />
      <div style={{ position: "absolute", left: "121px", top: "713px", width: "188px", height: "52px", fontFamily: "'Cormorant', serif", fontSize: "12px", fontWeight: 400, fontStyle: "normal", letterSpacing: "1.2px", lineHeight: "14px", textAlign: "center", color: "rgba(0, 147, 216, 1)", textTransform: "uppercase", zIndex: 4 }}>
        <br />Haifa Palace<br />Mornag
      </div>
      <div style={{ position: "absolute", left: "135px", top: "765px", width: "162px", height: "30px", fontFamily: "'Gulzar', serif", fontSize: "14px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "22px", textAlign: "center", color: "rgba(0, 147, 216, 1)", zIndex: 4 }}>
        هيفاء بالاص<br />مرناق
      </div>
      <button
        type="button"
        style={{ ...figmaBox({ x: 162, y: 2452 - BLOCK_Y, width: 106, height: 40, zIndex: 5 }), backgroundColor: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "7px", boxSizing: "border-box", cursor: "pointer", fontFamily: "'Cormorant', serif", fontSize: "12px", letterSpacing: "1.2px", color: "rgba(73, 96, 107, 1)", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        Open in maps
      </button>
      <img src={fishMariage} alt="" style={figmaBox({ x: 343, y: 2470 - BLOCK_Y, width: 57, height: 61, zIndex: 3 })} draggable="false" />
    </section>
  );
};

/* =========================================================================
   BLOCK 6: DRESS CODE (Height: 369px, Absolute Y: 2568)
   ========================================================================= */
const DressCodeBlock = () => {
  const BLOCK_Y = 2568;
  return (
    <section id="block-dress-code" style={{ position: "relative", width: `${CANVAS_WIDTH}px`, height: "369px", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: "131px", top: "0px", width: "168px", height: "34px", fontFamily: "'Antic Didone', serif", fontSize: "20px", fontWeight: 400, fontStyle: "normal", letterSpacing: "1px", lineHeight: "24px", textAlign: "center", color: "rgba(0, 147, 216, 1)" }}>
        Dress Code
      </div>
      <div style={{ position: "absolute", left: "134px", top: "19px", width: "162px", height: "30px", fontFamily: "'Gulzar', serif", fontSize: "20px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "54px", textAlign: "center", color: "rgba(0, 147, 216, 1)" }}>
        التبديلة
      </div>

      <img src={dressCodeAttire} alt="Attire" style={figmaBox({ x: 139, y: 2605 - BLOCK_Y, width: 153, height: 230 })} draggable="false" />

      <div style={{ position: "absolute", left: "95px", top: "286px", width: "241px", height: "41px", fontFamily: "'Cormorant', serif", fontSize: "12px", fontWeight: 400, fontStyle: "normal", letterSpacing: "1.2px", lineHeight: "18px", textAlign: "center", color: "rgba(73, 96, 107, 1)" }}>
        We Request Attending The Outeya With<br />A Traditional Attire
      </div>
    </section>
  );
};

/* =========================================================================
   BLOCK 7: PROGRAMME (Height: 430px, Absolute Y: 2937)
   ========================================================================= */
const ProgrammeBlock = () => {
  const BLOCK_Y = 2937;
  return (
    <section id="block-programme" style={{ position: "relative", width: `${CANVAS_WIDTH}px`, height: "430px", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: "131px", top: "0px", width: "168px", height: "34px", fontFamily: "'Antic Didone', serif", fontSize: "20px", fontWeight: 400, fontStyle: "normal", letterSpacing: "1px", lineHeight: "24px", textAlign: "center", color: "rgba(0, 147, 216, 1)" }}>
        Programme
      </div>
      <div style={{ position: "absolute", left: "134px", top: "19px", width: "162px", height: "30px", fontFamily: "'Gulzar', serif", fontSize: "20px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "54px", textAlign: "center", color: "rgba(0, 147, 216, 1)" }}>
        البرنامج
      </div>

      <div style={{ ...figmaBox({ x: 203, y: 3047 - BLOCK_Y, width: 1, height: 235, zIndex: 1 }), backgroundColor: "rgba(46, 136, 226, 1)" }} />

      {/* Step 1: Sdek */}
      <div style={{ position: "absolute", left: "131px", top: "110px", width: "54px", height: "60px", fontFamily: "'Cormorant Infant', serif", fontSize: "12px", fontWeight: 600, fontStyle: "normal", letterSpacing: "1.2px", lineHeight: "15px", textAlign: "left", color: "rgba(46, 136, 226, 1)", zIndex: 3 }}>
        17:00
      </div>
      <div style={{ ...figmaBox({ x: 197, y: 3047 - BLOCK_Y, width: 13, height: 13, zIndex: 3 }), borderRadius: "50%", border: "1px solid rgba(46, 136, 226, 1)", backgroundColor: "#FFFFFF" }} />
      <img src={progIconSdek} alt="" style={figmaBox({ x: 236, y: 3034 - BLOCK_Y, width: 37, height: 33, zIndex: 3 })} draggable="false" />
      <div style={{ position: "absolute", left: "219px", top: "135px", width: "71px", height: "21px", fontFamily: "'Cormorant', serif", fontSize: "12px", fontWeight: 400, fontStyle: "normal", letterSpacing: "1.2px", lineHeight: "15px", textAlign: "center", color: "rgba(73, 96, 107, 1)", zIndex: 3 }}>
        Sdek
      </div>

      {/* Step 2: Reception */}
      <div style={{ position: "absolute", left: "131px", top: "185px", width: "54px", height: "60px", fontFamily: "'Cormorant Infant', serif", fontSize: "12px", fontWeight: 600, fontStyle: "normal", letterSpacing: "1.2px", lineHeight: "15px", textAlign: "left", color: "rgba(46, 136, 226, 1)", zIndex: 3 }}>
        18:00
      </div>
      <div style={{ ...figmaBox({ x: 197, y: 3124 - BLOCK_Y, width: 13, height: 13, zIndex: 3 }), borderRadius: "50%", border: "1px solid rgba(46, 136, 226, 1)", backgroundColor: "#FFFFFF" }} />
      <img src={progIconReception} alt="" style={figmaBox({ x: 236, y: 3111 - BLOCK_Y, width: 37, height: 33, zIndex: 3 })} draggable="false" />
      <div style={{ position: "absolute", left: "219px", top: "208px", width: "71px", height: "21px", fontFamily: "'Cormorant', serif", fontSize: "12px", fontWeight: 400, fontStyle: "normal", letterSpacing: "1.2px", lineHeight: "15px", textAlign: "center", color: "rgba(73, 96, 107, 1)", zIndex: 3 }}>
        Reception
      </div>

      {/* Step 3: Dinner */}
      <div style={{ position: "absolute", left: "131px", top: "260px", width: "54px", height: "60px", fontFamily: "'Cormorant Infant', serif", fontSize: "12px", fontWeight: 600, fontStyle: "normal", letterSpacing: "1.2px", lineHeight: "15px", textAlign: "left", color: "rgba(46, 136, 226, 1)", zIndex: 3 }}>
        20:00
      </div>
      <div style={{ ...figmaBox({ x: 197, y: 3200 - BLOCK_Y, width: 13, height: 13, zIndex: 3 }), borderRadius: "50%", border: "1px solid rgba(46, 136, 226, 1)", backgroundColor: "#FFFFFF" }} />
      <img src={progIconDinner} alt="" style={figmaBox({ x: 236, y: 3182 - BLOCK_Y, width: 37, height: 33, zIndex: 3 })} draggable="false" />
      <div style={{ position: "absolute", left: "219px", top: "282px", width: "71px", height: "18px", fontFamily: "'Cormorant', serif", fontSize: "12px", fontWeight: 400, fontStyle: "normal", letterSpacing: "1.2px", lineHeight: "15px", textAlign: "center", color: "rgba(73, 96, 107, 1)", zIndex: 3 }}>
        Dinner
      </div>

      {/* Step 4: Dance */}
      <div style={{ position: "absolute", left: "131px", top: "335px", width: "54px", height: "60px", fontFamily: "'Cormorant Infant', serif", fontSize: "12px", fontWeight: 600, fontStyle: "normal", letterSpacing: "1.2px", lineHeight: "15px", textAlign: "left", color: "rgba(46, 136, 226, 1)", zIndex: 3 }}>
        00:00
      </div>
      <div style={{ ...figmaBox({ x: 197, y: 3275 - BLOCK_Y, width: 13, height: 13, zIndex: 3 }), borderRadius: "50%", backgroundColor: "rgba(46, 136, 226, 1)" }} />
      <img src={progIconDance} alt="" style={figmaBox({ x: 236, y: 3254 - BLOCK_Y, width: 37, height: 33, zIndex: 3 })} draggable="false" />
      <div style={{ position: "absolute", left: "219px", top: "355px", width: "71px", height: "18px", fontFamily: "'Cormorant', serif", fontSize: "12px", fontWeight: 400, fontStyle: "normal", letterSpacing: "1.2px", lineHeight: "15px", textAlign: "center", color: "rgba(73, 96, 107, 1)", zIndex: 3 }}>
        Dance
      </div>
    </section>
  );
};

/* =========================================================================
   BLOCK 8: RSVP SECTION (Height: 490px, Absolute Y: 3367)
   ========================================================================= */
const RsvpBlock = () => {
  const BLOCK_Y = 3367;
  return (
    <section id="block-rsvp" style={{ position: "relative", width: `${CANVAS_WIDTH}px`, height: "490px", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: "131px", top: "0px", width: "168px", height: "34px", fontFamily: "'Antic Didone', serif", fontSize: "20px", fontWeight: 400, fontStyle: "normal", letterSpacing: "1px", lineHeight: "24px", textAlign: "center", color: "rgba(0, 147, 216, 1)" }}>
        RSVP
      </div>
      <div style={{ position: "absolute", left: "55px", top: "39px", width: "320px", height: "41px", fontFamily: "'Cormorant', serif", fontSize: "12px", fontWeight: 400, fontStyle: "normal", letterSpacing: "1.2px", lineHeight: "18px", textAlign: "center", color: "rgba(73, 96, 107, 1)" }}>
        <span style={{ whiteSpace: "nowrap" }}>The Favour Of A Reply Is Kindly</span><br /><span style={{ whiteSpace: "nowrap" }}>Requested By The Fifteenth Of June, 2026</span>
      </div>

      <div style={{ position: "absolute", left: "16px", top: "108px", width: "50px", height: "14px", fontFamily: "'Cormorant', serif", fontSize: "14px", fontWeight: 700, fontStyle: "normal", letterSpacing: "0px", lineHeight: "17px", color: "rgba(73, 96, 107, 1)" }}>
        Name
      </div>
      <div style={{ ...figmaBox({ x: 16, y: 3494 - BLOCK_Y, width: 398, height: 40, zIndex: 3 }), backgroundColor: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "7px", boxSizing: "border-box" }} />

      <div style={{ position: "absolute", left: "16px", top: "182px", width: "53px", height: "14px", fontFamily: "'Cormorant', serif", fontSize: "14px", fontWeight: 700, fontStyle: "normal", letterSpacing: "0px", lineHeight: "17px", color: "rgba(73, 96, 107, 1)" }}>
        Sir Name
      </div>
      <div style={{ ...figmaBox({ x: 16, y: 3568 - BLOCK_Y, width: 398, height: 40, zIndex: 3 }), backgroundColor: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "7px", boxSizing: "border-box" }} />

      <div style={{ position: "absolute", left: "16px", top: "257px", width: "50px", height: "14px", fontFamily: "'Cormorant', serif", fontSize: "14px", fontWeight: 700, fontStyle: "normal", letterSpacing: "0px", lineHeight: "17px", color: "rgba(73, 96, 107, 1)" }}>
        Email
      </div>
      <div style={{ ...figmaBox({ x: 16, y: 3643 - BLOCK_Y, width: 398, height: 40, zIndex: 3 }), backgroundColor: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "7px", boxSizing: "border-box" }} />

      <div style={{ position: "absolute", left: "16px", top: "331px", width: "128px", height: "14px", fontFamily: "'Cormorant', serif", fontSize: "14px", fontWeight: 700, fontStyle: "normal", letterSpacing: "0px", lineHeight: "17px", color: "rgba(73, 96, 107, 1)" }}>
        Number of guests
      </div>
      <div style={{ ...figmaBox({ x: 16, y: 3717 - BLOCK_Y, width: 398, height: 40, zIndex: 3 }), backgroundColor: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "7px", boxSizing: "border-box" }} />

      <button
        type="button"
        style={{ ...figmaBox({ x: 16, y: 3787 - BLOCK_Y, width: 398, height: 40, zIndex: 3 }), backgroundColor: "rgba(0, 147, 216, 1)", borderRadius: "7px", border: "none", cursor: "pointer", fontFamily: "'Cormorant', serif", fontSize: "14px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "17px", textAlign: "center", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        Send Confirmation
      </button>
    </section>
  );
};

/* =========================================================================
   BLOCK 9: FOOTER SECTION (Height: 160px, Absolute Y: 3857)
   ========================================================================= */
const FooterBlock = () => {
  const BLOCK_Y = 3857;
  return (
    <section id="block-footer" style={{ position: "relative", width: `${CANVAS_WIDTH}px`, height: "160px", overflow: "hidden" }}>
      <div style={{ ...figmaBox({ x: 188, y: 3857 - BLOCK_Y, width: 37, height: 57, zIndex: 3 }), borderRadius: "20px", border: "1px solid rgba(0, 147, 216, 1)", boxSizing: "border-box" }} />
      <div style={{ position: "absolute", left: "187px", top: "4px", width: "32px", height: "29px", fontFamily: "'Antic Didone', serif", fontSize: "24px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "32px", textAlign: "center", color: "rgba(0, 147, 216, 1)", zIndex: 3 }}>
        S
      </div>
      <div style={{ position: "absolute", left: "192px", top: "23px", width: "32px", height: "29px", fontFamily: "'Antic Didone', serif", fontSize: "24px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "32px", textAlign: "center", color: "rgba(0, 147, 216, 1)", zIndex: 3 }}>
        H
      </div>

      <div style={{ position: "absolute", left: "125px", top: "67px", width: "162px", height: "26px", fontFamily: "'Gulzar', serif", fontSize: "18px", fontWeight: 400, fontStyle: "normal", letterSpacing: "0px", lineHeight: "49px", textAlign: "center", color: "rgba(0, 147, 216, 1)" }}>
        ان شاء الله ليلتكم زينة
      </div>

      <img src={closingSmallOrnament} alt="" style={figmaBox({ x: 192, y: 3964 - BLOCK_Y, width: 29, height: 12 })} draggable="false" />
    </section>
  );
};

/* =========================================================================
   MAIN COMPONENT: SIDI BOU SAID FIGMA MIRROR (100% AST-DRIVEN TRUTH)
   ========================================================================= */
export default function SidiBouSaidFigmaMirror() {
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [isDiffMode, setIsDiffMode] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#2B3544",
        display: "flex",
        justifyContent: "center",
        padding: "24px 0",
        fontFamily: "'Urbanist', sans-serif"
      }}
    >
      <div
        style={{
          position: "relative",
          width: `${CANVAS_WIDTH}px`,
          height: "4017px",
          backgroundColor: "#DCEBF0",
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          borderRadius: "8px",
          overflow: "hidden"
        }}
      >
        <HeroBlock />
        <RevealBlock />
        <StoryBlock />
        <CountdownBlock />
        <CelebrationsBlock />
        <DressCodeBlock />
        <ProgrammeBlock />
        <RsvpBlock />
        <FooterBlock />

        {overlayOpacity > 0 && (
          <img
            src={fullReferenceImg}
            alt="Figma 1:1 Overlay"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: `${CANVAS_WIDTH}px`,
              height: "4017px",
              opacity: overlayOpacity,
              mixBlendMode: isDiffMode ? "difference" : "normal",
              pointerEvents: "none",
              zIndex: 9999
            }}
            draggable="false"
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
