import React from "react";
import { FiCalendar, FiClock, FiMapPin, FiSend } from "react-icons/fi";
import openingVideo from "../assets/digital/sidi-bousaid/can_you_create_a_video_,_of_a_tunisian_double_opening_door_door_(_of_sidi_bousaid_)_opening_to_revea_seed458836054.mp4";
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
import templateConfig from "../data/digital/templates/sidi-bousaid.json";
import { boxStyle, textStyle, toCssSize } from "../utils/digitalTemplateDesign";

const defaultInvite = templateConfig.sample;
const design = templateConfig.design;
const fixedText = templateConfig.fixedText;
const fixedTimelineSteps = templateConfig.fixedTimelineSteps || [];
const fonts = design.fonts;
const colors = design.colors;

const getCountdown = (dateString) => {
  if (!dateString) {
    return [];
  }

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

const formatDisplayDate = (dateString) => {
  if (!dateString) {
    return "";
  }

  const [year, month, day] = dateString.split("-");

  if (!year || !month || !day) {
    return "";
  }

  return `${day}.${month}.${year}`;
};

function SidiBouSaidInvitePage({ invite = defaultInvite }) {
  const countdown = getCountdown(invite.eventDate);
  const displayDate = formatDisplayDate(invite.eventDate);
  const timelineEntries = (invite.timeline || [])
    .map((item, index) => ({
      ...item,
      title: fixedTimelineSteps[index]?.title || item.title || "",
    }))
    .filter((item) => item.time || item.title);
  const timelineGap = design.sections.timeline.itemGap || 110;
  const timelineStepCount = Math.max(fixedTimelineSteps.length, timelineEntries.length, 1);
  const timelineImageHeight = design.sections.timeline.imageHeight || design.sections.timeline.stageHeight;
  const timelineImageWidth = design.sections.timeline.imageWidth || 112;
  const timelineSegmentHeight = timelineImageHeight / timelineStepCount;
  const getTimelineItemLayout = (index) => {
    const configuredLayout = design.timelineItems[index];

    if (configuredLayout) {
      return configuredLayout;
    }

    const lastConfiguredLayout = design.timelineItems[design.timelineItems.length - 1] || {
      top: 0,
      left: 0,
      width: 112,
      textAlign: "left",
    };
    const extraIndex = index - design.timelineItems.length + 1;
    const isRight = index % 2 === 1;

    return {
      top: Number(lastConfiguredLayout.top || 0) + timelineGap * extraIndex,
      left: isRight ? undefined : 0,
      right: isRight ? 0 : undefined,
      width: lastConfiguredLayout.width || 112,
      textAlign: isRight ? "right" : "left",
      timeTextAlign: isRight ? "right" : "left",
    };
  };
  const timelineStageHeight = Math.max(
    design.sections.timeline.stageHeight,
    timelineEntries.length ? getTimelineItemLayout(timelineEntries.length - 1).top + timelineSegmentHeight + 36 : 0
  );

  return (
    <main
      className="min-h-screen py-6"
      style={{ backgroundColor: colors.pageBackground, color: colors.primaryText, fontFamily: fonts.body }}
    >
      <div
        className="mx-auto w-full overflow-hidden shadow-2xl"
        style={{ maxWidth: toCssSize(design.card.maxWidth), backgroundColor: colors.cardBackground }}
      >
        <section
          className="relative overflow-hidden text-center"
          style={{ minHeight: toCssSize(design.hero.minHeight), color: colors.heroText }}
        >
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={openingVideo}
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0" style={{ background: colors.heroOverlay }} />

          <div
            className="relative z-10 flex flex-col items-center justify-between"
            style={{
              minHeight: toCssSize(design.hero.minHeight),
              paddingLeft: toCssSize(design.hero.paddingX),
              paddingRight: toCssSize(design.hero.paddingX),
              paddingTop: toCssSize(design.hero.paddingY),
              paddingBottom: toCssSize(design.hero.paddingY),
            }}
          >
            <p style={textStyle(design.hero.intro)}>{fixedText.introLabel}</p>

            <div>
              <h1 className="drop-shadow-md" style={textStyle(design.hero.title)}>
                {invite.title}
              </h1>
              <p
                className="drop-shadow"
                style={{
                  ...textStyle(design.hero.coupleNames),
                  marginTop: toCssSize(design.hero.coupleNames.marginTop),
                }}
              >
                {invite.coupleNames}
              </p>
              <p
                className="mx-auto"
                style={{
                  ...textStyle(design.hero.introText),
                  marginTop: toCssSize(design.hero.introText.marginTop),
                  maxWidth: toCssSize(design.hero.introText.maxWidth),
                }}
              >
                {fixedText.introText}
              </p>
            </div>

            <img
              src={topArrow}
              alt=""
              className="brightness-0 invert"
              style={{ width: toCssSize(design.hero.arrow.width), height: toCssSize(design.hero.arrow.height) }}
            />
          </div>
        </section>

        <section
          className="relative px-10 text-center"
          style={{
            paddingTop: toCssSize(design.sections.countdown.paddingTop),
            paddingBottom: toCssSize(design.sections.countdown.paddingBottom),
          }}
        >
          <img src={sun} alt="" className="mx-auto" style={{ width: toCssSize(design.sections.countdown.sunWidth) }} />
          <h2
            style={{
              ...textStyle(design.sections.heading),
              color: colors.heading,
              marginTop: toCssSize(design.sections.countdown.headingMarginTop),
            }}
          >
            Countdown
          </h2>
          {countdown.length ? (
            <div className="grid grid-cols-3 gap-4" style={{ marginTop: toCssSize(design.sections.countdown.gridMarginTop) }}>
              {countdown.map(([value, label]) => (
                <div key={label} className="border-y py-4" style={{ borderColor: `${colors.heading}33` }}>
                  <div style={textStyle(design.sections.countdownValue)}>{value}</div>
                  <div className="mt-2" style={textStyle(design.sections.countdownLabel)}>{label}</div>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        <section className="relative px-10 text-center" style={{ paddingBottom: toCssSize(design.sections.location.paddingBottom) }}>
          <h2 style={{ ...textStyle(design.sections.heading), color: colors.heading }}>
            Location
          </h2>
          <p style={{ ...textStyle(design.sections.smallText), marginTop: toCssSize(design.sections.location.copyMarginTop) }}>
            {fixedText.locationIntro}
          </p>

          <div
            className="relative mx-auto w-full"
            style={{
              marginTop: toCssSize(design.sections.location.stageMarginTop),
              height: toCssSize(design.sections.location.stageHeight),
              maxWidth: toCssSize(design.sections.location.stageMaxWidth),
            }}
          >
            <img src={locationLineLeft} alt="" className="absolute" style={boxStyle(design.locationAssets.lineLeft)} />
            <img src={locationLineRight} alt="" className="absolute" style={boxStyle(design.locationAssets.lineRight)} />
            <img src={locationLineLowerLeft} alt="" className="absolute" style={boxStyle(design.locationAssets.lineLowerLeft)} />
            <img src={locationLineLowerRight} alt="" className="absolute" style={boxStyle(design.locationAssets.lineLowerRight)} />
            <img src={venueSoft} alt="" className="absolute" style={boxStyle(design.locationAssets.venueSoft)} />
            <img src={venue} alt="Wedding venue" className="absolute" style={boxStyle(design.locationAssets.venue)} />
            <img src={portrait} alt="" className="absolute" style={boxStyle(design.locationAssets.portrait)} />
            <img src={lemons} alt="" className="absolute" style={boxStyle(design.locationAssets.lemons)} />
          </div>

          <h3
            style={{
              ...textStyle(design.sections.locationName),
              marginTop: toCssSize(design.sections.location.venueNameMarginTop),
            }}
          >
            {invite.venueName}
          </h3>
          <p className="mt-2 text-[8px] tracking-[0.1em]">{invite.locationLabel}</p>
          <p className="mt-1 text-[8px] tracking-[0.1em]">{invite.time}</p>
        </section>

        <section className="relative px-8 text-center" style={{ paddingBottom: toCssSize(design.sections.timeline.paddingBottom) }}>
          <h2 style={{ ...textStyle(design.sections.heading), color: colors.heading }}>
            Timeline
          </h2>
          <div
            className="relative mx-auto"
            style={{
              marginTop: toCssSize(design.sections.timeline.stageMarginTop),
              height: toCssSize(timelineStageHeight),
              maxWidth: toCssSize(design.sections.timeline.stageMaxWidth),
            }}
          >
            {timelineEntries.map((item, index) => {
              const itemLayout = getTimelineItemLayout(index);

              return (
                <React.Fragment key={`${item.time}-${item.title}-${index}`}>
                  <div
                    className="absolute left-1/2 overflow-hidden"
                    style={{
                      top: toCssSize(Number(itemLayout.top || 0) - 18),
                      width: toCssSize(timelineImageWidth),
                      height: toCssSize(timelineSegmentHeight + 24),
                      transform: "translateX(-50%)",
                      pointerEvents: "none",
                    }}
                  >
                    <img
                      src={timelineDoodle}
                      alt=""
                      className="absolute left-0"
                      style={{
                        top: toCssSize(-index * timelineSegmentHeight),
                        width: toCssSize(timelineImageWidth),
                        height: toCssSize(timelineImageHeight),
                      }}
                    />
                  </div>
                  <div className="absolute" style={boxStyle(itemLayout)}>
                    <p style={textStyle(design.sections.timelineTitle)}>{item.title}</p>
                    <div
                      style={{
                        ...textStyle(design.sections.timelineTime),
                        color: colors.accent,
                        textAlign: itemLayout.timeTextAlign || itemLayout.textAlign,
                      }}
                    >
                      {item.time}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </section>

        <section className="px-10 text-center" style={{ paddingBottom: toCssSize(design.sections.actions.paddingBottom) }}>
          <div className="grid gap-3">
            <a
              href={invite.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 border px-4 py-3 text-xs uppercase tracking-[0.1em]"
              style={{ borderColor: colors.heading }}
            >
              <FiMapPin /> Voir le lieu
            </a>
            {invite.rsvpEnabled && (
              <button
                className="flex items-center justify-center gap-2 border px-4 py-3 text-xs uppercase tracking-[0.1em] text-white"
                style={{ borderColor: colors.heading, backgroundColor: colors.heading }}
              >
                <FiSend /> Confirmer ma presence
              </button>
            )}
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 text-[10px]">
            <div className="flex flex-col items-center gap-2">
              <FiCalendar />
              {displayDate}
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

        <section
          className="relative px-10 text-center"
          style={{
            paddingTop: toCssSize(design.sections.closing.paddingTop),
            paddingBottom: toCssSize(design.sections.closing.paddingBottom),
          }}
        >
          <img src={noteCard} alt="" className="mx-auto w-full" />
          <div className="absolute inset-x-10" style={{ top: toCssSize(design.sections.closing.textTop) }}>
            <p style={textStyle(design.sections.closingText)}>{fixedText.closingText}</p>
            <p className="mt-2" style={textStyle(design.sections.closingNames)}>{invite.coupleNames}</p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default SidiBouSaidInvitePage;
