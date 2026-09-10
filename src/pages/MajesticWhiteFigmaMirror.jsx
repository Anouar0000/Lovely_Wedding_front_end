import React, { useState } from "react";

// Assets for Majestic White Template
import heroBg from "../assets/digital/majestic-white/hero-bg.png";
import monogramLogo from "../assets/digital/majestic-white/monogram-logo.svg";
import separatorSvg from "../assets/digital/majestic-white/separator.svg";
import storyFrame from "../assets/digital/majestic-white/story-frame.png";
import storyPhoto from "../assets/digital/majestic-white/story-photo.png";
import countdownBg from "../assets/digital/majestic-white/countdown-bg.png";
import envelopeImg from "../assets/digital/majestic-white/envelope.png";
import paperCard from "../assets/digital/majestic-white/paper-card.png";
import waxSeal from "../assets/digital/majestic-white/wax-seal.png";
import timelineVector from "../assets/digital/majestic-white/timeline-vector.svg";
import footerBg from "../assets/digital/majestic-white/footer-bg.png";
import bgGradient from "../assets/digital/majestic-white/bg-gradient.png";
import pearlRight from "../assets/digital/majestic-white/pearl-right.png";
import pearlLeft from "../assets/digital/majestic-white/pearl-left.png";
import fullReferenceImg from "../assets/digital/majestic-white/majestic-white-reference.png";

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

export default function MajesticWhiteFigmaMirror() {
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [isDiffMode, setIsDiffMode] = useState(false);

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
        id="majestic-white-canvas-root"
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

        {/* Pearl 2 / Pearl 3 (Left, Story Portrait - y: 960, x: -70, 227.35 x 316.44) */}
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

        {/* Pearl 3 / Pearl (Right, Below Countdown - y: 1383, x: 323, 159 x 285) */}
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

        {/* Pearl 5 / Pearl (Right, Timeline - y: 2792, x: 323, 159 x 285) */}
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

        {/* Pearl 6 / Pearl 5 (Left, Leave a Message - y: 3101, x: -70, 227.35 x 316.44) */}
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

        {/* Pearl 7 / Pearl (Right, RSVP - y: 3677, x: 320, 159 x 285) */}
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
        <img
          src={monogramLogo}
          alt="Damon & Alice Monogram"
          style={figmaBox({
            x: 140,
            y: 282.63,
            width: 149.49,
            height: 121.57,
            zIndex: 3,
          })}
        />

        {/* Date: "15 . 09 . 2026" (y: 415 optical match, x: 121, 188 x 27) */}
        <div
          style={figmaBox({
            x: 121,
            y: 415,
            width: 188,
            height: 27,
            zIndex: 3,
            extra: {
              fontFamily: FONT_CORMORANT_INFANT,
              fontWeight: 400,
              fontSize: "20px",
              lineHeight: "16px",
              letterSpacing: "0.1em",
              textAlign: "center",
              color: COLOR_TAUPE,
              textTransform: "capitalize",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
          })}
        >
          15 . 09 . 2026
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
          style={figmaBox({
            x: 141,
            y: 709,
            width: 148,
            height: 46,
            zIndex: 3,
            extra: { display: "flex", alignItems: "center", justifyContent: "center" },
          })}
        >
          <img src={ourStoryTitleSvg} alt="Our Story" style={{ width: 111, height: 41, display: "block" }} />
        </div>

        {/* Story Text (y: 772, x: 61, 309 x 165) */}
        <div
          style={figmaBox({
            x: 61,
            y: 772,
            width: 309,
            height: 165,
            zIndex: 3,
            extra: {
              fontFamily: FONT_CORMORANT,
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "20px",
              textAlign: "center",
              color: COLOR_TAUPE,
              textTransform: "capitalize",
              whiteSpace: "pre-line",
            },
          })}
        >
          {"Voluptatum Non Fugiat Qui Ab Non.\nAt Ut Quasi Dolorum Numquam Voluptas\nRerum Qui. Non R Numquam Molestiae Vero\nDolores Dolores. Dolor Ut Sit Quos\nAccusantium Vitae Aliquid Ducimus"}
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
          style={figmaBox({
            x: 172,
            y: 960,
            width: 87,
            height: 128,
            zIndex: 4,
            extra: {
              borderRadius: "50%",
              overflow: "hidden",
            },
          })}
        >
          <img
            src={storyPhoto}
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
            extra: { objectFit: "cover" },
          })}
        />

        {/* Title: "Countdown" (y: 1235, x: 141, 148 x 46) */}
        <div
          style={figmaBox({
            x: 141,
            y: 1235,
            width: 148,
            height: 46,
            zIndex: 3,
            extra: { display: "flex", alignItems: "center", justifyContent: "center" },
          })}
        >
          <img src={countdownTitleSvg} alt="Countdown" style={{ width: 107, height: 30, display: "block" }} />
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
            60
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
            05
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
            32
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
          style={figmaBox({
            x: 135,
            y: 1503,
            width: 161,
            height: 46,
            zIndex: 3,
            extra: { display: "flex", alignItems: "center", justifyContent: "center" },
          })}
        >
          <img src={formalInviteTitleSvg} alt="Formal Invite" style={{ width: 171, height: 30, display: "block" }} />
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
          src={paperCard}
          alt=""
          style={figmaBox({
            x: 103,
            y: 1588,
            width: 224,
            height: 336,
            zIndex: 3,
            extra: {
              boxShadow: "2px 2px 10px 0px rgba(0, 0, 0, 0.25)",
              objectFit: "cover",
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
          style={figmaBox({
            x: 141,
            y: 2081,
            width: 148,
            height: 46,
            zIndex: 3,
            extra: { display: "flex", alignItems: "center", justifyContent: "center" },
          })}
        >
          <img src={celebrationsTitleSvg} alt="Celebrations" style={{ width: 113, height: 30, display: "block" }} />
        </div>

        {/* Subtitle 1 (y: 2144, x: 82, 266 x 47) */}
        <div
          style={figmaBox({
            x: 82,
            y: 2144,
            width: 266,
            height: 47,
            zIndex: 3,
            extra: {
              fontFamily: FONT_CORMORANT,
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "20px",
              textAlign: "center",
              color: COLOR_TAUPE,
              textTransform: "capitalize",
              whiteSpace: "pre-line",
            },
          })}
        >
          {"Voluptatum Non Fugiat Qui Ab Non.\nAt Ut Quasi Dolorum Numquam Voluptas"}
        </div>

        {/* Event 1 Venue Name: "Club Nautique" (y: 2201, x: 158, 115 x 28) */}
        <div
          style={figmaBox({
            x: 158,
            y: 2201,
            width: 115,
            height: 28,
            zIndex: 3,
            extra: {
              fontFamily: FONT_CORMORANT,
              fontWeight: 700,
              fontSize: "18px",
              lineHeight: "20px",
              textAlign: "center",
              color: COLOR_TAUPE,
              textTransform: "capitalize",
            },
          })}
        >
          Club Nautique
        </div>

        {/* Event 1 Address / Time: "Les Berges Du Lac 1 \nÀ 18h" (y: 2235, x: 136, 159 x 59) */}
        <div
          style={figmaBox({
            x: 136,
            y: 2235,
            width: 159,
            height: 59,
            zIndex: 3,
            extra: {
              fontFamily: FONT_CORMORANT,
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "20px",
              textAlign: "center",
              color: COLOR_TAUPE,
              textTransform: "capitalize",
              whiteSpace: "pre-line",
            },
          })}
        >
          {"Les Berges Du Lac 1\nÀ 18h"}
        </div>

        {/* Event 1 Button: "Open In Maps" (y: 2289, x: 136, 158 x 45) */}
        <div
          style={figmaBox({
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
              cursor: "pointer",
            },
          })}
        >
          Open In Maps
        </div>

        {/* Subtitle 2 (y: 2370, x: 82, 266 x 47) */}
        <div
          style={figmaBox({
            x: 82,
            y: 2370,
            width: 266,
            height: 47,
            zIndex: 3,
            extra: {
              fontFamily: FONT_CORMORANT,
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "20px",
              textAlign: "center",
              color: COLOR_TAUPE,
              textTransform: "capitalize",
              whiteSpace: "pre-line",
            },
          })}
        >
          {"Voluptatum Non Fugiat Qui Ab Non.\nAt Ut Quasi Dolorum Numquam Voluptas"}
        </div>

        {/* Event 2 Venue Name: "Club Nautique" (y: 2427, x: 158, 115 x 28) */}
        <div
          style={figmaBox({
            x: 158,
            y: 2427,
            width: 115,
            height: 28,
            zIndex: 3,
            extra: {
              fontFamily: FONT_CORMORANT,
              fontWeight: 700,
              fontSize: "18px",
              lineHeight: "20px",
              textAlign: "center",
              color: COLOR_TAUPE,
              textTransform: "capitalize",
            },
          })}
        >
          Club Nautique
        </div>

        {/* Event 2 Address / Time: "Les Berges Du Lac 1 \nÀ 18h" (y: 2461, x: 136, 159 x 59) */}
        <div
          style={figmaBox({
            x: 136,
            y: 2461,
            width: 159,
            height: 59,
            zIndex: 3,
            extra: {
              fontFamily: FONT_CORMORANT,
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "20px",
              textAlign: "center",
              color: COLOR_TAUPE,
              textTransform: "capitalize",
              whiteSpace: "pre-line",
            },
          })}
        >
          {"Les Berges Du Lac 1\nÀ 18h"}
        </div>

        {/* Event 2 Button: "Open In Maps" (y: 2515, x: 136, 158 x 45) */}
        <div
          style={figmaBox({
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
              cursor: "pointer",
            },
          })}
        >
          Open In Maps
        </div>

        {/* =========================================================================
            SECTION 6: TIMELINE (y: 2636 - 3069)
            ========================================================================= */}
        {/* Title: "Timeline" (y: 2636, x: 141, 148 x 46) */}
        <div
          style={figmaBox({
            x: 141,
            y: 2636,
            width: 148,
            height: 46,
            zIndex: 3,
            extra: { display: "flex", alignItems: "center", justifyContent: "center" },
          })}
        >
          <img src={timelineTitleSvg} alt="Timeline" style={{ width: 96, height: 30, display: "block" }} />
        </div>

        {/* Timeline Subtitle (y: 2699, x: 82, 266 x 47) */}
        <div
          style={figmaBox({
            x: 82,
            y: 2699,
            width: 266,
            height: 47,
            zIndex: 3,
            extra: {
              fontFamily: FONT_CORMORANT,
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "20px",
              textAlign: "center",
              color: COLOR_TAUPE,
              textTransform: "capitalize",
              whiteSpace: "pre-line",
            },
          })}
        >
          {"Voluptatum Non Fugiat Qui Ab Non.\nAt Ut Quasi Dolorum Numquam Voluptas"}
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
          style={figmaBox({
            x: 141,
            y: 3069,
            width: 148,
            height: 46,
            zIndex: 3,
            extra: { display: "flex", alignItems: "center", justifyContent: "center" },
          })}
        >
          <img src={leaveAMessageTitleSvg} alt="Leave a message" style={{ width: 151, height: 41, display: "block" }} />
        </div>

        {/* Subtitle: "Leave A Heartfelt Message To The Brides" (y: 3132, x: 82, 266 x 47) */}
        <div
          style={figmaBox({
            x: 82,
            y: 3132,
            width: 266,
            height: 47,
            zIndex: 3,
            extra: {
              fontFamily: FONT_CORMORANT,
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "20px",
              textAlign: "center",
              color: COLOR_TAUPE,
              textTransform: "capitalize",
            },
          })}
        >
          Leave A Heartfelt Message To The Brides
        </div>

        {/* Message Input Box (y: 3179, x: 16, 398 x 121, borderRadius: 50px) */}
        <div
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
              padding: "20px 30px",
            },
          })}
        >
          {/* Placeholder: "Write Something..." (y: 3201 - 3179 = 22, x: 57 - 16 = 41) */}
          <span
            style={{
              fontFamily: FONT_CORMORANT,
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "20px",
              color: "rgba(151, 127, 109, 0.5)",
              textTransform: "capitalize",
            }}
          >
            Write Something...
          </span>
        </div>

        {/* =========================================================================
            SECTION 8: RSVP (y: 3371 - 3869)
            ========================================================================= */}
        {/* Title: "RSVP" (y: 3371, x: 141, 148 x 46) */}
        <div
          style={figmaBox({
            x: 141,
            y: 3371,
            width: 148,
            height: 46,
            zIndex: 3,
            extra: { display: "flex", alignItems: "center", justifyContent: "center" },
          })}
        >
          <img src={rsvpTitleSvg} alt="RSVP" style={{ width: 114, height: 28, display: "block" }} />
        </div>

        {/* RSVP Form Inputs Group (y: 3447, x: 16, 398 x 282) */}
        <div
          style={figmaBox({
            x: 16,
            y: 3447,
            width: 398,
            height: 282,
            zIndex: 3,
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
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 19,
              width: 398,
              height: 40,
              backgroundColor: COLOR_WHITE,
              border: `1px solid ${COLOR_BORDER}`,
              borderRadius: "7px",
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
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 93,
              width: 398,
              height: 40,
              backgroundColor: COLOR_WHITE,
              border: `1px solid ${COLOR_BORDER}`,
              borderRadius: "7px",
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
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 168,
              width: 398,
              height: 40,
              backgroundColor: COLOR_WHITE,
              border: `1px solid ${COLOR_BORDER}`,
              borderRadius: "7px",
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
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 242,
              width: 398,
              height: 40,
              backgroundColor: COLOR_WHITE,
              border: `1px solid ${COLOR_BORDER}`,
              borderRadius: "7px",
            }}
          />
        </div>

        {/* Send Button (y: 3770, x: 136, 158 x 45, borderRadius: 50px) */}
        <div
          style={figmaBox({
            x: 136,
            y: 3770,
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
              cursor: "pointer",
            },
          })}
        >
          Send
        </div>

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
            extra: { objectFit: "cover" },
          })}
        />

        {/* Footer Couple Names: "Damon & Alice" (y: 3939, x: 110, 210 x 46) */}
        <div
          style={figmaBox({
            x: 110,
            y: 3939,
            width: 210,
            height: 46,
            zIndex: 3,
            extra: { display: "flex", alignItems: "center", justifyContent: "center" },
          })}
        >
          <img src={footerNamesSvg} alt="Damon & Alice" style={{ width: 189, height: 33, display: "block" }} />
        </div>

        {/* =========================================================================
            LAYER 99: FIGMA GROUND TRUTH OVERLAY FOR PIXEL-PERFECT QA
            ========================================================================= */}
        {overlayOpacity > 0 && (
          <img
            src={fullReferenceImg}
            alt="Figma Reference"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: `${CANVAS_WIDTH}px`,
              height: `${CANVAS_HEIGHT}px`,
              zIndex: 99999,
              opacity: overlayOpacity,
              pointerEvents: "none",
              filter: isDiffMode ? "invert(1) contrast(3)" : "none",
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
          backgroundColor: "rgba(15, 23, 42, 0.92)",
          backdropFilter: "blur(8px)",
          color: "#FFFFFF",
          padding: "8px 16px",
          borderRadius: "30px",
          border: "1px solid #334155",
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
