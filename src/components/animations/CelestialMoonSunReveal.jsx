import React, { useState, useRef, useEffect, useCallback } from "react";
import moonSunBaseSvg from "../../assets/digital/celestial/moon-sun-base.svg";
import moonSvg from "../../assets/digital/celestial/moon.svg";

// 101 uniform arc trajectory points [dx, dy] along the curve from Moon (0,0) to Sun (312.5, 0.5)
const MOON_ARC_POINTS = [
  [0.0, 0.0], [2.63, -2.49], [5.3, -4.93], [8.0, -7.34], [10.75, -9.7],
  [13.53, -12.01], [16.34, -14.29], [19.2, -16.52], [22.08, -18.7], [25.0, -20.84],
  [27.96, -22.93], [30.94, -24.97], [33.96, -26.97], [37.01, -28.92], [40.09, -30.82],
  [43.2, -32.68], [46.34, -34.48], [49.5, -36.23], [52.7, -37.94], [55.92, -39.59],
  [59.16, -41.19], [62.43, -42.74], [65.73, -44.24], [69.04, -45.69], [72.38, -47.09],
  [75.74, -48.43], [79.13, -49.72], [82.53, -50.96], [85.95, -52.14], [89.39, -53.27],
  [92.84, -54.34], [96.32, -55.36], [99.8, -56.33], [103.31, -57.24], [106.83, -58.09],
  [110.36, -58.89], [113.9, -59.63], [117.45, -60.32], [121.01, -60.95], [124.59, -61.53],
  [128.17, -62.05], [131.76, -62.51], [135.36, -62.92], [138.96, -63.27], [142.57, -63.56],
  [146.18, -63.8], [149.79, -63.97], [153.41, -64.1], [157.03, -64.16], [160.65, -64.17],
  [164.27, -64.12], [167.89, -64.02], [171.5, -63.85], [175.11, -63.63], [178.72, -63.36],
  [182.33, -63.02], [185.92, -62.64], [189.52, -62.19], [193.1, -61.69], [196.68, -61.13],
  [200.24, -60.51], [203.8, -59.84], [207.35, -59.11], [210.88, -58.33], [214.4, -57.49],
  [217.91, -56.6], [221.4, -55.65], [224.88, -54.64], [228.34, -53.59], [231.78, -52.47],
  [235.21, -51.31], [238.62, -50.09], [242.0, -48.81], [245.37, -47.48], [248.72, -46.1],
  [252.04, -44.67], [255.34, -43.19], [258.62, -41.65], [261.87, -40.06], [265.1, -38.42],
  [268.3, -36.73], [271.47, -34.99], [274.62, -33.2], [277.74, -31.37], [280.83, -29.48],
  [283.88, -27.54], [288.62, -23.82], [292.92, -20.33], [296.8, -17.06], [300.25, -14.03],
  [303.3, -11.27], [305.94, -8.76], [308.17, -6.53], [310.02, -4.57], [311.47, -2.91],
  [312.55, -1.54], [313.25, -0.49], [313.59, 0.26], [313.58, 0.67], [313.21, 0.76],
  [312.5, 0.5]
];

function getMoonOffset(p) {
  const clamped = Math.max(0, Math.min(1, p));
  const floatIdx = clamped * 100;
  const idx0 = Math.floor(floatIdx);
  const idx1 = Math.min(100, Math.ceil(floatIdx));
  if (idx0 === idx1) return MOON_ARC_POINTS[idx0];
  const t = floatIdx - idx0;
  const p0 = MOON_ARC_POINTS[idx0];
  const p1 = MOON_ARC_POINTS[idx1];
  return [
    p0[0] + t * (p1[0] - p0[0]),
    p0[1] + t * (p1[1] - p0[1])
  ];
}

const ARC_TOTAL_LENGTH = 362;

export default function CelestialMoonSunReveal({
  style = {},
  editable = false,
  onSelect,
  onJoin,
  onJoinChange,
}) {
  const [progress, setProgress] = useState(0); // 0 (Moon) to 1 (Sun)
  const [isDragging, setIsDragging] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const containerRef = useRef(null);
  const animFrameRef = useRef(null);
  const isDraggingRef = useRef(false);
  const hasMovedRef = useRef(false);
  const startXRef = useRef(0);
  const startProgressRef = useRef(0);

  // Notify parent whenever join state changes
  useEffect(() => {
    onJoinChange?.(isJoined);
    if (isJoined) {
      onJoin?.();
    }
  }, [isJoined, onJoin, onJoinChange]);

  // Smooth animation to target progress
  const animateTo = useCallback((targetProgress, duration = 800, onDone) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    const startP = progress;
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(1, elapsed / duration);
      // Smooth easeInOutCubic
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const currentP = startP + (targetProgress - startP) * ease;
      setProgress(currentP);

      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        setProgress(targetProgress);
        if (targetProgress >= 0.99) {
          setIsJoined(true);
        } else if (targetProgress <= 0.01) {
          setIsJoined(false);
        }
        onDone?.();
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  }, [progress]);

  // Pointer / Touch Handlers
  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return; // Primary only
    e.stopPropagation();
    onSelect?.();

    hasMovedRef.current = false;
    isDraggingRef.current = true;
    setIsDragging(true);
    startXRef.current = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
    startProgressRef.current = progress;

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
  };

  const updateDrag = useCallback((clientX) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    if (Math.abs(clientX - startXRef.current) > 4) {
      hasMovedRef.current = true;
    }
    const rect = containerRef.current.getBoundingClientRect();
    // Horizontal distance across the arc (312px active span)
    const dragDistance = clientX - rect.left - 15; // 15px is moon center at start
    const newProgress = Math.max(0, Math.min(1, dragDistance / 312.5));
    setProgress(newProgress);
    if (newProgress >= 0.98) {
      setIsJoined(true);
    } else {
      setIsJoined(false);
    }
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!isDraggingRef.current) return;
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    if (clientX !== undefined) {
      updateDrag(clientX);
    }
  }, [updateDrag]);

  const handlePointerUp = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    // If past 65%, snap to join! Otherwise return to start
    setProgress((cur) => {
      if (cur >= 0.65) {
        animateTo(1.0, 500);
      } else {
        animateTo(0.0, 500);
      }
      return cur;
    });
  }, [animateTo]);

  // Global window listeners for drag to ensure no pointer drop
  useEffect(() => {
    const onMouseMove = (e) => handlePointerMove(e);
    const onMouseUp = () => handlePointerUp();
    const onTouchMove = (e) => {
      if (isDraggingRef.current && e.cancelable) {
        e.preventDefault(); // Prevent scrolling while dragging moon
      }
      handlePointerMove(e);
    };
    const onTouchEnd = () => handlePointerUp();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [handlePointerMove, handlePointerUp]);

  // Click handler: tap on moon or sun auto-glides
  const handleClick = (e) => {
    e.stopPropagation();
    if (hasMovedRef.current) {
      hasMovedRef.current = false;
      return;
    }
    onSelect?.();
    if (isJoined || progress >= 0.95) {
      animateTo(0.0, 900);
    } else {
      animateTo(1.0, 1100);
    }
  };

  const [moonDx, moonDy] = getMoonOffset(progress);

  return (
    <div
      ref={containerRef}
      style={{
        ...style,
        position: "absolute",
        cursor: isDragging ? "grabbing" : "default",
        userSelect: "none",
        WebkitUserSelect: "none",
        touchAction: "none",
      }}
    >
      <style>
        {`
          @keyframes moonPulseGlow {
            0%, 100% {
              filter: drop-shadow(0 0 3px rgba(232, 204, 51, 0.4)) drop-shadow(0 0 8px rgba(212, 135, 68, 0.3));
              transform: scale(1);
            }
            50% {
              filter: drop-shadow(0 0 7px rgba(232, 204, 51, 0.9)) drop-shadow(0 0 16px rgba(212, 135, 68, 0.6));
              transform: scale(1.06);
            }
          }
          @keyframes sunEclipseCorona {
            0%, 100% {
              filter: drop-shadow(0 0 12px rgba(232, 204, 51, 0.8)) drop-shadow(0 0 28px rgba(227, 160, 100, 0.6));
              transform: scale(1.02);
            }
            50% {
              filter: drop-shadow(0 0 20px rgba(232, 204, 51, 1)) drop-shadow(0 0 45px rgba(212, 135, 68, 0.9));
              transform: scale(1.08);
            }
          }
          .celestial-moon-pulse {
            animation: moonPulseGlow 3s ease-in-out infinite;
          }
          .celestial-sun-eclipse {
            animation: sunEclipseCorona 2.5s ease-in-out infinite;
          }
        `}
      </style>

      {/* 1. Base SVG: Static Arc & Sun */}
      <img
        src={moonSunBaseSvg}
        alt=""
        draggable="false"
        style={{
          position: "absolute",
          left: 0,
          top: "49px",
          width: "359px",
          height: "91px",
          pointerEvents: "none",
          display: "block",
          filter: isJoined ? "drop-shadow(0 0 8px rgba(232, 204, 51, 0.5))" : undefined,
          transition: "filter 0.5s ease",
        }}
      />

      {/* Click target over the Sun so tapping either Moon or Sun glides the moon */}
      <div
        onClick={handleClick}
        style={{
          position: "absolute",
          left: "296px",
          top: `${49 + 18}px`,
          width: "63px",
          height: "63px",
          borderRadius: "50%",
          cursor: "pointer",
          zIndex: 4,
        }}
        title={isJoined ? "Tap to reset moon" : "Tap to join moon to sun"}
      />

      {/* 2. Golden Illuminated Trailing Arc as Moon Travels */}
      <svg
        width="359"
        height="91"
        viewBox="0 0 359 91"
        style={{
          position: "absolute",
          left: 0,
          top: "49px",
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        <defs>
          <linearGradient id="celestialArcGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D48744" />
            <stop offset="50%" stopColor="#E8CC33" />
            <stop offset="100%" stopColor="#E3A064" />
          </linearGradient>
          <filter id="celestialGoldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <path
          d="M 10.0163 64.5488 C 31.8351 43.5783 57.5766 27.1199 85.7656 16.1167 C 113.955 5.11354 144.037 -0.218095 174.289 0.427343 C 204.541 1.07278 234.367 7.6826 262.059 19.878 C 289.751 32.0735 314.764 49.6148 335.665 71.4967"
          fill="none"
          stroke="url(#celestialArcGold)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeDasharray={ARC_TOTAL_LENGTH}
          strokeDashoffset={ARC_TOTAL_LENGTH * (1 - progress)}
          filter="url(#celestialGoldGlow)"
          opacity={progress > 0.02 ? Math.min(1, progress * 1.5) : 0}
        />
      </svg>

      {/* 3. Eclipse Conjunction Aura over Sun when joined */}
      {isJoined && (
        <div
          className="celestial-sun-eclipse"
          style={{
            position: "absolute",
            left: "296px",
            top: `${49 + 26}px`,
            width: "63px",
            height: "64px",
            borderRadius: "50%",
            pointerEvents: "none",
            zIndex: 4,
            background: "radial-gradient(circle, rgba(232, 204, 51, 0.4) 0%, rgba(212, 135, 68, 0) 75%)",
          }}
        />
      )}

      {/* 4. Movable Moon with Grab Touch Target */}
      <div
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        style={{
          position: "absolute",
          left: 0,
          top: `${49 + 39.31}px`,
          width: "30px",
          height: "37px",
          transform: `translate3d(${moonDx}px, ${moonDy}px, 0)`,
          transition: isDragging ? "none" : "transform 0.1s ease-out",
          cursor: isDragging ? "grabbing" : (isJoined ? "pointer" : "grab"),
          zIndex: 5,
          touchAction: "none",
          transformOrigin: "center center",
        }}
      >
        {/* Invisible expanded touch hit area (54x54px) for easy finger grabbing on mobile */}
        <div
          style={{
            position: "absolute",
            top: "-9px",
            left: "-12px",
            width: "54px",
            height: "55px",
            background: "transparent",
            cursor: isDragging ? "grabbing" : "grab",
          }}
        />

        {/* The Moon graphic */}
        <img
          src={moonSvg}
          alt="Moon"
          draggable="false"
          className={!isDragging && !isJoined ? "celestial-moon-pulse" : undefined}
          style={{
            width: "30px",
            height: "37px",
            display: "block",
            pointerEvents: "none",
            filter: isJoined
              ? "drop-shadow(0 0 10px rgba(232, 204, 51, 1))"
              : isDragging
              ? "drop-shadow(0 0 8px rgba(232, 204, 51, 0.9))"
              : undefined,
          }}
        />
      </div>
    </div>
  );
}
