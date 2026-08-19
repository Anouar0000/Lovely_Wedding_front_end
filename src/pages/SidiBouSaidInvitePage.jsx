import React, { useEffect, useMemo, useRef, useState } from "react";
import openingVideo from "../assets/videos/Mediterranean_Sea_harbor_bougain.mp4";
import exportLayers from "../assets/digital/sidi-bousaid/export-v2/layers.json";
import templateConfig from "../data/digital/templates/sidi-bousaid.json";
import ParticleEmitter from "../components/animations/ParticleEmitter";
import AudioPlayer from "../components/audio/AudioPlayer";

// Import figma assets for Our Story
import watercolorBougainvillea from "../assets/digital/sidi-bousaid/exported/watercolor-bougainvillea-figma.png";
import tape from "../assets/digital/sidi-bousaid/exported/tape-8.png";
import tornPaper from "../assets/digital/sidi-bousaid/exported/torn-paper-3.png";
import stamp2 from "../assets/digital/sidi-bousaid/exported/stamp-2.png";
import stamp3 from "../assets/digital/sidi-bousaid/exported/stamp-3.png";
import vectorBg from "../assets/digital/sidi-bousaid/exported/vector-bg.png";
import layer1 from "../assets/digital/sidi-bousaid/exported/layer-1.png";
import layer2 from "../assets/digital/sidi-bousaid/exported/layer-2.png";

// Import figma assets for Programme
import rect118 from "../assets/digital/sidi-bousaid/exported/rect-118.png";
import rect119 from "../assets/digital/sidi-bousaid/exported/rect-119.png";
import rect120 from "../assets/digital/sidi-bousaid/exported/rect-120.png";
import rect121 from "../assets/digital/sidi-bousaid/exported/rect-121.png";

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
    return "\u062f\u0627\u0631 \u0633\u064a\u062f\u064a \u0628\u0648\u0633\u0639\u064a\u062f";
  }
  return "\u0647\u064a\u0641\u0627\u0621 \u0628\u0627\u0644\u0627\u0635\u0645\u0631\u0646\u0627\u0642";
};

const getNames = (coupleNames) => {
  const [firstName = "Sarah", secondName = "Hedi"] = (coupleNames || "Sarah & Hedi").split(/\s*&\s*|\s+et\s+/i);
  return {
    firstName: firstName.trim() || "Sarah",
    secondName: secondName.trim() || "Hedi",
  };
};

const getCountdownParts = (dateString) => {
  const eventDate = dateString ? new Date(`${dateString}T00:00:00`) : new Date("2027-07-20T00:00:00");
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
      stacked: "The Favour Of A Reply Is\nKindly Requested By The\nFifteenth Of June, 2027",
      inline: "The Favour Of A Reply Is Kindly\nRequested By The Fifteenth Of June, 2027"
    };
  }
  const date = new Date(`${eventDateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return {
      stacked: "The Favour Of A Reply Is\nKindly Requested By The\nFifteenth Of June, 2027",
      inline: "The Favour Of A Reply Is Kindly\nRequested By The Fifteenth Of June, 2027"
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
  'countdown-panel.png': 1174,
  'dress-code-illustration.png': 2850,
  'programme-flourish-right.svg': 3410,
  'programme-flourish-left.svg': 3430,
  'programme-line-top.svg': 3485,
  'programme-line-bottom.svg': 3565,
  'closing-small-ornament.png': 4385,
};

const baseLayers = exportLayers.map(layer => {
  const name = layer.srcName || layer.name;
  let top = customTops[name] !== undefined ? customTops[name] : layer.top;
  let left = layer.left;
  let width = layer.width;
  let height = layer.height;

  if (layer.name === "reveal-hand.svg") {
    width = 36;
    height = 43;
    left = 197;
    top = 753;
  }

  return { ...layer, top, left, width, height };
});

// Event decorations source of truth (from Outeya / first event)
const eventDecorations = [
  { name: "celebration-right-floral.png", left: 328, top: 17, width: 102, height: 95 },
  { name: "celebration-left-floral.png", left: 0, top: 161, width: 103, height: 95 },
  { name: "celebration-small-floral.png", left: 343, top: 323, width: 57, height: 61 }
];

// A localized section wrapper that provides scoped absolute coordinates for child graphics
const Section = ({ invite, startY, height, bg = "transparent", layerNames = [], delayOffset = 200, isFullScreenHeight = false, children, ...rest }) => {
  const [secHeight, setSecHeight] = React.useState(window.innerHeight);

  React.useEffect(() => {
    if (!isFullScreenHeight) return;
    const handleResize = () => setSecHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isFullScreenHeight]);

  const sectionOffsetY = invite?.styleOverrides?.[rest['data-section-id']]?.posY || 0;
  const sectionExtraHeight = invite?.styleOverrides?.[rest['data-section-id']]?.height || 0;
  const effectiveHeight = height + sectionExtraHeight;

  const absoluteBox = ({ id, left, top, width: w, height: h }) => {
    const overrideX = invite?.styleOverrides?.[id]?.posX || 0;
    const overrideY = invite?.styleOverrides?.[id]?.posY || 0;
    return {
      position: "absolute",
      left: pct(left + overrideX, pageWidth),
      top: pct(top - startY + overrideY + sectionOffsetY, effectiveHeight),
      width: pct(w, pageWidth),
      height: h ? pct(h, effectiveHeight) : undefined,
    };
  };

  const textLayer = ({ id, left, top, width: w, children: textChildren, color = blue, fontSize = 16, lineHeight, family = "Cormorant Infant, serif", weight = 400, style = "normal", align = "center", letterSpacing = 0, wordSpacing = "normal", transform, zIndex = 3, pointerEvents, reveal = false, delay = 0 }) => {
    const overrideText = invite?.styleOverrides?.[id]?.text;
    const overrideColor = invite?.styleOverrides?.[id]?.color;
    const overrideFontSize = invite?.styleOverrides?.[id]?.fontSize;
    const overrideFontFamily = invite?.styleOverrides?.[id]?.fontFamily;

    const finalColor = overrideColor || color;
    const finalFontSize = overrideFontSize || fontSize;
    const finalFontFamily = (overrideFontFamily && overrideFontFamily !== "Défaut du Template") ? overrideFontFamily : family;

    return (
    <div
      className={reveal ? "reveal" : ""}
      style={{
        ...absoluteBox({ id, left, top, width: w }),
        color: finalColor,
        fontFamily: finalFontFamily,
        fontSize: `clamp(${finalFontSize * 0.78}px, ${(finalFontSize / pageWidth) * 100}vw, ${finalFontSize}px)`,
        fontStyle: style,
        fontWeight: weight,
        lineHeight: lineHeight ? `${lineHeight / finalFontSize}` : 1.2,
        textAlign: align,
        letterSpacing,
        wordSpacing,
        textTransform: transform,
        whiteSpace: "pre-wrap",
        zIndex,
        pointerEvents,
        transitionDelay: reveal ? `${delay + delayOffset}ms` : undefined,
      }}
    >
      {overrideText || textChildren}
    </div>
    );
  };

  const sectionLayers = baseLayers.filter(l => layerNames.includes(l.name));

  const sectionStyle = isFullScreenHeight
    ? { position: "relative", width: "100%", height: `calc(${secHeight}px + ${sectionExtraHeight}px)`, backgroundColor: bg, overflow: "hidden" }
    : { position: "relative", width: "100%", aspectRatio: `${pageWidth} / ${effectiveHeight}`, backgroundColor: bg, overflow: "hidden" };

  return (
    <section
      style={sectionStyle}
      {...rest}
    >
       {sectionLayers.map((layer, idx) => (
          <img
            key={layer.name}
            src={exportImageSources[layer.srcName || layer.name]}
            className="reveal"
            style={{
              ...absoluteBox({ id: { 'hero-arch.png': 'hero-bg', 'our-story-photo.png': 'story-photo', 'watercolor-bougainvillea-figma.png': 'story-ornaments', 'dress-code-illustration.png': 'dress-illustration' }[layer.name] || layer.name, ...layer }),
              transform: layer.transform,
              zIndex: layer.zIndex || 2,
              transitionDelay: `${idx * 100 + delayOffset}ms`
            }}
            alt=""
            draggable="false"
          />
       ))}
       {children({ absoluteBox, textLayer })}
    </section>
  );
};

const WavyCircle = ({ percent }) => {
  if (percent === 0) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          border: "1.2px solid #2e88e2",
          backgroundColor: "#fff"
        }}
      />
    );
  }

  const y = 13 - (13 * percent);
  const wavePath = percent === 1
    ? "M 0 0 L 26 0 L 26 13 L 0 13 Z"
    : `M 0 ${y} Q 3.25 ${y - 1.2}, 6.5 ${y} T 13 ${y} Q 16.25 ${y - 1.2}, 19.5 ${y} T 26 ${y} L 26 13 L 0 13 Z`;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        border: "1.2px solid #2e88e2",
        backgroundColor: "#fff",
        overflow: "hidden"
      }}
    >
      <style>{`
        @keyframes waveMove {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
        .animate-wave {
          animation: waveMove 1.5s linear infinite;
        }
      `}</style>
      <svg
        width="200%"
        height="100%"
        viewBox="0 0 26 13"
        style={{ position: "absolute", top: 0, left: 0, display: "block" }}
      >
        <path
          className={percent === 1 ? "" : "animate-wave"}
          d={wavePath}
          fill="#2e88e2"
        />
      </svg>
    </div>
  );
};

function SidiBouSaidInvitePage({ invite = defaultInvite }) {
  const [isIntroFading, setIsIntroFading] = useState(false);
  const [isIntroDone, setIsIntroDone] = useState(invite.videoIntroEnabled === false);
  const [doorFrame, setDoorFrame] = useState(0);
  const doorTimerRef = useRef(null);
  const [isProgrammeFinished, setIsProgrammeFinished] = useState(false);
  const programmeTimerRef = useRef(null);

  const animType = invite.animationType || "fade-up";
  const animSpeed = invite.animationSpeed !== undefined ? invite.animationSpeed : 1.2;
  const animDelay = invite.animationDelay !== undefined ? invite.animationDelay : 0.2;
  const animDelayMs = Math.round(animDelay * 1000);

  let initialTransform = "translateY(24px)";
  if (animType === "fade") {
    initialTransform = "none";
  } else if (animType === "zoom") {
    initialTransform = "scale(0.96)";
  }

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

  const dateParts = useMemo(() => formatDateParts(effectiveEventDate), [effectiveEventDate]);
  const revealDateParts = useMemo(() => {
    const dateObj = effectiveEventDate ? new Date(`${effectiveEventDate}T00:00:00`) : new Date("2027-07-20T00:00:00");
    return {
      day: String(dateObj.getDate()).padStart(2, "0"),
      monthNum: String(dateObj.getMonth() + 1).padStart(2, "0"),
      year2D: String(dateObj.getFullYear()).slice(-2),
    };
  }, [effectiveEventDate]);
  const rsvpDeadline = useMemo(() => getRsvpDeadline(effectiveEventDate), [effectiveEventDate]);
  const names = useMemo(() => getNames(invite.coupleNames), [invite.coupleNames]);
  const [countdown, setCountdown] = useState(() => getCountdownParts(effectiveEventDate));

  useEffect(() => {
    setCountdown(getCountdownParts(effectiveEventDate));
    const countdownTimer = window.setInterval(() => {
      setCountdown(getCountdownParts(effectiveEventDate));
    }, 60000);

    return () => window.clearInterval(countdownTimer);
  }, [effectiveEventDate]);

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
    if (!isIntroDone) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionEl = entry.target.closest("[data-section-index]");
            const secIdx = sectionEl ? parseInt(sectionEl.getAttribute("data-section-index"), 10) : null;

            // RSVP (index 7) remains locked until Programme has finished its sequence
            if (secIdx === 7 && !isProgrammeFinished) {
              return;
            }

            entry.target.classList.add("revealed");

            // When Programme (index 6) starts animating, start countdown to unlock RSVP
            if (secIdx === 6 && !programmeTimerRef.current) {
              const totalDuration = 2900 + animDelayMs + Math.round(animSpeed * 1000);
              programmeTimerRef.current = window.setTimeout(() => {
                setIsProgrammeFinished(true);
              }, totalDuration);
            }
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
  }, [invite, isIntroDone, isProgrammeFinished, animSpeed, animDelayMs]);

  useEffect(() => {
    return () => {
      if (doorTimerRef.current) {
        window.clearInterval(doorTimerRef.current);
      }
      if (programmeTimerRef.current) {
        window.clearTimeout(programmeTimerRef.current);
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
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <main className="min-h-screen bg-[#dcebf0] font-urbanist text-[#0093d8]">
      <style>{`
        .reveal {
          opacity: 0;
          transform: ${initialTransform};
          transition: opacity ${animSpeed}s cubic-bezier(0.16, 1, 0.3, 1), transform ${animSpeed}s cubic-bezier(0.16, 1, 0.3, 1);
          transition-delay: ${animDelayMs}ms;
        }
        .reveal.revealed {
          opacity: 1;
          transform: ${animType === "zoom" ? "scale(1)" : "translateY(0)"};
        }
        .line-segment {
          transform: scaleY(0);
          transform-origin: top;
          transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .line-segment.revealed {
          transform: scaleY(1);
        }
        .celebration-decoration {
          pointer-events: none;
          will-change: transform;
          animation-name: celebration-swim;
          animation-duration: 3.4s;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-direction: alternate;
        }
        @keyframes celebration-swim {
          0% { transform: translate3d(0, 0, 0) rotate(-1deg); }
          50% { transform: translate3d(0, -7px, 0) rotate(1.5deg); }
          100% { transform: translate3d(0, 5px, 0) rotate(-0.5deg); }
        }
      `}</style>
      <div className="mx-auto w-full bg-[#fffcf9] shadow-2xl flex flex-col">

        {/* Canvas 1: Hero */}
        <Section invite={invite}
          startY={0}
          height={804}
          delayOffset={animDelayMs}
          data-section-index={0} data-section-id="sec-hero"
          isFullScreenHeight={true}
          layerNames={[]}
        >
          {({ absoluteBox, textLayer }) => {
            return (
              <>
                <video
                  className="absolute inset-0 h-full w-full"
                  style={{ objectFit: "cover", zIndex: 1 }}
                  src={invite.videoUrl || openingVideo}
                  autoPlay
                  muted
                  loop
                  playsInline
                />

                {/* Flying Birds stylesheet & elements */}
                {invite.enableBirds !== false && (
                  <>
                    <style>{`
                      @keyframes fly-left-to-right {
                        0% { left: -10%; top: 120px; transform: scale(0.6); opacity: 0; }
                        10% { opacity: 0.7; }
                        90% { opacity: 0.7; }
                        100% { left: 110%; top: 50px; transform: scale(0.8); opacity: 0; }
                      }
                      @keyframes fly-left-to-right-2 {
                        0% { left: -10%; top: 200px; transform: scale(0.4); opacity: 0; }
                        15% { opacity: 0.5; }
                        85% { opacity: 0.5; }
                        100% { left: 110%; top: 130px; transform: scale(0.5); opacity: 0; }
                      }
                    `}</style>
                    <div
                      className="absolute pointer-events-none"
                      style={{
                        animation: "fly-left-to-right 18s linear infinite",
                        width: "28px",
                        height: "20px",
                        zIndex: 10,
                      }}
                    >
                      <svg viewBox="0 0 24 14" style={{ width: "100%", height: "100%", fill: "#7A9EB2", opacity: 0.4 }}>
                        <path d="M 0 0 C 4 6, 8 10, 12 3 C 16 10, 20 6, 24 0 C 19 4, 15 2, 12 1 C 9 2, 5 4, 0 0 Z" fill="currentColor" />
                      </svg>
                    </div>
                    <div
                      className="absolute pointer-events-none"
                      style={{
                        animation: "fly-left-to-right-2 24s linear infinite",
                        animationDelay: "6s",
                        width: "20px",
                        height: "14px",
                        zIndex: 10,
                      }}
                    >
                      <svg viewBox="0 0 24 14" style={{ width: "100%", height: "100%", fill: "#7A9EB2", opacity: 0.3 }}>
                        <path d="M 0 0 C 4 6, 8 10, 12 3 C 16 10, 20 6, 24 0 C 19 4, 15 2, 12 1 C 9 2, 5 4, 0 0 Z" fill="currentColor" />
                      </svg>
                    </div>
                  </>
                )}

                <div
                  className="absolute left-0 top-1/2 w-full -translate-y-1/2"
                  style={{ height: pct(340, 804), zIndex: 3, marginTop: invite?.styleOverrides?.['sec-hero']?.posY || 0 }}
                >
                  {/* Initials Mark */}
                  <div className="reveal" style={{ position: "absolute", left: pct(194 + (invite?.styleOverrides?.['hero-initials']?.posX || 0), pageWidth), top: pct(0 + (invite?.styleOverrides?.['hero-initials']?.posY || 0), 340), width: pct(35, pageWidth), height: pct(72, 340), border: `1.5px solid ${invite?.styleOverrides?.['hero-initials']?.color || '#fff'}`, borderRadius: `${invite?.styleOverrides?.['hero-initials']?.radius ?? 16}px`, zIndex: 3, transitionDelay: `${animDelayMs}ms` }}>
                    <div style={{ position: "absolute", top: `calc(12% + ${invite?.styleOverrides?.['hero-initial-1']?.posY || 0}px)`, left: `calc(31% + ${invite?.styleOverrides?.['hero-initial-1']?.posX || 0}px)`, color: invite?.styleOverrides?.['hero-initials']?.color || "#fff", fontFamily: (invite?.styleOverrides?.['hero-initials']?.fontFamily && invite?.styleOverrides?.['hero-initials']?.fontFamily !== 'Défaut du Template') ? invite?.styleOverrides?.['hero-initials']?.fontFamily : "Antic Didone, serif", fontSize: `clamp(${(invite?.styleOverrides?.['hero-initials']?.fontSize || 21) * 0.78}px, ${((invite?.styleOverrides?.['hero-initials']?.fontSize || 21) / pageWidth) * 100}vw, ${invite?.styleOverrides?.['hero-initials']?.fontSize || 21}px)`, lineHeight: "1", fontWeight: "400" }}>{names.firstName.charAt(0).toUpperCase()}</div>
                    <div style={{ position: "absolute", bottom: `calc(12% - ${invite?.styleOverrides?.['hero-initial-2']?.posY || 0}px)`, left: `calc(49% + ${invite?.styleOverrides?.['hero-initial-2']?.posX || 0}px)`, color: invite?.styleOverrides?.['hero-initials']?.color || "#fff", fontFamily: (invite?.styleOverrides?.['hero-initials']?.fontFamily && invite?.styleOverrides?.['hero-initials']?.fontFamily !== 'Défaut du Template') ? invite?.styleOverrides?.['hero-initials']?.fontFamily : "Antic Didone, serif", fontSize: `clamp(${(invite?.styleOverrides?.['hero-initials']?.fontSize || 21) * 0.78}px, ${((invite?.styleOverrides?.['hero-initials']?.fontSize || 21) / pageWidth) * 100}vw, ${invite?.styleOverrides?.['hero-initials']?.fontSize || 21}px)`, lineHeight: "1", fontWeight: "400" }}>{names.secondName.charAt(0).toUpperCase()}</div>
                  </div>

                  {/* Names */}
                  <div className="reveal" style={{ position: "absolute", left: pct(85 + (invite?.styleOverrides?.['hero-names']?.posX || 0) + (invite?.styleOverrides?.['hero-name-1']?.posX || 0), pageWidth), top: pct(75 + (invite?.styleOverrides?.['hero-names']?.posY || 0) + (invite?.styleOverrides?.['hero-name-1']?.posY || 0), 340), width: pct(260, pageWidth), color: invite?.styleOverrides?.['hero-names']?.color || "#fff", fontFamily: (invite?.styleOverrides?.['hero-names']?.fontFamily && invite?.styleOverrides?.['hero-names']?.fontFamily !== 'Défaut du Template') ? invite?.styleOverrides?.['hero-names']?.fontFamily : "Cormorant Infant, serif", fontSize: `clamp(${(invite?.styleOverrides?.['hero-names']?.fontSize || 46) * 0.78}px, ${( (invite?.styleOverrides?.['hero-names']?.fontSize || 46) / pageWidth) * 100}vw, ${invite?.styleOverrides?.['hero-names']?.fontSize || 46}px)`, fontWeight: 400, lineHeight: 1, textAlign: "center", whiteSpace: "pre-wrap", zIndex: 3, transitionDelay: `${animDelayMs}ms` }}>{names.firstName}</div>
                  <div className="reveal" style={{ position: "absolute", left: pct(85 + (invite?.styleOverrides?.['hero-names']?.posX || 0) + (invite?.styleOverrides?.['hero-name-2']?.posX || 0), pageWidth), top: pct(75 + (invite?.styleOverrides?.['hero-names']?.fontSize || 46) + (invite?.styleOverrides?.['hero-names']?.posY || 0) + (invite?.styleOverrides?.['hero-name-2']?.posY || 0), 340), width: pct(260, pageWidth), color: invite?.styleOverrides?.['hero-names']?.color || "#fff", fontFamily: (invite?.styleOverrides?.['hero-names']?.fontFamily && invite?.styleOverrides?.['hero-names']?.fontFamily !== 'Défaut du Template') ? invite?.styleOverrides?.['hero-names']?.fontFamily : "Cormorant Infant, serif", fontSize: `clamp(${(invite?.styleOverrides?.['hero-names']?.fontSize || 46) * 0.78}px, ${( (invite?.styleOverrides?.['hero-names']?.fontSize || 46) / pageWidth) * 100}vw, ${invite?.styleOverrides?.['hero-names']?.fontSize || 46}px)`, fontWeight: 400, lineHeight: 1, textAlign: "center", whiteSpace: "pre-wrap", zIndex: 3, transitionDelay: `${animDelayMs}ms` }}>{names.secondName}</div>

                  {/* Subtitle */}
                  <div className="reveal" style={{ position: "absolute", left: pct(85 + (invite?.styleOverrides?.['hero-subtitle']?.posX || 0), pageWidth), top: pct(204 + (invite?.styleOverrides?.['hero-subtitle']?.posY || 0), 340), width: pct(260, pageWidth), color: "#fff", fontFamily: "Cormorant, serif", fontSize: `clamp(12.48px, ${(16 / pageWidth) * 100}vw, 16px)`, fontWeight: 400, lineHeight: 1, textAlign: "center", letterSpacing: "0.1em", textTransform: "capitalize", whiteSpace: "pre-wrap", zIndex: 3, transitionDelay: `${200 + animDelayMs}ms` }}>{"Welcome To Our\nMediterranean Abode"}</div>

                  {/* Dates Left and Right */}
                  <div className="reveal" style={{ position: "absolute", left: pct(80 + (invite?.styleOverrides?.['hero-date']?.posX || 0) + (invite?.styleOverrides?.['hero-date-month']?.posX || 0), pageWidth), top: pct(127 + (invite?.styleOverrides?.['hero-date']?.posY || 0) + (invite?.styleOverrides?.['hero-date-month']?.posY || 0), 340), width: pct(75, pageWidth), color: invite?.styleOverrides?.['hero-date']?.color || "#fff", fontFamily: (invite?.styleOverrides?.['hero-date']?.fontFamily && invite?.styleOverrides?.['hero-date']?.fontFamily !== 'Défaut du Template') ? invite?.styleOverrides?.['hero-date']?.fontFamily : "Cormorant Infant, serif", fontSize: `clamp(${(invite?.styleOverrides?.['hero-date']?.fontSize || 17) * 0.78}px, ${((invite?.styleOverrides?.['hero-date']?.fontSize || 17) / pageWidth) * 100}vw, ${invite?.styleOverrides?.['hero-date']?.fontSize || 17}px)`, fontStyle: "italic", fontWeight: 400, lineHeight: 18 / 17, textAlign: "right", letterSpacing: "0.15em", textTransform: "uppercase", whiteSpace: "pre-wrap", zIndex: 3, transitionDelay: `${400 + animDelayMs}ms` }}>{dateParts.month}</div>
                  <div className="reveal" style={{ position: "absolute", left: pct(275 + (invite?.styleOverrides?.['hero-date']?.posX || 0) + (invite?.styleOverrides?.['hero-date-year']?.posX || 0), pageWidth), top: pct(127 + (invite?.styleOverrides?.['hero-date']?.posY || 0) + (invite?.styleOverrides?.['hero-date-year']?.posY || 0), 340), width: pct(75, pageWidth), color: invite?.styleOverrides?.['hero-date']?.color || "#fff", fontFamily: (invite?.styleOverrides?.['hero-date']?.fontFamily && invite?.styleOverrides?.['hero-date']?.fontFamily !== 'Défaut du Template') ? invite?.styleOverrides?.['hero-date']?.fontFamily : "Cormorant Infant, serif", fontSize: `clamp(${(invite?.styleOverrides?.['hero-date']?.fontSize || 17) * 0.78}px, ${((invite?.styleOverrides?.['hero-date']?.fontSize || 17) / pageWidth) * 100}vw, ${invite?.styleOverrides?.['hero-date']?.fontSize || 17}px)`, fontStyle: "italic", fontWeight: 400, lineHeight: 18 / 17, textAlign: "left", letterSpacing: "0.15em", textTransform: "uppercase", whiteSpace: "pre-wrap", zIndex: 3, transitionDelay: `${400 + animDelayMs}ms` }}>{dateParts.year}</div>

                  {/* Scroll down button */}
                  <button
                    type="button"
                    onClick={handleScrollDown}
                    className="reveal"
                    style={{
                      position: "absolute",
                      left: pct(164, pageWidth),
                      top: pct(302, 340),
                      width: pct(100, pageWidth),
                      height: pct(38, 340),
                      backgroundColor: "#fff",
                      borderRadius: "100px",
                      zIndex: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "none",
                      cursor: "pointer",
                      transitionDelay: `${500 + animDelayMs}ms`
                    }}
                  >
                    <span style={{ fontFamily: "Cormorant Infant, serif", fontSize: `clamp(12px, ${(15 / pageWidth) * 100}vw, 15px)`, color: blue }}>Scroll down</span>
                  </button>
                </div>

              </>
            );
          }}
        </Section>

        {/* Canvas 2: Reveal */}
        <Section invite={invite}
          startY={501}
          height={303}
          delayOffset={animDelayMs}
          data-section-index={1} data-section-id="sec-reveal"
          layerNames={[
            "reveal-corner-top-right.png",
            "reveal-hand.svg",
            "reveal-corner-bottom-left.png"
          ]}
        >
          {({ absoluteBox, textLayer }) => {
            const revealOpacity = doorFrameSources.length ? doorFrame / (doorFrameSources.length - 1) : 0;
            return (
              <>
                {/* Reveal Titles */}
                {textLayer({ left: 85, top: 535, width: 260, fontSize: 22, family: "Cormorant Infant, serif", color: blue, reveal: true, children: "Reveal" })}
                {textLayer({ left: 85, top: 565, width: 260, fontSize: 26, family: "Gulzar, serif", color: blue, reveal: true, delay: 150, children: "\u0627\u0644\u0646\u0647\u0627\u0631 \u062c\u0627\u0621" })}

                {/* Reveal Box Content */}
                {textLayer({ left: 86, top: 668, width: 63, fontSize: 20, family: "Antic Didone, serif", color: blue, align: "center", zIndex: 7, pointerEvents: "none", children: <div style={{ opacity: revealOpacity, transition: "opacity 0.25s ease-out" }}>{revealDateParts.day}</div> })}
                {textLayer({ left: 183, top: 668, width: 63, fontSize: 20, family: "Antic Didone, serif", color: blue, align: "center", zIndex: 7, pointerEvents: "none", children: <div style={{ opacity: revealOpacity, transition: "opacity 0.25s ease-out" }}>{revealDateParts.monthNum}</div> })}
                {textLayer({ left: 280, top: 668, width: 63, fontSize: 20, family: "Antic Didone, serif", color: blue, align: "center", zIndex: 7, pointerEvents: "none", children: <div style={{ opacity: revealOpacity, transition: "opacity 0.25s ease-out" }}>{revealDateParts.year2D}</div> })}

                {doorFrameSources.length ? (
                  <button
                    type="button"
                    onClick={handleDoorClick}
                    aria-label="Open reveal doors"
                    className="reveal absolute cursor-pointer bg-transparent p-0 focus:outline-none"
                    onTransitionEnd={(event) => {
                      if (event.propertyName === "opacity") {
                        handleDoorClick();
                      }
                    }}
                    style={{ ...absoluteBox({ left: 82, top: 610, width: 267, height: 170 }), zIndex: 6, transitionDelay: `${900 + animDelayMs}ms` }}
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
            );
          }}
        </Section>

        {/* Canvas 5: Our Story (moved here, startY=804, height=340) */}
        <Section invite={invite}
          startY={804}
          height={340}
          delayOffset={animDelayMs}
          data-section-index={1}
          layerNames={[]}
        >
          {({ absoluteBox, textLayer }) => (
            <>
              {/* Tile Ornaments */}
              <img
                className="reveal absolute"
                style={{ ...absoluteBox({ left: 0, top: 804 + 290, width: 32, height: 40 }), zIndex: 2, transitionDelay: `${1300 + animDelayMs}ms` }}
                alt=""
                src={layer1}
                draggable="false"
              />
              <img
                className="reveal absolute"
                style={{ ...absoluteBox({ left: 398, top: 804 + 15, width: 32, height: 40 }), zIndex: 2, transitionDelay: `${1300 + animDelayMs}ms` }}
                alt=""
                src={layer2}
                draggable="false"
              />

              {/* Watercolor bougainvillea */}
              <img
                className="reveal absolute"
                style={{ ...absoluteBox({ left: 85, top: 804 + 65, width: 164, height: 164 }), zIndex: 2, transitionDelay: `${2200 + animDelayMs}ms` }}
                alt="Watercolor bougainvillea"
                src={watercolorBougainvillea}
                draggable="false"
              />

              {/* Decorative tape */}
              <img
                className="reveal absolute"
                style={{ ...absoluteBox({ left: 256, top: 804 + 93, width: 114, height: 52 }), zIndex: 3, transitionDelay: `${950 + animDelayMs}ms` }}
                alt="Decorative tape"
                src={tape}
                draggable="false"
              />

              {/* Couple Photo */}
              <img
                className="reveal absolute"
                style={{ ...absoluteBox({ left: 185, top: 800 + 110, width: 225.25, height: 172.48 }), zIndex: 2, transitionDelay: `${550 + animDelayMs}ms` }}
                alt="Couple"
                src={vectorBg}
                draggable="false"
              />

              {/* Torn paper */}
              <img
                className="reveal absolute"
                style={{ ...absoluteBox({ left: 15, top: 804 + 138, width: 223, height: 165 }), zIndex: 2, transitionDelay: `${1750 + animDelayMs}ms` }}
                alt="Torn paper"
                src={tornPaper}
                draggable="false"
              />

              {/* Decorative stamp (layered for depth) */}
              <img
                className="reveal absolute"
                style={{ ...absoluteBox({ left: 301, top: 804 + 230, width: 68, height: 101 }), zIndex: 3, transitionDelay: `${1750 + animDelayMs}ms` }}
                alt="Decorative stamp"
                src={stamp2}
                draggable="false"
              />
              <img
                className="reveal absolute"
                style={{ ...absoluteBox({ left: 306, top: 804 + 237, width: 57, height: 86 }), zIndex: 4, transitionDelay: `${1750 + animDelayMs}ms` }}
                alt="Decorative stamp"
                src={stamp3}
                draggable="false"
              />

              {/* Our Story titles */}
              {textLayer({ id: "story-title", left: 131, top: 804 + 17, width: 168, fontSize: 22, family: "Antic Didone, serif", color: blue, letterSpacing: "1.1px", reveal: true, children: "Our Story" })}
              {textLayer({ id: "story-title-ar", left: 134, top: 804 + 47, width: 162, fontSize: 20, family: "Gulzar, serif", color: blue, reveal: true, delay: 250, children: "\u062d\u0643\u0627\u064a\u062a\u0646\u0627" })}

              {/* Rotated text on torn paper */}
              <div
                className="reveal"
                style={{
                  ...absoluteBox({ id: "story-quote", left: 8, top: 804 + 195, width: 241 }),
                  transform: "rotate(-10deg)",
                  fontFamily: "Cormorant Infant, serif",
                  fontSize: `clamp(11px, ${(12 / pageWidth) * 100}vw, 12px)`,
                  color: "#49606b",
                  textAlign: "center",
                  letterSpacing: "1.2px",
                  lineHeight: "18px",
                  zIndex: 3,
                  transitionDelay: `${2200 + animDelayMs}ms`
                }}
              >
                Our Happy Ever After
                <br />
                starts
                <br />
                now
              </div>
            </>
          )}
        </Section>

        {/* Canvas 2: Countdown (shifted, startY=1144, height=296) */}
        <Section invite={invite}
          startY={1144}
          height={296}
          delayOffset={animDelayMs}
          data-section-index={2} data-section-id="sec-story"
          layerNames={["countdown-panel.png"]}
        >
          {({ absoluteBox, textLayer }) => (
            <>
              {textLayer({ id: "countdown-title", left: 85, top: 1201, width: 260, fontSize: 22, family: "Cormorant Infant, serif", color: "#fff", letterSpacing: "0.1em", reveal: true, children: "Countdown" })}
              {textLayer({ id: "countdown-title-ar", left: 85, top: 1236, width: 260, fontSize: 22, family: "Gulzar, serif", color: "#fff", reveal: true, delay: 150, children: "\u0627\u0644\u0639\u062f \u0627\u0644\u062a\u0646\u0627\u0632\u0644\u064a" })}

              {[
                { left: 75, value: countdown.days, label: "Days" },
                { left: 185, value: countdown.hours, label: "Hours" },
                { left: 295, value: countdown.minutes, label: "Minutes" },
              ].map((box, index) => (
                <div
                  key={box.label}
                  className="reveal"
                  style={{
                    ...absoluteBox({ left: box.left, top: 1300, width: 60, height: 60 }),
                    backgroundColor: "rgba(240, 248, 255, 0.9)",
                    border: `1px solid ${blue}`,
                    borderRadius: "12px",
                    zIndex: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    transitionDelay: `${index * 150 + 300 + animDelayMs}ms`
                  }}
                >
                  <div style={{ fontFamily: "Cormorant Infant, serif", fontSize: `clamp(14px, ${(16 / pageWidth) * 100}vw, 16px)`, color: blue, lineHeight: "1.2", fontWeight: "600" }}>{String(box.value).padStart(2, '0')}</div>
                  <div style={{ fontFamily: "Cormorant Infant, serif", fontSize: `clamp(9px, ${(10 / pageWidth) * 100}vw, 10px)`, color: blue, letterSpacing: "0.05em", marginTop: "2px" }}>{box.label}</div>
                </div>
              ))}
            </>
          )}
        </Section>

        {/* Canvas 3: Celebrations Title (shifted, startY=1440, height=100) */}
        <Section invite={invite} startY={1440} height={100} delayOffset={animDelayMs} data-section-index={3} data-section-id="sec-countdown">
          {({ textLayer }) => (
            <>
              {textLayer({ id: "celeb-title", left: 85, top: 1457, width: 260, fontSize: 22, family: "Cormorant Infant, serif", color: blue, letterSpacing: "0.05em", reveal: true, children: "The Celebrations" })}
              {textLayer({ id: "celeb-title-ar", left: 85, top: 1487, width: 260, fontSize: 22, family: "Gulzar, serif", color: blue, reveal: true, delay: 150, children: "\u0627\u0644\u0644\u064a\u0627\u0644\u064a" })}
            </>
          )}
        </Section>

        {/* Canvas 4: Dynamic Flex Celebrations Container */}
        <div data-section-index={4} data-section-id="sec-celeb" style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", backgroundColor: "transparent", marginTop: invite?.styleOverrides?.['sec-celeb']?.posY || 0 }}>
          {(invite.timeline || []).map((event, index) => {
            return (
              <section
                key={index}
                className="reveal"
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: `${pageWidth} / 460`,
                  overflow: "hidden",
                  transitionDelay: `${animDelayMs}ms`
                }}
              >
                {/* Render the identical source-of-truth decorations for each card */}
                {eventDecorations.map(dec => (
                  <img
                    key={dec.name}
                    className="celebration-decoration"
                    src={exportImageSources[dec.name]}
                    style={{
                      position: "absolute",
                      left: pct(dec.left, pageWidth),
                      top: pct(dec.top, 460),
                      width: pct(dec.width, pageWidth),
                      height: pct(dec.height, 460),
                      zIndex: 5,
                      animationDelay: `${index * 0.35 + dec.left / 900}s`
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
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e0e0e0", borderRadius: "10px", padding: "10px 20px", marginTop: "35px", backgroundColor: "#fff", cursor: "pointer" }}
                  >
                    <span style={{ fontFamily: "Cormorant Infant, serif", fontSize: `clamp(10px, ${(12 / pageWidth) * 100}vw, 12px)`, color: "rgb(73, 96, 107)", letterSpacing: "0.1em" }}>Open in maps</span>
                  </button>
                </div>
              </section>
            );
          })}
        </div>

                {/* Canvas 6: Dress Code (shifted, startY=2790, height=430) */}
        <Section invite={invite}
          startY={2790}
          height={430}
          delayOffset={animDelayMs}
          data-section-index={5} data-section-id="sec-dress"
          layerNames={["dress-code-illustration.png"]}
        >
          {({ textLayer }) => (
            <>
              {textLayer({ id: "dress-title", left: 85, top: 2790, width: 260, fontSize: 22, family: "Cormorant Infant, serif", color: blue, align: "center", letterSpacing: "0.05em", reveal: true, children: "Dress Code" })}
              {textLayer({ id: "dress-title-ar", left: 85, top: 2820, width: 260, fontSize: 22, family: "Gulzar, serif", color: blue, align: "center", reveal: true, delay: 150, children: "\u0627\u0644\u062a\u0628\u062f\u064a\u0644\u0629" })}
              {textLayer({ id: "dress-text", left: 85, top: 3100, width: 260, fontSize: 14, family: "Cormorant, serif", color: "#49606B", align: "center", weight: 400, wordSpacing: "0.15em", reveal: true, delay: 300, children: invite.dressCodeText || "We Request Attending The Outeya\nWith A Traditional Attire" })}
            </>
          )}
        </Section>

        {/* Canvas 7: Programme (shifted, startY=3220, height=430) */}
        <Section invite={invite}
          startY={3220}
          height={430}
          delayOffset={animDelayMs}
          data-section-index={6} data-section-id="sec-prog"
          layerNames={[]}
        >
          {({ absoluteBox, textLayer }) => (
            <>
              {textLayer({ id: "prog-title", left: 85, top: 3220, width: 260, fontSize: 22, family: "Cormorant Infant, serif", color: blue, align: "center", letterSpacing: "0.05em", reveal: true, children: "Programme" })}
              {textLayer({ id: "prog-title-ar", left: 85, top: 3250, width: 260, fontSize: 22, family: "Gulzar, serif", color: blue, align: "center", reveal: true, delay: 150, children: "\u0627\u0644\u0628\u0631\u0646\u0627\u0645\u062c" })}

              {/* Programme Steps mapping */}
              {(invite.programmeSteps || [
                { time: "17:00", name: "Sdek" },
                { time: "18:00", name: "Reception" },
                { time: "20:00", name: "Dinner" },
                { time: "00:00", name: "Dance" },
              ]).map((item, index) => {
                const isFinal = index === 3;
                const top = 3330 + index * 75;
                const image = [rect121, rect120, rect119, rect118][index];
                const percent = [0, 0.25, 0.50, 1.00][index];
                return (
                  <div key={index} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>

                    {/* Dot */}
                    <div
                      className="reveal"
                      style={{
                        ...absoluteBox({ left: 209, top: top + 2, width: 13, height: 13 }),
                        zIndex: 3,
                        transitionDelay: `${index * 900 + animDelayMs}ms`
                      }}
                    >
                      <WavyCircle percent={percent} />
                    </div>

                    {/* Step Content Wrapper (Time, Icon, and Label) */}
                    <div
                      className="reveal"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        transitionDelay: `${index * 900 + 200 + animDelayMs}ms`
                      }}
                    >
                      {/* Time */}
                      <div
                        style={{
                          ...absoluteBox({ left: 131, top: top, width: 54, height: 18 }),
                          fontFamily: "Cormorant Infant, serif",
                          fontWeight: "600",
                          fontSize: `clamp(11px, ${(12 / pageWidth) * 100}vw, 12px)`,
                          color: "#2e88e2",
                          letterSpacing: "1.2px",
                          textAlign: "left",
                          zIndex: 3
                        }}
                      >
                        {item.time}
                      </div>

                      {/* Step Icon Flourish */}
                      <img
                        className="absolute"
                        style={{ ...absoluteBox({ left: 248, top: top - 13, width: 37, height: 33 }), zIndex: 3 }}
                        alt=""
                        src={image}
                      />

                      {/* Label */}
                      <div
                        style={{
                          ...absoluteBox({ left: 217, top: top + (isFinal ? 20 : 25), width: 100, height: 18 }),
                          fontFamily: "Cormorant Infant, serif",
                          fontSize: `clamp(11px, ${(12 / pageWidth) * 100}vw, 12px)`,
                          color: "#49606b",
                          letterSpacing: "1.2px",
                          textAlign: "center",
                          zIndex: 3
                        }}
                      >
                        {item.name}
                      </div>
                    </div>

                    {/* Connecting Line Segment to next step */}
                    {!isFinal && (
                      <div
                        className="reveal line-segment"
                        style={{
                          ...absoluteBox({ left: 215, top: top + 15, width: 1, height: 62 }),
                          backgroundColor: "#2e88e2",
                          zIndex: 2,
                          transitionDelay: `${index * 900 + 400 + animDelayMs}ms`
                        }}
                      />
                    )}

                  </div>
                );
              })}
            </>
          )}
        </Section>

        {/* Canvas 8: RSVP (shifted, startY=3650, height=700) */}
        {invite.rsvpEnabled !== false ? (
          <Section invite={invite} startY={3650} height={535} delayOffset={animDelayMs} data-section-index={7} data-section-id="sec-rsvp">
            {({ absoluteBox, textLayer }) => (
              <>
                {textLayer({ id: "rsvp-title", left: 131, top: 3650, width: 168, fontSize: 22, family: "Cormorant Infant, serif", color: blue, align: "center", letterSpacing: "0.05em", reveal: true, children: "RSVP" })}
                {textLayer({ left: 45, top: 3685, width: 340, fontSize: 12, lineHeight: 20, family: "Cormorant Infant, serif", color: "rgb(73, 96, 107)", align: "center", reveal: true, delay: 150, children: rsvpDeadline.inline })}

                <div className="reveal" style={{ ...absoluteBox({ left: 40, top: 3750, width: 350, height: 420 }), zIndex: 10, display: "flex", flexDirection: "column", gap: "15px", transitionDelay: `${300 + animDelayMs}ms` }}>
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
                  <button style={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#008CDE", color: "#fff", padding: "16px", borderRadius: "8px", border: "none", marginTop: "15px", fontFamily: "Cormorant Infant, serif", fontSize: "18px", cursor: "pointer", width: "100%" }}>
                    Send Confirmation
                  </button>
                </div>
              </>
            )}
          </Section>
        ) : null}

        {/* Canvas 9: Footer */}
        <Section invite={invite}
          startY={4200}
          height={240}
          delayOffset={animDelayMs}
          data-section-index={8} data-section-id="sec-footer"
        >
          {({ absoluteBox, textLayer }) => (
            <>
              <div className="reveal" style={{ ...absoluteBox({ id: 'footer-initials', left: 194, top: 4200, width: 35, height: 52 }), border: `1.5px solid ${invite?.styleOverrides?.['footer-initials']?.color || blue}`, borderRadius: `${invite?.styleOverrides?.['footer-initials']?.radius ?? 16}px`, zIndex: 3, transitionDelay: `${animDelayMs}ms` }}>
                <div style={{ position: "absolute", top: `calc(12% + ${invite?.styleOverrides?.['footer-initial-1']?.posY || 0}px)`, left: `calc(31% + ${invite?.styleOverrides?.['footer-initial-1']?.posX || 0}px)`, color: invite?.styleOverrides?.['footer-initials']?.color || blue, fontFamily: (invite?.styleOverrides?.['footer-initials']?.fontFamily && invite?.styleOverrides?.['footer-initials']?.fontFamily !== 'Défaut du Template') ? invite?.styleOverrides?.['footer-initials']?.fontFamily : "Antic Didone, serif", fontSize: `clamp(${(invite?.styleOverrides?.['footer-initials']?.fontSize || 21) * 0.78}px, ${((invite?.styleOverrides?.['footer-initials']?.fontSize || 21) / pageWidth) * 100}vw, ${invite?.styleOverrides?.['footer-initials']?.fontSize || 21}px)`, lineHeight: "1", fontWeight: "400" }}>{names.firstName.charAt(0).toUpperCase()}</div>
                <div style={{ position: "absolute", bottom: `calc(12% - ${invite?.styleOverrides?.['footer-initial-2']?.posY || 0}px)`, left: `calc(49% + ${invite?.styleOverrides?.['footer-initial-2']?.posX || 0}px)`, color: invite?.styleOverrides?.['footer-initials']?.color || blue, fontFamily: (invite?.styleOverrides?.['footer-initials']?.fontFamily && invite?.styleOverrides?.['footer-initials']?.fontFamily !== 'Défaut du Template') ? invite?.styleOverrides?.['footer-initials']?.fontFamily : "Antic Didone, serif", fontSize: `clamp(${(invite?.styleOverrides?.['footer-initials']?.fontSize || 21) * 0.78}px, ${((invite?.styleOverrides?.['footer-initials']?.fontSize || 21) / pageWidth) * 100}vw, ${invite?.styleOverrides?.['footer-initials']?.fontSize || 21}px)`, lineHeight: "1", fontWeight: "400" }}>{names.secondName.charAt(0).toUpperCase()}</div>
              </div>
              {textLayer({ id: "footer-arabic", left: 85, top: 4285, width: 260, fontSize: 26, family: "Gulzar, serif", color: blue, align: "center", reveal: true, children: "\u0627\u0646 \u0634\u0627\u0621 \u0627\u0644\u0644\u0647 \u0644\u064a\u0644\u062a\u0643\u0645 \u0632\u064a\u0646\u0629" })}
              <img
                className="celebration-decoration"
                src={exportImageSources["closing-small-ornament.png"]}
                style={{
                  ...absoluteBox({ left: 198, top: 4320, width: 29, height: 12 }),
                  zIndex: 5,
                  animationDelay: "0.2s"
                }}
                alt=""
                draggable="false"
              />
            </>
          )}
        </Section>

        {/* Particle Emitter */}
        <ParticleEmitter type="petals" active={invite.enablePetals !== false} count={invite.petalsIntensity || 30} />

        {/* Audio Player */}
        <AudioPlayer src={invite.musicUrl} active={Boolean(invite.musicUrl) && isIntroDone} />

      </div>

      {!isIntroDone ? (
        <div
          className={`fixed inset-0 z-50 bg-black transition-opacity duration-1000 ${isIntroFading ? "opacity-0" : "opacity-100"}`}
          aria-hidden="true"
        >
          <video
            className="h-full w-full object-cover"
            src={invite.videoUrl || openingVideo}
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
