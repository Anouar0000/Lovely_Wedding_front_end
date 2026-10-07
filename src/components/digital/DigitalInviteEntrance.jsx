import React, { useEffect, useRef } from "react";

/**
 * Full-screen invitation entrance (Figma splash above the invite frame).
 * Image: tap to open. Video: tap or auto-open after autoOpenAfterMs / video end.
 */
function DigitalInviteEntrance({
  image,
  video,
  alt = "Open invitation",
  openLabel = "Ouvrir l'invitation",
  background = "#000",
  autoOpenAfterMs,
  onOpen,
}) {
  const videoRef = useRef(null);
  const openedRef = useRef(false);

  const handleOpen = () => {
    if (openedRef.current) return;
    openedRef.current = true;
    onOpen?.();
  };

  useEffect(() => {
    if (!video) return undefined;
    const el = videoRef.current;
    if (!el) return undefined;

    const onEnded = () => handleOpen();
    el.addEventListener("ended", onEnded);

    const playPromise = el.play?.();
    if (playPromise?.catch) {
      playPromise.catch(() => {
        /* autoplay blocked — user can still tap */
      });
    }

    return () => el.removeEventListener("ended", onEnded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video]);

  // Auto-dismiss after N ms (e.g. Sakura entrance video)
  useEffect(() => {
    if (!autoOpenAfterMs || autoOpenAfterMs <= 0) return undefined;
    const id = window.setTimeout(() => handleOpen(), autoOpenAfterMs);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpenAfterMs, video, image]);

  if (!image && !video) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex cursor-pointer items-center justify-center"
      style={{ background }}
      role="button"
      tabIndex={0}
      aria-label={openLabel}
      onClick={handleOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleOpen();
        }
      }}
    >
      {video ? (
        <video
          ref={videoRef}
          className="lw-invite-entrance-img h-full w-full max-w-[430px] object-cover"
          src={video}
          autoPlay
          muted
          playsInline
          preload="auto"
          aria-label={alt}
        />
      ) : (
        <img
          src={image}
          alt={alt}
          className="lw-invite-entrance-img h-full w-full max-w-[430px] object-cover"
          draggable={false}
        />
      )}
      <span className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 rounded-full bg-black/45 px-5 py-2 text-[11px] uppercase tracking-[0.18em] text-white backdrop-blur-sm">
        {openLabel}
      </span>
    </div>
  );
}

export default DigitalInviteEntrance;
