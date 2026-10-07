import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import templateConfig from "../data/digital/templates/sakura-koi.json";
import { submitRsvpResponse } from "../services/rsvp";
import { isFirebaseConfigured } from "../lib/firebase";

import heroPoster from "../assets/digital/sakura-koi/hero.png";
import seal from "../assets/digital/sakura-koi/seal.png";
import silkTop from "../assets/digital/sakura-koi/silk-top.png";
import silkMid from "../assets/digital/sakura-koi/silk-mid.png";
import silkBot from "../assets/digital/sakura-koi/silk-bot.png";
import envelope from "../assets/digital/sakura-koi/envelope.png";
import invitePaper from "../assets/digital/sakura-koi/invite-paper.jpg";
import letterContent from "../assets/digital/sakura-koi/letter-content.png";
import storyLeft from "../assets/digital/sakura-koi/story-left.png";
import storyRight from "../assets/digital/sakura-koi/story-right.png";
import venueCircle from "../assets/digital/sakura-koi/venue-circle.png";
import blossom from "../assets/digital/sakura-koi/blossom-cut.png";
import DigitalInviteEntrance from "../components/digital/DigitalInviteEntrance";
import AudioPlayer from "../components/audio/AudioPlayer";
import { toSafeHttpUrl } from "../lib/safeUrl";

const HERO_VIDEO = "/assets/digital/sakura-koi/hero-inside.mp4";
const ENTRANCE_VIDEO = "/assets/digital/sakura-koi/entrance.mp4";
const KOI_VIDEO = "/assets/digital/sakura-koi/koi-swim-v2.webm";
const KOI_VIDEO_FALLBACK = "/assets/digital/sakura-koi/koi-swim-v2.mp4";
const KOI_VIDEO_VER = "1703";

const defaultInvite = templateConfig.sample;
const fixedText = templateConfig.fixedText;
const C = {
  page: "#ffffff",
  accent: "#a56c64",
  text: "#4e4e4e",
  rsvp: "#ecdfdf",
  gold: "#b08a4f",
};
const F = {
  script: '"Gwendolyn", cursive',
  serif: '"Cormorant Garamond", serif',
};
const PAGE_W = 430;
const PAGE_H = 3645;

const parseEventTime = (time) => {
  if (!time) return { hours: 0, minutes: 0 };
  const match = String(time).match(/(\d{1,2})\D+(\d{1,2})/);
  if (!match) return { hours: 0, minutes: 0 };
  return {
    hours: Math.min(23, Number(match[1]) || 0),
    minutes: Math.min(59, Number(match[2]) || 0),
  };
};

const getCountdown = (dateString, time) => {
  if (!dateString) return { days: "00", hours: "00", minutes: "00" };
  const { hours: h, minutes: m } = parseEventTime(time);
  const hh = String(h).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  const target = new Date(`${dateString}T${hh}:${mm}:00`);
  if (Number.isNaN(target.getTime())) return { days: "00", hours: "00", minutes: "00" };
  const diff = Math.max(target.getTime() - Date.now(), 0);
  return {
    days: String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, "0"),
    hours: String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, "0"),
    minutes: String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0"),
  };
};

const formatInviteDate = (dateString, time) => {
  if (!dateString) {
    return { day: "15", month: "09", year: "2027", time: time || "21H30", label: "15 . 09 . 2027" };
  }
  const d = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(d.getTime())) {
    return { day: "15", month: "09", year: "2027", time: time || "21H30", label: "15 . 09 . 2027" };
  }
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear());
  return {
    day,
    month,
    year,
    time: time || "21H30",
    label: `${day} . ${month} . ${year}`,
  };
};

/** Animated koi — flip = miroir horizontal (comme Figma Flip Horizontal) */
function KoiFish({ left, top, flip = false, width = 58, height = 90, className = "", style = {} }) {
  return (
    <div
      className={`lw-sakura-koi pointer-events-none absolute overflow-hidden ${className}`}
      style={{ left, top, width, height, zIndex: 2, ...style }}
      aria-hidden
    >
      <video
        className={`lw-sakura-koi-video h-full w-full object-contain ${flip ? "lw-sakura-koi-flip" : ""}`}
        width={width}
        height={height}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={`${KOI_VIDEO}?v=${KOI_VIDEO_VER}`} type="video/webm" />
        <source src={`${KOI_VIDEO_FALLBACK}?v=${KOI_VIDEO_VER}`} type="video/mp4" />
      </video>
    </div>
  );
}

/** Expanding water-drop rings (no static SVG — avoids stacked circles) */
function Ripple({ left, top, size = 176, delay = 0 }) {
  return (
    <div
      className="lw-sakura-ripple pointer-events-none absolute z-[1]"
      style={{
        left,
        top,
        width: size,
        height: size,
        ["--lw-ripple-delay"]: `${delay}s`,
      }}
      aria-hidden
    >
      <span className="lw-sakura-ripple-ring" />
      <span className="lw-sakura-ripple-ring" />
      <span className="lw-sakura-ripple-ring" />
    </div>
  );
}

function SakuraKoiInvitePage({ invite = defaultInvite, previewMode = false }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guestCount, setGuestCount] = useState("1");
  const [attending, setAttending] = useState(true);
  const [rsvpStatus, setRsvpStatus] = useState("");
  const [rsvpError, setRsvpError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [entered, setEntered] = useState(false);
  // Compute scale on first paint — avoids skewed/overflow layout until refresh
  const [scale, setScale] = useState(() => {
    if (typeof window === "undefined") return 1;
    const w = Math.min(window.innerWidth, document.documentElement.clientWidth || window.innerWidth);
    return w > 0 && w < PAGE_W ? w / PAGE_W : 1;
  });
  const [countdown, setCountdown] = useState(() =>
    getCountdown(invite.eventDate || defaultInvite.eventDate, invite.time || defaultInvite.time)
  );
  const [displayCountdown, setDisplayCountdown] = useState({ days: "00", hours: "00", minutes: "00" });
  const countdownRef = useRef(null);
  const countdownAnimated = useRef(false);
  const countdownLatest = useRef(countdown);
  countdownLatest.current = countdown;

  // Same concept as Capri / other invites: document scroll, hide native bar
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById("root");
    html.classList.add("hide-scrollbar");
    body.classList.add("hide-scrollbar");
    root?.classList.add("hide-scrollbar");
    const prev = {
      htmlOverflowX: html.style.overflowX,
      bodyOverflowX: body.style.overflowX,
      htmlScrollbar: html.style.scrollbarWidth,
      bodyScrollbar: body.style.scrollbarWidth,
    };
    html.style.overflowX = "hidden";
    body.style.overflowX = "hidden";
    html.style.scrollbarWidth = "none";
    body.style.scrollbarWidth = "none";
    window.scrollTo(0, 0);
    return () => {
      html.classList.remove("hide-scrollbar");
      body.classList.remove("hide-scrollbar");
      root?.classList.remove("hide-scrollbar");
      html.style.overflowX = prev.htmlOverflowX;
      body.style.overflowX = prev.bodyOverflowX;
      html.style.scrollbarWidth = prev.htmlScrollbar;
      body.style.scrollbarWidth = prev.bodyScrollbar;
    };
  }, []);

  // Fit Figma 430px canvas to phone width (no horizontal overflow)
  useLayoutEffect(() => {
    const updateScale = () => {
      const w = Math.min(window.innerWidth, document.documentElement.clientWidth || window.innerWidth);
      setScale(w > 0 && w < PAGE_W ? w / PAGE_W : 1);
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    window.addEventListener("orientationchange", updateScale);
    return () => {
      window.removeEventListener("resize", updateScale);
      window.removeEventListener("orientationchange", updateScale);
    };
  }, []);

  // Lock scroll on entrance; reset to top when opening
  useEffect(() => {
    if (!entered) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
      return () => {
        document.body.style.overflow = prev;
      };
    }
    // Keep page scrollable but without visible scrollbar
    document.body.style.overflow = "";
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    return undefined;
  }, [entered]);

  // First-time scroll: words fade/slide in when they enter the viewport
  useEffect(() => {
    if (!entered) return undefined;
    const nodes = document.querySelectorAll(".lw-sakura-reveal");
    if (!nodes.length) return undefined;

    const reveal = (el) => el.classList.add("is-in");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    nodes.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < vh * 0.92 && rect.bottom > 0) {
        reveal(el);
      } else {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [entered]);

  // Live date countdown (updates every minute)
  useEffect(() => {
    const tick = () => setCountdown(getCountdown(invite.eventDate, invite.time));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [invite.eventDate, invite.time]);

  // Animate countdown numbers the first time the block enters the viewport
  useEffect(() => {
    if (!entered || countdownAnimated.current) return undefined;
    const el = countdownRef.current;
    if (!el) return undefined;

    const animateTo = (target) => {
      countdownAnimated.current = true;
      const start = performance.now();
      const duration = 1100;
      const to = {
        days: Number(target.days) || 0,
        hours: Number(target.hours) || 0,
        minutes: Number(target.minutes) || 0,
      };
      const pad = (n) => String(Math.round(n)).padStart(2, "0");
      const step = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const ease = 1 - (1 - t) ** 3;
        setDisplayCountdown({
          days: pad(to.days * ease),
          hours: pad(to.hours * ease),
          minutes: pad(to.minutes * ease),
        });
        if (t < 1) requestAnimationFrame(step);
        else setDisplayCountdown(countdownLatest.current);
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateTo(countdownLatest.current);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [entered]);

  // Keep display in sync after first animation
  useEffect(() => {
    if (countdownAnimated.current) setDisplayCountdown(countdown);
  }, [countdown]);

  const musicUrl = invite.musicUrl || defaultInvite.musicUrl || "";
  const inviteId = invite.id || invite.slug || "";
  const canSubmitRsvp = Boolean(invite.ownerId && inviteId && isFirebaseConfigured && !previewMode);
  const dateParts = formatInviteDate(invite.eventDate, invite.time);
  const couple = invite.coupleNames || defaultInvite.coupleNames;
  const venue = invite.venueName || defaultInvite.venueName;
  const letterImg = invite.letterContentImg || letterContent;

  const handleRsvpSubmit = async (event) => {
    event.preventDefault();
    setRsvpError("");
    setRsvpStatus("");
    if (!canSubmitRsvp) {
      setRsvpError("RSVP disponible sur le lien publié de l'invitation (dashboard).");
      return;
    }
    setSubmitting(true);
    try {
      await submitRsvpResponse({
        inviteId,
        ownerId: invite.ownerId,
        clientUserId: invite.clientUserId || "",
        clientEmail: invite.clientEmail || "",
        inviteSlug: invite.slug || inviteId,
        fullName,
        email,
        phone,
        guestCount,
        attending,
      });
      setRsvpStatus("Merci ! Votre réponse a bien été enregistrée.");
      setFullName("");
      setEmail("");
      setPhone("");
      setGuestCount("1");
      setAttending(true);
    } catch (error) {
      setRsvpError(error.message || "Impossible d'enregistrer le RSVP.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {!entered ? (
        <DigitalInviteEntrance
          video={`${ENTRANCE_VIDEO}?v=1`}
          alt="Sakura Koi invitation"
          openLabel="Ouvrir l'invitation"
          background="#f7ebe8"
          autoOpenAfterMs={4000}
          onOpen={() => {
            window.scrollTo(0, 0);
            setEntered(true);
          }}
        />
      ) : null}
      <AudioPlayer src={musicUrl} active={entered && Boolean(musicUrl)} themeColor={C.accent} />

      {/* Figma 1571:3 — absolute canvas 430 × 3645, scaled to viewport on mobile */}
      <div
        className="mx-auto overflow-hidden bg-white hide-scrollbar"
        style={{
          position: "relative",
          width: PAGE_W * scale,
          height: PAGE_H * scale,
        }}
      >
        <main
          className="bg-white hide-scrollbar"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: PAGE_W,
            height: PAGE_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            // Stable GPU layer — prevents skew / hard shadow lines on mobile Chrome
            WebkitBackfaceVisibility: "hidden",
            backfaceVisibility: "hidden",
            color: C.text,
            fontFamily: F.serif,
          }}
        >
        {/* Silk ribbons — Figma exports 1615:39 / 1640:226 / 1640:277 */}
        <img
          src={silkTop}
          alt=""
          className="pointer-events-none absolute left-0 top-[601px] z-0 h-[420px] w-[430px] max-w-none"
          draggable={false}
          aria-hidden
        />
        <img
          src={silkMid}
          alt=""
          className="pointer-events-none absolute left-[-10px] top-[2561px] z-0 h-[420px] w-[430px] max-w-none"
          draggable={false}
          aria-hidden
        />
        <img
          src={silkBot}
          alt=""
          className="pointer-events-none absolute left-[102px] top-[3091px] z-0 h-[420px] w-[328px] max-w-none"
          draggable={false}
          aria-hidden
        />

        {/* Water ripples — Figma Calques, behind content */}
        <Ripple left={319} top={626} delay={0} />
        <Ripple left={-80} top={814} delay={0.4} />
        <Ripple left={314} top={1118} delay={0.2} />
        <Ripple left={-80} top={1397} delay={0.8} />
        <Ripple left={314} top={1707} delay={0.6} />
        <Ripple left={-80} top={2086} delay={1} />
        <Ripple left={314} top={2610} delay={0.7} />
        <Ripple left={-56} top={3356} delay={0.5} />

        {/* Hero — vidéo boucle (sakura koi inside) */}
        <div className="absolute left-0 top-0 z-[2] h-[601px] w-[430px] overflow-hidden bg-white">
          <video
            className="absolute left-0 top-0 h-full w-full object-cover"
            style={{ objectPosition: "center top" }}
            src={HERO_VIDEO}
            poster={heroPoster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden
          />
          {/* Fade inside clip */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[140px] w-full"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 35%, rgba(255,255,255,0.85) 65%, #ffffff 88%, #ffffff 100%)",
            }}
            aria-hidden
          />
        </div>
        {/* Cover the overflow-clip hairline at hero → white (shows on scaled mobile) */}
        <div
          className="pointer-events-none absolute left-0 top-[575px] z-[3] h-[40px] w-[430px]"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0) 0%, #ffffff 45%, #ffffff 100%)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute left-0 top-[598px] z-[3] h-[6px] w-[430px] bg-white"
          aria-hidden
        />
        <p
          className="lw-sakura-reveal lw-sakura-cx absolute left-1/2 top-[262px] z-[3] w-[188px] text-center text-[16px] capitalize leading-4 tracking-[0.1em] text-white"
          style={{ textShadow: "0 1px 8px rgba(0,0,0,0.35)", ["--lw-reveal-delay"]: "0.1s" }}
        >
          {fixedText.heroEyebrow}
        </p>
        <h1
          className="lw-sakura-reveal lw-sakura-cx absolute left-1/2 top-[282px] z-[3] w-[338px] text-center text-[38px] leading-[40px] text-white"
          style={{ fontFamily: F.script, textShadow: "0 2px 12px rgba(0,0,0,0.4)", ["--lw-reveal-delay"]: "0.28s" }}
        >
          {couple}
        </h1>
        <p
          className="lw-sakura-reveal lw-sakura-cx absolute left-1/2 top-[330px] z-[3] w-[188px] text-center text-[16px] capitalize leading-4 tracking-[0.1em] text-white"
          style={{ textShadow: "0 1px 8px rgba(0,0,0,0.35)", ["--lw-reveal-delay"]: "0.45s" }}
        >
          {dateParts.label}
        </p>
        <div
          className="lw-sakura-reveal absolute left-[185px] top-[357px] z-[3] size-[62px] overflow-hidden rounded-full shadow-md"
          style={{ ["--lw-reveal-delay"]: "0.6s" }}
        >
          <img src={seal} alt="" className="size-full object-cover" draggable={false} />
        </div>

        {/* Countdown */}
        <h2
          className="lw-sakura-reveal lw-sakura-cx absolute left-1/2 top-[723px] z-[3] w-[338px] text-center text-[38px] leading-[40px]"
          style={{ fontFamily: F.script, color: C.accent }}
        >
          {fixedText.countdown}
        </h2>
        <div
          ref={countdownRef}
          className="lw-sakura-reveal absolute left-[104px] top-[790px] z-[2] flex h-[72px] w-[223px] justify-between text-center"
          style={{ ["--lw-reveal-delay"]: "0.15s" }}
        >
          {[
            [displayCountdown.days, "Days"],
            [displayCountdown.hours, "Hours"],
            [displayCountdown.minutes, "Minutes"],
          ].map(([value, label]) => (
            <div key={label} className="min-w-[44px]">
              <p className="text-[30px] leading-[22px] tracking-[0.1em]" style={{ color: C.accent }}>
                {value}
              </p>
              <p className="mt-2 text-[14px] leading-[22px] tracking-[0.1em]">{label}</p>
            </div>
          ))}
        </div>
        <KoiFish left={317} top={909} />

        {/* Formal Invite */}
        <h2
          className="lw-sakura-reveal lw-sakura-cx absolute left-1/2 top-[1040px] z-[3] w-[338px] text-center text-[38px] leading-[40px]"
          style={{ fontFamily: F.script, color: C.accent }}
        >
          {fixedText.formalInvite}
        </h2>
        <KoiFish left={8} top={1165} width={52} height={85} flip style={{ zIndex: 5 }} />
        <img
          src={envelope}
          alt=""
          className="pointer-events-none absolute left-[54px] top-[1099px] z-[2] h-[579px] w-[323px] object-contain"
          draggable={false}
        />
        <img
          src={invitePaper}
          alt=""
          className="pointer-events-none absolute left-[103px] top-[1138px] z-[3] h-[336px] w-[224px] object-cover"
          style={{ filter: "drop-shadow(2px 3px 8px rgba(0,0,0,0.18))" }}
          draggable={false}
        />
        <img
          src={letterImg}
          alt="Formal invitation letter"
          className="pointer-events-none absolute left-[128px] top-[1167px] z-[4] h-[288px] w-[175px] object-contain"
          draggable={false}
        />

        {/* Our Story */}
        <KoiFish left={338} top={1586} />
        <h2
          className="lw-sakura-reveal lw-sakura-cx absolute left-1/2 top-[1620px] z-[3] w-[338px] text-center text-[38px] leading-[40px]"
          style={{ fontFamily: F.script, color: C.accent }}
        >
          {fixedText.ourStory}
        </h2>
        <p
          className="lw-sakura-reveal absolute left-[104px] top-[1674px] z-[2] w-[226px] text-center text-[14px] capitalize leading-[18px] tracking-[0.1em]"
          style={{ ["--lw-reveal-delay"]: "0.12s" }}
        >
          {fixedText.storyText}
        </p>
        <img
          src={storyLeft}
          alt=""
          className="absolute left-[-31px] top-[1807px] z-[2] h-[342px] w-[246px] object-cover"
          draggable={false}
        />
        <img
          src={storyRight}
          alt=""
          className="absolute left-[227px] top-[1807px] z-[2] h-[342px] w-[246px] object-cover"
          draggable={false}
        />

        {/* Venue */}
        <KoiFish left={14} top={2149} flip />
        <h2
          className="lw-sakura-reveal lw-sakura-cx absolute left-1/2 top-[2204px] z-[3] w-[338px] text-center text-[38px] leading-[40px]"
          style={{ fontFamily: F.script, color: C.accent }}
        >
          {fixedText.venue}
        </h2>
        <p
          className="lw-sakura-reveal lw-sakura-cx absolute left-1/2 top-[2257px] z-[2] w-[222px] text-center text-[16px] capitalize tracking-[0.1em]"
          style={{ ["--lw-reveal-delay"]: "0.12s" }}
        >
          {venue}
        </p>
        <div className="absolute left-[147px] top-[2343px] z-[2] size-[132px]">
          {/* Rings centered on venue photo */}
          <div
            className="lw-sakura-ripple pointer-events-none absolute left-1/2 top-1/2 z-0 size-[240px] -translate-x-1/2 -translate-y-1/2"
            style={{ ["--lw-ripple-delay"]: "0.3s" }}
            aria-hidden
          >
            <span className="lw-sakura-ripple-ring" />
            <span className="lw-sakura-ripple-ring" />
            <span className="lw-sakura-ripple-ring" />
          </div>
          <img
            src={venueCircle}
            alt=""
            className="relative z-[1] size-full rounded-full object-cover"
            draggable={false}
          />
        </div>
        <a
          href={toSafeHttpUrl(invite.mapUrl || defaultInvite.mapUrl, "https://maps.google.com")}
          target="_blank"
          rel="noreferrer"
          className="lw-sakura-reveal lw-sakura-cx absolute left-1/2 top-[2541px] z-[2] flex h-[45px] w-[158px] items-center justify-center rounded-full text-[14px] tracking-[0.1em]"
          style={{ background: C.rsvp, color: C.text, ["--lw-reveal-delay"]: "0.1s" }}
        >
          {fixedText.openMaps}
        </a>
        <KoiFish left={338} top={2580} />

        {/* RSVP capsule */}
        <div
          className="absolute left-[-4px] top-[2697px] z-[2] h-[709px] w-[434px] rounded-[217px]"
          style={{ background: C.rsvp }}
        />
        <h2
          className="lw-sakura-reveal lw-sakura-cx absolute left-1/2 top-[2774px] z-10 w-[338px] text-center text-[38px] leading-[40px]"
          style={{ fontFamily: F.script, color: C.accent }}
        >
          {fixedText.rsvp}
        </h2>

        <form onSubmit={handleRsvpSubmit} className="lw-sakura-reveal absolute left-[53px] top-[2878px] z-10 w-[320px]" style={{ ["--lw-reveal-delay"]: "0.12s" }}>
          <p className="text-[14px] tracking-[0.1em]">Will you attend</p>
          <div className="mt-4 grid grid-cols-2 gap-x-3 text-[12px] leading-[16px] tracking-[0.08em]">
            <label className="flex items-start gap-2">
              <input
                type="radio"
                className="mt-0.5 size-[14px] shrink-0 accent-[#a56c64]"
                checked={attending}
                onChange={() => setAttending(true)}
              />
              <span>Yes, I will be there</span>
            </label>
            <label className="flex items-start gap-2">
              <input
                type="radio"
                className="mt-0.5 size-[14px] shrink-0 accent-[#a56c64]"
                checked={!attending}
                onChange={() => setAttending(false)}
              />
              <span>Sorry, I can&apos;t make it</span>
            </label>
          </div>

          {[
            ["Name", fullName, setFullName, "text", true],
            ["Email", email, setEmail, "email", false],
            ["Phone Number", phone, setPhone, "tel", false],
            ["Number of Guests", guestCount, setGuestCount, "number", false],
          ].map(([label, value, setter, type, required], i) => (
            <label key={label} className={`block ${i === 0 ? "mt-6" : "mt-4"}`}>
              <span className="text-[14px] tracking-[0.1em]">{label}</span>
              <input
                type={type}
                required={required}
                value={value}
                onChange={(e) => setter(e.target.value)}
                min={type === "number" ? "1" : undefined}
                className="mt-1 w-full border-0 border-b border-black bg-transparent pb-2 text-[14px] outline-none"
              />
            </label>
          ))}

          {rsvpError ? <p className="mt-3 text-center text-sm text-red-600">{rsvpError}</p> : null}
          {rsvpStatus ? <p className="mt-3 text-center text-sm text-emerald-700">{rsvpStatus}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="mx-auto mt-8 flex h-[45px] w-[158px] items-center justify-center rounded-full bg-white text-[14px] tracking-[0.1em] disabled:opacity-60"
          >
            {submitting ? "…" : "Send !"}
          </button>
        </form>

        <KoiFish left={14} top={3360} flip />

        {/* Footer */}
        <h2
          className="lw-sakura-reveal lw-sakura-cx absolute left-1/2 top-[3499px] z-10 w-[338px] text-center text-[38px] leading-[40px]"
          style={{ fontFamily: F.script, color: C.accent }}
        >
          {fixedText.seeYou}
        </h2>
        <img
          src={blossom}
          alt=""
          className="lw-sakura-reveal pointer-events-none absolute left-[185px] top-[3555px] z-[2] h-[80px] w-[60px] object-contain"
          style={{ ["--lw-reveal-delay"]: "0.15s" }}
          draggable={false}
        />
      </main>
      </div>
    </>
  );
}

export default SakuraKoiInvitePage;
