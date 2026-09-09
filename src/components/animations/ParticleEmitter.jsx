import React, { useEffect, useRef } from "react";

function hexToRgb(hex) {
  if (!hex || typeof hex !== "string") return null;
  if (hex.startsWith("rgb")) {
    const match = hex.match(/\d+/g);
    if (match && match.length >= 3) {
      return { r: parseInt(match[0], 10), g: parseInt(match[1], 10), b: parseInt(match[2], 10) };
    }
  }
  let cleanHex = hex.replace("#", "").trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split("").map((c) => c + c).join("");
  }
  if (cleanHex.length === 6) {
    const num = parseInt(cleanHex, 16);
    if (!isNaN(num)) {
      return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255,
      };
    }
  }
  return null;
}

/**
 * ParticleEmitter
 * 
 * High-performance canvas particle system for wedding digital invitations:
 * - "petals": Falling flower petals accompanied by glistening diamond sparkles.
 * - "sparkles" / "stars": Pure celestial stardust with 4-point diamond flares, halos, and shimmering twinkles.
 * - "mixed": Combined fluttering petals and celestial sparkles.
 */
const ParticleEmitter = ({
  type = "petals",
  count = 30,
  active = true,
  color = "#FFFFFF",
  withSparkles = true,
  sparkleRatio = 0.35,
  style = {},
  className = "",
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resizeCanvas = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.offsetWidth || canvas.parentElement.clientWidth || 430;
      canvas.height = canvas.parentElement.offsetHeight || canvas.parentElement.clientHeight || 3243;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const baseRgb = color ? hexToRgb(color) : null;
    const isWhite = baseRgb ? baseRgb.r >= 235 && baseRgb.g >= 235 && baseRgb.b >= 235 : false;

    // Initialize particles
    const particles = [];
    const isPureSparkles = type === "sparkles" || type === "stars";

    for (let i = 0; i < count; i++) {
      const isSparkle = isPureSparkles || (withSparkles && Math.random() < sparkleRatio);

      if (isSparkle) {
        // Celestial Sparkle / Stardust Particle
        const sparkleColor = baseRgb
          ? baseRgb
          : Math.random() > 0.4
          ? { r: 250, g: 232, b: 175 } // Warm Champagne Gold
          : { r: 255, g: 255, b: 255 }; // Diamond White

        particles.push({
          kind: "sparkle",
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 5.5 + 2.5,
          speedY: Math.random() * 0.45 + 0.45,
          driftPhase: Math.random() * Math.PI * 2,
          driftSpeed: Math.random() * 0.015 + 0.01,
          baseOpacity: Math.random() * 0.45 + 0.45,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 0.06 + 0.03,
          angle: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.018,
          colorRgb: sparkleColor,
        });
      } else {
        // Flower Petal Particle
        let particleColor;
        if (baseRgb) {
          const varR = Math.min(255, Math.max(0, baseRgb.r + (Math.floor(Math.random() * 16) - 8)));
          const varG = Math.min(255, Math.max(0, baseRgb.g + (Math.floor(Math.random() * 16) - 8)));
          const varB = Math.min(255, Math.max(0, baseRgb.b + (Math.floor(Math.random() * 16) - 8)));
          particleColor = `rgba(${varR}, ${varG}, ${varB}, `;
        } else {
          particleColor = `rgba(${200 + Math.floor(Math.random() * 55)}, ${17 + Math.floor(Math.random() * 30)}, ${90 + Math.floor(Math.random() * 50)}, `;
        }

        particles.push({
          kind: "petal",
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          r: Math.random() * 7 + 4,
          d: Math.random() * count,
          opacity: isWhite ? Math.random() * 0.45 + 0.45 : Math.random() * 0.5 + 0.3,
          drift: Math.random() * 1.5 - 0.75,
          angle: Math.random() * Math.PI * 2,
          spin: Math.random() * 0.02 - 0.01,
          color: particleColor,
          isWhite,
        });
      }
    }

    // Draw a 4-point diamond star sparkle with ethereal outer glow and white core
    const drawSparkle = (p) => {
      const currentOpacity = p.baseOpacity * (0.55 + 0.45 * Math.sin(p.twinklePhase));
      if (currentOpacity <= 0.02) return;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);

      const r = p.colorRgb.r;
      const g = p.colorRgb.g;
      const b = p.colorRgb.b;

      // 1. Ethereal outer radial glow
      const glowRadius = p.size * 2.5;
      const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, glowRadius);
      glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${currentOpacity * 0.65})`);
      glow.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${currentOpacity * 0.22})`);
      glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
      ctx.fill();

      // 2. Diamond 4-point concave star
      const spike = p.size * 2.0;
      const waist = p.size * 0.22;
      ctx.beginPath();
      ctx.moveTo(0, -spike);
      ctx.quadraticCurveTo(0, -waist, waist, 0);
      ctx.quadraticCurveTo(waist, 0, spike, 0);
      ctx.quadraticCurveTo(waist, 0, 0, waist);
      ctx.quadraticCurveTo(0, waist, 0, spike);
      ctx.quadraticCurveTo(0, waist, -waist, 0);
      ctx.quadraticCurveTo(-waist, 0, -spike, 0);
      ctx.quadraticCurveTo(-waist, 0, 0, -waist);
      ctx.closePath();
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(1, currentOpacity * 0.95)})`;
      ctx.fill();

      // 3. Secondary 45-degree micro cross-rays
      const dLen = spike * 0.42;
      const dW = Math.max(0.6, waist * 0.65);
      const c45 = 0.7071;
      ctx.beginPath();
      ctx.moveTo(-dLen * c45, -dLen * c45);
      ctx.lineTo(dLen * c45, dLen * c45);
      ctx.moveTo(-dLen * c45, dLen * c45);
      ctx.lineTo(dLen * c45, -dLen * c45);
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${currentOpacity * 0.7})`;
      ctx.lineWidth = dW;
      ctx.stroke();

      // 4. Brilliant white diamond glint center
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(0.8, waist * 1.15), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, currentOpacity * 1.25)})`;
      ctx.fill();

      ctx.restore();
    };

    // Draw falling flower petal
    const drawPetal = (p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r, p.r * 0.58, 0, 0, Math.PI * 2);
      if (p.isWhite) {
        ctx.shadowColor = "rgba(0, 0, 0, 0.14)";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 1;
      }
      ctx.fillStyle = p.color + p.opacity + ")";
      ctx.fill();
      if (p.isWhite) {
        ctx.strokeStyle = `rgba(235, 235, 235, ${p.opacity * 0.5})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      ctx.restore();
    };

    const updateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (p.kind === "sparkle") {
          p.y += p.speedY;
          p.x += Math.sin(p.driftPhase) * 0.6;
          p.driftPhase += p.driftSpeed;
          p.angle += p.spin;
          p.twinklePhase += p.twinkleSpeed;

          // Re-spawn at top when falling off bottom
          if (p.y > canvas.height + 20) {
            p.x = Math.random() * canvas.width;
            p.y = -20;
            p.twinklePhase = Math.random() * Math.PI * 2;
            p.angle = Math.random() * Math.PI * 2;
          }

          drawSparkle(p);
        } else {
          p.y += p.r * 0.15 + Math.sin(p.angle) * 0.2 + 0.8;
          p.x += p.drift + Math.sin(p.y * 0.01) * 0.5;
          p.angle += p.spin;

          if (p.y > canvas.height + 20) {
            particles[i] = {
              ...p,
              x: Math.random() * canvas.width,
              y: -20,
              angle: Math.random() * Math.PI * 2,
              opacity: p.isWhite ? Math.random() * 0.45 + 0.45 : Math.random() * 0.5 + 0.3,
            };
          }

          drawPetal(p);
        }
      }

      animationFrameId = requestAnimationFrame(updateParticles);
    };

    updateParticles();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [type, count, active, color, withSparkles, sparkleRatio]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute left-0 top-0 h-full w-full ${className}`}
      style={{ zIndex: 5, ...style }}
    />
  );
};

export default ParticleEmitter;
