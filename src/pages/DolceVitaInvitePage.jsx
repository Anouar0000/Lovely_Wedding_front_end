import React from "react";
import { FiCalendar, FiClock, FiMapPin, FiSend } from "react-icons/fi";
import columns from "../assets/digital/dolce-vita/figma-layer-01.png";
import flourishLeft from "../assets/digital/dolce-vita/figma-layer-02.png";
import flourishRight from "../assets/digital/dolce-vita/figma-layer-03.png";
import divider from "../assets/digital/dolce-vita/figma-layer-04.png";
import sun from "../assets/digital/dolce-vita/figma-layer-05.png";
import venueSoft from "../assets/digital/dolce-vita/figma-layer-06.png";
import venue from "../assets/digital/dolce-vita/figma-layer-07.png";
import portrait from "../assets/digital/dolce-vita/figma-layer-08.png";
import lemons from "../assets/digital/dolce-vita/figma-layer-09.png";
import noteCard from "../assets/digital/dolce-vita/figma-layer-10.png";
import timelineDoodle from "../assets/digital/dolce-vita/timeline-doodle.png";
import locationLineLeft from "../assets/digital/dolce-vita/figma-vector-38.svg";
import locationLineLowerLeft from "../assets/digital/dolce-vita/figma-vector-02.svg";
import locationLineRight from "../assets/digital/dolce-vita/figma-vector-37.svg";
import locationLineLowerRight from "../assets/digital/dolce-vita/figma-vector-39.svg";
import topArrow from "../assets/digital/dolce-vita/figma-vector-01.svg";

const gold = "#e8cc33";

const defaultInvite = {
  title: "La Dolce Vita",
  coupleNames: "Bilel & Dorra",
  introLabel: "We are getting married",
  introText: "We would like to invite you to celebrate with us the most special day of our lives",
  eventDate: "2026-08-12",
  dateLabel: "12.08.2026",
  venueName: "Dar Bouraoui Carthage",
  city: "Carthage",
  locationLabel: "MALAGA",
  time: "19H00",
  mapUrl: "https://maps.google.com",
  rsvpEnabled: true,
  closingText: "We hope you can make it",
  timeline: [
    { time: "20h", title: "Accueil", subtitle: "des invites" },
    { time: "20h30", title: "Arrivee", subtitle: "des maries" },
    { time: "21h", title: "Contrat", subtitle: "de mariage" },
  ],
};

const getCountdown = (dateString) => {
  const target = new Date(`${dateString}T00:00:00`);
  const diff = Math.max(target.getTime() - Date.now(), 0);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  return [
    [String(days), "Days"],
    [String(hours), "Hours"],
    [String(minutes), "Minutes"],
  ];
};

function DolceVitaInvitePage({ invite = defaultInvite }) {
  const countdown = getCountdown(invite.eventDate);

  return (
    <main className="min-h-screen bg-[#ebe7dd] py-6 font-urbanist text-[#130554]">
      <div className="mx-auto w-full max-w-[430px] overflow-hidden bg-[#f9faf3] shadow-2xl">
        <section className="relative min-h-[382px] px-10 pt-24 text-center">
          <img src={columns} alt="" className="absolute inset-x-0 top-0 w-full" />
          <img src={flourishLeft} alt="" className="absolute left-6 top-0 w-40" />
          <img src={flourishRight} alt="" className="absolute right-6 top-0 w-40" />
          <img src={divider} alt="" className="absolute left-1/2 top-0 w-32 -translate-x-1/2" />

          <p className="relative z-10 text-[8px] uppercase tracking-[0.1em]">{invite.introLabel}</p>
          <h1 className="relative z-10 mt-3 font-pinyon text-[46px] leading-none">{invite.title}</h1>
          <p className="relative z-10 mt-4 font-playfair text-sm tracking-[0.1em]">{invite.coupleNames}</p>
          <img src={topArrow} alt="" className="relative z-10 mx-auto mt-16 h-[18px] w-auto" />
        </section>

        <section className="relative px-10 pb-12 text-center">
          <img src={sun} alt="" className="mx-auto w-28" />
          <h2 className="mt-4 font-pinyon text-[42px] leading-none">Countdown</h2>
          <p className="mx-auto mt-5 max-w-[348px] text-[8px] uppercase leading-3 tracking-[0.1em]">
            {invite.introText}
          </p>

          <div className="mt-7 grid grid-cols-3 gap-4 font-playfair">
            {countdown.map(([value, label]) => (
              <div key={label}>
                <div className="text-sm tracking-[0.1em]">{value}</div>
                <div className="mt-2 text-[8px] tracking-[0.1em]">{label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="relative px-10 pb-16 text-center">
          <h2 className="font-pinyon text-[42px] leading-none">Location</h2>
          <p className="mt-5 text-[8px] uppercase leading-3 tracking-[0.1em]">
            The ceremony will take place at
          </p>

          <div className="relative mx-auto mt-5 h-[220px] w-full max-w-[348px]">
            <img src={locationLineLeft} alt="" className="absolute -left-10 top-1 w-[146px]" />
            <img src={locationLineRight} alt="" className="absolute -right-10 -top-3 w-[143px]" />
            <img src={locationLineLowerLeft} alt="" className="absolute -left-10 top-[100px] w-[149px]" />
            <img src={locationLineLowerRight} alt="" className="absolute -right-10 top-[90px] w-[152px]" />
            <img src={venueSoft} alt="" className="absolute left-1/2 top-0 w-[143px] -translate-x-1/2 blur-[4px]" />
            <img src={venue} alt="Wedding venue" className="absolute left-1/2 top-2 w-[126px] -translate-x-1/2" />
            <img src={portrait} alt="" className="absolute left-0 top-16 w-24" />
            <img src={lemons} alt="" className="absolute right-0 top-8 w-24" />
          </div>

          <h3 className="font-playfair text-sm tracking-[0.1em]">{invite.venueName}</h3>
          <p className="mt-2 text-[8px] tracking-[0.1em]">{invite.locationLabel}</p>
          <p className="mt-1 text-[8px] tracking-[0.1em]">{invite.time}</p>
        </section>

        <section className="relative px-8 pb-16 text-center">
          <h2 className="font-pinyon text-[42px] leading-none">Timeline</h2>
          <div className="relative mx-auto mt-8 h-[350px] max-w-[285px]">
            <img src={timelineDoodle} alt="" className="absolute inset-y-0 left-1/2 h-full -translate-x-1/2" />

            {invite.timeline.map((item, index) => {
              const positions = [
                "left-0 top-4 text-left",
                "right-0 top-[118px] text-right",
                "left-0 top-[238px] text-left",
              ];

              return (
                <div key={item.time} className={`absolute w-28 ${positions[index]}`}>
                  <div className="font-playfair text-sm" style={{ color: gold }}>
                    {item.time}
                  </div>
                  <p className="font-pinyon text-2xl leading-6">{item.title}</p>
                  <p className="font-playfair text-xs">{item.subtitle}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="px-10 pb-16 text-center">
          <div className="grid gap-3">
            <a
              href={invite.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 border border-[#130554] px-4 py-3 text-xs uppercase tracking-[0.1em]"
            >
              <FiMapPin /> Voir le lieu
            </a>
            {invite.rsvpEnabled && (
              <button className="flex items-center justify-center gap-2 border border-[#130554] bg-[#130554] px-4 py-3 text-xs uppercase tracking-[0.1em] text-white">
                <FiSend /> Confirmer ma presence
              </button>
            )}
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 text-[10px]">
            <div className="flex flex-col items-center gap-2">
              <FiCalendar />
              {invite.dateLabel}
            </div>
            <div className="flex flex-col items-center gap-2">
              <FiClock />
              {invite.time}
            </div>
            <div className="flex flex-col items-center gap-2">
              <FiMapPin />
              {invite.city}
            </div>
          </div>
        </section>

        <section className="relative px-10 pb-24 pt-4 text-center">
          <img src={noteCard} alt="" className="mx-auto w-full" />
          <div className="absolute inset-x-10 top-[118px]">
            <p className="font-playfair text-sm tracking-[0.1em]">{invite.closingText}</p>
            <p className="mt-2 font-pinyon text-[34px] leading-none">{invite.coupleNames}</p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default DolceVitaInvitePage;
