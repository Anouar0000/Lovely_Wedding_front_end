import React, { useEffect, useRef } from "react";

const ParticleEmitter = ({ type = "petals", count = 30, active = true }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resizeCanvas = () => {
      if (!canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles
    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 6 + 4,
        d: Math.random() * count,
        opacity: Math.random() * 0.5 + 0.3,
        drift: Math.random() * 1.5 - 0.75,
        angle: Math.random() * Math.PI * 2,
        spin: Math.random() * 0.02 - 0.01,
        color: type === "petals" 
          ? `rgba(${200 + Math.floor(Math.random() * 55)}, ${17 + Math.floor(Math.random() * 30)}, ${90 + Math.floor(Math.random() * 50)}, `
          : `rgba(255, 223, 0, `, // Yellow sparkles
      });
    }

    const drawParticle = (p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.beginPath();
      
      if (type === "petals") {
        ctx.ellipse(0, 0, p.r, p.r * 0.6, 0, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.opacity + ")";
        ctx.fill();
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
            opacity: Math.random() * 0.5 + 0.3,
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
  }, [type, count, active]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute left-0 top-0 h-full w-full"
      style={{ zIndex: 5 }}
    />
  );
};

export default ParticleEmitter;
