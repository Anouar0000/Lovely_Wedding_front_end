import React, { useEffect, useMemo, useRef, useState } from "react";
import openingVideo from "../assets/videos/Mediterranean_Sea_harbor_bougain.mp4";
import exportLayers from "../assets/digital/sidi-bousaid/export-v2/layers.json";
import templateConfig from "../data/digital/templates/sidi-bousaid.json";

const exportImageContext = require.context("../assets/digital/sidi-bousaid/export-v2", false, /\.(png|svg)$/);
const exportImageSources = exportImageContext.keys().reduce((images, key) => {
  images[key.replace("./", "")] = exportImageContext(key);
  return images;
}, {});

const doorFrameContext = require.context("../assets/digital/sidi-bousaid/renders-webp", false, /\.webp$/);
const doorFrameSources = doorFrameContext
  .keys()
  .sort()
  .map((key) => doorFrameContext(key));

const defaultInvite = templateConfig.sample;
const blue = "#0093d8";
const pageWidth = 430;
const pageHeight = 4000;
const doorSlots = [
  { left: 92, top: 631, width: 59, height: 99 },
  { left: 189, top: 631, width: 59, height: 99 },
  { left: 286, top: 631, width: 59, height: 99 },
];

const pct = (value, total) => `${(value / total) * 100}%`;

const absoluteBox = ({ left, top, width, height }, sectionHeight = pageHeight) => ({
  position: "absolute",
  left: pct(left, pageWidth),
  top: pct(top, sectionHeight),
  width: pct(width, pageWidth),
  height: height ? pct(height, sectionHeight) : undefined,
});

const textLayer = ({
  left,
  top,
  width,
  children,
  color = blue,
  fontSize = 16,
  lineHeight,
  family = "Cormorant Infant, serif",
  weight = 400,
  style = "normal",
  align = "center",
  letterSpacing = 0,
  transform,
  zIndex = 3,
}) => (
  <div
    style={{
      ...absoluteBox({ left, top, width }, pageHeight),
      color,
      fontFamily: family,
      fontSize: `clamp(${fontSize * 0.78}px, ${(fontSize / pageWidth) * 100}vw, ${fontSize}px)`,
      fontStyle: style,
      fontWeight: weight,
      lineHeight: lineHeight ? `${lineHeight / fontSize}` : 1.2,
      letterSpacing,
      textAlign: align,
      textTransform: transform,
      whiteSpace: "pre-wrap",
      zIndex,
    }}
  >
    {children}
  </div>
);

const formatDateParts = (dateString) => {
  if (!dateString) {
    return { day: "20", month: "July", weekday: "Monday", year: "2026", display: "20 July 2026" };
  }

  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return { day: "20", month: "July", weekday: "Monday", year: "2026", display: "20 July 2026" };
  }

  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: date.toLocaleString("en", { month: "long" }),
    weekday: date.toLocaleString("en", { weekday: "long" }),
    year: String(date.getFullYear()),
    display: date.toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
  };
};

const getArabicVenueAndCity = (venue, city) => {
  const venueLower = (venue || "").toLowerCase();
  const cityLower = (city || "").toLowerCase();
  if (venueLower.includes("dar sidi") || cityLower.includes("sidi bou said")) {
    return "دار سيدي بوسعيد";
  }
  return "هيفاء بالاصمرناق";
};

const getNames = (coupleNames) => {
  const [firstName = "Sarah", secondName = "Hedi"] = (coupleNames || "Sarah & Hedi").split(/\s*&\s*|\s+et\s+/i);

  return {
    firstName: firstName.trim() || "Sarah",
    secondName: secondName.trim() || "Hedi",
  };
};

const getCountdownParts = (dateString) => {
  const eventDate = dateString ? new Date(`${dateString}T00:00:00`) : new Date("2026-07-20T00:00:00");
  const diff = Math.max(0, eventDate.getTime() - Date.now());
  const totalHours = Math.floor(diff / (1000 * 60 * 60));
  return {
    days: Math.floor(totalHours / 24),
    hours: totalHours % 24,
    minutes: Math.floor((diff / (1000 * 60)) % 60),
  };
};

function SidiBouSaidInvitePage({ invite = defaultInvite }) {
  const [isIntroFading, setIsIntroFading] = useState(false);
  const [isIntroDone, setIsIntroDone] = useState(false);
  const [doorFrame, setDoorFrame] = useState(0);
  const doorTimerRef = useRef(null);
  const dateParts = useMemo(() => formatDateParts(invite.eventDate), [invite.eventDate]);
  const names = useMemo(() => getNames(invite.coupleNames), [invite.coupleNames]);
  const countdown = useMemo(() => getCountdownParts(invite.eventDate), [invite.eventDate]);
  const venueName = invite.venueName || "Haifa Palace";
  const city = invite.city || "Mornag";
  const time = invite.time || "7PM";

  const adjustedLayers = useMemo(() => {
    return exportLayers.map(layer => {
      let top = layer.top;
      if (layer.name === 'our-story-hand-small.svg') {
        top = 2070;
      } else if (layer.name === 'our-story-photo.png') {
        top = 2140;
      } else if (layer.name === 'our-story-ornament.svg') {
        top = 2151;
      } else if (layer.name === 'dress-code-illustration.png') {
        top = 2490;
      } else if (layer.name === 'programme-flourish-right.svg') {
        top = 2880;
      } else if (layer.name === 'programme-flourish-left.svg') {
        top = 2900;
      } else if (layer.name === 'programme-line-top.svg') {
        top = 2955;
      } else if (layer.name === 'programme-line-bottom.svg') {
        top = 3035;
      } else if (layer.name === 'closing-small-ornament.png') {
        top = 3810;
      }
      return { ...layer, top };
    });
  }, []);

  useEffect(() => {
    if (isIntroDone) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isIntroDone]);

  useEffect(() => {
    doorFrameSources.forEach((frame) => {
      const image = new Image();
      image.src = frame;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (doorTimerRef.current) {
        window.clearInterval(doorTimerRef.current);
      }
    };
  }, []);

  const completeIntro = () => {
    setIsIntroFading(true);
    window.setTimeout(() => setIsIntroDone(true), 900);
  };

  const handleVideoTimeUpdate = (event) => {
    const video = event.currentTarget;

    if (video.duration && video.duration - video.currentTime < 1.1) {
      setIsIntroFading(true);
    }
  };

  const handleDoorClick = () => {
    if (!doorFrameSources.length || doorTimerRef.current || doorFrame === doorFrameSources.length - 1) {
      return;
    }

    setDoorFrame(0);

    doorTimerRef.current = window.setInterval(() => {
      setDoorFrame((currentFrame) => {
        const nextFrame = currentFrame + 1;
        if (nextFrame >= doorFrameSources.length - 1) {
          window.clearInterval(doorTimerRef.current);
          doorTimerRef.current = null;
          return doorFrameSources.length - 1;
        }

        return nextFrame;
      });
    }, 34);
  };

  return (
    <main className="min-h-screen bg-[#dcebf0] font-urbanist text-[#0093d8]">
      <div className="mx-auto w-full bg-[#fffcf9] shadow-2xl" style={{ maxWidth: pageWidth }}>
        <section className="relative w-full overflow-hidden" style={{ aspectRatio: `${pageWidth} / ${pageHeight}` }}>
          <video
            className="absolute left-0 top-0 h-auto w-full"
            style={{ height: pct(501, pageHeight), objectFit: "cover", zIndex: 1 }}
            src={openingVideo}
            autoPlay
            muted
            loop
            playsInline
          />

          {adjustedLayers
            .map((layer) => (
              <img
                key={layer.name}
                src={exportImageSources[layer.srcName || layer.name]}
                alt=""
                style={{ ...absoluteBox(layer), transform: layer.transform, zIndex: layer.zIndex || 2 }}
                draggable="false"
              />
            ))}

          {/* Initials Oval */}
          <div style={{ ...absoluteBox({ left: 194, top: 75, width: 42, height: 64 }), border: "1.5px solid #fff", borderRadius: "100px", zIndex: 3 }}>
            <div style={{ position: "absolute", top: "15%", left: "20%", color: "#fff", fontFamily: "Cormorant Infant, serif", fontSize: `clamp(20px, ${(25 / pageWidth) * 100}vw, 25px)`, lineHeight: "1", fontWeight: "600" }}>{names.firstName.charAt(0).toUpperCase()}</div>
            <div style={{ position: "absolute", bottom: "15%", right: "20%", color: "#fff", fontFamily: "Cormorant Infant, serif", fontSize: `clamp(20px, ${(25 / pageWidth) * 100}vw, 25px)`, lineHeight: "1", fontWeight: "600" }}>{names.secondName.charAt(0).toUpperCase()}</div>
          </div>

          {/* Names */}
          {textLayer({ left: 85, top: 168, width: 260, fontSize: 46, lineHeight: 46, family: "Cormorant Infant, serif", color: "#fff", children: `${names.firstName}\n${names.secondName}` })}

          {/* Subtitle */}
          {textLayer({ left: 85, top: 285, width: 260, fontSize: 16, lineHeight: 18, family: "Cormorant Infant, serif", color: "#fff", letterSpacing: "0.1em", children: "Welcome To Our\nMediterranean Abode" })}

          {/* Dates Left and Right */}
          {textLayer({ left: 80, top: 216, width: 75, fontSize: 17, lineHeight: 18, family: "Cormorant Infant, serif", style: "italic", color: "#fff", transform: "uppercase", letterSpacing: "0.15em", align: "right", children: dateParts.month })}
          {textLayer({ left: 275, top: 216, width: 75, fontSize: 17, lineHeight: 18, family: "Cormorant Infant, serif", style: "italic", color: "#fff", transform: "uppercase", letterSpacing: "0.15em", align: "left", children: dateParts.year })}

          {/* Scroll down button */}
          <div style={{ ...absoluteBox({ left: 155, top: 355, width: 120, height: 38 }), backgroundColor: "#fff", borderRadius: "100px", zIndex: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "Cormorant Infant, serif", fontSize: `clamp(12px, ${(15 / pageWidth) * 100}vw, 15px)`, color: blue }}>Scroll down</span>
          </div>

          {/* Reveal Titles */}
          {textLayer({ left: 85, top: 535, width: 260, fontSize: 22, family: "Cormorant Infant, serif", color: blue, children: "Reveal" })}
          {textLayer({ left: 85, top: 565, width: 260, fontSize: 26, family: "Gulzar, serif", color: blue, children: "النهار جاء" })}

          {textLayer({ left: 96, top: 767, width: 44, fontSize: 12, family: "Cormorant Infant, serif", color: "#fff", children: "Day" })}
          {textLayer({ left: 192, top: 767, width: 48, fontSize: 12, family: "Cormorant Infant, serif", color: "#fff", children: "Month" })}
          {textLayer({ left: 288, top: 767, width: 48, fontSize: 12, family: "Cormorant Infant, serif", color: "#fff", children: "Year" })}
          {textLayer({ left: 96, top: 713, width: 44, fontSize: 20, family: "Antic Didone, serif", color: "#fff", children: dateParts.day })}
          {textLayer({ left: 182, top: 713, width: 68, fontSize: 20, family: "Antic Didone, serif", color: "#fff", children: dateParts.month })}
          {textLayer({ left: 276, top: 713, width: 68, fontSize: 20, family: "Antic Didone, serif", color: "#fff", children: dateParts.year })}

          {/* Countdown Titles */}
          {textLayer({ left: 85, top: 835, width: 260, fontSize: 22, family: "Cormorant Infant, serif", color: "#fff", letterSpacing: "0.1em", children: "Countdown" })}
          {textLayer({ left: 85, top: 865, width: 260, fontSize: 22, family: "Gulzar, serif", color: "#fff", children: "العد التنازلي" })}

          {/* Countdown Boxes */}
          {[
            { left: 75, value: countdown.days, label: "Days" },
            { left: 185, value: countdown.hours, label: "Hours" },
            { left: 295, value: countdown.minutes, label: "Minutes" },
          ].map((box) => (
            <div
              key={box.label}
              style={{
                ...absoluteBox({ left: box.left, top: 920, width: 60, height: 60 }),
                backgroundColor: "rgba(240, 248, 255, 0.9)",
                border: `1px solid ${blue}`,
                borderRadius: "12px",
                zIndex: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ fontFamily: "Cormorant Infant, serif", fontSize: `clamp(14px, ${(16 / pageWidth) * 100}vw, 16px)`, color: blue, lineHeight: "1.2", fontWeight: "600" }}>{String(box.value).padStart(2, '0')}</div>
              <div style={{ fontFamily: "Cormorant Infant, serif", fontSize: `clamp(9px, ${(10 / pageWidth) * 100}vw, 10px)`, color: blue, letterSpacing: "0.05em", marginTop: "2px" }}>{box.label}</div>
            </div>
          ))}

          {/* Celebrations Title */}
          {textLayer({ left: 85, top: 1050, width: 260, fontSize: 22, family: "Cormorant Infant, serif", color: blue, letterSpacing: "0.05em", children: "The Celebrations" })}
          {textLayer({ left: 85, top: 1085, width: 260, fontSize: 22, family: "Gulzar, serif", color: blue, children: "الليالي" })}

          {/* Outeya Box */}
          <div style={{ ...absoluteBox({ left: 55, top: 1140, width: 320, height: 420 }), border: `1.5px solid ${blue}`, borderRadius: "10px", zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "35px", backgroundColor: "transparent" }}>
            {/* Title */}
            <span style={{ fontFamily: "Cormorant Infant, serif", fontSize: `clamp(24px, ${(32 / pageWidth) * 100}vw, 32px)`, color: blue, lineHeight: "1" }}>Outeya</span>
            <span style={{ fontFamily: "Gulzar, serif", fontSize: `clamp(20px, ${(24 / pageWidth) * 100}vw, 24px)`, color: blue, lineHeight: "1.2", marginTop: "5px" }}>الوطية</span>
            
            {/* Date Layout */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "80%", marginTop: "30px" }}>
              <div style={{ borderTop: "1px solid #777", borderBottom: "1px solid #777", padding: "8px 0", flex: 1, textAlign: "center" }}>
                <span style={{ fontFamily: "Cormorant Infant, serif", fontSize: `clamp(16px, ${(20 / pageWidth) * 100}vw, 20px)`, color: "rgb(73, 96, 107)" }}>{dateParts.weekday}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 15px" }}>
                <span style={{ fontFamily: "Cormorant Infant, serif", fontSize: `clamp(30px, ${(36 / pageWidth) * 100}vw, 36px)`, color: "rgb(73, 96, 107)", lineHeight: "1" }}>{dateParts.day}</span>
                <span style={{ fontFamily: "Cormorant Infant, serif", fontSize: `clamp(14px, ${(18 / pageWidth) * 100}vw, 18px)`, color: "rgb(73, 96, 107)", lineHeight: "1", marginTop: "2px" }}>{dateParts.year}</span>
              </div>
              <div style={{ borderTop: "1px solid #777", borderBottom: "1px solid #777", padding: "8px 0", flex: 1, textAlign: "center" }}>
                <span style={{ fontFamily: "Cormorant Infant, serif", fontSize: `clamp(16px, ${(20 / pageWidth) * 100}vw, 20px)`, color: "rgb(73, 96, 107)" }}>{dateParts.month}</span>
              </div>
            </div>

            {/* Venue Layout */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "40px" }}>
              <span style={{ fontFamily: "Cormorant Infant, serif", fontSize: `clamp(10px, ${(13 / pageWidth) * 100}vw, 13px)`, color: blue, letterSpacing: "0.15em", textTransform: "uppercase", textAlign: "center", lineHeight: "1.4", whiteSpace: "pre-wrap" }}>{`${venueName}\n${city}`}</span>
              <span style={{ fontFamily: "Gulzar, serif", fontSize: `clamp(14px, ${(18 / pageWidth) * 100}vw, 18px)`, color: blue, textAlign: "center", marginTop: "10px", lineHeight: "1.4" }}>{getArabicVenueAndCity(venueName, city)}</span>
            </div>

            {/* Maps Button */}
            <div style={{ border: "1px solid #e0e0e0", borderRadius: "10px", padding: "10px 20px", marginTop: "35px", backgroundColor: "#fff" }}>
              <span style={{ fontFamily: "Cormorant Infant, serif", fontSize: `clamp(10px, ${(12 / pageWidth) * 100}vw, 12px)`, color: "rgb(73, 96, 107)", letterSpacing: "0.1em" }}>Open in maps</span>
            </div>
          </div>

          {/* Mariage Box */}
          <div style={{ ...absoluteBox({ left: 55, top: 1600, width: 320, height: 420 }), border: `1.5px solid ${blue}`, borderRadius: "10px", zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "35px", backgroundColor: "transparent" }}>
            {/* Title */}
            <span style={{ fontFamily: "Cormorant Infant, serif", fontSize: `clamp(24px, ${(32 / pageWidth) * 100}vw, 32px)`, color: blue, lineHeight: "1" }}>Mariage</span>
            <span style={{ fontFamily: "Gulzar, serif", fontSize: `clamp(20px, ${(24 / pageWidth) * 100}vw, 24px)`, color: blue, lineHeight: "1.2", marginTop: "5px" }}>العرس</span>
            
            {/* Date Layout */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "80%", marginTop: "30px" }}>
              <div style={{ borderTop: "1px solid #777", borderBottom: "1px solid #777", padding: "8px 0", flex: 1, textAlign: "center" }}>
                <span style={{ fontFamily: "Cormorant Infant, serif", fontSize: `clamp(16px, ${(20 / pageWidth) * 100}vw, 20px)`, color: "rgb(73, 96, 107)" }}>{dateParts.weekday}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 15px" }}>
                <span style={{ fontFamily: "Cormorant Infant, serif", fontSize: `clamp(30px, ${(36 / pageWidth) * 100}vw, 36px)`, color: "rgb(73, 96, 107)", lineHeight: "1" }}>{dateParts.day}</span>
                <span style={{ fontFamily: "Cormorant Infant, serif", fontSize: `clamp(14px, ${(18 / pageWidth) * 100}vw, 18px)`, color: "rgb(73, 96, 107)", lineHeight: "1", marginTop: "2px" }}>{dateParts.year}</span>
              </div>
              <div style={{ borderTop: "1px solid #777", borderBottom: "1px solid #777", padding: "8px 0", flex: 1, textAlign: "center" }}>
                <span style={{ fontFamily: "Cormorant Infant, serif", fontSize: `clamp(16px, ${(20 / pageWidth) * 100}vw, 20px)`, color: "rgb(73, 96, 107)" }}>{dateParts.month}</span>
              </div>
            </div>

            {/* Venue Layout */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "40px" }}>
              <span style={{ fontFamily: "Cormorant Infant, serif", fontSize: `clamp(10px, ${(13 / pageWidth) * 100}vw, 13px)`, color: blue, letterSpacing: "0.15em", textTransform: "uppercase", textAlign: "center", lineHeight: "1.4", whiteSpace: "pre-wrap" }}>{`${venueName}\n${city}`}</span>
              <span style={{ fontFamily: "Gulzar, serif", fontSize: `clamp(14px, ${(18 / pageWidth) * 100}vw, 18px)`, color: blue, textAlign: "center", marginTop: "10px", lineHeight: "1.4" }}>{getArabicVenueAndCity(venueName, city)}</span>
            </div>

            {/* Maps Button */}
            <div style={{ border: "1px solid #e0e0e0", borderRadius: "10px", padding: "10px 20px", marginTop: "35px", backgroundColor: "#fff" }}>
              <span style={{ fontFamily: "Cormorant Infant, serif", fontSize: `clamp(10px, ${(12 / pageWidth) * 100}vw, 12px)`, color: "rgb(73, 96, 107)", letterSpacing: "0.1em" }}>Open in maps</span>
            </div>
          </div>

          {/* Our Story Background (Left Half) */}
          <div style={{ ...absoluteBox({ left: 0, top: 2140, width: 215, height: 267 }), backgroundImage: "linear-gradient(to bottom, #0093D8, #251380)", zIndex: 1 }}></div>
          
          {/* Our Story */}
          {textLayer({ left: 20, top: 2160, width: 185, fontSize: 22, family: "Cormorant Infant, serif", color: "#fff", align: "right", letterSpacing: "0.05em", children: "Our Story" })}
          {textLayer({ left: 20, top: 2190, width: 185, fontSize: 22, family: "Gulzar, serif", color: "#fff", align: "right", children: "حكايتنا" })}
          {textLayer({ left: 10, top: 2235, width: 195, fontSize: 11, lineHeight: 18, family: "Cormorant Infant, serif", color: "#fff", align: "right", children: "The Favour Of A Reply Is\nKindly Requested By The\nFifteenth Of June, 2026" })}
          {textLayer({ left: 10, top: 2290, width: 195, fontSize: 13, lineHeight: 22, family: "Amiri, serif", color: "#fff", align: "right", children: "اللهم ألّف بين قلوبنا، واجعل بيننا\nمودّة ورحمة، وبارك لنا\nفي زواجنا واجعله سكينةً لنا في الدنيا\nوالآخرة" })}

          {/* Dress Code */}
          {textLayer({ left: 85, top: 2430, width: 260, fontSize: 22, family: "Cormorant Infant, serif", color: blue, align: "center", letterSpacing: "0.05em", children: "Dress Code" })}
          {textLayer({ left: 85, top: 2460, width: 260, fontSize: 22, family: "Gulzar, serif", color: blue, align: "center", children: "التبديلة" })}
          
          {/* Programme */}
          {textLayer({ left: 85, top: 2780, width: 260, fontSize: 22, family: "Cormorant Infant, serif", color: blue, align: "center", letterSpacing: "0.05em", children: "Programme" })}
          {textLayer({ left: 85, top: 2810, width: 260, fontSize: 22, family: "Gulzar, serif", color: blue, align: "center", children: "البرنامج" })}

          {textLayer({ left: 58, top: 2975, width: 241, fontSize: 12, lineHeight: 18, family: "Cormorant Infant, serif", color: "rgb(73, 96, 107)", align: "center", children: time })}
          
          {/* RSVP Title */}
          {textLayer({ left: 131, top: 3120, width: 168, fontSize: 22, family: "Cormorant Infant, serif", color: blue, align: "center", letterSpacing: "0.05em", children: "RSVP" })}
          {textLayer({ left: 45, top: 3155, width: 340, fontSize: 12, lineHeight: 20, family: "Cormorant Infant, serif", color: "rgb(73, 96, 107)", align: "center", children: "The Favour Of A Reply Is Kindly\nRequested By The Fifteenth Of June, 2026" })}

          {/* RSVP Form */}
          <div style={{ ...absoluteBox({ left: 40, top: 3220, width: 350, height: 420 }), zIndex: 10, display: "flex", flexDirection: "column", gap: "15px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontFamily: "Cormorant Infant, serif", fontSize: "16px", color: "rgb(73, 96, 107)", fontWeight: 600 }}>Name</label>
              <input type="text" style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "8px", outline: "none", fontFamily: "Cormorant Infant, serif", fontSize: "16px", backgroundColor: "#fff" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontFamily: "Cormorant Infant, serif", fontSize: "16px", color: "rgb(73, 96, 107)", fontWeight: 600 }}>Sir Name</label>
              <input type="text" style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "8px", outline: "none", fontFamily: "Cormorant Infant, serif", fontSize: "16px", backgroundColor: "#fff" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontFamily: "Cormorant Infant, serif", fontSize: "16px", color: "rgb(73, 96, 107)", fontWeight: 600 }}>Email</label>
              <input type="email" style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "8px", outline: "none", fontFamily: "Cormorant Infant, serif", fontSize: "16px", backgroundColor: "#fff" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontFamily: "Cormorant Infant, serif", fontSize: "16px", color: "rgb(73, 96, 107)", fontWeight: 600 }}>Number of guests</label>
              <input type="number" style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "8px", outline: "none", fontFamily: "Cormorant Infant, serif", fontSize: "16px", backgroundColor: "#fff" }} />
            </div>
            <button style={{ backgroundColor: "#008CDE", color: "#fff", padding: "16px", borderRadius: "8px", border: "none", marginTop: "15px", fontFamily: "Cormorant Infant, serif", fontSize: "18px", cursor: "pointer", width: "100%" }}>
              Send Confirmation
            </button>
          </div>

          {/* Bottom Logo */}
          <div style={{ ...absoluteBox({ left: 194, top: 3680, width: 42, height: 64 }), border: `1.5px solid ${blue}`, borderRadius: "100px", zIndex: 3 }}>
            <div style={{ position: "absolute", top: "15%", left: "20%", color: blue, fontFamily: "Cormorant Infant, serif", fontSize: `clamp(20px, ${(25 / pageWidth) * 100}vw, 25px)`, lineHeight: "1", fontWeight: "600" }}>{names.firstName.charAt(0).toUpperCase()}</div>
            <div style={{ position: "absolute", bottom: "15%", right: "20%", color: blue, fontFamily: "Cormorant Infant, serif", fontSize: `clamp(20px, ${(25 / pageWidth) * 100}vw, 25px)`, lineHeight: "1", fontWeight: "600" }}>{names.secondName.charAt(0).toUpperCase()}</div>
          </div>
          {textLayer({ left: 85, top: 3766, width: 260, fontSize: 26, family: "Gulzar, serif", color: blue, align: "center", children: "ان شاء الله ليلتكم زينة" })}

          {doorFrameSources.length ? (
            <button
              type="button"
              onClick={handleDoorClick}
              aria-label="Open reveal doors"
              className="absolute cursor-pointer bg-transparent p-0 focus:outline-none"
              style={{ left: pct(82, pageWidth), top: pct(610, pageHeight), width: pct(267, pageWidth), height: pct(170, pageHeight), zIndex: 6 }}
            >
              {doorSlots.map((door) => (
                <img
                  key={door.left}
                  src={doorFrameSources[doorFrame]}
                  alt=""
                  className="absolute"
                  style={{ left: pct(door.left - 82, 267), top: pct(door.top - 610, 170), width: pct(door.width, 270), height: pct(door.height, 170) }}
                  draggable="false"
                />
              ))}
            </button>
          ) : null}
        </section>
      </div>

      {!isIntroDone ? (
        <div
          className={`fixed inset-0 z-50 bg-black transition-opacity duration-1000 ${isIntroFading ? "opacity-0" : "opacity-100"}`}
          aria-hidden="true"
        >
          <video
            className="h-full w-full object-cover"
            src={openingVideo}
            autoPlay
            muted
            playsInline
            onTimeUpdate={handleVideoTimeUpdate}
            onEnded={completeIntro}
            onError={completeIntro}
          />
        </div>
      ) : null}
    </main>
  );
}

export default SidiBouSaidInvitePage;
