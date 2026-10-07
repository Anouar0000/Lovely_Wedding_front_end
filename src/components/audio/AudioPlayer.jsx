import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { FiVolume2, FiVolumeX } from "react-icons/fi";

const AudioPlayer = forwardRef(function AudioPlayer(
  { src, musicUrl, active = true, themeColor, onPlayingChange },
  ref
) {
  const track = src || musicUrl;
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const setPlaying = (next) => {
    setIsPlaying(next);
    onPlayingChange?.(next);
  };

  useEffect(() => {
    if (!active || !track) {
      if (audioRef.current) {
        audioRef.current.pause();
        setPlaying(false);
      }
      return undefined;
    }

    const audio = new Audio(track);
    audio.loop = true;
    audio.volume = 0.45;
    audioRef.current = audio;

    const startPlayOnInteraction = async () => {
      try {
        if (audioRef.current) {
          await audioRef.current.play();
          setPlaying(true);
        }
      } catch (e) {
        console.error("Interactive play failed", e);
      } finally {
        document.removeEventListener("click", startPlayOnInteraction);
        document.removeEventListener("touchstart", startPlayOnInteraction);
      }
    };

    const playAudio = async () => {
      try {
        await audio.play();
        setPlaying(true);
      } catch (err) {
        document.addEventListener("click", startPlayOnInteraction);
        document.addEventListener("touchstart", startPlayOnInteraction);
      }
    };

    playAudio();

    return () => {
      document.removeEventListener("click", startPlayOnInteraction);
      document.removeEventListener("touchstart", startPlayOnInteraction);
      audio.pause();
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- setPlaying is stable enough for mount cycle
  }, [track, active]);

  const togglePlayback = (e) => {
    e?.stopPropagation?.();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setPlaying(false);
    } else {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch((err) => console.error("Playback toggle failed", err));
    }
  };

  useImperativeHandle(ref, () => ({
    toggle: () => togglePlayback(),
    play: async () => {
      const audio = audioRef.current;
      if (!audio) return;
      await audio.play();
      setPlaying(true);
    },
    pause: () => {
      audioRef.current?.pause();
      setPlaying(false);
    },
    isPlaying: () => isPlaying,
  }));

  if (!active || !track) return null;

  const accent = themeColor || "#ffffff";

  return (
    <button
      type="button"
      onClick={togglePlayback}
      className={`fixed bottom-6 right-6 z-[9999] flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/60 shadow-lg backdrop-blur-md transition-transform duration-300 hover:scale-110 active:scale-95 ${
        isPlaying ? "animate-pulse" : ""
      }`}
      aria-label={isPlaying ? "Couper la musique" : "Lancer la musique"}
    >
      {isPlaying ? (
        <FiVolume2 className="h-5 w-5" style={{ color: accent, animation: "spin 8s linear infinite" }} />
      ) : (
        <FiVolumeX className="h-5 w-5" style={{ color: accent }} />
      )}
    </button>
  );
});

export default AudioPlayer;
