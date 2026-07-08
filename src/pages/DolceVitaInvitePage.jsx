import React from "react";
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
import accueilTimeline from "../assets/digital/dolce-vita/accueil-des-invites.png";
import arriveeTimeline from "../assets/digital/dolce-vita/arrivee-des-maries.png";
import contratTimeline from "../assets/digital/dolce-vita/contrat-de-mariage.png";
import soireeTimeline from "../assets/digital/dolce-vita/soiree-dansante.png";
import finTimeline from "../assets/digital/dolce-vita/la-fin.png";
import timelineArrow1 from "../assets/digital/dolce-vita/arrow1.png";
import timelineArrow2 from "../assets/digital/dolce-vita/arrow2.png";
import timelineArrow3 from "../assets/digital/dolce-vita/arrow3.png";
import timelineArrow4 from "../assets/digital/dolce-vita/arrow4.png";
import locationLineLeft from "../assets/digital/dolce-vita/figma-vector-38.svg";
import locationLineLowerLeft from "../assets/digital/dolce-vita/figma-vector-02.svg";
import locationLineRight from "../assets/digital/dolce-vita/figma-vector-37.svg";
import locationLineLowerRight from "../assets/digital/dolce-vita/figma-vector-39.svg";
import topArrow from "../assets/digital/dolce-vita/figma-vector-01.svg";
import menuPlate from "../assets/digital/dolce-vita/export-update/figma-image-49.png";
import menuLemons from "../assets/digital/dolce-vita/export-update/figma-image-50.png";
import menuPortrait from "../assets/digital/dolce-vita/export-update/figma-image-51.png";
import templateConfig from "../data/digital/templates/dolce-vita.json";
import { boxStyle, textStyle, toCssSize } from "../utils/digitalTemplateDesign";

const defaultInvite = templateConfig.sample;
const design = templateConfig.design;
const fixedText = templateConfig.fixedText;
const fixedTimelineSteps = templateConfig.fixedTimelineSteps || [];
const fonts = design.fonts;
const colors = design.colors;
const timelineImages = {
  accueil: accueilTimeline,
  arrivee: arriveeTimeline,
  contrat: contratTimeline,
  soiree: soireeTimeline,
  fin: finTimeline,
};
const timelineArrows = [timelineArrow1, timelineArrow2, timelineArrow3, timelineArrow4];
const menuItems = [
  {
    course: "Starter",
    title: "Insalata Caprese",
    description:
      "Layers of creamy buffalo mozzarella, ripe slices of tomato, and fragrant basil leaves are elegantly arranged on a plate.",
  },
  {
    course: "Main Course",
    title: "Spaghetti alla Carbonara",
    description: "Al dente spaghetti, lovingly coated in a velvety sauce, awaits your palate.",
  },
  {
    course: "Dessert",
    title: "Tiramisu",
    description: "Savor the finale of your Italian journey with the epitome of dolce perfection - Tiramisu.",
  },
];
const getTimelineStep = (item, index) => {
  const stepKey = item.step || item.image || fixedTimelineSteps[index]?.image;
  return fixedTimelineSteps.find((step) => step.image === stepKey) || fixedTimelineSteps[index] || {};
};

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

function DolceVitaInvitePage({ invite = defaultInvite }) {
  const countdown = getCountdown(invite.eventDate);
  const timelineEntries = (invite.timeline || [])
    .map((item, index) => {
      const timelineStep = getTimelineStep(item, index);

      return {
        ...item,
        title: timelineStep.title || item.title || "",
        image: timelineStep.image || item.image || "",
        imageWidth: timelineStep.imageWidth || item.imageWidth,
      };
    })
    .filter((item) => item.time || item.title);
  const timelineGap = design.sections.timeline.itemGap || 110;
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
    120,
    ...timelineEntries.map((item, index) => {
      const itemLayout = getTimelineItemLayout(index);
      const imageLayout = design.timelineImages?.[index] || {
        top: Number(itemLayout.top || 0),
        width: 64,
      };
      const arrowLayout = design.timelineArrows?.[index] || {
        top: Number(itemLayout.top || 0) + 56,
        width: 48,
      };

      return Math.max(
        Number(itemLayout.top || 0) + 112,
        Number(imageLayout.top || 0) + Number(item.imageWidth || imageLayout.width || 64),
        index < timelineEntries.length - 1
          ? Number(arrowLayout.top || 0) + Number(arrowLayout.width || 48)
          : 0
      );
    })
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
          className="relative text-center"
          style={{
            minHeight: toCssSize(design.hero.minHeight),
            paddingLeft: toCssSize(design.hero.paddingX),
            paddingRight: toCssSize(design.hero.paddingX),
            paddingTop: toCssSize(design.hero.paddingTop),
          }}
        >
          <img src={columns} alt="" className="absolute" style={boxStyle(design.hero.assets.columns)} />
          <img src={flourishLeft} alt="" className="absolute" style={boxStyle(design.hero.assets.flourishLeft)} />
          <img src={flourishRight} alt="" className="absolute" style={boxStyle(design.hero.assets.flourishRight)} />
          <img src={divider} alt="" className="absolute" style={boxStyle(design.hero.assets.divider)} />

          <p className="relative z-10" style={textStyle(design.hero.intro)}>
            {fixedText.introLabel}
          </p>
          <h1
            className="relative z-10"
            style={{
              ...textStyle(design.hero.title),
              marginTop: toCssSize(design.hero.title.marginTop),
            }}
          >
            {invite.title}
          </h1>
          <p
            className="relative z-10"
            style={{
              ...textStyle(design.hero.coupleNames),
              marginTop: toCssSize(design.hero.coupleNames.marginTop),
            }}
          >
            {invite.coupleNames}
          </p>
          <img
            src={topArrow}
            alt=""
            className="relative z-10 mx-auto"
            style={{
              width: toCssSize(design.hero.arrow.width),
              height: toCssSize(design.hero.arrow.height),
              marginTop: toCssSize(design.hero.arrow.marginTop),
            }}
          />
        </section>

        <section
          className="relative px-10 text-center"
          style={{ paddingBottom: toCssSize(design.sections.countdown.paddingBottom) }}
        >
          <img src={sun} alt="" className="mx-auto" style={{ width: toCssSize(design.sections.countdown.sunWidth) }} />
          <h2
            style={{
              ...textStyle(design.sections.heading),
              marginTop: toCssSize(design.sections.countdown.headingMarginTop),
            }}
          >
            Countdown
          </h2>
          <p
            className="mx-auto"
            style={{
              ...textStyle(design.sections.smallText),
              marginTop: toCssSize(design.sections.countdown.textMarginTop),
              maxWidth: toCssSize(design.sections.countdown.textMaxWidth),
            }}
          >
            {fixedText.introText}
          </p>

          {countdown.length ? (
            <div className="grid grid-cols-3 gap-4" style={{ marginTop: toCssSize(design.sections.countdown.gridMarginTop) }}>
              {countdown.map(([value, label]) => (
                <div key={label}>
                  <div style={textStyle(design.sections.countdownValue)}>{value}</div>
                  <div className="mt-2" style={textStyle(design.sections.countdownLabel)}>{label}</div>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        <section className="relative px-10 text-center" style={{ paddingBottom: toCssSize(design.sections.location.paddingBottom) }}>
          <h2 style={textStyle(design.sections.heading)}>Location</h2>
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
          <h2 style={textStyle(design.sections.heading)}>Timeline</h2>
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
              const imageLayout = design.timelineImages?.[index] || {
                top: Number(itemLayout.top || 0),
                left: "50%",
                width: 64,
                transform: "translateX(-50%)",
              };
              const arrowLayout = design.timelineArrows?.[index] || {
                top: Number(itemLayout.top || 0) + 56,
                left: "50%",
                width: 48,
                transform: "translateX(-50%)",
              };
              const stepImage = timelineImages[item.image];
              const arrowImage = timelineArrows[index % timelineArrows.length];

              return (
                <React.Fragment key={`${item.time}-${item.title}-${index}`}>
                  {stepImage ? (
                    <img
                      src={stepImage}
                      alt=""
                      className="absolute"
                      style={{
                        ...boxStyle({
                          ...imageLayout,
                          width: item.imageWidth || imageLayout.width,
                        }),
                        pointerEvents: "none",
                      }}
                    />
                  ) : null}
                  {index < timelineEntries.length - 1 && arrowImage ? (
                    <img
                      src={arrowImage}
                      alt=""
                      className="absolute"
                      style={{ ...boxStyle(arrowLayout), pointerEvents: "none" }}
                    />
                  ) : null}
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

        <section className="relative px-5 text-center" style={{ paddingBottom: 86 }}>
          <h2 style={textStyle(design.sections.heading)}>Menu</h2>
          <p className="mt-4" style={{ ...textStyle(design.sections.smallText), fontSize: 10 }}>
            Culinary Travel
          </p>
          <div className="relative mx-auto mt-10 min-h-[520px] max-w-[392px]">
            <img src={menuPortrait} alt="" className="absolute left-[-20px] top-[-24px] w-[181px]" />
            <img src={menuPlate} alt="" className="absolute left-1/2 top-0 w-[377px] -translate-x-1/2" />
            <img src={menuLemons} alt="" className="absolute right-[-20px] top-[352px] w-[149px]" />
            <div className="relative z-10 mx-auto pt-14">
              {menuItems.map((item) => (
                <div key={item.course} className="mx-auto mb-10 max-w-[392px] px-1">
                  <p style={{ ...textStyle(design.sections.heading), fontSize: 24 }}>{item.course}</p>
                  <p className="mt-4" style={{ ...textStyle(design.sections.locationName), fontSize: 12 }}>
                    {item.title}
                  </p>
                  <p className="mx-auto mt-3 max-w-[392px]" style={{ ...textStyle(design.sections.smallText), lineHeight: 1.45 }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {invite.rsvpEnabled ? (
          <section className="px-7 text-center" style={{ paddingBottom: 64 }}>
            <h2 style={textStyle(design.sections.heading)}>RSVP</h2>
            <form
              className="mt-16 space-y-5 text-left"
              onSubmit={(event) => event.preventDefault()}
              style={{ color: colors.primaryText }}
            >
              <fieldset>
                <legend className="mb-4 text-[14px]" style={textStyle(design.sections.locationName)}>
                  Will you attend
                </legend>
                <div className="grid grid-cols-2 gap-5 text-[12px]" style={textStyle(design.sections.smallText)}>
                  <label className="flex items-center gap-3">
                    <input type="radio" name="dolce-rsvp-attending" defaultChecked />
                    Yes, I will be there
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="radio" name="dolce-rsvp-attending" />
                    Sorry, I can't make it
                  </label>
                </div>
              </fieldset>
              {[
                ["Full Name", "text", "Full Name"],
                ["Email", "email", "abc.xyz@contact.com"],
                ["Phone Number", "tel", "+216000111"],
                ["Number of guests", "number", "3"],
              ].map(([label, type, placeholder]) => (
                <label key={label} className="block">
                  <span className="mb-3 block" style={{ ...textStyle(design.sections.locationName), fontSize: 14 }}>
                    {label}
                  </span>
                  <input
                    type={type}
                    min={type === "number" ? "1" : undefined}
                    placeholder={placeholder}
                    className="w-full rounded-[7px] border bg-transparent px-4 py-3 text-sm outline-none"
                    style={{ borderColor: colors.primaryText }}
                  />
                </label>
              ))}
              <button
                type="submit"
                className="mt-5 w-full rounded-[7px] px-5 py-3 text-center text-sm text-white"
                style={{ backgroundColor: colors.primaryText }}
              >
                Send Confirmation
              </button>
            </form>
          </section>
        ) : null}

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

export default DolceVitaInvitePage;
