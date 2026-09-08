import React, { useState } from "react";

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
import fullReferenceImg from "../assets/digital/bridgerton/bridgerton_full_reference.png";

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

export default function BridgertonFigmaMirror() {
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [isDiffMode, setIsDiffMode] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#E2E8F0",
        padding: "32px 0 80px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* 430px Canvas Container */}
      <div
        id="bridgerton-canvas-root"
        style={{
          position: "relative",
          width: `${CANVAS_WIDTH}px`,
          height: `${CANVAS_HEIGHT}px`,
          backgroundColor: COLOR_WHITE,
          overflow: "hidden",
          boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
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

        {/* #1584:89 Hero Couple Photo Frame (Lace Doily with 0.8 Opacity) */}
        <div
          style={figmaBox({
            x: 57,
            y: 121,
            width: 316,
            height: 421,
            zIndex: 3,
            extra: {
              backgroundImage: `url(${heroCouplePhoto})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              overflow: "hidden",
              opacity: 0.8,
            },
          })}
        />

        {/* #1583:85 Hero Couple Names */}
        <div
          style={figmaBox({
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
            },
          })}
        >
          {"Karim\n&\nAzza"}
        </div>

        {/* #1584:90 "Our Happy Ever After" */}
        <div
          style={figmaBox({
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
            },
          })}
        >
          Our Happy Ever After
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
        <img
          src={birdLeft}
          alt=""
          style={figmaBox({
            x: -33,
            y: 640,
            width: 129,
            height: 124,
            zIndex: 6,
            extra: { pointerEvents: "none" },
          })}
        />

        {/* =========================================================================
            SECTION 2: DATE & WAITING FOR YOU (649 - 931px)
           ========================================================================= */}
        {/* #1586:98 Date: 23 / 11 / 26 */}
        <div
          style={figmaBox({
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
          })}
        >
          {"23\n11\n26"}
        </div>

        {/* #1586:99 "waiting for you..." */}
        <div
          style={figmaBox({
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
          })}
        >
          waiting for you...
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
          style={figmaBox({
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
            },
          })}
        >
          {"Join Us For The \nBest Day Ever"}
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
          style={figmaBox({
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
          })}
        >
          {"Wedding\nVenue"}
        </div>

        {/* #1586:2003 Venue Address Text */}
        <div
          style={figmaBox({
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
          })}
        >
          {"Dar Bouraoui \nCarthage\nSalle Malaga\n18H - 20H"}
        </div>

        {/* #1587:2013 Stamp 3 (Hummingbird - Rotated -30deg) */}
        <img
          src={stamp3}
          alt="Stamp"
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
          style={figmaBox({
            x: 43,
            y: 1531,
            width: 120,
            height: 180,
            zIndex: 6,
            extra: {
              position: "absolute",
            },
          })}
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
          {/* #1587:3493 Venue Golden Frame */}
          <img
            src={venuePhoto}
            alt="Venue"
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
          style={figmaBox({
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
          })}
        >
          Dress Code
        </div>

        {/* #1586:96 Dress Code Text */}
        <div
          style={figmaBox({
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
          })}
        >
          We'd love for guests to embrace a formal look for our celebration.
        </div>

        {/* #1586:126 Stamp 2 (Rose - Rotated 30deg) */}
        <img
          src={stamp2}
          alt="Stamp"
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
          <div style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: "#D9E5EB" }} />
          <div style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: "#F9F5D4" }} />
          <div style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: "#F2C1BE" }} />
          <div style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: "#C8D4D0" }} />
        </div>

        {/* #1587:2207 TE_Bird-01 2 (Bird Right) */}
        <img
          src={birdRight}
          alt=""
          style={figmaBox({
            x: 326,
            y: 1899,
            width: 129,
            height: 124,
            zIndex: 4,
            extra: { pointerEvents: "none" },
          })}
        />

        {/* #1586:124 Title: "Transport" */}
        <div
          style={figmaBox({
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
          })}
        >
          Transport
        </div>

        {/* #1586:125 Transport Guidance Text */}
        <div
          style={figmaBox({
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
          })}
        >
          {"Parking: On-site parking will be available at the venue.\nTaxis: We recommend booking taxis in advance."}
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
          style={figmaBox({
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
          })}
        >
          {"Leave\na message"}
        </div>

        {/* #1587:3508 Subtitle: "Leave a heartfelt message to the brides" */}
        <div
          style={figmaBox({
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
          })}
        >
          Leave a heartfelt message to the brides
        </div>

        {/* #1602:3 Message Input Box */}
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
              justifyContent: "flex-end",
              padding: "0 14px",
              backgroundColor: "transparent",
            },
          })}
        >
          <span
            style={{
              fontFamily: FONT_SERIF,
              fontSize: "12px",
              letterSpacing: "2.4px",
              color: "rgba(255, 255, 255, 0.8)",
              textAlign: "right",
            }}
          >
            Enter text here
          </span>
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
          style={figmaBox({
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
          })}
        >
          RSVP
        </div>

        {/* #1587:3521 RSVP Deadline */}
        <div
          style={figmaBox({
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
          })}
        >
          The favour of a reply is kindly requested by the 15th of June, 2026
        </div>

        {/* #1587:4168 Stamp 4 (Butterfly - Rotated -45deg) */}
        <img
          src={stamp4}
          alt="Stamp"
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

        {/* #1587:4165 Form Group */}
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
            <div
              style={{
                fontFamily: FONT_SERIF,
                fontSize: "12px",
                letterSpacing: "2.4px",
                color: COLOR_MAUVE,
                marginBottom: "5px",
              }}
            >
              Name
            </div>
            <div
              style={{
                width: "398px",
                height: "40px",
                backgroundColor: COLOR_WHITE,
                border: `1px solid ${COLOR_BORDER}`,
                borderRadius: "7px",
              }}
            />
          </div>

          {/* Sir Name Field */}
          <div style={{ position: "absolute", left: 0, top: "74px", width: "398px" }}>
            <div
              style={{
                fontFamily: FONT_SERIF,
                fontSize: "12px",
                letterSpacing: "2.4px",
                color: COLOR_MAUVE,
                marginBottom: "5px",
              }}
            >
              Sir Name
            </div>
            <div
              style={{
                width: "398px",
                height: "40px",
                backgroundColor: COLOR_WHITE,
                border: `1px solid ${COLOR_BORDER}`,
                borderRadius: "7px",
              }}
            />
          </div>

          {/* Email Field */}
          <div style={{ position: "absolute", left: 0, top: "149px", width: "398px" }}>
            <div
              style={{
                fontFamily: FONT_SERIF,
                fontSize: "12px",
                letterSpacing: "2.4px",
                color: COLOR_MAUVE,
                marginBottom: "5px",
              }}
            >
              Email
            </div>
            <div
              style={{
                width: "398px",
                height: "40px",
                backgroundColor: COLOR_WHITE,
                border: `1px solid ${COLOR_BORDER}`,
                borderRadius: "7px",
              }}
            />
          </div>

          {/* Number of guests Field */}
          <div style={{ position: "absolute", left: 0, top: "223px", width: "398px" }}>
            <div
              style={{
                fontFamily: FONT_SERIF,
                fontSize: "12px",
                letterSpacing: "2.4px",
                color: COLOR_MAUVE,
                marginBottom: "5px",
              }}
            >
              Number of guests
            </div>
            <div
              style={{
                width: "398px",
                height: "40px",
                backgroundColor: COLOR_WHITE,
                border: `1px solid ${COLOR_BORDER}`,
                borderRadius: "7px",
              }}
            />
          </div>
        </div>

        {/* #1587:3529 Submit Button */}
        <div
          style={figmaBox({
            x: 16,
            y: 2953,
            width: 398,
            height: 40,
            zIndex: 5,
            extra: {
              backgroundColor: COLOR_MAUVE,
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            },
          })}
        >
          <span
            style={{
              fontFamily: FONT_SERIF,
              fontSize: "12px",
              lineHeight: "18px",
              letterSpacing: "2.4px",
              color: COLOR_WHITE,
            }}
          >
            Send Confirmation
          </span>
        </div>

        {/* =========================================================================
            SECTION 8: FOOTER MONOGRAM SEAL (3034 - 3214px)
           ========================================================================= */}
        {/* #1583:14 Lace 1 Frame */}
        <div
          style={figmaBox({
            x: 125,
            y: 3034,
            width: 180,
            height: 180,
            zIndex: 4,
          })}
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
            {"Karim\n&\nAzza"}
          </div>
        </div>

        {/* QA Comparison Image Overlay */}
        {overlayOpacity > 0 && (
          <img
            src={fullReferenceImg}
            alt="Figma Reference Overlay"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
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
