import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import DigitalHomeHeader from "../components/home/DigitalHomeHeader";
import DigitalHomeFooter from "../components/home/DigitalHomeFooter";
import { useCart } from "../context/CartContext";

function CartPage() {
  const navigate = useNavigate();
  const { items, subtotal, updateQty, removeItem } = useCart();

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white font-urbanist text-lw-text">
      <DigitalHomeHeader mode="none" />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 lg:px-8 lg:py-16">
        <nav className="flex items-center gap-2 text-[14px] text-lw-text">
          <Link to="/" className="hover:text-lw-accent">
            Accueil
          </Link>
          <span aria-hidden>›</span>
          <span className="font-bold">Panier</span>
        </nav>

        <h1 className="mt-6 text-center lw-h1 lg:text-left lg:text-[40px] lg:leading-tight">
          Panier
        </h1>
        <p className="mx-auto mt-2 max-w-[280px] text-center lw-body lg:mx-0 lg:max-w-none lg:text-left lg:text-[16px]">
          Vérifiez vos articles avant de finaliser la commande.
        </p>

        {items.length === 0 ? (
          <div className="mt-10 rounded-[5px] bg-[#fffaed] px-6 py-10 text-center">
            <p className="font-abhaya text-[22px] font-medium text-lw-text">Votre panier est vide</p>
            <p className="mt-2 text-sm text-lw-muted">Découvrez nos collections digitales et imprimées.</p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/invitations-physique"
                className="inline-flex h-[42px] min-w-[200px] items-center justify-center rounded-[5px] border border-lw-accent bg-white px-4 text-sm font-bold uppercase text-lw-accent"
              >
                Invitations imprimées
              </Link>
              <Link
                to="/invitations-digital"
                className="inline-flex h-[42px] min-w-[200px] items-center justify-center rounded-[5px] bg-lw-accent px-4 text-sm font-bold uppercase text-white hover:bg-lw-accentDark"
              >
                Invitations digitales
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-4 lg:mt-10">
            {items.map((item) => (
              <article
                key={item.lineId}
                className="flex flex-col gap-4 rounded-[5px] border border-lw-line bg-white p-5 lg:flex-row lg:items-center lg:justify-between"
              >
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-lw-accent">
                    {item.productType === "digital" ? "Digital" : "Imprimé"}
                  </p>
                  <h2 className="mt-1 font-abhaya text-[22px] font-medium text-lw-text lg:text-[26px]">{item.title}</h2>
                  {(item.format || item.motif) && (
                    <p className="mt-1 text-sm text-lw-muted">
                      {[item.format, item.motif].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  <p className="mt-2 text-sm font-semibold text-lw-text">{item.unitPrice} DT / unité</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="inline-flex items-center rounded-[5px] border border-lw-line">
                    <button
                      type="button"
                      className="px-3 py-2"
                      onClick={() => updateQty(item.lineId, item.qty - 1)}
                      aria-label="Diminuer"
                    >
                      <FiMinus />
                    </button>
                    <span className="min-w-[2rem] text-center font-semibold">{item.qty}</span>
                    <button
                      type="button"
                      className="px-3 py-2"
                      onClick={() => updateQty(item.lineId, item.qty + 1)}
                      aria-label="Augmenter"
                    >
                      <FiPlus />
                    </button>
                  </div>

                  <p className="min-w-[5rem] text-right font-semibold">
                    {(item.qty * item.unitPrice).toFixed(0)} DT
                  </p>

                  <button
                    type="button"
                    onClick={() => removeItem(item.lineId)}
                    className="text-lw-muted hover:text-red-700"
                    aria-label="Supprimer"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </article>
            ))}

            <div className="rounded-[5px] bg-[#fffaed] p-5 lg:p-6">
              <div className="flex items-center justify-between font-abhaya text-[22px] font-medium lg:text-[28px]">
                <span>Sous-total</span>
                <span>{subtotal.toFixed(0)} DT</span>
              </div>
              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="mt-5 h-[42px] w-full rounded-[5px] bg-lw-accent px-5 text-sm font-bold uppercase tracking-wide text-white hover:bg-lw-accentDark"
              >
                Passer commande
              </button>
            </div>
          </div>
        )}
      </main>

      <DigitalHomeFooter />
    </div>
  );
}

export default CartPage;
