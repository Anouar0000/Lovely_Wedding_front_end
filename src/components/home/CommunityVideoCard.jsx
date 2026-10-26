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
  const [failed, setFailed] = useState(false);
  const userStartedRef = useRef(false);
  const retryRef = useRef(0);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return undefined;

    let cancelled = false;
    setFailed(false);

    const showFirstFrame = () => {
      try {
        if (el.readyState >= 1 && el.currentTime < 0.05) {
          el.currentTime = 0.05;
        }
      } catch {
        /* ignore seek errors */
      }
    };

    const tryPlay = () => {
      if (cancelled || !active) return;
      if (!userStartedRef.current) {
        el.muted = true;
        el.setAttribute("muted", "");
        setMuted(true);
      }
      el.setAttribute("playsinline", "");
      const playPromise = el.play();
      if (playPromise?.then) {
        playPromise
          .then(() => {
            if (!cancelled) setPlaying(true);
          })
          .catch(() => {
            if (cancelled) return;
            // iOS / autoplay : forcer muet puis réessayer une fois chargé
            el.muted = true;
            el.setAttribute("muted", "");
            setMuted(true);
            el.play()
              .then(() => {
                if (!cancelled) setPlaying(true);
              })
              .catch(() => {
                if (!cancelled) setPlaying(false);
              });
          });
      }
    };

    const onCanPlay = () => {
      showFirstFrame();
      if (active) tryPlay();
    };

    const onError = () => {
      if (cancelled) return;
      if (retryRef.current < 2) {
        retryRef.current += 1;
        el.load();
        return;
      }
      setFailed(true);
      setPlaying(false);
    };

    el.addEventListener("loadeddata", showFirstFrame);
    el.addEventListener("canplay", onCanPlay);
    el.addEventListener("error", onError);

    if (active) {
      retryRef.current = 0;
      if (el.readyState < 2) {
        el.load();
      } else {
        tryPlay();
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
      cancelled = true;
      el.removeEventListener("loadeddata", showFirstFrame);
      el.removeEventListener("canplay", onCanPlay);
      el.removeEventListener("error", onError);
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

    if (failed) {
      setFailed(false);
      retryRef.current = 0;
      el.load();
    }

    if (el.paused) {
      onActivate?.(slide.id);
      const start = () => {
        playWithSound(el)
          .then(() => setPlaying(true))
          .catch(() => {
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
      };
      if (el.readyState >= 2) start();
      else {
        const once = () => {
          el.removeEventListener("canplay", once);
          start();
        };
        el.addEventListener("canplay", once);
        el.load();
      }
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
      aria-label={
        failed
          ? `Réessayer ${slide.handle}`
          : playing
            ? `Pause ${slide.handle}`
            : `Lire ${slide.handle}`
      }
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
        preload="auto"
        controls={false}
        webkit-playsinline="true"
        x-webkit-airplay="allow"
      />
      {failed ? (
        <span className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 px-4 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-lw-text shadow">
            <FiPlay className="ml-0.5 text-lg" />
          </span>
          <span className="font-glacial text-[12px] text-white">
            Appuyer pour réessayer
          </span>
        </span>
      ) : !playing ? (
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
