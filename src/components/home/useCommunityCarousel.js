import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Carrousel Communauté — snap + auto-scroll animé, pause au touch / flèches.
 */
export function useCommunityCarousel(slides, { intervalMs = 3800, resumeMs = 7000 } = {}) {
  const scrollerRef = useRef(null);
  const indexRef = useRef(0);
  const pausedUntilRef = useRef(0);
  const [index, setIndex] = useState(0);
  const [activeId, setActiveId] = useState(slides[0]?.id);

  const scrollTo = useCallback(
    (next) => {
      const safe = ((next % slides.length) + slides.length) % slides.length;
      indexRef.current = safe;
      setIndex(safe);
      setActiveId(slides[safe].id);
      const scroller = scrollerRef.current;
      if (!scroller) return;
      const card = scroller.children[safe];
      if (!card) return;
      // Horizontal only — avoid page jumping vertically (scrollIntoView).
      const left = card.offsetLeft - (scroller.clientWidth - card.offsetWidth) / 2;
      scroller.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
    },
    [slides]
  );

  const pauseAuto = useCallback(() => {
    pausedUntilRef.current = Date.now() + resumeMs;
  }, [resumeMs]);

  const go = useCallback(
    (dir) => {
      pauseAuto();
      scrollTo(indexRef.current + dir);
    },
    [pauseAuto, scrollTo]
  );

  const setActiveFromUser = useCallback(
    (id) => {
      pauseAuto();
      setActiveId(id);
      const i = slides.findIndex((s) => s.id === id);
      if (i >= 0) {
        indexRef.current = i;
        setIndex(i);
      }
    },
    [pauseAuto, slides]
  );

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const center = scroller.scrollLeft + scroller.clientWidth / 2;
        let best = 0;
        let bestDist = Infinity;
        Array.from(scroller.children).forEach((child, i) => {
          const mid = child.offsetLeft + child.offsetWidth / 2;
          const dist = Math.abs(mid - center);
          if (dist < bestDist) {
            bestDist = dist;
            best = i;
          }
        });
        if (indexRef.current !== best) {
          indexRef.current = best;
          setIndex(best);
          setActiveId(slides[best].id);
        }
        ticking = false;
      });
    };

    const onInteract = () => pauseAuto();

    scroller.addEventListener("scroll", onScroll, { passive: true });
    scroller.addEventListener("touchstart", onInteract, { passive: true });
    scroller.addEventListener("pointerdown", onInteract);

    return () => {
      scroller.removeEventListener("scroll", onScroll);
      scroller.removeEventListener("touchstart", onInteract);
      scroller.removeEventListener("pointerdown", onInteract);
    };
  }, [pauseAuto, slides]);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (Date.now() < pausedUntilRef.current) return;
      if (typeof document !== "undefined" && document.hidden) return;
      scrollTo(indexRef.current + 1);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, scrollTo]);

  return {
    scrollerRef,
    index,
    activeId,
    go,
    setActiveId: setActiveFromUser,
  };
}
