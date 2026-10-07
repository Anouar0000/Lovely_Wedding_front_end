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
import family from "../assets/digital/club-capri/family.png";
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
import stripesLeft from "../assets/digital/club-capri/stripes-left.svg";
import stripesRight from "../assets/digital/club-capri/stripes-right.svg";
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
  const month = getMonthLabel(invite.eventDate);
  const names = useMemo(() => splitNames(invite.coupleNames || defaultInvite.coupleNames), [invite.coupleNames]);

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
          openLabel="Ouvrir l'invitation"
          background="#0a0a0a"
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
        <div className="absolute left-[93px] top-[131px] z-[4] flex h-[83px] w-[245px] items-start justify-center">
          <img
            src={heroTitleSvg}
            alt="POST Card FROM Summer"
            className="block h-[74px] w-[227px] max-w-none"
            draggable={false}
          />
        </div>

        {/* Names — Figma x:125 / x:219 y:201 */}
        <div className="absolute left-[125px] top-[201px] z-[4] flex h-[40px] w-[73px] items-center justify-center">
          {names.left.toLowerCase() === "chedy" ? (
            <img src={chedySvg} alt={names.left} className="block h-[12px] w-[47px] max-w-none" draggable={false} />
          ) : (
            <span className="text-[14px] uppercase leading-none tracking-[0.05em]" style={{ color: C.soft }}>
              {names.left}
            </span>
          )}
        </div>
        <div className="absolute left-[219px] top-[201px] z-[4] flex h-[40px] w-[73px] items-center justify-center">
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
          className="absolute left-[102px] top-[427px] z-[4] flex h-[40px] w-[73px] items-center justify-center text-[16px] uppercase leading-5 tracking-[0.05em]"
          style={{ color: C.soft }}
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
        <div className="absolute left-[141px] top-[25px] z-[2] flex h-[46px] w-[148px] items-center justify-center">
          <img src={joinUsTitleSvg} alt="Join us in" className="block h-[22px] w-[78px]" draggable={false} />
        </div>

        {/* JUNE — y:667 → top:66, box 239×42, SVG 89×31 */}
        <div className="absolute left-[96px] top-[66px] z-[2] flex h-[42px] w-[239px] items-center justify-center">
          {month.toLowerCase() === "june" ? (
            <img src={juneTitleSvg} alt="JUNE" className="block h-[31px] w-[89px]" draggable={false} />
          ) : (
            <h2 className="text-[36px] uppercase leading-[40px]" style={{ fontFamily: F.serif, fontWeight: 300 }}>
              {month}
            </h2>
          )}
        </div>

        {/* Invite text — y:715 → top:114, 226×57 */}
        <p className="absolute left-[102px] top-[114px] z-[2] flex h-[57px] w-[226px] items-center justify-center text-center text-[12px] uppercase leading-[18px]">
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
        <div className="absolute left-[141px] top-[237px] z-[2] flex h-[46px] w-[148px] items-center justify-center">
          <img src={theDayTitleSvg} alt="The Day" className="block h-[32px] w-[110px]" draggable={false} />
        </div>

        {/* Countdown — y:913 → top:312, 307×64; cols x:0 / 127 / 253 */}
        <div className="absolute left-[62px] top-[312px] z-[3] h-[64px] w-[307px]">
          {[
            [countdown.days, "Days", 0],
            [countdown.hours, "Hours", 127],
            [countdown.minutes, "Minutes", 253],
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
          className="pointer-events-none absolute left-[162px] top-[266px] z-0 h-[478px] w-[269px] object-cover"
          draggable={false}
        />
      </section>

      {/* Celebrations — Figma y:1246 (overlap bateau : -99px after section y:1345) */}
      <section className="relative z-10 overflow-hidden pb-16" style={{ marginTop: -99 }}>
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

        <div className="relative z-10 mx-auto flex h-[46px] w-[148px] items-center justify-center">
          <img
            src={celebrationsTitleSvg}
            alt="Celebrations"
            className="block h-[26px] w-[132px]"
            draggable={false}
          />
        </div>

        {/* Postcards — Figma x:26 y:1335 / 1631, gap 41 */}
        <div className="relative z-10 mx-auto mt-[43px] flex w-[377px] flex-col gap-[41px]">
          {celebrations.map((item) => (
            <article
              key={item.label}
              className="relative h-[255px] w-[377px] overflow-hidden rounded-[5px] bg-white shadow-[0px_1px_15px_0px_rgba(0,0,0,0.25)]"
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

      {/* Dress code */}
      <section className="px-8 pb-6 pt-4 text-center">
        <p className="text-[26px] leading-[40px]" style={{ fontFamily: F.script }}>
          Dress Code
        </p>
        <h2 className="text-[36px] lowercase leading-[40px]" style={{ fontFamily: F.serif }}>
          {invite.dressCode || defaultInvite.dressCode}
        </h2>
        <p className="mx-auto mt-4 max-w-[226px] text-[12px] uppercase leading-[18px]">{fixedText.inviteText}</p>
        <div className="relative mx-auto mt-4 h-[278px] w-[270px] overflow-hidden">
          <img
            src={family}
            alt=""
            className="absolute left-[12.61%] top-[-30.95%] h-[130.81%] w-[75.14%] max-w-none object-cover"
            draggable={false}
          />
        </div>
      </section>

      {/* Arrival RSVP intro (cream) */}
      <section className="px-8 pb-8 pt-6 text-center">
        <p className="text-[26px] leading-[40px]" style={{ fontFamily: F.script }}>
          Arrival
        </p>
        <h2 className="text-[36px] uppercase leading-[40px] tracking-[0.04em]" style={{ fontFamily: F.serif }}>
          RSVP
        </h2>
        <p className="mx-auto mt-4 max-w-[226px] text-[12px] uppercase leading-[18px]">{fixedText.rsvpDeadline}</p>
      </section>

      {/* RSVP form on water bg */}
      <section className="relative min-h-[640px] px-6 pb-14 pt-10">
        <img
          src={rsvpBg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
          draggable={false}
        />
        <div className="relative mx-auto w-full max-w-[382px] pt-6">
          <img
            src={tape}
            alt=""
            className="absolute left-1/2 top-[-6px] z-20 h-[37px] w-[124px] -translate-x-1/2 object-cover"
            draggable={false}
          />
          <div
            className="relative overflow-hidden"
            style={{
              WebkitMaskImage: `url(${stampFrame})`,
              maskImage: `url(${stampFrame})`,
              WebkitMaskSize: "100% 100%",
              maskSize: "100% 100%",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
            }}
          >
            <form onSubmit={handleRsvpSubmit} className="relative bg-white px-7 pb-10 pt-14 text-left">
              <p className="text-[12px] uppercase leading-[18px]">Will you attend</p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[12px] uppercase leading-[18px]">
                <label className="flex items-center gap-2">
                  <input type="radio" checked={attending} onChange={() => setAttending(true)} />
                  Yes, I will be there
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" checked={!attending} onChange={() => setAttending(false)} />
                  Sorry, I can&apos;t make it
                </label>
              </div>

              {[
                ["Name", fullName, setFullName, "text", true],
                ["Email", email, setEmail, "email", false],
                ["Phone Number", phone, setPhone, "tel", false],
                ["Number of Guests", guestCount, setGuestCount, "number", false],
              ].map(([label, value, setter, type, required]) => (
                <label key={label} className="mt-7 block">
                  <span className="text-[12px] uppercase leading-[18px]">{label}</span>
                  <input
                    type={type}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    required={required}
                    className="mt-1 w-full border-0 border-b border-black bg-transparent py-2 text-[13px] outline-none"
                  />
                </label>
              ))}

              {rsvpError ? <p className="mt-4 text-center text-sm text-red-600">{rsvpError}</p> : null}
              {rsvpStatus ? <p className="mt-4 text-center text-sm text-emerald-700">{rsvpStatus}</p> : null}

              <button
                type="submit"
                disabled={submitting}
                className="mt-8 w-full rounded-[7px] py-3 text-[12px] uppercase tracking-[0.04em] text-white disabled:opacity-60"
                style={{ background: C.button }}
              >
                {submitting ? "Sending…" : "Send Confirmation"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative flex flex-col items-center overflow-hidden pb-16 pt-10">
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 top-8"
          style={{
            backgroundImage: `repeating-linear-gradient(180deg, ${C.stripe} 0 14px, transparent 14px 30px)`,
          }}
          aria-hidden
        />
        <div className="relative z-10 flex flex-col items-center">
          <img src={lifebuoy} alt="" className="h-[200px] w-[111px] object-cover" draggable={false} />
          <div className="absolute left-1/2 top-[88px] flex -translate-x-1/2 items-baseline gap-1" style={{ color: C.brand }}>
            <p className="text-[36px] lowercase leading-[40px]" style={{ fontFamily: F.serif }}>
              club
            </p>
            <p className="text-[48px] leading-[40px]" style={{ fontFamily: F.script }}>
              Capri
            </p>
          </div>
        </div>
      </footer>
    </main>
    </div>
    </>
  );
}

export default ClubCapriInvitePage;
