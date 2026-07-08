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

const doorSlots = [
  { left: 86, top: 631, width: 63, height: 99 },
  { left: 183, top: 631, width: 63, height: 99 },
  { left: 280, top: 631, width: 63, height: 99 },
];

const formatEventDate = (dateString) => {
  if (!dateString) return { weekday: "", day: "", month: "", year: "" };
  const parts = dateString.split("-");
  if (parts.length < 3) return { weekday: "", day: "", month: "", year: "" };
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  return {
    weekday: d.toLocaleDateString("en-US", { weekday: "long" }),
    day: d.getDate(),
    month: d.toLocaleDateString("en-US", { month: "short" }),
    year: d.getFullYear(),
  };
};

const pct = (value, total) => `${(value / total) * 100}%`;

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

const numberToOrdinalWord = (num) => {
  const ordinals = [
    "First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth",
    "Eleventh", "Twelfth", "Thirteenth", "Fourteenth", "Fifteenth", "Sixteenth", "Seventeenth", "Eighteenth", "Nineteenth", "Twentieth",
    "Twenty-first", "Twenty-second", "Twenty-third", "Twenty-fourth", "Twenty-fifth", "Twenty-sixth", "Twenty-seventh", "Twenty-eighth", "Twenty-ninth", "Thirtieth",
    "Thirty-first"
  ];
  return ordinals[num - 1] || String(num);
};

const getRsvpDeadline = (eventDateString) => {
  if (!eventDateString) {
    return {
      stacked: "The Favour Of A Reply Is\nKindly Requested By The\nFifteenth Of June, 2026",
      inline: "The Favour Of A Reply Is Kindly\nRequested By The Fifteenth Of June, 2026"
    };
  }
  const date = new Date(`${eventDateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return {
      stacked: "The Favour Of A Reply Is\nKindly Requested By The\nFifteenth Of June, 2026",
      inline: "The Favour Of A Reply Is Kindly\nRequested By The Fifteenth Of June, 2026"
    };
  }

  // Subtract exactly 1 month
  const rsvpDate = new Date(date);
  rsvpDate.setMonth(rsvpDate.getMonth() - 1);

  const dayWord = numberToOrdinalWord(rsvpDate.getDate());
  const monthName = rsvpDate.toLocaleString("en", { month: "long" });
  const yearStr = String(rsvpDate.getFullYear());

  return {
    stacked: `The Favour Of A Reply Is\nKindly Requested By The\n${dayWord} Of ${monthName}, ${yearStr}`,
    inline: `The Favour Of A Reply Is Kindly\nRequested By The ${dayWord} Of ${monthName}, ${yearStr}`
  };
};

// Map original graphic layer overrides so they snap exactly perfectly into place
const customTops = {
  'our-story-hand-small.svg': 2070,
  'our-story-photo.png': 2140,
  'our-story-ornament.svg': 2151,
  'dress-code-illustration.png': 2490,
  'programme-flourish-right.svg': 2880,
  'programme-flourish-left.svg': 2900,
  'programme-line-top.svg': 2955,
  'programme-line-bottom.svg': 3035,
  'closing-small-ornament.png': 3810,
};

const baseLayers = exportLayers.map(layer => {
  const name = layer.srcName || layer.name;
  return { ...layer, top: customTops[name] !== undefined ? customTops[name] : layer.top };
});

// Event decorations source of truth (from Outeya / first event)
const eventDecorations = [
  { name: "celebration-right-floral.png", left: 328, top: 17, width: 102, height: 95 },
  { name: "celebration-left-floral.png", left: 0, top: 161, width: 103, height: 95 },
  { name: "celebration-small-floral.png", left: 343, top: 323, width: 57, height: 61 }
];

// A localized section wrapper that provides scoped absolute coordinates for child graphics
const Section = ({ startY, height, bg = "transparent", layerNames = [], children }) => {
  const absoluteBox = ({ left, top, width: w, height: h }) => ({
    position: "absolute",
    left: pct(left, pageWidth),
    top: pct(top - startY, height),
    width: pct(w, pageWidth),
    height: h ? pct(h, height) : undefined,
  });

  const textLayer = ({ left, top, width: w, children: textChildren, color = blue, fontSize = 16, lineHeight, family = "Cormorant Infant, serif", weight = 400, style = "normal", align = "center", letterSpacing = 0, transform, zIndex = 3 }) => (
    <div style={{
      ...absoluteBox({ left, top, width: w }),
      color,
      fontFamily: family,
      fontSize: `clamp(${fontSize * 0.78}px, ${(fontSize / pageWidth) * 100}vw, ${fontSize}px)`,
      fontStyle: style,
      fontWeight: weight,
      lineHeight: lineHeight ? `${lineHeight / fontSize}` : 1.2,
      textAlign: align,
      letterSpacing,
      textTransform: transform,
      whiteSpace: "pre-wrap",
      zIndex,
    }}>
      {textChildren}
    </div>
  );

  const sectionLayers = baseLayers.filter(l => layerNames.includes(l.name));

  return (
    <section style={{ position: "relative", width: "100%", aspectRatio: `${pageWidth} / ${height}`, backgroundColor: bg, overflow: "hidden" }}>
       {sectionLayers.map(layer => (
          <img 
            key={layer.name} 
            src={exportImageSources[layer.srcName || layer.name]} 
            style={{ ...absoluteBox(layer), transform: layer.transform, zIndex: layer.zIndex || 2 }} 
            alt="" 
            draggable="false" 
          />
       ))}
       {children({ absoluteBox, textLayer })}
    </section>
  );
};

function SidiBouSaidInvitePage({ invite = defaultInvite }) {
  const [isIntroFading, setIsIntroFading] = useState(false);
  const [isIntroDone, setIsIntroDone] = useState(invite.videoIntroEnabled === false);
  const [doorFrame, setDoorFrame] = useState(0);
  const doorTimerRef = useRef(null);

  useEffect(() => {
    if (invite.videoIntroEnabled === false) {
      setIsIntroDone(true);
      setIsIntroFading(false);
    } else {
      setIsIntroDone(false);
      setIsIntroFading(false);
    }
  }, [invite.videoIntroEnabled]);

  const lastEvent = useMemo(() => {
    return invite.timeline && invite.timeline.length > 0
      ? invite.timeline[invite.timeline.length - 1]
      : null;
  }, [invite.timeline]);

  const effectiveEventDate = useMemo(() => {
    return lastEvent?.date || invite.eventDate;
  }, [lastEvent, invite.eventDate]);

  const effectiveTime = useMemo(() => {
    return lastEvent?.time || invite.time || "7PM";
  }, [lastEvent, invite.time]);

  const dateParts = useMemo(() => formatDateParts(effectiveEventDate), [effectiveEventDate]);
  const rsvpDeadline = useMemo(() => getRsvpDeadline(effectiveEventDate), [effectiveEventDate]);
  const names = useMemo(() => getNames(invite.coupleNames), [invite.coupleNames]);
  const countdown = useMemo(() => getCountdownParts(effectiveEventDate), [effectiveEventDate]);
  const time = invite.time || "7PM";

  useEffect(() => {
    if (isIntroDone) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
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

  const handleScrollDown = () => {
    const container = document.querySelector('main');
    if (container) {
      const scale = container.clientWidth / pageWidth;
      window.scrollTo({
        top: 500 * scale,
        behavior: "smooth",
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#dcebf0] font-urbanist text-[#0093d8]">
      <div className="mx-auto w-full bg-[#fffcf9] shadow-2xl flex flex-col" style={{ maxWidth: pageWidth }}>
        
        {/* Canvas 1: Hero & Reveal */}
        <Section 
          startY={0} 
          height={804}
          layerNames={[
            "reveal-corner-top-left.png", 
            "reveal-corner-top-right.png", 
            "reveal-hand.svg", 
            "reveal-corner-bottom-left.png", 
            "reveal-corner-bottom-right.png"
          ]}
        >
          {({ absoluteBox, textLayer }) => (
            <>
              <video
                className="absolute left-0 top-0 h-auto w-full"
                style={{ height: pct(501, 804), objectFit: "cover", zIndex: 1 }}
                src={openingVideo}
                autoPlay
                muted
                loop
                playsInline
              />

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
              <button
                type="button"
                onClick={handleScrollDown}
                style={{ 
                  ...absoluteBox({ left: 155, top: 355, width: 120, height: 38 }), 
                  backgroundColor: "#fff", 
                  borderRadius: "100px", 
                  zIndex: 3, 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  border: "none", 
                  cursor: "pointer" 
                }}
              >
                <span style={{ fontFamily: "Cormorant Infant, serif", fontSize: `clamp(12px, ${(15 / pageWidth) * 100}vw, 15px)`, color: blue }}>Scroll down</span>
              </button>

              {/* Reveal Titles */}
              {textLayer({ left: 85, top: 535, width: 260, fontSize: 22, family: "Cormorant Infant, serif", color: blue, children: "Reveal" })}
              {textLayer({ left: 85, top: 565, width: 260, fontSize: 26, family: "Gulzar, serif", color: blue, children: "النهار جاء" })}

              {/* Reveal Box Content */}
              {textLayer({ left: 96, top: 767, width: 44, fontSize: 12, family: "Cormorant Infant, serif", color: "#fff", children: "Day" })}
              {textLayer({ left: 192, top: 767, width: 48, fontSize: 12, family: "Cormorant Infant, serif", color: "#fff", children: "Month" })}
              {textLayer({ left: 288, top: 767, width: 48, fontSize: 12, family: "Cormorant Infant, serif", color: "#fff", children: "Year" })}
              {textLayer({ left: 96, top: 713, width: 44, fontSize: 20, family: "Antic Didone, serif", color: "#fff", children: dateParts.day })}
              {textLayer({ left: 182, top: 713, width: 68, fontSize: 20, family: "Antic Didone, serif", color: "#fff", children: dateParts.month })}
              {textLayer({ left: 276, top: 713, width: 68, fontSize: 20, family: "Antic Didone, serif", color: "#fff", children: dateParts.year })}

              {doorFrameSources.length ? (
                <button
                  type="button"
                  onClick={handleDoorClick}
                  aria-label="Open reveal doors"
                  className="absolute cursor-pointer bg-transparent p-0 focus:outline-none"
                  style={{ ...absoluteBox({ left: 82, top: 610, width: 267, height: 170 }), zIndex: 6 }}
                >
                  {doorSlots.map((door) => (
                    <img
                      key={door.left}
                      src={doorFrameSources[doorFrame]}
                      alt=""
                      className="absolute"
                      style={{ left: pct(door.left - 82, 267), top: pct(door.top - 610, 170), width: pct(door.width, 267), height: pct(door.height, 170) }}
                      draggable="false"
                    />
                  ))}
                </button>
              ) : null}
            </>
          )}
        </Section>

        {/* Canvas 2: Countdown */}
        <Section 
          startY={804} 
          height={246}
          layerNames={["countdown-panel.png"]}
        >
          {({ absoluteBox, textLayer }) => (
            <>
              {textLayer({ left: 85, top: 835, width: 260, fontSize: 22, family: "Cormorant Infant, serif", color: "#fff", letterSpacing: "0.1em", children: "Countdown" })}
              {textLayer({ left: 85, top: 865, width: 260, fontSize: 22, family: "Gulzar, serif", color: "#fff", children: "العد التنازلي" })}

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
            </>
          )}
        </Section>

        {/* Canvas 3: Celebrations Title */}
        <Section startY={1050} height={90}>
          {({ textLayer }) => (
            <>
              {textLayer({ left: 85, top: 1050, width: 260, fontSize: 22, family: "Cormorant Infant, serif", color: blue, letterSpacing: "0.05em", children: "The Celebrations" })}
              {textLayer({ left: 85, top: 1085, width: 260, fontSize: 22, family: "Gulzar, serif", color: blue, children: "الليالي" })}
            </>
          )}
        </Section>

        {/* Canvas 4: Dynamic Flex Celebrations Container */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", backgroundColor: "transparent" }}>
          {(invite.timeline || []).map((event, index) => {
            const startY = 1140 + index * 460;
            return (
              <section 
                key={index} 
                style={{ 
                  position: "relative", 
                  width: "100%", 
                  aspectRatio: `${pageWidth} / 460`, 
                  overflow: "hidden" 
                }}
              >
                {/* Render the identical source-of-truth decorations for each card */}
                {eventDecorations.map(dec => (
                  <img
                    key={dec.name}
                    src={exportImageSources[dec.name]}
                    style={{
                      position: "absolute",
                      left: pct(dec.left, pageWidth),
                      top: pct(dec.top, 460),
                      width: pct(dec.width, pageWidth),
                      height: pct(dec.height, 460),
                      zIndex: 2
                    }}
                    alt=""
                    draggable="false"
                  />
                ))}

                {/* Event Card Content Box */}
                <div 
                  style={{ 
                    position: "absolute",
                    left: pct(55, pageWidth),
                    top: pct(0, 460),
                    width: pct(320, pageWidth),
                    height: pct(420, 460),
                    border: `1.5px solid ${blue}`, 
                    borderRadius: "10px", 
                    zIndex: 3, 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center", 
                    paddingTop: "35px", 
                    backgroundColor: "transparent" 
                  }}
                >
                  <span style={{ fontFamily: "Cormorant Infant, serif", fontSize: `clamp(24px, ${(32 / pageWidth) * 100}vw, 32px)`, color: blue, lineHeight: "1" }}>{event.title}</span>
                  <span style={{ fontFamily: "Gulzar, serif", fontSize: `clamp(20px, ${(24 / pageWidth) * 100}vw, 24px)`, color: blue, lineHeight: "1.2", marginTop: "5px" }}>{event.titleAr}</span>
                  
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "80%", marginTop: "30px" }}>
                    <div style={{ borderTop: "1px solid #777", borderBottom: "1px solid #777", padding: "8px 0", flex: 1, textAlign: "center" }}>
                      <span style={{ fontFamily: "Cormorant Infant, serif", fontSize: `clamp(16px, ${(20 / pageWidth) * 100}vw, 20px)`, color: "rgb(73, 96, 107)" }}>{formatEventDate(event.date || invite.eventDate).weekday}</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 15px" }}>
                      <span style={{ fontFamily: "Cormorant Infant, serif", fontSize: `clamp(30px, ${(36 / pageWidth) * 100}vw, 36px)`, color: "rgb(73, 96, 107)", lineHeight: "1" }}>{formatEventDate(event.date || invite.eventDate).day}</span>
                      <span style={{ fontFamily: "Cormorant Infant, serif", fontSize: `clamp(14px, ${(18 / pageWidth) * 100}vw, 18px)`, color: "rgb(73, 96, 107)", lineHeight: "1", marginTop: "2px" }}>{formatEventDate(event.date || invite.eventDate).year}</span>
                    </div>
                    <div style={{ borderTop: "1px solid #777", borderBottom: "1px solid #777", padding: "8px 0", flex: 1, textAlign: "center" }}>
                      <span style={{ fontFamily: "Cormorant Infant, serif", fontSize: `clamp(16px, ${(20 / pageWidth) * 100}vw, 20px)`, color: "rgb(73, 96, 107)" }}>{formatEventDate(event.date || invite.eventDate).month}</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "40px" }}>
                    <span style={{ fontFamily: "Cormorant Infant, serif", fontSize: `clamp(10px, ${(13 / pageWidth) * 100}vw, 13px)`, color: blue, letterSpacing: "0.15em", textTransform: "uppercase", textAlign: "center", lineHeight: "1.4", whiteSpace: "pre-wrap" }}>{`${event.venue || ""}\n${event.city || ""}`}</span>
                    <span style={{ fontFamily: "Gulzar, serif", fontSize: `clamp(14px, ${(18 / pageWidth) * 100}vw, 18px)`, color: blue, textAlign: "center", marginTop: "10px", lineHeight: "1.4" }}>{getArabicVenueAndCity(event.venue, event.city)}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => window.open(event.mapUrl || invite.mapUrl || "https://maps.google.com", "_blank")}
                    style={{ border: "1px solid #e0e0e0", borderRadius: "10px", padding: "10px 20px", marginTop: "35px", backgroundColor: "#fff", cursor: "pointer" }}
                  >
                    <span style={{ fontFamily: "Cormorant Infant, serif", fontSize: `clamp(10px, ${(12 / pageWidth) * 100}vw, 12px)`, color: "rgb(73, 96, 107)", letterSpacing: "0.1em" }}>Open in maps</span>
                  </button>
                </div>
              </section>
            );
          })}
        </div>

        {/* Canvas 5: Our Story */}
        <Section 
          startY={2060} 
          height={370}
          layerNames={[
            "our-story-hand-small.svg", 
            "our-story-photo.png", 
            "our-story-ornament.svg"
          ]}
        >
          {({ absoluteBox, textLayer }) => (
            <>
              <div style={{ ...absoluteBox({ left: 0, top: 2140, width: 215, height: 267 }), backgroundImage: "linear-gradient(to bottom, #0093D8, #251380)", zIndex: 1 }}></div>
              
              {textLayer({ left: 20, top: 2160, width: 185, fontSize: 22, family: "Cormorant Infant, serif", color: "#fff", align: "right", letterSpacing: "0.05em", children: "Our Story" })}
              {textLayer({ left: 20, top: 2190, width: 185, fontSize: 22, family: "Gulzar, serif", color: "#fff", align: "right", children: "حكايتنا" })}
              {textLayer({ left: 10, top: 2235, width: 195, fontSize: 11, lineHeight: 18, family: "Cormorant Infant, serif", color: "#fff", align: "right", children: rsvpDeadline.stacked })}
              {textLayer({ left: 10, top: 2290, width: 195, fontSize: 13, lineHeight: 22, family: "Amiri, serif", color: "#fff", align: "right", children: "اللهم ألّف بين قلوبنا، واجعل بيننا\nمودّة ورحمة، وبارك لنا\nفي زواجنا واجعله سكينةً لنا في الدنيا\nوالآخرة" })}
            </>
          )}
        </Section>

        {/* Canvas 6: Dress Code */}
        <Section 
          startY={2430} 
          height={350}
          layerNames={["dress-code-illustration.png"]}
        >
          {({ textLayer }) => (
            <>
              {textLayer({ left: 85, top: 2430, width: 260, fontSize: 22, family: "Cormorant Infant, serif", color: blue, align: "center", letterSpacing: "0.05em", children: "Dress Code" })}
              {textLayer({ left: 85, top: 2460, width: 260, fontSize: 22, family: "Gulzar, serif", color: blue, align: "center", children: "التبديلة" })}
            </>
          )}
        </Section>

        {/* Canvas 7: Programme */}
        <Section 
          startY={2780} 
          height={340}
          layerNames={[
            "programme-flourish-right.svg", 
            "programme-flourish-left.svg", 
            "programme-line-top.svg", 
            "programme-line-bottom.svg"
          ]}
        >
          {({ textLayer }) => (
            <>
              {textLayer({ left: 85, top: 2780, width: 260, fontSize: 22, family: "Cormorant Infant, serif", color: blue, align: "center", letterSpacing: "0.05em", children: "Programme" })}
              {textLayer({ left: 85, top: 2810, width: 260, fontSize: 22, family: "Gulzar, serif", color: blue, align: "center", children: "البرنامج" })}
              {textLayer({ left: 58, top: 2975, width: 241, fontSize: 12, lineHeight: 18, family: "Cormorant Infant, serif", color: "rgb(73, 96, 107)", align: "center", children: effectiveTime })}
            </>
          )}
        </Section>

        {/* Canvas 8: RSVP */}
        {invite.rsvpEnabled !== false ? (
          <Section startY={3120} height={560}>
            {({ absoluteBox, textLayer }) => (
              <>
                {textLayer({ left: 131, top: 3120, width: 168, fontSize: 22, family: "Cormorant Infant, serif", color: blue, align: "center", letterSpacing: "0.05em", children: "RSVP" })}
                {textLayer({ left: 45, top: 3155, width: 340, fontSize: 12, lineHeight: 20, family: "Cormorant Infant, serif", color: "rgb(73, 96, 107)", align: "center", children: rsvpDeadline.inline })}

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
              </>
            )}
          </Section>
        ) : null}

        {/* Canvas 9: Footer */}
        <Section 
          startY={3680} 
          height={320}
          layerNames={["closing-small-ornament.png"]}
        >
          {({ absoluteBox, textLayer }) => (
            <>
              <div style={{ ...absoluteBox({ left: 194, top: 3680, width: 42, height: 64 }), border: `1.5px solid ${blue}`, borderRadius: "100px", zIndex: 3 }}>
                <div style={{ position: "absolute", top: "15%", left: "20%", color: blue, fontFamily: "Cormorant Infant, serif", fontSize: `clamp(20px, ${(25 / pageWidth) * 100}vw, 25px)`, lineHeight: "1", fontWeight: "600" }}>{names.firstName.charAt(0).toUpperCase()}</div>
                <div style={{ position: "absolute", bottom: "15%", right: "20%", color: blue, fontFamily: "Cormorant Infant, serif", fontSize: `clamp(20px, ${(25 / pageWidth) * 100}vw, 25px)`, lineHeight: "1", fontWeight: "600" }}>{names.secondName.charAt(0).toUpperCase()}</div>
              </div>
              {textLayer({ left: 85, top: 3766, width: 260, fontSize: 26, family: "Gulzar, serif", color: blue, align: "center", children: "ان شاء الله ليلتكم زينة" })}
            </>
          )}
        </Section>

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
