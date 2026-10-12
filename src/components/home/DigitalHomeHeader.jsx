import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPrinter, FiSmartphone } from "react-icons/fi";
import { LuMenu, LuSearch, LuShoppingBag, LuUser } from "react-icons/lu";
import { useAuth } from "../auth/AuthProvider";
import { useCart } from "../../context/CartContext";
import LovelyMobileDrawer from "./LovelyMobileDrawer";

/** Figma Lucide: 24px, stroke 1.5 */
const iconProps = { size: 24, strokeWidth: 1.5, "aria-hidden": true };

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
      <header className="sticky top-0 z-50 shrink-0 border-b border-transparent bg-[#F7F2EC] text-lw-text lg:border-lw-line/60">
        {/* Figma: logo Y:23 → padding-top (pas margin). Antic 26, box 206×31, x:112 */}
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-[19px] pt-[23px] lg:px-8 lg:pb-4 lg:pt-4">
          <div className="flex h-[31px] w-[60px] shrink-0 items-center gap-3 lg:h-auto lg:w-auto lg:gap-6">
            <button
              type="button"
              className="inline-flex size-6 items-center justify-center lg:hidden"
              aria-label="Ouvrir le menu"
              aria-expanded={menuOpen}
              aria-controls="lovely-mobile-menu"
              onClick={() => setMenuOpen(true)}
            >
              <LuMenu {...iconProps} />
            </button>
            <button
              type="button"
              className="hidden size-6 items-center justify-center lg:inline-flex"
              aria-label="Recherche"
            >
              <LuSearch {...iconProps} />
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

          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex h-[31px] min-w-0 items-center justify-center"
          >
            <span className="lw-logo text-[26px] leading-none tracking-normal lg:text-[28px]">
              Lovely Invitations
            </span>
          </button>

          <div className="flex h-[31px] w-[60px] shrink-0 items-center justify-end gap-3 lg:h-auto lg:w-auto lg:gap-4">
            <button
              type="button"
              className="inline-flex size-6 items-center justify-center"
              aria-label="Compte"
              onClick={goUser}
            >
              <LuUser {...iconProps} />
            </button>
            <button
              type="button"
              className="relative inline-flex size-6 items-center justify-center"
              aria-label="Panier"
              onClick={() => navigate("/cart")}
            >
              <LuShoppingBag {...iconProps} />
              {itemCount > 0 ? (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-lw-text px-1 text-[10px] text-white">
                  {itemCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        {showToggle ? (
          <div className="flex justify-center px-4 pb-3 pt-6 lg:pb-7 lg:pt-4">
            {/* Figma Switcher: 244×48; ~24px sous le logo, 12px avant le hero */}
            <div
              className="inline-flex h-12 w-[244px] items-center gap-1 rounded-full bg-white p-1 shadow-sm ring-1 ring-lw-line/80 lg:w-[280px]"
              role="tablist"
              aria-label="Type d'invitation"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mode === "digitale"}
                className={
                  mode === "digitale"
                    ? "flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-[#c4a69c] px-3 font-urbanist text-[14px] font-semibold leading-none text-white"
                    : "flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-transparent px-3 font-urbanist text-[14px] font-medium leading-none text-lw-text"
                }
                onClick={() => {
                  if (mode !== "digitale") navigate("/");
                }}
              >
                <FiSmartphone className="size-[16px] shrink-0" aria-hidden />
                Digitale
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "imprimee"}
                className={
                  mode === "imprimee"
                    ? "flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-[#c4a69c] px-3 font-urbanist text-[14px] font-semibold leading-none text-white"
                    : "flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-transparent px-3 font-urbanist text-[14px] font-medium leading-none text-lw-text"
                }
                onClick={() => {
                  if (mode !== "imprimee") navigate("/imprimee");
                }}
              >
                <FiPrinter className="size-[16px] shrink-0" aria-hidden />
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
