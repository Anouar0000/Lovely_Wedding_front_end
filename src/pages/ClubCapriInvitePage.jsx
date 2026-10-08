import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import templateConfig from "../data/digital/templates/club-capri.json";
import { submitRsvpResponse } from "../services/rsvp";
import { isFirebaseConfigured } from "../lib/firebase";

import heroSea from "../assets/digital/club-capri/hero-sea.png";
import cassette from "../assets/digital/club-capri/cassette-cut.png";
import boat from "../assets/digital/club-capri/boat-cut.png";
import photoWedding from "../assets/digital/club-capri/postcard-photo-1.png";
import photoHenna from "../assets/digital/club-capri/postcard-photo-2.png";
import stampFrame from "../assets/digital/club-capri/stamp-frame.svg";
import postmark1Svg from "../assets/digital/club-capri/postmark-1.svg";
import postmark2Svg from "../assets/digital/club-capri/postmark-2.svg";
import stampSunImg from "../assets/digital/club-capri/stamp-sun.png";
import stampCapriImg from "../assets/digital/club-capri/stamp-capri.png";
import stampCocktailImg from "../assets/digital/club-capri/stamp-cocktail.png";
import rsvpBg from "../assets/digital/club-capri/rsvp-bg.png";
import lifebuoy from "../assets/digital/club-capri/lifebuoy.png";
import tape from "../assets/digital/club-capri/tape.png";
import family from "../assets/digital/club-capri/dress-code-family.png";
import heroTitleSvg from "../assets/digital/club-capri/svg_text/hero-title.svg";
import chedySvg from "../assets/digital/club-capri/svg_text/chedy.svg";
import helaSvg from "../assets/digital/club-capri/svg_text/hela.svg";
import joinUsTitleSvg from "../assets/digital/club-capri/svg_text/join-us-title.svg";
import juneTitleSvg from "../assets/digital/club-capri/svg_text/june-title.svg";
import theDayTitleSvg from "../assets/digital/club-capri/svg_text/the-day-title.svg";
import celebrationsTitleSvg from "../assets/digital/club-capri/svg_text/celebrations-title.svg";
import postcardTitle1Svg from "../assets/digital/club-capri/svg_text/postcard-title-1.svg";
import postcardTitle2Svg from "../assets/digital/club-capri/svg_text/postcard-title-2.svg";
import weddingTitleSvg from "../assets/digital/club-capri/svg_text/wedding-title.svg";
import hennaTitleSvg from "../assets/digital/club-capri/svg_text/henna-title.svg";
import dressCodeTitleSvg from "../assets/digital/club-capri/svg_text/dress-code-title.svg";
import casualChicTitleSvg from "../assets/digital/club-capri/svg_text/casual-chic-title.svg";
import arrivalTitleSvg from "../assets/digital/club-capri/svg_text/arrival-title.svg";
import rsvpTitleSvg from "../assets/digital/club-capri/svg_text/rsvp-title.svg";
import clubCapriTitleSvg from "../assets/digital/club-capri/svg_text/club-capri-title.svg";
import stripesLeft from "../assets/digital/club-capri/stripes-left.svg";
import stripesRight from "../assets/digital/club-capri/stripes-right.svg";
import stripesBottom from "../assets/digital/club-capri/stripes-bottom.svg";
import arrowDownSvg from "../assets/digital/club-capri/arrow-down.svg";
import DigitalInviteEntrance from "../components/digital/DigitalInviteEntrance";
import AudioPlayer from "../components/audio/AudioPlayer";

const ENTRANCE_VIDEO = "/assets/digital/club-capri/entrance.mp4";

const defaultInvite = templateConfig.sample;
const fixedText = templateConfig.fixedText;
const C = {
  page: "#fffbf0",
  ink: "#083b50",
  cream: "#f7edbc",
  soft: "#e5e2dd",
  stripe: "#c0d5d8",
  button: "#c0d5d8",
  brand: "#427d8d",
};
const F = {
  script: '"Great Vibes", cursive',
  serif: '"Cinzel", serif',
  mono: '"Roboto Mono", monospace',
};
const PAGE_W = 430;

const getCountdown = (dateString) => {
  if (!dateString) return { days: "00", hours: "00", minutes: "00" };
  const target = new Date(`${dateString}T00:00:00`);
  const diff = Math.max(target.getTime() - Date.now(), 0);
  return {
    days: String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, "0"),
    hours: String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, "0"),
    minutes: String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0"),
  };
};

const getMonthLabel = (dateString) => {
  if (!dateString) return "June";
  const d = new Date(`${dateString}T00:00:00`);
  return Number.isNaN(d.getTime()) ? "June" : d.toLocaleString("en", { month: "long" });
};

const splitNames = (coupleNames) => {
  const [left = "Chedy", right = "Hela"] = (coupleNames || "Chedy & Hela").split(/\s*&\s*|\s+et\s+/i);
  return { left: left.trim(), right: right.trim() };
};

function ClubCapriInvitePage({ invite = defaultInvite, previewMode = false }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guestCount, setGuestCount] = useState("1");
  const [attending, setAttending] = useState(true);
  const [rsvpStatus, setRsvpStatus] = useState("");
  const [rsvpError, setRsvpError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [entered, setEntered] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const musicPlayerRef = useRef(null);
  const canvasRef = useRef(null);
  const countdownRef = useRef(null);
  const countdownAnimated = useRef(false);
  const countdownLatest = useRef(getCountdown(invite.eventDate));
  const musicUrl = invite.musicUrl || defaultInvite.musicUrl || "";

  // Scale canvas 430px → largeur téléphone (évite overflow / inclinaison)
  const [scale, setScale] = useState(() => {
    if (typeof window === "undefined") return 1;
    const w = Math.min(window.innerWidth, document.documentElement.clientWidth || window.innerWidth);
    return w > 0 && w < PAGE_W ? w / PAGE_W : 1;
  });
  const [contentH, setContentH] = useState(3200);

  const inviteId = invite.id || invite.slug || "";
  const canSubmitRsvp = Boolean(invite.ownerId && inviteId && isFirebaseConfigured && !previewMode);
  const countdown = getCountdown(invite.eventDate);
  const [displayCountdown, setDisplayCountdown] = useState(() => ({
    days: "00",
    hours: "00",
    minutes: "00",
  }));
  const month = getMonthLabel(invite.eventDate);
  const names = useMemo(() => splitNames(invite.coupleNames || defaultInvite.coupleNames), [invite.coupleNames]);

  useEffect(() => {
    countdownLatest.current = countdown;
  }, [countdown]);

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
    };
    html.style.overflowX = "hidden";
    body.style.overflowX = "hidden";
    window.scrollTo(0, 0);
    return () => {
      html.classList.remove("hide-scrollbar");
      body.classList.remove("hide-scrollbar");
      root?.classList.remove("hide-scrollbar");
      html.style.overflowX = prev.htmlOverflowX;
      body.style.overflowX = prev.bodyOverflowX;
    };
  }, []);

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

  useLayoutEffect(() => {
    const el = canvasRef.current;
    if (!el) return undefined;
    const measure = () => setContentH(el.scrollHeight || el.offsetHeight || 3200);
    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    return () => ro?.disconnect();
  }, [entered]);

  useEffect(() => {
    if (!entered) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
      return () => {
        document.body.style.overflow = prev;
      };
    }
    window.scrollTo(0, 0);
    return undefined;
  }, [entered]);

  // Scroll reveal — same pattern as Sakura
  useEffect(() => {
    if (!entered) return undefined;
    const nodes = document.querySelectorAll(".lw-capri-reveal");
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

  // Countdown tick
  useEffect(() => {
    const tick = () => {
      const next = getCountdown(invite.eventDate);
      countdownLatest.current = next;
      if (countdownAnimated.current) setDisplayCountdown(next);
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [invite.eventDate]);

  // Animate countdown numbers on first viewport entry
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

  const celebrations = [
    {
      label: "wedding",
      postcardTitle: postcardTitle1Svg,
      labelSvg: weddingTitleSvg,
      labelW: 110,
      addressLines: ["Dar Bouraoui Carthage", "Malaga", "18h"],
      image: photoWedding,
      postmark: postmark1Svg,
      stampA: stampSunImg,
      stampB: stampCapriImg,
    },
    {
      label: "henna",
      postcardTitle: postcardTitle2Svg,
      labelSvg: hennaTitleSvg,
      labelW: 79,
      addressLines: ["Dar Bouraoui Carthage", "Malaga", "18h"],
      image: photoHenna,
      postmark: postmark2Svg,
      stampA: stampCocktailImg,
      stampB: stampCapriImg,
    },
  ];

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
          alt="Club Capri invitation entrance"
          background="#0a0a0a"
          autoOnly
          autoOpenAfterMs={4000}
          onOpen={() => {
            window.scrollTo(0, 0);
            setEntered(true);
          }}
        />
      ) : null}
      <AudioPlayer
        ref={musicPlayerRef}
        src={musicUrl}
        active={entered && Boolean(musicUrl)}
        themeColor={C.brand}
        onPlayingChange={setMusicPlaying}
      />
    <div
      className="mx-auto overflow-hidden hide-scrollbar"
      style={{
        position: "relative",
        width: PAGE_W * scale,
        height: contentH * scale,
        background: C.page,
      }}
    >
    <main
      ref={canvasRef}
      className="relative hide-scrollbar"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: PAGE_W,
        background: C.page,
        color: C.ink,
        fontFamily: F.mono,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        WebkitBackfaceVisibility: "hidden",
        backfaceVisibility: "hidden",
      }}
    >
      {/* Hero — Figma 1519:5 (430×601) — positions d'origine */}
      <section className="relative h-[601px] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={heroSea}
            alt=""
            className="absolute left-0 top-0 h-[601px] w-[430px] max-w-none object-cover"
            draggable={false}
          />
        </div>
        <div
          className="pointer-events-none absolute left-[-1px] top-[517px] z-[2] h-[95px] w-[432px]"
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, #fffbf0 89%)" }}
        />

        {/* Cassette x:78 y:116 w:274 h:490 */}
        <button
          type="button"
          className={`lw-capri-cassette absolute left-[78px] top-[116px] z-[3] h-[490px] w-[274px] cursor-pointer border-0 bg-transparent p-0 ${
            musicPlaying ? "" : "opacity-95"
          }`}
          aria-label={musicPlaying ? "Pause musique" : "Lecture musique"}
          onClick={() => musicPlayerRef.current?.toggle()}
        >
          <img
            src={cassette}
            alt=""
            className="pointer-events-none h-full w-full object-cover"
            draggable={false}
          />
        </button>

        {/* Title — Figma SVG x:93 y:131 */}
        <div
          className="lw-capri-reveal absolute left-[93px] top-[131px] z-[4] flex h-[83px] w-[245px] items-start justify-center"
          style={{ ["--lw-reveal-delay"]: "0.05s" }}
        >
          <img
            src={heroTitleSvg}
            alt="POST Card FROM Summer"
            className="block h-[74px] w-[227px] max-w-none"
            draggable={false}
          />
        </div>

        {/* Names — Figma x:125 / x:219 y:201 */}
        <div
          className="lw-capri-reveal absolute left-[125px] top-[201px] z-[4] flex h-[40px] w-[73px] items-center justify-center"
          style={{ ["--lw-reveal-delay"]: "0.2s" }}
        >
          {names.left.toLowerCase() === "chedy" ? (
            <img src={chedySvg} alt={names.left} className="block h-[12px] w-[47px] max-w-none" draggable={false} />
          ) : (
            <span className="text-[14px] uppercase leading-none tracking-[0.05em]" style={{ color: C.soft }}>
              {names.left}
            </span>
          )}
        </div>
        <div
          className="lw-capri-reveal absolute left-[219px] top-[201px] z-[4] flex h-[40px] w-[73px] items-center justify-center"
          style={{ ["--lw-reveal-delay"]: "0.32s" }}
        >
          {names.right.toLowerCase() === "hela" ? (
            <img src={helaSvg} alt={names.right} className="block h-[12px] w-[37px] max-w-none" draggable={false} />
          ) : (
            <span className="text-[14px] uppercase leading-none tracking-[0.05em]" style={{ color: C.soft }}>
              {names.right}
            </span>
          )}
        </div>

        {/* VOLUME x:102 y:427 */}
        <p
          className="lw-capri-reveal absolute left-[102px] top-[427px] z-[4] flex h-[40px] w-[73px] items-center justify-center text-[16px] uppercase leading-5 tracking-[0.05em]"
          style={{ color: C.soft, ["--lw-reveal-delay"]: "0.45s" }}
        >
          Volume
        </p>
        {[183, 193, 203, 213, 223, 233, 243, 253, 263, 273, 283].map((x, i) => (
          <span
            key={x}
            className={`absolute z-[4] w-[2px] bg-current ${musicPlaying ? "lw-capri-volume-bar" : ""}`}
            style={{ left: x, top: 436, height: 21, color: C.soft, animationDelay: `${i * 0.07}s` }}
            aria-hidden
          />
        ))}
      </section>

      {/* Join us + The Day — Figma absolute (offset from hero end y:601) */}
      <section className="relative z-10 overflow-hidden" style={{ height: 744 }}>
        {/* Join us in — y:626 → top:25, box 148×46, SVG 78×22 */}
        <div
          className="lw-capri-reveal absolute left-[141px] top-[25px] z-[2] flex h-[46px] w-[148px] items-center justify-center"
          style={{ ["--lw-reveal-delay"]: "0.05s" }}
        >
          <img src={joinUsTitleSvg} alt="Join us in" className="block h-[22px] w-[78px]" draggable={false} />
        </div>

        {/* JUNE — y:667 → top:66, box 239×42, SVG 89×31 */}
        <div
          className="lw-capri-reveal absolute left-[96px] top-[66px] z-[2] flex h-[42px] w-[239px] items-center justify-center"
          style={{ ["--lw-reveal-delay"]: "0.18s" }}
        >
          {month.toLowerCase() === "june" ? (
            <img src={juneTitleSvg} alt="JUNE" className="block h-[31px] w-[89px]" draggable={false} />
          ) : (
            <h2 className="text-[36px] uppercase leading-[40px]" style={{ fontFamily: F.serif, fontWeight: 300 }}>
              {month}
            </h2>
          )}
        </div>

        {/* Invite text — y:715 → top:114, 226×57 */}
        <p
          className="lw-capri-reveal absolute left-[102px] top-[114px] z-[2] flex h-[57px] w-[226px] items-center justify-center text-center text-[12px] uppercase leading-[18px]"
          style={{ ["--lw-reveal-delay"]: "0.3s" }}
        >
          {fixedText.inviteText}
        </p>

        {/* Arrow — y:787 → top:186 */}
        <img
          src={arrowDownSvg}
          alt=""
          className="lw-capri-arrow pointer-events-none absolute left-[212px] top-[186px] z-[2] h-[19px] w-[6px]"
          draggable={false}
          aria-hidden
        />

        {/* The Day — y:838 → top:237, box 148×46, SVG 110×32 */}
        <div
          className="lw-capri-reveal absolute left-[141px] top-[237px] z-[2] flex h-[46px] w-[148px] items-center justify-center"
          style={{ ["--lw-reveal-delay"]: "0.08s" }}
        >
          <img src={theDayTitleSvg} alt="The Day" className="block h-[32px] w-[110px]" draggable={false} />
        </div>

        {/* Countdown — y:913 → top:312, 307×64; cols x:0 / 127 / 253 */}
        <div
          ref={countdownRef}
          className="lw-capri-reveal absolute left-[62px] top-[312px] z-[3] h-[64px] w-[307px]"
          style={{ ["--lw-reveal-delay"]: "0.2s" }}
        >
          {[
            [displayCountdown.days, "Days", 0],
            [displayCountdown.hours, "Hours", 127],
            [displayCountdown.minutes, "Minutes", 253],
          ].map(([value, label, left]) => (
            <div key={label} className="absolute top-0 h-[64px] w-[44px] text-center" style={{ left }}>
              <p className="h-[35px] text-[30px] leading-[40px]" style={{ fontFamily: F.serif, fontWeight: 300 }}>
                {value}
              </p>
              <p className="mt-[5px] flex h-[24px] items-center justify-center text-[12px] uppercase leading-[18px]">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Boat — y:867 → top:266, x:162 w:269 h:478 */}
        <img
          src={boat}
          alt=""
          className="lw-capri-boat pointer-events-none absolute left-[162px] top-[266px] z-0 h-[478px] w-[269px] object-cover"
          draggable={false}
        />
      </section>

      {/* Celebrations — Figma y:1246 (overlap bateau : -99px after section y:1345)
          Gap postcard bas (1631+255=1886) → Dress Code (2005) = 119px */}
      <section className="relative z-10 overflow-hidden" style={{ marginTop: -99, paddingBottom: 119 }}>
        {/* Rayures gauches — Figma y:1396 → top:150, x:-324 */}
        <img
          src={stripesLeft}
          alt=""
          className="pointer-events-none absolute z-[1] h-[314px] w-[499px] max-w-none"
          style={{ left: -324, top: 150 }}
          draggable={false}
          aria-hidden
        />
        {/* Rayures droites — Figma y:1790 → top:544, x:281 */}
        <img
          src={stripesRight}
          alt=""
          className="pointer-events-none absolute left-[281px] top-[544px] z-[1] h-[164px] w-[499px] max-w-none"
          draggable={false}
          aria-hidden
        />

        <div
          className="lw-capri-reveal relative z-10 mx-auto flex h-[46px] w-[148px] items-center justify-center"
          style={{ ["--lw-reveal-delay"]: "0.05s" }}
        >
          <img
            src={celebrationsTitleSvg}
            alt="Celebrations"
            className="block h-[26px] w-[132px]"
            draggable={false}
          />
        </div>

        {/* Postcards — Figma x:26 y:1335 / 1631, gap 41 */}
        <div className="relative z-10 mx-auto mt-[43px] flex w-[377px] flex-col gap-[41px]">
          {celebrations.map((item, index) => (
            <article
              key={item.label}
              className="lw-capri-reveal relative h-[255px] w-[377px] overflow-hidden rounded-[5px] bg-white shadow-[0px_1px_15px_0px_rgba(0,0,0,0.25)]"
              style={{ ["--lw-reveal-delay"]: `${0.08 + index * 0.12}s` }}
            >
              {/* Postcard — Figma relative x:26 y:29 */}
              <div className="absolute left-[26px] top-[29px] z-[2] flex h-[39px] w-[148px] items-center justify-center">
                <img
                  src={item.postcardTitle}
                  alt="Postcard"
                  className="block h-[16px] w-[65px]"
                  draggable={false}
                />
              </div>
              {/* wedding / henna — Figma x:-20 y:59 */}
              <div className="absolute left-[-20px] top-[59px] z-[2] flex h-[42px] w-[239px] items-center justify-center">
                <img
                  src={item.labelSvg}
                  alt={item.label}
                  className="block h-[17px]"
                  style={{ width: item.labelW }}
                  draggable={false}
                />
              </div>
              <img
                src={item.image}
                alt=""
                className="absolute left-[42px] top-[103px] z-[2] size-[115px] object-cover"
                draggable={false}
              />
              <div
                className="absolute left-[187px] top-[29px] z-[2] h-[202px] w-0 border-l-[0.25px] border-[#083b50]"
                aria-hidden
              />

              {/* Cachet (cercles) sous timbres — Figma x:250 y:18 95.72² */}
              <img
                src={item.postmark}
                alt=""
                className="pointer-events-none absolute left-[250px] top-[18px] z-[2] h-[95.72px] w-[95.72px]"
                draggable={false}
              />
              <img
                src={item.stampA}
                alt=""
                className="absolute z-[3] h-[53px] w-[39px] object-cover"
                style={{ left: 276.71, top: 56 }}
                draggable={false}
              />
              <img
                src={item.stampB}
                alt=""
                className="absolute z-[3] h-[53px] w-[39px] object-cover"
                style={{ left: 311.71, top: 22 }}
                draggable={false}
              />

              {/* To: + adresse sous le tampon — Figma */}
              <p className="absolute left-[210px] top-[125px] z-[2] flex h-[25px] w-[26px] items-center justify-center text-[10px] uppercase leading-[18px]">
                To:
              </p>
              <div className="absolute left-[214px] top-[142px] z-[1] w-[137px] border-t-[0.25px] border-[#083b50]" />
              <div className="absolute left-[214px] top-[165px] z-[1] w-[137px] border-t-[0.25px] border-[#083b50]" />
              <div className="absolute left-[214px] top-[188px] z-[1] w-[137px] border-t-[0.25px] border-[#083b50]" />
              <div className="absolute left-[214px] top-[211px] z-[1] w-[137px] border-t-[0.25px] border-[#083b50]" />
              <div
                className="absolute left-[206px] top-[146px] z-[2] w-[148px] text-center text-[16px] leading-[23px]"
                style={{ fontFamily: F.script }}
              >
                {item.addressLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Dress code — Figma y:2005–2416 (relative tops from 2005) */}
      <section className="relative overflow-hidden" style={{ height: 411 }}>
        {/* Dress Code — y:2005 → top:0, box 148×46, SVG 94×19 */}
        <div
          className="lw-capri-reveal absolute left-[141px] top-0 z-[2] flex h-[46px] w-[148px] items-center justify-center"
          style={{ ["--lw-reveal-delay"]: "0.05s" }}
        >
          <img src={dressCodeTitleSvg} alt="Dress Code" className="block h-[19px] w-[94px]" draggable={false} />
        </div>

        {/* casual chic — y:2046 → top:41, box 253×42, SVG 239×28 */}
        <div
          className="lw-capri-reveal absolute left-[89px] top-[41px] z-[2] flex h-[42px] w-[253px] items-center justify-center"
          style={{ ["--lw-reveal-delay"]: "0.16s" }}
        >
          {(invite.dressCode || defaultInvite.dressCode || "").toLowerCase() === "casual chic" ? (
            <img src={casualChicTitleSvg} alt="casual chic" className="block h-[28px] w-[239px]" draggable={false} />
          ) : (
            <h2
              className="text-[28px] lowercase leading-none tracking-[0.02em]"
              style={{ fontFamily: F.serif, fontWeight: 300 }}
            >
              {invite.dressCode || defaultInvite.dressCode}
            </h2>
          )}
        </div>

        {/* Invite copy — y:2094 → top:89, 226×57 */}
        <p
          className="lw-capri-reveal absolute left-[102px] top-[89px] z-[2] flex h-[57px] w-[226px] items-center justify-center text-center text-[12px] uppercase leading-[18px]"
          style={{ ["--lw-reveal-delay"]: "0.28s" }}
        >
          {fixedText.inviteText}
        </p>

        {/* Family — y:2138 → top:133, 270×278 */}
        <img
          src={family}
          alt=""
          className="lw-capri-reveal absolute left-[80px] top-[133px] z-[2] h-[278px] w-[270px] object-cover"
          style={{ ["--lw-reveal-delay"]: "0.4s" }}
          draggable={false}
        />
      </section>

      {/* Arrival & RSVP — Figma y:2422–2619, 6px sous la photo (section dress code finit à y:2416) */}
      <section className="relative overflow-hidden" style={{ height: 203 }}>
        {/* Arrival — y:2422 → top:6, box 148×46, SVG 71×19 */}
        <div
          className="lw-capri-reveal absolute left-[141px] top-[6px] z-[2] flex h-[46px] w-[148px] items-center justify-center"
          style={{ ["--lw-reveal-delay"]: "0.05s" }}
        >
          <img src={arrivalTitleSvg} alt="Arrival" className="block h-[19px] w-[71px]" draggable={false} />
        </div>

        {/* RSVP — y:2463 → top:47, box 253×42, SVG 83×28 */}
        <div
          className="lw-capri-reveal absolute left-[89px] top-[47px] z-[2] flex h-[42px] w-[253px] items-center justify-center"
          style={{ ["--lw-reveal-delay"]: "0.16s" }}
        >
          <img src={rsvpTitleSvg} alt="RSVP" className="block h-[28px] w-[83px]" draggable={false} />
        </div>

        {/* Deadline — y:2511 → top:95, 226×57, 12/18 */}
        <p
          className="lw-capri-reveal absolute left-[102px] top-[95px] z-[2] flex h-[57px] w-[226px] items-center justify-center text-center text-[12px] uppercase leading-[18px]"
          style={{ ["--lw-reveal-delay"]: "0.28s" }}
        >
          {fixedText.rsvpDeadline}
        </p>
      </section>

      {/* RSVP form — Figma bg y:2619 h:608; stamp 24,2664 382×517 */}
      <section className="relative overflow-hidden" style={{ height: 608 }}>
        <img
          src={rsvpBg}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
          draggable={false}
        />

        {/* Stamp card — relative to bg: top 45 (2664-2619) */}
        <div
          className="lw-capri-reveal absolute left-[24px] top-[45px] z-[3] h-[517px] w-[382px]"
          style={{ ["--lw-reveal-delay"]: "0.1s" }}
        >
          {/* Tape — Figma y:2652 → top -12 relative to stamp */}
          <img
            src={tape}
            alt=""
            className="pointer-events-none absolute left-[129px] top-[-12px] z-[5] h-[37px] w-[124px] object-cover"
            draggable={false}
          />

          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              WebkitMaskImage: `url(${stampFrame})`,
              maskImage: `url(${stampFrame})`,
              WebkitMaskSize: "100% 100%",
              maskSize: "100% 100%",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
            }}
          >
            <form
              onSubmit={handleRsvpSubmit}
              className="relative h-full w-full bg-white text-left"
              style={{ fontFamily: F.mono, color: C.ink }}
            >
              {/* Will you attend — stamp-relative top 68 (2732-2664), left 31 */}
              <p className="absolute left-[31px] top-[68px] h-[18px] w-[152px] text-[12px] uppercase leading-[18px]">
                Will you attend
              </p>

              {/* Radios side-by-side — Figma y:2770/2771 */}
              <label className="absolute left-[31px] top-[107px] z-[4] flex h-[36px] w-[161px] cursor-pointer items-start gap-[10px]">
                <span
                  className="mt-[1px] size-[14px] shrink-0 rounded-full"
                  style={{
                    background: attending ? C.stripe : "transparent",
                    border: attending ? "none" : `1px solid ${C.stripe}`,
                  }}
                  aria-hidden
                />
                <input
                  type="radio"
                  className="sr-only"
                  checked={attending}
                  onChange={() => setAttending(true)}
                />
                <span className="w-[133px] text-[12px] uppercase leading-[18px]">Yes, I will be there</span>
              </label>
              <label className="absolute left-[192px] top-[107px] z-[4] flex h-[36px] w-[159px] cursor-pointer items-start gap-[10px]">
                <span
                  className="mt-[1px] size-[14px] shrink-0 rounded-full"
                  style={{
                    background: !attending ? C.stripe : "transparent",
                    border: !attending ? "none" : `1px solid ${C.stripe}`,
                  }}
                  aria-hidden
                />
                <input
                  type="radio"
                  className="sr-only"
                  checked={!attending}
                  onChange={() => setAttending(false)}
                />
                <span className="w-[135px] text-[12px] uppercase leading-[18px]">Sorry, I can&apos;t make it</span>
              </label>

              {/* Fields — Figma 320×40, tops 153 / 223 / 293 / 363, gap 70 */}
              {[
                ["Name", fullName, setFullName, "text", true, 153],
                ["Email", email, setEmail, "email", false, 223],
                ["Phone Number", phone, setPhone, "tel", false, 293],
                ["Number of Guests", guestCount, setGuestCount, "number", false, 363],
              ].map(([label, value, setter, type, required, top]) => (
                <label
                  key={label}
                  className="absolute left-[31px] z-[4] block h-[40px] w-[320px] border-b border-black"
                  style={{ top }}
                >
                  {!String(value || "").trim() ? (
                    <span className="pointer-events-none absolute left-0 top-[10px] text-[12px] uppercase leading-[18px]">
                      {label}
                    </span>
                  ) : null}
                  <input
                    type={type}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    required={required}
                    aria-label={label}
                    className="absolute inset-0 h-full w-full border-0 bg-transparent pt-[10px] text-[12px] uppercase leading-[18px] outline-none"
                    style={{ color: C.ink, fontFamily: F.mono }}
                  />
                </label>
              ))}

              {rsvpError ? (
                <p className="absolute left-[31px] top-[408px] z-[4] w-[320px] text-center text-[11px] text-red-600">
                  {rsvpError}
                </p>
              ) : null}
              {rsvpStatus ? (
                <p className="absolute left-[31px] top-[408px] z-[4] w-[320px] text-center text-[11px] text-emerald-700">
                  {rsvpStatus}
                </p>
              ) : null}

              {/* Button — Figma 3097 → top 433, 320×40 */}
              <button
                type="submit"
                disabled={submitting}
                className="absolute left-[31px] top-[433px] z-[4] flex h-[40px] w-[320px] items-center justify-center rounded-[7px] text-[12px] uppercase leading-[18px] text-white disabled:opacity-60"
                style={{ background: C.button, fontFamily: F.mono }}
              >
                {submitting ? "Sending…" : "Send Confirmation"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer — Figma y:3227–3454. Bouée y:3239, titre y:3320, rayures y:3339 */}
      <footer className="relative overflow-hidden" style={{ height: 227 }}>
        <img
          src={stripesBottom}
          alt=""
          className="pointer-events-none absolute z-[1] h-[164px] w-[499px] max-w-none"
          style={{ left: -10, top: 112 }}
          draggable={false}
          aria-hidden
        />
        <img
          src={lifebuoy}
          alt=""
          className="lw-capri-reveal absolute left-[160px] top-[12px] z-[2] h-[200px] w-[111px] object-cover"
          style={{ ["--lw-reveal-delay"]: "0.05s" }}
          draggable={false}
        />
        <div
          className="lw-capri-reveal absolute left-[103px] top-[93px] z-[3] flex h-[41px] w-[221px] items-center justify-center"
          style={{ ["--lw-reveal-delay"]: "0.18s" }}
        >
          <img src={clubCapriTitleSvg} alt="club Capri" className="block h-[44px] w-[187px]" draggable={false} />
        </div>
      </footer>
    </main>
    </div>
    </>
  );
}

export default ClubCapriInvitePage;
