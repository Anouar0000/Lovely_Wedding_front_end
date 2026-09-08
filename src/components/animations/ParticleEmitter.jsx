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

const ParticleEmitter = ({ type = "petals", count = 30, active = true, color = "#FFFFFF" }) => {
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
    const isWhite = baseRgb ? (baseRgb.r >= 235 && baseRgb.g >= 235 && baseRgb.b >= 235) : false;

    // Initialize particles
    const particles = [];
    for (let i = 0; i < count; i++) {
      let particleColor;
      if (type === "petals") {
        if (baseRgb) {
          const varR = Math.min(255, Math.max(0, baseRgb.r + (Math.floor(Math.random() * 16) - 8)));
          const varG = Math.min(255, Math.max(0, baseRgb.g + (Math.floor(Math.random() * 16) - 8)));
          const varB = Math.min(255, Math.max(0, baseRgb.b + (Math.floor(Math.random() * 16) - 8)));
          particleColor = `rgba(${varR}, ${varG}, ${varB}, `;
        } else {
          particleColor = `rgba(${200 + Math.floor(Math.random() * 55)}, ${17 + Math.floor(Math.random() * 30)}, ${90 + Math.floor(Math.random() * 50)}, `;
        }
      } else {
        particleColor = `rgba(255, 223, 0, `; // Yellow sparkles
      }

      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 7 + 4,
        d: Math.random() * count,
        opacity: isWhite ? (Math.random() * 0.45 + 0.45) : (Math.random() * 0.5 + 0.3),
        drift: Math.random() * 1.5 - 0.75,
        angle: Math.random() * Math.PI * 2,
        spin: Math.random() * 0.02 - 0.01,
        color: particleColor,
        isWhite,
      });
    }

    const drawParticle = (p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.beginPath();
      
      if (type === "petals") {
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
      } else {
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.r);
        grad.addColorStop(0, `rgba(255, 255, 255, ${p.opacity})`);
        grad.addColorStop(0.5, p.color + p.opacity * 0.5 + ")");
        grad.addColorStop(1, p.color + "0)");
        ctx.fillStyle = grad;
        ctx.arc(0, 0, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const updateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.y += (p.r * 0.15) + (Math.sin(p.angle) * 0.2) + 0.8;
        p.x += p.drift + Math.sin(p.y * 0.01) * 0.5;
        p.angle += p.spin;

        if (p.y > canvas.height + 20) {
          particles[i] = {
            ...p,
            x: Math.random() * canvas.width,
            y: -20,
            angle: Math.random() * Math.PI * 2,
            opacity: p.isWhite ? (Math.random() * 0.45 + 0.45) : (Math.random() * 0.5 + 0.3),
          };
        }

        drawParticle(p);
      }

      animationFrameId = requestAnimationFrame(updateParticles);
    };

    updateParticles();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [type, count, active, color]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute left-0 top-0 h-full w-full"
      style={{ zIndex: 5 }}
    />
  );
};

export default ParticleEmitter;
