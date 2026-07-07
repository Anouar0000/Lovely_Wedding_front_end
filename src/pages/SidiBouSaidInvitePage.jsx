import React, { useEffect, useMemo, useRef, useState } from "react";
import openingVideo from "../assets/digital/sidi-bousaid/can_you_create_a_video_,_of_a_tunisian_double_opening_door_door_(_of_sidi_bousaid_)_opening_to_revea_seed458836054.mp4";
import image01 from "../assets/digital/sidi-bousaid/export/figma-image-01.png";
import image02 from "../assets/digital/sidi-bousaid/export/figma-image-02.png";
import image05 from "../assets/digital/sidi-bousaid/export/figma-image-05.png";
import image06 from "../assets/digital/sidi-bousaid/export/figma-image-06.png";
import image07 from "../assets/digital/sidi-bousaid/export/figma-image-07.png";
import image08 from "../assets/digital/sidi-bousaid/export/figma-image-08.png";
import image09 from "../assets/digital/sidi-bousaid/export/figma-image-09.png";
import image10 from "../assets/digital/sidi-bousaid/export/figma-image-10.png";
import image11 from "../assets/digital/sidi-bousaid/export/figma-image-11.png";
import image12 from "../assets/digital/sidi-bousaid/export/figma-image-12.png";
import image13 from "../assets/digital/sidi-bousaid/export/figma-image-13.png";
import image14 from "../assets/digital/sidi-bousaid/export/figma-image-14.png";
import image16 from "../assets/digital/sidi-bousaid/export/figma-image-16.png";
import image17 from "../assets/digital/sidi-bousaid/export/figma-image-17.png";
import image18 from "../assets/digital/sidi-bousaid/export/figma-image-18.png";
import templateConfig from "../data/digital/templates/sidi-bousaid.json";

const doorFrameContext = require.context("../assets/digital/sidi-bousaid/renders-webp", false, /\.webp$/);
const doorFrameSources = doorFrameContext
  .keys()
  .sort()
  .map((key) => doorFrameContext(key));

const defaultInvite = templateConfig.sample;
const blue = "#054cb6";
const pageWidth = 430;
const pageHeight = 1743;
const revealStart = 596;
const revealHeight = pageHeight - revealStart;

const exportImages = [
  { src: image01, left: 53, top: 755, width: 56 },
  { src: image02, left: 299, top: 648, width: 77.8635 },
  { src: image05, left: 0, top: 310, width: 34 },
  { src: image06, left: 398, top: 310, width: 32 },
  { src: image07, left: 4, top: 358, width: 41 },
  { src: image08, left: 385, top: 358, width: 41 },
  { src: image09, left: 0, top: 406, width: 34 },
  { src: image10, left: 398, top: 406, width: 32 },
  { src: image11, left: 4, top: 454, width: 41 },
  { src: image12, left: 385, top: 454, width: 41 },
  { src: image13, left: 0, top: 502, width: 34 },
  { src: image14, left: 398, top: 502, width: 32 },
  { src: image16, left: 61, top: 346, width: 139, dropShadow: true },
  { src: image17, left: 232, top: 346, width: 139, dropShadow: true },
  { src: image18, left: 0, top: 866, width: 430 },
];

const pct = (value, total) => `${(value / total) * 100}%`;

const absoluteBox = ({ left, top, width }, sectionHeight = pageHeight, topOffset = 0) => ({
  position: "absolute",
  left: pct(left, pageWidth),
  top: pct(top - topOffset, sectionHeight),
  width: pct(width, pageWidth),
});

const textBox = ({
  left,
  top,
  width,
  fontSize,
  lineHeight,
  letterSpacing = 0,
  children,
  family = "Taviraj, serif",
  sectionHeight = pageHeight,
  topOffset = 0,
}) => (
  <div
    style={{
      ...absoluteBox({ left, top, width }, sectionHeight, topOffset),
      color: blue,
      fontFamily: family,
      fontSize: `clamp(${fontSize * 0.75}px, ${(fontSize / pageWidth) * 100}vw, ${fontSize}px)`,
      lineHeight: lineHeight ? `${lineHeight / fontSize}` : 1.2,
      letterSpacing,
      textAlign: "center",
      whiteSpace: "pre-wrap",
    }}
  >
    {children}
  </div>
);

const formatDateParts = (dateString) => {
  if (!dateString) {
    return { day: "12", month: "08", year: "2026", display: "12 . 08 . 2026" };
  }

  const [year, month, day] = dateString.split("-");

  return {
    day: day || "12",
    month: month || "08",
    year: year || "2026",
    display: day && month && year ? `${day} . ${month} . ${year}` : "12 . 08 . 2026",
  };
};

const getNames = (coupleNames) => {
  const [firstName = "Sarah", secondName = ""] = (coupleNames || "").split(/\s*&\s*|\s+et\s+/i);

  return {
    firstName: firstName.trim() || "Sarah",
    secondName: secondName.trim(),
  };
};

function SidiBouSaidInvitePage({ invite = defaultInvite }) {
  const [isIntroFading, setIsIntroFading] = useState(false);
  const [isIntroDone, setIsIntroDone] = useState(false);
  const [doorFrame, setDoorFrame] = useState(0);
  const doorTimerRef = useRef(null);
  const dateParts = useMemo(() => formatDateParts(invite.eventDate), [invite.eventDate]);
  const names = useMemo(() => getNames(invite.coupleNames), [invite.coupleNames]);

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
    <main className="min-h-screen bg-[#dcebf0] font-urbanist text-[#054cb6]">
      <div
        className="mx-auto w-full bg-white shadow-2xl"
        style={{ maxWidth: pageWidth }}
      >
        <section
          className="relative w-full overflow-hidden max-[430px]:min-h-[100svh]"
          style={{ aspectRatio: `${pageWidth} / ${revealStart}` }}
        >
          {exportImages
            .filter((image) => image.top < revealStart)
            .map((image) => (
              <img
                key={image.src}
                src={image.src}
                alt=""
                style={{
                  ...absoluteBox(image, revealStart),
                  filter: image.dropShadow ? "drop-shadow(0 10px 18px rgba(0, 0, 0, 0.15))" : undefined,
                }}
              />
            ))}

          {textBox({ left: 121, top: 56, width: 188, fontSize: 10, lineHeight: 14, letterSpacing: "0.1em", sectionHeight: revealStart, children: "Welcome to our" })}
          {textBox({ left: 115, top: 91, width: 199, fontSize: 28, lineHeight: 32, sectionHeight: revealStart, children: names.secondName ? `${names.firstName}\n& ${names.secondName}` : names.firstName })}
          {textBox({ left: 142, top: 198, width: 146, fontSize: 13, lineHeight: 18, letterSpacing: "0.1em", sectionHeight: revealStart, children: dateParts.display })}
          {textBox({ left: 131, top: 280, width: 168, fontSize: 22, sectionHeight: revealStart, children: "Our Story" })}
          {textBox({ left: 107, top: 539, width: 44, fontSize: 12, sectionHeight: revealStart, children: "Us" })}
        </section>

        <div className="relative w-full overflow-hidden" style={{ aspectRatio: `${pageWidth} / ${revealHeight}` }}>
          <div style={{ ...absoluteBox({ left: 0, top: 596, width: 430 }, revealHeight, revealStart), height: pct(270, revealHeight), background: "rgba(5, 76, 182, 0.12)" }} />

          {exportImages
            .filter((image) => image.top >= revealStart)
            .map((image) => (
              <img
                key={image.src}
                src={image.src}
                alt=""
                style={{
                  ...absoluteBox(image, revealHeight, revealStart),
                  filter: image.dropShadow ? "drop-shadow(0 10px 18px rgba(0, 0, 0, 0.15))" : undefined,
                }}
              />
            ))}

          {textBox({ left: 131, top: 622, width: 168, fontSize: 22, sectionHeight: revealHeight, topOffset: revealStart, children: "Reveal" })}
          {textBox({ left: 97, top: 791, width: 44, fontSize: 12, sectionHeight: revealHeight, topOffset: revealStart, children: "Day" })}
          {textBox({ left: 193, top: 791, width: 44, fontSize: 12, sectionHeight: revealHeight, topOffset: revealStart, children: "Month" })}
          {textBox({ left: 289, top: 791, width: 44, fontSize: 12, sectionHeight: revealHeight, topOffset: revealStart, children: "Year" })}
          {textBox({ left: 91, top: 732, width: 64, fontSize: 18, sectionHeight: revealHeight, topOffset: revealStart, children: dateParts.day })}
          {textBox({ left: 181, top: 732, width: 68, fontSize: 18, sectionHeight: revealHeight, topOffset: revealStart, children: dateParts.month })}
          {textBox({ left: 273, top: 732, width: 72, fontSize: 18, sectionHeight: revealHeight, topOffset: revealStart, children: dateParts.year })}
          {doorFrameSources.length ? (
            <button
              type="button"
              onClick={handleDoorClick}
              aria-label="Open reveal doors"
              className="absolute cursor-pointer bg-transparent p-0 focus:outline-none"
              style={{
                left: pct(82, pageWidth),
                top: pct(678 - revealStart, revealHeight),
                width: pct(267, pageWidth),
                height: pct(126, revealHeight),
                zIndex: 2,
              }}
            >
              {[
                { left: 0, width: 77 },
                { left: 95, width: 77 },
                { left: 190, width: 77 },
              ].map((door) => (
                <img
                  key={door.left}
                  src={doorFrameSources[doorFrame]}
                  alt=""
                  className="absolute top-0"
                  style={{
                    left: pct(door.left, 267),
                    width: pct(door.width, 267),
                  }}
                  draggable="false"
                />
              ))}
            </button>
          ) : null}
          {textBox({ left: 131, top: 916, width: 168, fontSize: 22, sectionHeight: revealHeight, topOffset: revealStart, children: "Countdown" })}
        </div>
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
