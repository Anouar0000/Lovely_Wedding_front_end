import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useCart } from "../../context/CartContext";
import { homeDigitalAssets as a } from "./homeDigitalAssets";
import LovelyMobileDrawer from "./LovelyMobileDrawer";

/**
 * @param {"digitale" | "imprimee" | "none"} mode
 */
function DigitalHomeHeader({ mode = "digitale" }) {
  const navigate = useNavigate();
  const { user, loading, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const showToggle = mode === "digitale" || mode === "imprimee";

  const goUser = () => {
    if (loading) return;
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(isAdmin ? "/dashboard" : "/espace-client");
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-transparent bg-white lg:border-lw-line/60">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 lg:px-8 lg:py-4">
          <div className="flex w-[72px] items-center gap-2 lg:w-auto lg:gap-6">
            <button
              type="button"
              className="p-0.5 lg:hidden"
              aria-label="Ouvrir le menu"
              aria-expanded={menuOpen}
              aria-controls="lovely-mobile-menu"
              onClick={() => setMenuOpen(true)}
            >
              <img src={a.iconMenu} alt="" className="h-[26px] w-[26px] object-contain" />
            </button>
            <button type="button" className="hidden p-0.5 lg:inline-flex" aria-label="Recherche">
              <img src={a.iconSearch} alt="" className="h-[26px] w-[26px] object-contain" />
            </button>
            <nav className="hidden items-center gap-6 font-urbanist text-[14px] text-lw-text lg:flex">
              <button
                type="button"
                onClick={() =>
                  navigate(mode === "imprimee" ? "/invitations-physique" : "/invitations-digital")
                }
                className="hover:text-lw-accent"
              >
                Collection
              </button>
              <a href="#faq" className="hover:text-lw-accent">
                FAQ
              </a>
            </nav>
          </div>

          <button type="button" onClick={() => navigate("/")} className="px-1">
            <span className="lw-logo">Lovely Invitations</span>
          </button>

          <div className="flex w-[72px] items-center justify-end gap-2 lg:w-auto lg:gap-4">
            <button type="button" className="p-0.5" aria-label="Compte" onClick={goUser}>
              <img src={a.iconUser} alt="" className="h-[26px] w-[26px] object-contain" />
            </button>
            <button
              type="button"
              className="relative p-0.5"
              aria-label="Panier"
              onClick={() => navigate("/cart")}
            >
              <img src={a.iconCart} alt="" className="h-[26px] w-[26px] object-contain" />
              {itemCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-lw-text px-1 text-[10px] text-white">
                  {itemCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        {showToggle ? (
          <div className="flex justify-center px-4 pb-4 pt-1 lg:pb-6">
            <div
              className="inline-flex h-[42px] w-[273px] overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-lw-line lg:w-[320px]"
              role="tablist"
              aria-label="Type d'invitation"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mode === "digitale"}
                className={
                  mode === "digitale"
                    ? "flex-1 rounded-full bg-lw-accent font-urbanist text-[13px] font-bold uppercase tracking-wide text-white"
                    : "flex-1 rounded-full bg-white font-urbanist text-[13px] font-bold uppercase tracking-wide text-lw-accent"
                }
                onClick={() => {
                  if (mode !== "digitale") navigate("/");
                }}
              >
                Digitale
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "imprimee"}
                className={
                  mode === "imprimee"
                    ? "flex-1 rounded-full bg-lw-accent font-urbanist text-[13px] font-bold uppercase tracking-wide text-white"
                    : "flex-1 rounded-full bg-white font-urbanist text-[13px] font-bold uppercase tracking-wide text-lw-accent"
                }
                onClick={() => {
                  if (mode !== "imprimee") navigate("/imprimee");
                }}
              >
                Imprimée
              </button>
            </div>
          </div>
        ) : null}
      </header>

      <div id="lovely-mobile-menu">
        <LovelyMobileDrawer open={menuOpen} onClose={() => setMenuOpen(false)} mode={mode} />
      </div>
    </>
  );
}

export default DigitalHomeHeader;
