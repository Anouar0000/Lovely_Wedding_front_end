import React, { useEffect, useRef, useState } from "react";
import { FiVolume2, FiVolumeX } from "react-icons/fi";

const AudioPlayer = ({ src, active = true }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!active || !src) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      return;
    }

    const audio = new Audio(src);
    audio.loop = true;
    audioRef.current = audio;

    const playAudio = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        // Autoplay blocked, wait for user interaction to trigger play
        const startPlayOnInteraction = async () => {
          try {
            if (audioRef.current) {
              await audioRef.current.play();
              setIsPlaying(true);
            }
            document.removeEventListener("click", startPlayOnInteraction);
            document.removeEventListener("touchstart", startPlayOnInteraction);
          } catch (e) {
            console.error("Interactive play failed", e);
          }
        };
        document.addEventListener("click", startPlayOnInteraction);
        document.addEventListener("touchstart", startPlayOnInteraction);
      }
    };

    playAudio();

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [src, active]);

  const togglePlayback = (e) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.error("Playback toggle failed", err);
        });
    }
  };

  if (!active || !src) return null;

  return (
    <button
      type="button"
      onClick={togglePlayback}
      className={`fixed bottom-6 right-6 z-[9999] flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/60 shadow-lg backdrop-blur-md transition-transform duration-300 hover:scale-110 active:scale-95 ${
        isPlaying ? "animate-pulse" : ""
      }`}
      aria-label={isPlaying ? "Mute music" : "Play music"}
    >
      {isPlaying ? (
        <FiVolume2 
          className="h-5 w-5 text-white" 
          style={{ animation: "spin 8s linear infinite" }}
        />
      ) : (
        <FiVolumeX className="h-5 w-5 text-white" />
      )}
    </button>
  );
};

export default AudioPlayer;
