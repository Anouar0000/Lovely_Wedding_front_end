import { useEffect } from "react";

/**
 * Molette / trackpad vertical → scroll horizontal sur un carrousel overflow-x.
 * Ne bloque la page que s'il reste du scroll horizontal dans la direction de la molette.
 */
export default function useHorizontalWheelScroll(scrollerRef) {
  useEffect(() => {
    const el = scrollerRef?.current;
    if (!el) return undefined;

    const onWheel = (e) => {
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 1) return;

      // Trackpad horizontal déjà géré nativement
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      const atStart = el.scrollLeft <= 0;
      const atEnd = el.scrollLeft >= max - 1;
      if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;

      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [scrollerRef]);
}
