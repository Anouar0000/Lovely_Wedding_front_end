import React, { useState } from "react";

// Assets for Club Capri Template
import heroBg from "../assets/digital/club-capri/hero-bg.png";
import cassetteImg from "../assets/digital/club-capri/cassette.png";
import arrowDownSvg from "../assets/digital/club-capri/arrow-down.svg";
import boatImg from "../assets/digital/club-capri/boat.png";
import stripesLeft from "../assets/digital/club-capri/stripes-left.svg";
import stripesRight from "../assets/digital/club-capri/stripes-right.svg";
import stripesBottom from "../assets/digital/club-capri/stripes-bottom.svg";
import postcardPhoto1 from "../assets/digital/club-capri/postcard-photo-1.png";
import postcardPhoto2 from "../assets/digital/club-capri/postcard-photo-2.png";
import postmark1Svg from "../assets/digital/club-capri/postmark-1.svg";
import postmark2Svg from "../assets/digital/club-capri/postmark-2.svg";
import stampSunImg from "../assets/digital/club-capri/stamp-sun.png";
import stampCapriImg from "../assets/digital/club-capri/stamp-capri.png";
import stampCocktailImg from "../assets/digital/club-capri/stamp-cocktail.png";
import dressCodeFamilyImg from "../assets/digital/club-capri/dress-code-family.png";
import rsvpBgImg from "../assets/digital/club-capri/rsvp-bg.png";
import stampFrameSvg from "../assets/digital/club-capri/stamp-frame.svg";
import maskingTapeImg from "../assets/digital/club-capri/masking-tape.png";
import lifebuoyImg from "../assets/digital/club-capri/lifebuoy.png";
import fullReferenceImg from "../assets/digital/club-capri/club-capri-reference.png";

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
const COLOR_TAPE_TEXT = "#E5E2DD";
const COLOR_LIGHT_BLUE = "#C0D5D8";

// Typography
const FONT_PERPETUA = "'Perpetua Titling MT', 'Perpetua', 'Cinzel', serif";
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

export default function ClubCapriFigmaMirror() {
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [isDiffMode, setIsDiffMode] = useState(false);

  // Volume indicator tick x coordinates (11 ticks, 10px apart from 183 to 283)
  const volumeTicks = [183, 193, 203, 213, 223, 233, 243, 253, 263, 273, 283];

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
        id="club-capri-canvas-root"
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
          style={figmaBox({
            x: 93,
            y: 131,
            width: 245,
            height: 83,
            zIndex: 4,
          })}
        >
          <img src={heroTitleSvg} alt="POST Card FROM Summer" style={{ width: 227, height: 74, display: "block" }} />
        </div>

        {/* Chedy Label on Cassette Header (y: 201, x: 125, 73 x 40) */}
        <div
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
            },
          })}
        >
          <img src={chedySvg} alt="Chedy" style={{ width: 47, height: 12, display: "block" }} />
        </div>

        {/* HELA Label on Cassette Header (y: 201, x: 219, 73 x 40) */}
        <div
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
            },
          })}
        >
          <img src={helaSvg} alt="HELA" style={{ width: 37, height: 12, display: "block" }} />
        </div>

        {/* Cassette Tape (y: 116, x: 78, 274 x 490) */}
        <img
          src={cassetteImg}
          alt="Vintage Audio Cassette"
          style={figmaBox({
            x: 78,
            y: 116,
            width: 274,
            height: 490,
            zIndex: 3,
            extra: { objectFit: "cover", pointerEvents: "none" },
          })}
        />

        {/* VOLUME Text (y: 427, x: 102, 73 x 40) */}
        <div
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
              fontFamily: FONT_ROBOTO_MONO,
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "20px",
              color: COLOR_TAPE_TEXT,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            },
          })}
        >
          VOLUME
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
                borderLeft: `2px solid ${COLOR_TAPE_TEXT}`,
              },
            })}
          />
        ))}

        {/* =========================================================================
            SECTION 2: JOIN US IN JUNE (y: 626 - 810)
            ========================================================================= */}
        {/* "Join us in" (y: 626, x: 141, 148 x 46) */}
        <div
          style={figmaBox({
            x: 141,
            y: 626,
            width: 148,
            height: 46,
            zIndex: 2,
            extra: { display: "flex", alignItems: "center", justifyContent: "center" },
          })}
        >
          <img src={joinUsTitleSvg} alt="Join us in" style={{ width: 78, height: 22, display: "block" }} />
        </div>

        {/* "JUNE" (y: 667, x: 96, 239 x 42) */}
        <div
          style={figmaBox({
            x: 96,
            y: 667,
            width: 239,
            height: 42,
            zIndex: 2,
            extra: { display: "flex", alignItems: "center", justifyContent: "center" },
          })}
        >
          <img src={juneTitleSvg} alt="JUNE" style={{ width: 89, height: 31, display: "block" }} />
        </div>

        {/* Invitation Text (y: 715, x: 102, 226 x 57) */}
        <div
          style={figmaBox({
            x: 102,
            y: 715,
            width: 226,
            height: 57,
            zIndex: 2,
            extra: {
              fontFamily: FONT_ROBOTO_MONO,
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "18px",
              color: COLOR_NAVY,
              textTransform: "uppercase",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
          })}
        >
          We warmly invite you to celebrate our wedding day with us.
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
          style={figmaBox({
            x: 141,
            y: 838,
            width: 148,
            height: 46,
            zIndex: 2,
            extra: { display: "flex", alignItems: "center", justifyContent: "center" },
          })}
        >
          <img src={theDayTitleSvg} alt="The Day" style={{ width: 110, height: 32, display: "block" }} />
        </div>

        {/* Countdown Group (y: 913, x: 62, 307 x 64) */}
        <div
          style={figmaBox({
            x: 62,
            y: 913,
            width: 307,
            height: 64,
            zIndex: 3,
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
            60
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
            05
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
            32
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
        <img
          src={boatImg}
          alt="Luxury Yacht"
          style={figmaBox({
            x: 162,
            y: 867,
            width: 269,
            height: 478,
            zIndex: 2,
            extra: { objectFit: "cover", pointerEvents: "none" },
          })}
        />

        {/* =========================================================================
            SECTION 4: CELEBRATIONS & POSTCARDS (y: 1246 - 1950)
            ========================================================================= */}
        {/* "Celebrations" (y: 1246, x: 141, 148 x 46) */}
        <div
          style={figmaBox({
            x: 141,
            y: 1246,
            width: 148,
            height: 46,
            zIndex: 3,
            extra: { display: "flex", alignItems: "center", justifyContent: "center" },
          })}
        >
          <img src={celebrationsTitleSvg} alt="Celebrations" style={{ width: 132, height: 26, display: "block" }} />
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
            },
          })}
        >
          {/* "Postcard" (relative x: 52-26=26, y: 1364-1335=29, 148 x 39) */}
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

          {/* "wedding" (relative x: 6-26=-20, y: 1394-1335=59, 239 x 42) */}
          <div
            style={{
              position: "absolute",
              left: "-20px",
              top: "59px",
              width: "239px",
              height: "42px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src={weddingTitleSvg} alt="wedding" style={{ width: 110, height: 17, display: "block" }} />
          </div>

          {/* Photo 1 (relative x: 68-26=42, y: 1438-1335=103, 115 x 115) */}
          <img
            src={postcardPhoto1}
            alt="Wedding Celebration Aperitif"
            style={{
              position: "absolute",
              left: "42px",
              top: "103px",
              width: "115px",
              height: "115px",
              objectFit: "cover",
            }}
          />

          {/* Vertical Divider Line (relative x: 213-26=187, y: 1364-1335=29, h: 202) */}
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

          {/* Circular Postmark Stamp SVG (relative x: 276-26=250, y: 1353-1335=18, 95.72 x 95.72) */}
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

          {/* Stamp 1 - Sun (relative x: 302.71-26=276.71, y: 1391-1335=56, 39 x 53) */}
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

          {/* Stamp 2 - Capri (relative x: 337.71-26=311.71, y: 1357-1335=22, 39 x 53) */}
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

          {/* "To:" Label (relative x: 236-26=210, y: 1460-1335=125, 26 x 25) */}
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

          {/* Underlines (relative x: 240-26=214, w: 137, h: 0) */}
          <div style={{ position: "absolute", left: "214px", top: "142px", width: "137px", borderTop: `0.25px solid ${COLOR_NAVY}` }} />
          <div style={{ position: "absolute", left: "214px", top: "165px", width: "137px", borderTop: `0.25px solid ${COLOR_NAVY}` }} />
          <div style={{ position: "absolute", left: "214px", top: "188px", width: "137px", borderTop: `0.25px solid ${COLOR_NAVY}` }} />
          <div style={{ position: "absolute", left: "214px", top: "211px", width: "137px", borderTop: `0.25px solid ${COLOR_NAVY}` }} />

          {/* Address Text: "Dar Bouraoui Carthage \n Malaga \n 18h" (relative x: 232-26=206, y: 1481-1335=146, 148 x 117) */}
          <div
            style={{
              position: "absolute",
              left: "206px",
              top: "146px",
              width: "148px",
              height: "117px",
            }}
          >
            <img src={postcardWeddingTextSvg} alt="Dar Bouraoui Carthage Malaga 18h" style={{ width: 120, height: 59, display: "block" }} />
          </div>
        </div>

        {/* -------------------------------------------------------------------------
            POSTCARD 2: HENNA (y: 1631, x: 26, 377 x 255)
            ------------------------------------------------------------------------- */}
        <div
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
            },
          })}
        >
          {/* "Postcard" (relative x: 52-26=26, y: 1660-1631=29, 148 x 39) */}
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

          {/* "henna" (relative x: 6-26=-20, y: 1690-1631=59, 239 x 42) */}
          <div
            style={{
              position: "absolute",
              left: "-20px",
              top: "59px",
              width: "239px",
              height: "42px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src={hennaTitleSvg} alt="henna" style={{ width: 79, height: 17, display: "block" }} />
          </div>

          {/* Photo 2 (relative x: 68-26=42, y: 1734-1631=103, 115 x 115) */}
          <img
            src={postcardPhoto2}
            alt="Henna Celebration"
            style={{
              position: "absolute",
              left: "42px",
              top: "103px",
              width: "115px",
              height: "115px",
              objectFit: "cover",
            }}
          />

          {/* Vertical Divider Line (relative x: 213-26=187, y: 1660-1631=29, h: 202) */}
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

          {/* Circular Postmark Stamp SVG (relative x: 276-26=250, y: 1649-1631=18, 95.72 x 95.72) */}
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

          {/* Stamp 1 - Cocktail (relative x: 302.71-26=276.71, y: 1687-1631=56, 39 x 53) */}
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

          {/* Stamp 2 - Capri (relative x: 337.71-26=311.71, y: 1653-1631=22, 39 x 53) */}
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

          {/* "To:" Label (relative x: 236-26=210, y: 1756-1631=125, 26 x 25) */}
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

          {/* Underlines (relative x: 240-26=214, w: 137, h: 0) */}
          <div style={{ position: "absolute", left: "214px", top: "142px", width: "137px", borderTop: `0.25px solid ${COLOR_NAVY}` }} />
          <div style={{ position: "absolute", left: "214px", top: "165px", width: "137px", borderTop: `0.25px solid ${COLOR_NAVY}` }} />
          <div style={{ position: "absolute", left: "214px", top: "188px", width: "137px", borderTop: `0.25px solid ${COLOR_NAVY}` }} />
          <div style={{ position: "absolute", left: "214px", top: "211px", width: "137px", borderTop: `0.25px solid ${COLOR_NAVY}` }} />

          {/* Address Text: "Dar Bouraoui Carthage \n Malaga \n 18h" (relative x: 232-26=206, y: 1777-1631=146, 148 x 117) */}
          <div
            style={{
              position: "absolute",
              left: "206px",
              top: "146px",
              width: "148px",
              height: "117px",
            }}
          >
            <img src={postcardHennaTextSvg} alt="Dar Bouraoui Carthage Malaga 18h" style={{ width: 120, height: 59, display: "block" }} />
          </div>
        </div>

        {/* =========================================================================
            SECTION 5: DRESS CODE (y: 2005 - 2416)
            ========================================================================= */}
        {/* "Dress Code" (y: 2005, x: 141, 148 x 46) */}
        <div
          style={figmaBox({
            x: 141,
            y: 2005,
            width: 148,
            height: 46,
            zIndex: 2,
            extra: { display: "flex", alignItems: "center", justifyContent: "center" },
          })}
        >
          <img src={dressCodeTitleSvg} alt="Dress Code" style={{ width: 94, height: 19, display: "block" }} />
        </div>

        {/* "casual chic" (y: 2046, x: 89, 253 x 42) */}
        <div
          style={figmaBox({
            x: 89,
            y: 2046,
            width: 253,
            height: 42,
            zIndex: 2,
            extra: { display: "flex", alignItems: "center", justifyContent: "center" },
          })}
        >
          <img src={casualChicTitleSvg} alt="casual chic" style={{ width: 239, height: 28, display: "block" }} />
        </div>

        {/* Dress Code Instruction Copy (y: 2094, x: 102, 226 x 57) */}
        <div
          style={figmaBox({
            x: 102,
            y: 2094,
            width: 226,
            height: 57,
            zIndex: 2,
            extra: {
              fontFamily: FONT_ROBOTO_MONO,
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "18px",
              color: COLOR_NAVY,
              textTransform: "uppercase",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
          })}
        >
          We warmly invite you to celebrate our wedding day with us.
        </div>

        {/* Dress Code Attire Photo (Family) (y: 2138, x: 80, 270 x 278) */}
        <img
          src={dressCodeFamilyImg}
          alt="Casual Chic Attire"
          style={figmaBox({
            x: 80,
            y: 2138,
            width: 270,
            height: 278,
            zIndex: 2,
            extra: { objectFit: "cover" },
          })}
        />

        {/* =========================================================================
            SECTION 6: ARRIVAL & RSVP (y: 2422 - 3227)
            ========================================================================= */}
        {/* "Arrival" (y: 2422, x: 141, 148 x 46) */}
        <div
          style={figmaBox({
            x: 141,
            y: 2422,
            width: 148,
            height: 46,
            zIndex: 2,
            extra: { display: "flex", alignItems: "center", justifyContent: "center" },
          })}
        >
          <img src={arrivalTitleSvg} alt="Arrival" style={{ width: 71, height: 19, display: "block" }} />
        </div>

        {/* "RSVP" (y: 2463, x: 89, 253 x 42) */}
        <div
          style={figmaBox({
            x: 89,
            y: 2463,
            width: 253,
            height: 42,
            zIndex: 2,
            extra: { display: "flex", alignItems: "center", justifyContent: "center" },
          })}
        >
          <img src={rsvpTitleSvg} alt="RSVP" style={{ width: 83, height: 28, display: "block" }} />
        </div>

        {/* RSVP Deadline (y: 2511, x: 102, 226 x 57) */}
        <div
          style={figmaBox({
            x: 102,
            y: 2511,
            width: 226,
            height: 57,
            zIndex: 2,
            extra: {
              fontFamily: FONT_ROBOTO_MONO,
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "18px",
              color: COLOR_NAVY,
              textTransform: "uppercase",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
          })}
        >
          The favour of a reply is kindly requested by the fifteenth of June, 2026
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
        {/* "WILL YOU ATTEND" (y: 2732, x: 55, 152 x 18) */}
        <div
          style={figmaBox({
            x: 55,
            y: 2732,
            width: 152,
            height: 18,
            zIndex: 4,
            extra: {
              fontFamily: FONT_ROBOTO_MONO,
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "18px",
              color: COLOR_NAVY,
              textTransform: "uppercase",
            },
          })}
        >
          Will you attend
        </div>

        {/* Radio Option 1 - Active (y: 2771, x: 55) */}
        <div
          style={figmaBox({
            x: 55,
            y: 2771,
            width: 14,
            height: 14,
            zIndex: 4,
            extra: {
              backgroundColor: COLOR_LIGHT_BLUE,
              borderRadius: "50%",
            },
          })}
        />
        {/* Label Option 1 (y: 2770, x: 79, 133 x 36) */}
        <div
          style={figmaBox({
            x: 79,
            y: 2770,
            width: 133,
            height: 36,
            zIndex: 4,
            extra: {
              fontFamily: FONT_ROBOTO_MONO,
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "18px",
              color: COLOR_NAVY,
              textTransform: "uppercase",
            },
          })}
        >
          Yes, I will be there
        </div>

        {/* Radio Option 2 - Inactive (y: 2771, x: 216) */}
        <div
          style={figmaBox({
            x: 216,
            y: 2771,
            width: 14,
            height: 14,
            zIndex: 4,
            extra: {
              border: `1px solid ${COLOR_LIGHT_BLUE}`,
              borderRadius: "50%",
            },
          })}
        />
        {/* Label Option 2 (y: 2770, x: 240, 135 x 36) */}
        <div
          style={figmaBox({
            x: 240,
            y: 2770,
            width: 135,
            height: 36,
            zIndex: 4,
            extra: {
              fontFamily: FONT_ROBOTO_MONO,
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "18px",
              color: COLOR_NAVY,
              textTransform: "uppercase",
            },
          })}
        >
          Sorry, I can’t make it
        </div>

        {/* Input Field 1: Name (y: 2817, x: 55, 320 x 40) */}
        <div
          style={figmaBox({
            x: 55,
            y: 2817,
            width: 320,
            height: 40,
            zIndex: 4,
            extra: {
              borderBottom: "1px solid #000000",
            },
          })}
        >
          <div
            style={{
              position: "absolute",
              left: "0px",
              top: "10px",
              width: "55px",
              height: "19px",
              fontFamily: FONT_ROBOTO_MONO,
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "18px",
              color: COLOR_NAVY,
              textTransform: "uppercase",
            }}
          >
            Name
          </div>
        </div>

        {/* Input Field 2: Password (y: 2887, x: 55, 320 x 40) */}
        <div
          style={figmaBox({
            x: 55,
            y: 2887,
            width: 320,
            height: 40,
            zIndex: 4,
            extra: {
              borderBottom: "1px solid #000000",
            },
          })}
        >
          <div
            style={{
              position: "absolute",
              left: "0px",
              top: "10px",
              width: "116px",
              height: "19px",
              fontFamily: FONT_ROBOTO_MONO,
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "18px",
              color: COLOR_NAVY,
              textTransform: "uppercase",
            }}
          >
            Password
          </div>
        </div>

        {/* Input Field 3: Phone Number (y: 2957, x: 55, 320 x 40) */}
        <div
          style={figmaBox({
            x: 55,
            y: 2957,
            width: 320,
            height: 40,
            zIndex: 4,
            extra: {
              borderBottom: "1px solid #000000",
            },
          })}
        >
          <div
            style={{
              position: "absolute",
              left: "0px",
              top: "10px",
              width: "152px",
              height: "19px",
              fontFamily: FONT_ROBOTO_MONO,
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "18px",
              color: COLOR_NAVY,
              textTransform: "uppercase",
            }}
          >
            Phone Number
          </div>
        </div>

        {/* Input Field 4: Number of Guests (y: 3027, x: 55, 320 x 40) */}
        <div
          style={figmaBox({
            x: 55,
            y: 3027,
            width: 320,
            height: 40,
            zIndex: 4,
            extra: {
              borderBottom: "1px solid #000000",
            },
          })}
        >
          <div
            style={{
              position: "absolute",
              left: "0px",
              top: "10px",
              width: "176px",
              height: "19px",
              fontFamily: FONT_ROBOTO_MONO,
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "18px",
              color: COLOR_NAVY,
              textTransform: "uppercase",
            }}
          >
            Number of Guests
          </div>
        </div>

        {/* Send Confirmation Button (y: 3097, x: 55, 320 x 40) */}
        <div
          style={figmaBox({
            x: 55,
            y: 3097,
            width: 320,
            height: 40,
            zIndex: 4,
            extra: {
              backgroundColor: COLOR_LIGHT_BLUE,
              borderRadius: "7px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
          })}
        >
          <span
            style={{
              fontFamily: FONT_ROBOTO_MONO,
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "18px",
              color: COLOR_WHITE,
              textTransform: "uppercase",
            }}
          >
            Send Confirmation
          </span>
        </div>

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
          style={figmaBox({
            x: 103,
            y: 3320,
            width: 221,
            height: 41,
            zIndex: 3,
            extra: { display: "flex", alignItems: "center", justifyContent: "center" },
          })}
        >
          <img src={clubCapriTitleSvg} alt="club Capri" style={{ width: 187, height: 44, display: "block" }} />
        </div>

        {/* =========================================================================
            QA OVERLAY: FIGMA REFERENCE COMPARISON
            ========================================================================= */}
        {overlayOpacity > 0 && (
          <img
            src={fullReferenceImg}
            alt="Figma Full Reference"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: `${CANVAS_WIDTH}px`,
              height: `${CANVAS_HEIGHT}px`,
              opacity: overlayOpacity,
              pointerEvents: "none",
              zIndex: 99999,
              mixBlendMode: isDiffMode ? "difference" : "normal",
            }}
          />
        )}
      </div>

      {/* Floating QA Toolbar */}
      <div
        style={{
          position: "fixed",
          left: "50%",
          bottom: "20px",
          transform: "translateX(-50%)",
          backgroundColor: "rgba(15, 23, 42, 0.92)",
          backdropFilter: "blur(12px)",
          color: "#FFFFFF",
          padding: "10px 18px",
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
