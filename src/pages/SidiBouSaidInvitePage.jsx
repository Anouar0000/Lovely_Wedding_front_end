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

function SidiBouSaidInvitePage({ invite = defaultInvite, editable = false, selectedElementId = null, onSelectElement = null }) {
  const [isIntroFading, setIsIntroFading] = useState(false);
  const [isIntroDone, setIsIntroDone] = useState(invite.videoIntroEnabled === false);
  const [doorFrame, setDoorFrame] = useState(0);
  const doorTimerRef = useRef(null);
  const [isProgrammeFinished, setIsProgrammeFinished] = useState(false);
  const programmeTimerRef = useRef(null);

  const getOverrideStyle = (elementId) => {
    if (!invite.styleOverrides || !invite.styleOverrides[elementId]) return {};
    const o = invite.styleOverrides[elementId];
    const s = {};
    if (o.color) s.color = o.color;
    if (o.fontSize) s.fontSize = `${o.fontSize}px`;
    if (o.fontFamily) s.fontFamily = o.fontFamily;
    if (o.rotation !== undefined) s.transform = `rotate(${o.rotation}deg)`;
    if (o.marginTop !== undefined) s.marginTop = `${o.marginTop}px`;
    if (o.marginBottom !== undefined) s.marginBottom = `${o.marginBottom}px`;
    if (o.paddingTop !== undefined) s.paddingTop = `${o.paddingTop}px`;
    if (o.paddingBottom !== undefined) s.paddingBottom = `${o.paddingBottom}px`;
    if (o.width !== undefined) s.width = `${o.width}px`;
    if (o.height !== undefined) s.height = `${o.height}px`;
    return s;
  };

  const Section = ({ startY, height, bg = "transparent", layerNames = [], delayOffset = 200, isFullScreenHeight = false, className = "", children, ...rest }) => {
    const [secHeight, setSecHeight] = useState(window.innerHeight);

    useEffect(() => {
      if (!isFullScreenHeight) return;
      const handleResize = () => setSecHeight(window.innerHeight);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, [isFullScreenHeight]);

    const absoluteBox = ({ left, top, width: w, height: h }) => ({
      position: "absolute",
      left: pct(left, pageWidth),
      top: pct(top - startY, height),
      width: pct(w, pageWidth),
      height: h ? pct(h, height) : undefined,
    });

    const sectionLayers = baseLayers.filter(l => layerNames.includes(l.name));
    
    const sectionIndex = rest["data-section-index"];
    const sectionId = `section-${sectionIndex}`;
    const isSelected = selectedElementId === sectionId;
    const sectionOverride = getOverrideStyle(sectionId);

    const sectionStyle = isFullScreenHeight 
      ? { position: "relative", width: "100%", minHeight: `${secHeight}px`, backgroundColor: bg, ...sectionOverride }
      : { position: "relative", width: "100%", backgroundColor: bg, ...sectionOverride };

    const handleSectionClick = (e) => {
      if (editable && onSelectElement && sectionIndex !== undefined) {
        e.stopPropagation();
        onSelectElement(sectionId);
      }
    };

    return (
      <section 
        style={sectionStyle}
        onClick={handleSectionClick}
        className={`flex flex-col items-center w-full ${className} ${editable ? "cursor-pointer hover:outline hover:outline-dashed hover:outline-blue-300 hover:outline-1" : ""} ${isSelected ? "outline outline-2 outline-blue-500 outline-offset-[-2px] z-20" : ""}`}
        {...rest}
      >
         {sectionLayers.map((layer, idx) => (
            <img 
              key={layer.name} 
              src={exportImageSources[layer.srcName || layer.name]} 
              className="reveal absolute pointer-events-none"
              style={{ 
                ...absoluteBox(layer), 
                transform: layer.transform, 
                zIndex: layer.zIndex || 1,
                transitionDelay: `${idx * 100 + delayOffset}ms`
              }} 
              alt="" 
              draggable="false" 
            />
         ))}
         {typeof children === "function" ? children({ absoluteBox }) : children}
      </section>
    );
  };

  const Text = ({ children, elementId, color = blue, fontSize = 16, lineHeight, family = "Cormorant Infant, serif", weight = 400, fontStyle = "normal", align = "center", letterSpacing = 0, wordSpacing = "normal", transform, zIndex = 3, reveal = false, delay = 0, delayOffset = 200, className = "", ...rest }) => {
    const isSelected = selectedElementId === elementId;
    const override = getOverrideStyle(elementId);

    const handleClick = (e) => {
      if (editable && onSelectElement && elementId) {
        e.stopPropagation();
        onSelectElement(elementId);
      }
    };

    return (
      <div 
        onClick={handleClick}
        className={`${reveal ? "reveal" : ""} ${className} ${editable && elementId ? "cursor-pointer hover:outline hover:outline-dashed hover:outline-blue-400 hover:outline-2" : ""} ${isSelected ? "outline outline-2 outline-blue-600 outline-offset-2 z-[99]" : ""}`}
        style={{
          color,
          fontFamily: family,
          fontSize: `clamp(${fontSize * 0.78}px, ${(fontSize / pageWidth) * 100}vw, ${fontSize}px)`,
          fontStyle,
          fontWeight: weight,
          lineHeight: lineHeight ? `${lineHeight / fontSize}` : 1.2,
          textAlign: align,
          letterSpacing,
          wordSpacing,
          textTransform: transform,
          whiteSpace: "pre-wrap",
          zIndex,
          transitionDelay: reveal ? `${delay + delayOffset}ms` : undefined,
          ...override,
          ...rest.style
        }}
        {...rest}
      >
        {children}
      </div>
    );
  };

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

            if (secIdx === 7 && !isProgrammeFinished) {
              return;
            }

            entry.target.classList.add("revealed");

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

  const revealOpacity = doorFrameSources.length ? doorFrame / (doorFrameSources.length - 1) : 0;

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
        @keyframes waveMove {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
        .animate-wave {
          animation: waveMove 1.5s linear infinite;
        }
      `}</style>
      <div className="mx-auto w-full bg-[#fffcf9] shadow-2xl flex flex-col">

        {/* Canvas 1: Hero & Reveal (Combined into dynamic fullscreen layout) */}
        <Section
          startY={0}
          height={804}
          delayOffset={animDelayMs}
          data-section-index={0}
          isFullScreenHeight={true}
          layerNames={["reveal-corner-top-right.png", "reveal-hand.svg", "reveal-corner-bottom-left.png"]}
        >
          <video
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: 1 - revealOpacity, pointerEvents: revealOpacity === 1 ? "none" : "auto", zIndex: 1 }}
            src={invite.videoUrl || openingVideo}
            autoPlay
            muted
            loop
            playsInline
          />

          <div className="relative flex flex-col justify-between items-center py-12 w-full h-screen min-h-[inherit] z-10 select-none">
            {/* Top Initials Oval */}
            <div className="reveal border-[1.5px] border-white rounded-[16px] w-[35px] h-[52px] relative flex flex-col items-center justify-center mt-4" style={{ transitionDelay: `${animDelayMs}ms` }}>
              <div className="text-white font-antic text-[17px] leading-none mb-0.5">{names.firstName.charAt(0).toUpperCase()}</div>
              <div className="text-white font-antic text-[17px] leading-none mt-0.5">{names.secondName.charAt(0).toUpperCase()}</div>
            </div>

            {/* Names & Subtitle */}
            <div className="flex flex-col items-center w-full px-6">
              <Text elementId="hero-names" color="#fff" fontSize={38} family="Cormorant Infant, serif" reveal={true} delayOffset={animDelayMs}>
                {`${names.firstName}\n${names.secondName}`}
              </Text>
              <Text elementId="hero-subtitle" color="#fff" fontSize={16} family="Cormorant, serif" letterSpacing="0.15em" reveal={true} delay={200} delayOffset={animDelayMs} className="mt-4 lowercase first-letter:uppercase">
                {"Welcome To Our\nMediterranean Abode"}
              </Text>

              {/* Date Info */}
              <div className="flex items-center justify-center gap-6 mt-6 w-full">
                <Text elementId="hero-date-month" color="#fff" fontSize={17} fontStyle="italic" transform="uppercase" letterSpacing="0.15em" reveal={true} delay={400} delayOffset={animDelayMs}>
                  {dateParts.month}
                </Text>
                <div className="w-[1px] h-[20px] bg-white opacity-40"></div>
                <Text elementId="hero-date-year" color="#fff" fontSize={17} fontStyle="italic" transform="uppercase" letterSpacing="0.15em" reveal={true} delay={400} delayOffset={animDelayMs}>
                  {dateParts.year}
                </Text>
              </div>
            </div>

            {/* Bottom Scroll down button */}
            <button
              type="button"
              onClick={handleScrollDown}
              className="reveal bg-white text-blue rounded-[100px] border-none px-6 py-2.5 cursor-pointer shadow-md flex items-center justify-center text-sm font-semibold tracking-wider hover:opacity-95"
              style={{ transitionDelay: `${500 + animDelayMs}ms` }}
            >
              Scroll down
            </button>
          </div>

          {/* Interactive Doors / Webp Render overlays */}
          {revealOpacity < 1 ? (
            <button
              type="button"
              onClick={handleDoorClick}
              aria-label="Open reveal doors"
              className="reveal absolute cursor-pointer bg-transparent p-0 border-none outline-none focus:outline-none flex gap-2"
              onTransitionEnd={(event) => {
                if (event.propertyName === "opacity") {
                  handleDoorClick();
                }
              }}
              style={{
                bottom: "10vh",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 6,
                transitionDelay: `${900 + animDelayMs}ms`
              }}
            >
              {doorSlots.map((door, idx) => (
                <img
                  key={idx}
                  src={doorFrameSources[doorFrame]}
                  alt=""
                  className="w-[80px] h-[120px] object-contain"
                  draggable="false"
                />
              ))}
            </button>
          ) : (
            <div 
              className="absolute flex justify-center items-center gap-4"
              style={{ bottom: "14vh", left: "50%", transform: "translateX(-50%)", zIndex: 6 }}
            >
              <div style={{ opacity: revealOpacity, transition: "opacity 0.3s ease-out" }} className="text-blue font-antic text-2xl font-bold">{revealDateParts.day}</div>
              <div className="w-[1px] h-[20px] bg-blue opacity-30"></div>
              <div style={{ opacity: revealOpacity, transition: "opacity 0.3s ease-out" }} className="text-blue font-antic text-2xl font-bold">{revealDateParts.monthNum}</div>
              <div className="w-[1px] h-[20px] bg-blue opacity-30"></div>
              <div style={{ opacity: revealOpacity, transition: "opacity 0.3s ease-out" }} className="text-blue font-antic text-2xl font-bold">{revealDateParts.year2D}</div>
            </div>
          )}
        </Section>

        {/* Canvas 5: Our Story (visually Section 2, grows dynamically) */}
        <Section
          startY={804}
          height={340}
          delayOffset={animDelayMs}
          data-section-index={1}
          layerNames={[]}
          className="py-12"
        >
          {({ absoluteBox }) => (
            <>
              <Text elementId="our-story-title" fontSize={22} family="Antic Didone, serif" reveal={true} delayOffset={animDelayMs}>Our Story</Text>
              <Text elementId="our-story-title-ar" fontSize={20} family="Gulzar, serif" reveal={true} delay={250} delayOffset={animDelayMs} className="mt-2">حكايتنا</Text>

              {/* Collage Container wrapper of fixed aspect ratio 430/340 */}
              <div className="relative w-full max-w-[430px] aspect-[430/340] mt-6 overflow-hidden">
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
                  onClick={(e) => {
                    if (editable && onSelectElement) {
                      e.stopPropagation();
                      onSelectElement("our-story-photo");
                    }
                  }}
                  className={`reveal absolute ${editable ? "cursor-pointer hover:outline hover:outline-dashed hover:outline-blue-400 hover:outline-2" : ""} ${selectedElementId === "our-story-photo" ? "outline outline-2 outline-blue-600 outline-offset-2 z-10" : ""}`}
                  style={{ 
                    ...absoluteBox({ left: 185, top: 800 + 110, width: 225, height: 172 }), 
                    zIndex: 2, 
                    transitionDelay: `${550 + animDelayMs}ms`,
                    ...getOverrideStyle("our-story-photo")
                  }}
                  alt="Couple"
                  src={invite.couplePhoto || vectorBg}
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

                {/* Decorative stamp */}
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

                {/* Rotated text on torn paper */}
                <div
                  onClick={(e) => {
                    if (editable && onSelectElement) {
                      e.stopPropagation();
                      onSelectElement("our-story-quote");
                    }
                  }}
                  className={`reveal ${editable ? "cursor-pointer hover:outline hover:outline-dashed hover:outline-blue-400 hover:outline-2" : ""} ${selectedElementId === "our-story-quote" ? "outline outline-2 outline-blue-600 outline-offset-2 z-10" : ""}`}
                  style={{
                    ...absoluteBox({ left: 8, top: 804 + 195, width: 241 }),
                    transform: "rotate(-10deg)",
                    fontFamily: "Cormorant Infant, serif",
                    fontSize: `clamp(11px, ${(12 / pageWidth) * 100}vw, 12px)`,
                    color: "#49606b",
                    textAlign: "center",
                    letterSpacing: "1.2px",
                    lineHeight: "18px",
                    zIndex: 3,
                    transitionDelay: `${2200 + animDelayMs}ms`,
                    ...getOverrideStyle("our-story-quote")
                  }}
                >
                  Our Happy Ever After
                  <br />
                  starts
                  <br />
                  now
                </div>
              </div>
            </>
          )}
        </Section>

        {/* Canvas 2: Countdown (visually Section 3, grows dynamically) */}
        <Section
          startY={1144}
          height={296}
          delayOffset={animDelayMs}
          data-section-index={2}
          layerNames={["countdown-panel.png"]}
          className="py-12"
        >
          <div className="relative z-10 flex flex-col items-center w-full max-w-[390px]">
            <Text elementId="countdown-title" color="#fff" fontSize={22} letterSpacing="0.15em" reveal={true} delayOffset={animDelayMs}>Countdown</Text>
            <Text elementId="countdown-title-ar" color="#fff" fontSize={22} family="Gulzar, serif" reveal={true} delay={150} delayOffset={animDelayMs} className="mt-2">العد التنازلي</Text>

            <div className="flex gap-6 justify-center items-center mt-8 w-full">
              {[
                { value: countdown.days, label: "Days" },
                { value: countdown.hours, label: "Hours" },
                { value: countdown.minutes, label: "Minutes" },
              ].map((box, index) => (
                <div
                  key={box.label}
                  className="reveal w-[75px] h-[75px] bg-[rgba(240,248,255,0.9)] border border-blue-400 rounded-xl flex flex-col items-center justify-center shadow-sm"
                  style={{ transitionDelay: `${index * 150 + 300 + animDelayMs}ms` }}
                >
                  <span className="font-cormorant text-xl font-bold leading-none text-blue">{String(box.value).padStart(2, '0')}</span>
                  <span className="font-cormorant text-xs text-blue tracking-wide mt-1.5">{box.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Canvas 3 & 4: Celebrations (Combined into stack of dynamic height cards) */}
        <Section bg="transparent" className="py-12 px-6" data-section-index={3}>
          <Text elementId="celebrations-title" fontSize={22} family="Cormorant Infant, serif" reveal={true} delayOffset={animDelayMs}>The Celebrations</Text>
          <Text elementId="celebrations-title-ar" fontSize={22} family="Gulzar, serif" reveal={true} delay={150} delayOffset={animDelayMs} className="mt-2">الليالي</Text>

          <div className="flex flex-col gap-8 w-full max-w-[430px] mt-8">
            {(invite.timeline || []).map((event, index) => (
              <div 
                key={index}
                className="reveal relative w-full aspect-[430/460] overflow-hidden"
                style={{ transitionDelay: `${animDelayMs}ms` }}
              >
                {/* Card figma decorations */}
                {eventDecorations.map(dec => (
                  <img
                    key={dec.name}
                    className="celebration-decoration absolute pointer-events-none"
                    src={exportImageSources[dec.name]}
                    style={{
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

                {/* Content Card Body */}
                <div
                  className="absolute flex flex-col items-center pt-8"
                  style={{
                    left: pct(55, pageWidth),
                    top: 0,
                    width: pct(320, pageWidth),
                    height: pct(420, 460),
                    border: `1.5px solid ${blue}`,
                    borderRadius: "10px",
                    zIndex: 3,
                    backgroundColor: "transparent"
                  }}
                >
                  <span className="font-cormorant text-2xl font-semibold leading-none text-blue">{event.title}</span>
                  <span className="font-gulzar text-xl leading-relaxed text-blue mt-1">{event.titleAr}</span>

                  <div className="flex items-center justify-between w-[80%] mt-6">
                    <div className="border-t border-b border-gray-400 py-1.5 flex-1 text-center">
                      <span className="font-cormorant text-[15px] text-[#496067]">{formatEventDate(event.date || invite.eventDate).weekday}</span>
                    </div>
                    <div className="flex flex-col items-center px-4">
                      <span className="font-cormorant text-[30px] leading-none font-bold text-[#496067]">{formatEventDate(event.date || invite.eventDate).day}</span>
                      <span className="font-cormorant text-[13px] leading-none text-[#496067] mt-1">{formatEventDate(event.date || invite.eventDate).year}</span>
                    </div>
                    <div className="border-t border-b border-gray-400 py-1.5 flex-1 text-center">
                      <span className="font-cormorant text-[15px] text-[#496067]">{formatEventDate(event.date || invite.eventDate).month}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center mt-8">
                    <span className="font-cormorant text-xs font-semibold tracking-wider text-blue text-center leading-relaxed whitespace-pre-wrap">{`${event.venue || ""}\n${event.city || ""}`}</span>
                    <span className="font-gulzar text-sm text-blue text-center mt-2.5 leading-relaxed">{getArabicVenueAndCity(event.venue, event.city)}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => window.open(event.mapUrl || invite.mapUrl || "https://maps.google.com", "_blank")}
                    className="mt-8 border border-gray-200 rounded-lg px-6 py-2 bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center"
                  >
                    <span className="font-cormorant text-[11px] font-semibold text-[#496067] tracking-wider uppercase">Open in maps</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Canvas 6: Dress Code */}
        <Section
          startY={2790}
          height={430}
          delayOffset={animDelayMs}
          data-section-index={5}
          layerNames={["dress-code-illustration.png"]}
          className="py-12 min-h-[360px] justify-center"
        >
          <div className="relative z-10 flex flex-col items-center text-center px-6">
            <Text elementId="dress-code-title" fontSize={22} family="Cormorant Infant, serif" reveal={true} delayOffset={animDelayMs}>Dress Code</Text>
            <Text elementId="dress-code-title-ar" fontSize={22} family="Gulzar, serif" reveal={true} delay={150} delayOffset={animDelayMs} className="mt-2">التبديلة</Text>
            <Text elementId="dress-code-text" fontSize={14} family="Cormorant, serif" color="#49606B" reveal={true} delay={300} delayOffset={animDelayMs} className="mt-8 max-w-[280px] leading-relaxed">
              {invite.dressCodeText || "We Request Attending The Outeya\nWith A Traditional Attire"}
            </Text>
          </div>
        </Section>

        {/* Canvas 7: Programme */}
        <Section
          startY={3220}
          height={430}
          delayOffset={animDelayMs}
          data-section-index={6}
          layerNames={[]}
          className="py-12"
        >
          {({ absoluteBox }) => (
            <>
              <Text elementId="programme-title" fontSize={22} family="Cormorant Infant, serif" reveal={true} delayOffset={animDelayMs}>Programme</Text>
              <Text elementId="programme-title-ar" fontSize={22} family="Gulzar, serif" reveal={true} delay={150} delayOffset={animDelayMs} className="mt-2">البرنامج</Text>

              {/* Steps Area container */}
              <div className="relative w-full max-w-[430px] aspect-[430/260] mt-8 overflow-hidden">
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
              </div>
            </>
          )}
        </Section>

        {/* Canvas 8: RSVP (grows dynamically) */}
        {invite.rsvpEnabled !== false ? (
          <Section bg="transparent" className="py-12 px-6" data-section-index={7}>
            <Text elementId="rsvp-title" fontSize={22} family="Cormorant Infant, serif" reveal={true} delayOffset={animDelayMs}>RSVP</Text>
            <Text elementId="rsvp-deadline" fontSize={12} color="rgb(73, 96, 107)" reveal={true} delay={150} delayOffset={animDelayMs} className="mt-2">{rsvpDeadline.inline}</Text>

            <div 
              className="reveal flex flex-col gap-4 w-full max-w-[360px] bg-white border border-gray-100 rounded-xl p-6 mt-8 shadow-sm"
              style={{ transitionDelay: `${300 + animDelayMs}ms` }}
            >
              <div className="flex flex-col gap-1.5">
                <label className="font-cormorant text-[15px] font-semibold text-gray-500">Name</label>
                <input type="text" className="p-3 border border-gray-200 rounded-lg outline-none font-cormorant text-base bg-white" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-cormorant text-[15px] font-semibold text-gray-500">Sir Name</label>
                <input type="text" className="p-3 border border-gray-200 rounded-lg outline-none font-cormorant text-base bg-white" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-cormorant text-[15px] font-semibold text-gray-500">Email</label>
                <input type="email" className="p-3 border border-gray-200 rounded-lg outline-none font-cormorant text-base bg-white" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-cormorant text-[15px] font-semibold text-gray-500">Number of guests</label>
                <input type="number" className="p-3 border border-gray-200 rounded-lg outline-none font-cormorant text-base bg-white" />
              </div>
              <button className="bg-blue hover:opacity-90 text-white py-4 rounded-lg border-none mt-2 font-cormorant text-lg font-semibold cursor-pointer w-full">
                Send Confirmation
              </button>
            </div>
          </Section>
        ) : null}

        {/* Canvas 9: Footer */}
        <Section bg="transparent" className="py-12 pb-16" data-section-index={8}>
          {/* Initials Oval */}
          <div className="reveal border-[1.5px] border-blue rounded-[16px] w-[35px] h-[52px] relative flex flex-col items-center justify-center" style={{ transitionDelay: `${animDelayMs}ms` }}>
            <div className="text-blue font-antic text-[17px] leading-none mb-0.5">{names.firstName.charAt(0).toUpperCase()}</div>
            <div className="text-blue font-antic text-[17px] leading-none mt-0.5">{names.secondName.charAt(0).toUpperCase()}</div>
          </div>

          <Text elementId="footer-text" fontSize={26} family="Gulzar, serif" reveal={true} delay={150} delayOffset={animDelayMs} className="mt-6">
            ان شاء الله ليلتكم زينة
          </Text>

          <img
            className="celebration-decoration w-[29px] h-[12px] object-contain mt-6"
            src={exportImageSources["closing-small-ornament.png"]}
            style={{ animationDelay: "0.2s" }}
            alt=""
            draggable="false"
          />
        </Section>

        {/* Particle Emitter */}
        <ParticleEmitter type="petals" active={invite.enablePetals !== false} />

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
