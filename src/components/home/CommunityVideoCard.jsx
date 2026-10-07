import React, { useEffect, useRef, useState } from "react";
import { FiPlay, FiVolume2, FiVolumeX } from "react-icons/fi";

/**
 * Carte vidéo Communauté — autoplay muet si active ; son au clic utilisateur.
 */
function CommunityVideoCard({
  slide,
  active = false,
  onActivate,
  className = "",
  style,
}) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const userStartedRef = useRef(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return undefined;

    const showFirstFrame = () => {
      try {
        if (el.readyState >= 1 && el.currentTime < 0.05) {
          el.currentTime = 0.05;
        }
      } catch {
        /* ignore seek errors */
      }
    };

    el.addEventListener("loadeddata", showFirstFrame);

    if (active) {
      // Autoplay requires mute unless the user already started this card.
      if (!userStartedRef.current) {
        el.muted = true;
        el.setAttribute("muted", "");
        setMuted(true);
      }
      el.setAttribute("playsinline", "");
      const playPromise = el.play();
      if (playPromise?.then) {
        playPromise
          .then(() => setPlaying(true))
          .catch(() => setPlaying(false));
      }
    } else {
      userStartedRef.current = false;
      el.pause();
      el.muted = true;
      el.setAttribute("muted", "");
      setMuted(true);
      try {
        el.currentTime = 0.05;
      } catch {
        /* ignore */
      }
      setPlaying(false);
    }

    return () => {
      el.removeEventListener("loadeddata", showFirstFrame);
      el.pause();
    };
  }, [active, slide.video]);

  const playWithSound = (el) => {
    userStartedRef.current = true;
    el.muted = false;
    el.removeAttribute("muted");
    setMuted(false);
    return el.play();
  };

  const toggle = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const el = videoRef.current;
    if (!el) return;

    if (el.paused) {
      onActivate?.(slide.id);
      playWithSound(el)
        .then(() => setPlaying(true))
        .catch(() => {
          // Fallback: some browsers still need a muted start first.
          el.muted = true;
          el.setAttribute("muted", "");
          setMuted(true);
          el.play()
            .then(() => {
              setPlaying(true);
              el.muted = false;
              el.removeAttribute("muted");
              setMuted(false);
            })
            .catch(() => setPlaying(false));
        });
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  const toggleMute = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const el = videoRef.current;
    if (!el) return;

    const next = !el.muted;
    el.muted = next;
    if (next) {
      el.setAttribute("muted", "");
    } else {
      el.removeAttribute("muted");
      userStartedRef.current = true;
    }
    setMuted(next);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle(e);
        }
      }}
      aria-label={playing ? `Pause ${slide.handle}` : `Lire ${slide.handle}`}
      className={`relative overflow-hidden rounded-[5px] bg-[#1a1612] ${className}`}
      style={style}
    >
      <video
        ref={videoRef}
        src={slide.video}
        className="absolute inset-0 h-full w-full object-cover"
        playsInline
        muted
        loop
        preload={active ? "auto" : "metadata"}
        webkit-playsinline="true"
      />
      {!playing ? (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-lw-text shadow">
            <FiPlay className="ml-0.5 text-lg" />
          </span>
        </span>
      ) : null}
      {playing ? (
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Activer le son" : "Couper le son"}
          className="absolute bottom-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm"
        >
          {muted ? <FiVolumeX className="text-base" /> : <FiVolume2 className="text-base" />}
        </button>
      ) : null}
    </div>
  );
}

export default CommunityVideoCard;
