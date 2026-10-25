import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LuGlobe, LuX } from "react-icons/lu";
import { useAuth } from "../auth/AuthProvider";
import { useFavorites } from "../../context/FavoritesContext";
import { homeDigitalAssets as a } from "./homeDigitalAssets";

/**
 * Menu mobile Figma 1056:114 — plein écran + Favoris
 * @param {boolean} open
 * @param {() => void} onClose
 * @param {"digitale" | "imprimee" | "none"} mode
 */
function LovelyMobileDrawer({ open, onClose, mode = "digitale" }) {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { count: favCount } = useFavorites();

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const go = (path) => {
    onClose();
    navigate(path);
  };

  const goHash = (path, hash) => {
    onClose();
    const onPage = window.location.pathname === path;
    if (onPage) {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", `#${hash}`);
        return;
      }
    }
    navigate(`${path}#${hash}`);
  };

  const goAccount = () => {
    if (loading) return;
    onClose();
    if (!user) {
      navigate("/login");
      return;
    }
    navigate("/espace-client");
  };

  const homeDigital = "/";
  const homePrint = "/imprimee";

  const links = [
    {
      id: "digitales",
      label: "Invitations Digitales",
      onClick: () => go("/invitations-digital"),
    },
    {
      id: "std",
      label: "Vidéos Save The Date",
      onClick: () => goHash(homeDigital, "save-the-dates"),
    },
    {
      id: "imprimees",
      label: "Invitations Imprimées",
      onClick: () => go("/invitations-physique"),
    },
    {
      id: "dragees",
      label: "Dragées",
      onClick: () => goHash(homePrint, "dragees"),
    },
    {
      id: "calligraphie",
      label: "Calligraphie",
      onClick: () => go(homePrint),
    },
    {
      id: "forfaits",
      label: "Forfaits",
      onClick: () => goHash(homeDigital, "forfaits"),
    },
    {
      id: "avis",
      label: "Avis",
      onClick: () =>
        goHash(mode === "imprimee" ? homePrint : homeDigital, "our-story"),
    },
    {
      id: "faq",
      label: "FAQ",
      onClick: () =>
        goHash(mode === "imprimee" ? homePrint : homeDigital, "faq"),
    },
    {
      id: "favoris",
      label: favCount > 0 ? `Favoris (${favCount})` : "Favoris",
      onClick: () => go("/favoris"),
    },
    {
      id: "espace",
      label: "Espace client",
      onClick: goAccount,
    },
  ];

  return (
    <div
      className={`fixed inset-0 z-[70] bg-white transition-[opacity,visibility] duration-300 lg:hidden ${
        open
          ? "pointer-events-auto visible opacity-100"
          : "pointer-events-none invisible opacity-0"
      }`}
      aria-hidden={!open}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="flex h-full w-full flex-col bg-white"
      >
        {/* Barre haute Figma : ✕ · oiseau · Fr */}
        <div className="relative mx-4 flex h-[72px] shrink-0 items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="relative z-10 inline-flex items-center justify-center p-0 text-lw-text"
            aria-label="Fermer"
          >
            <LuX size={24} strokeWidth={1.5} aria-hidden />
          </button>

          <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center">
            <img
              src={a.menuOiseau}
              alt=""
              width={74.25}
              height={41}
              className="h-[41px] w-[74.25px] object-contain"
              draggable={false}
            />
          </div>

          <button
            type="button"
            className="relative z-10 inline-flex items-center gap-1.5 font-glacial text-[14px] font-bold leading-[23px] text-lw-text"
            aria-label="Langue : Français"
          >
            <LuGlobe size={24} strokeWidth={1.5} aria-hidden />
            <span className="inline-block h-[23px] min-w-[14px] text-[14px] font-bold leading-[23px]">
              Fr
            </span>
          </button>
        </div>

        <nav className="mx-4 flex-1 overflow-y-auto pb-10">
          <ul className="divide-y divide-[#E8E0D8]">
            {links.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={item.onClick}
                  className="flex w-full items-center py-4 text-left font-glacial text-[18px] font-normal leading-6 text-lw-text transition-colors hover:text-lw-accent"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default LovelyMobileDrawer;
