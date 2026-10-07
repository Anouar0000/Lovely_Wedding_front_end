import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useCart } from "../../context/CartContext";

/**
 * Menu mobile Lovely — liens vitrine (header desktop).
 * @param {boolean} open
 * @param {() => void} onClose
 * @param {"digitale" | "imprimee" | "none"} mode
 */
function LovelyMobileDrawer({ open, onClose, mode = "digitale" }) {
  const navigate = useNavigate();
  const { user, loading, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();

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

  const goAccount = () => {
    if (loading) return;
    onClose();
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(isAdmin ? "/dashboard" : "/espace-client");
  };

  const handleLogout = async () => {
    await logout();
    onClose();
    navigate("/");
  };

  const collectionPath =
    mode === "imprimee" ? "/invitations-physique" : "/invitations-digital";

  const linkClass =
    "block w-full border-b border-lw-line py-4 text-left font-urbanist text-[16px] font-medium text-lw-text transition-colors hover:text-lw-accent";

  return (
    <div
      className={`fixed inset-0 z-[70] lg:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        aria-label="Fermer le menu"
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`absolute left-0 top-0 flex h-full w-[min(100%,320px)] flex-col bg-white shadow-xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-lw-line px-5 py-4">
          <span className="lw-logo text-[18px]">Lovely Invitations</span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-[5px] text-lw-text hover:bg-lw-surface"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-2">
          <button type="button" className={linkClass} onClick={() => go("/")}>
            Accueil digitale
          </button>
          <button type="button" className={linkClass} onClick={() => go("/imprimee")}>
            Accueil imprimée
          </button>
          <button type="button" className={linkClass} onClick={() => go(collectionPath)}>
            Collection
          </button>
          <button
            type="button"
            className={linkClass}
            onClick={() => go("/invitations-digital")}
          >
            Invitations digitales
          </button>
          <button
            type="button"
            className={linkClass}
            onClick={() => go("/invitations-physique")}
          >
            Invitations physiques
          </button>
          <button
            type="button"
            className={linkClass}
            onClick={() => {
              onClose();
              if (window.location.pathname === "/" || window.location.pathname === "/imprimee") {
                const el = document.getElementById("faq");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                  return;
                }
              }
              navigate("/#faq");
            }}
          >
            FAQ
          </button>
          <button type="button" className={linkClass} onClick={goAccount}>
            {user ? (isAdmin ? "Dashboard" : "Mon espace") : "Connexion"}
          </button>
          <button type="button" className={linkClass} onClick={() => go("/cart")}>
            Panier{itemCount > 0 ? ` (${itemCount})` : ""}
          </button>
        </nav>

        <div className="border-t border-lw-line px-5 py-4">
          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-[5px] border border-lw-line py-3 font-urbanist text-[14px] font-semibold text-lw-text"
            >
              Déconnexion
            </button>
          ) : (
            <button
              type="button"
              onClick={() => go("/signup")}
              className="lw-btn w-full"
            >
              Créer un compte
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}

export default LovelyMobileDrawer;
