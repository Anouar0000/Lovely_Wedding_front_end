import React, { useState, useEffect } from "react";
import envelopeBack from "../../assets/digital/celestial/envelope-back.png";
import envelopeFront from "../../assets/digital/celestial/envelope-front.png";
import sunIcon from "../../assets/digital/celestial/sun-icon.svg";

/**
 * CelestialEnvelopeLetter
 * 
 * Interactive Hero envelope where the invitation letter smoothly glides out of the pocket.
 * 
 * Layer stacking:
 * - Envelope Back (zIndex: 2): Open top flap with dark textured paper lining.
 * - Letter Card (zIndex: 3): Warm ivory stationery card sliding upwards with smooth easing.
 * - Envelope Front (zIndex: 4): Black V-fold pocket covering the bottom of the emerging card.
 * - Star Seal (zIndex: 5): Pulsing golden star emblem at the apex of the envelope flap.
 */
export default function CelestialEnvelopeLetter({
  isOpen: controlledIsOpen,
  onToggle,
  children,
  autoOpenDelay = 700,
  tuckDistance = 95,
  style = {},
  className = "",
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  // Gracefully auto-open on initial load: starts tucked inside, then glides up to original place
  useEffect(() => {
    if (autoOpenDelay !== null && !isControlled) {
      const timer = setTimeout(() => {
        setInternalIsOpen(true);
      }, autoOpenDelay);
      return () => clearTimeout(timer);
    }
  }, [autoOpenDelay, isControlled]);

  const handleEnvelopeClick = (e) => {
    // If an interactive element inside stopped propagation, do nothing
    if (e.defaultPrevented) return;
    const next = !isOpen;
    if (!isControlled) {
      setInternalIsOpen(next);
    }
    if (onToggle) {
      onToggle(next);
    }
  };

  return (
    <div
      className={`celestial-envelope-wrapper ${className}`}
      onClick={handleEnvelopeClick}
      title={isOpen ? "Click to tuck invitation into envelope" : "Click to view invitation"}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "430px",
        height: "474px",
        cursor: "pointer",
        ...style,
      }}
    >
      {/* 1. Envelope Back (Open flap + dark interior lining) */}
      <img
        src={envelopeBack}
        alt=""
        style={{
          position: "absolute",
          left: "89px",
          top: "-81px",
          width: "253px",
          height: "450px",
          zIndex: 2,
          objectFit: "cover",
          pointerEvents: "none",
          userSelect: "none",
        }}
      />

      {/* 2. Clipping Container for Letter (clipped at envelope bottom y: 368px) */}
      <div
        className="celestial-envelope-card-clipper"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "430px",
          height: "368px",
          overflow: "hidden",
          zIndex: 3,
          pointerEvents: "none",
        }}
      >
        {/* Sliding Invitation Letter Card */}
        <div
          className="celestial-envelope-card"
          style={{
            position: "absolute",
            left: "142px",
            top: "147px",
            width: "146px",
            height: "215px",
            backgroundColor: "rgb(250, 246, 240)",
            borderRadius: "2px",
            boxShadow: isOpen
              ? "0 10px 24px rgba(0, 0, 0, 0.25)"
              : "0 2px 8px rgba(0, 0, 0, 0.15)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingTop: "32px",
            boxSizing: "border-box",
            transform: isOpen ? "translateY(0px)" : `translateY(${tuckDistance}px)`,
            transition: "transform 1.25s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 1.25s ease",
            userSelect: "none",
            pointerEvents: "auto",
          }}
        >
          {/* Card Content Slot (Couple Names etc.) */}
          <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            {children}
          </div>
        </div>
      </div>

      {/* 3. Envelope Front Pocket (V-fold covering bottom of card) */}
      <img
        src={envelopeFront}
        alt=""
        style={{
          position: "absolute",
          left: "89px",
          top: "-81px",
          width: "253px",
          height: "450px",
          zIndex: 4,
          objectFit: "cover",
          pointerEvents: "none",
          userSelect: "none",
        }}
      />

      {/* 4. Star Icon Emblem on Envelope Flap */}
      <img
        src={sunIcon}
        alt=""
        className="celestial-pulse"
        style={{
          position: "absolute",
          left: "200px",
          top: "320px",
          width: "30px",
          height: "30px",
          zIndex: 5,
          pointerEvents: "none",
          userSelect: "none",
        }}
      />
    </div>
  );
}
