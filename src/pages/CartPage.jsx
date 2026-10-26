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
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white font-glacial text-[#4B4242]">
      <DigitalHomeHeader mode="none" />

      <main className="mx-auto w-full max-w-[428px] flex-1 px-4 pb-12 pt-6 md:max-w-3xl lg:max-w-6xl lg:px-8 lg:pb-16 lg:pt-10">
        <nav className="flex flex-wrap items-center gap-2 text-[14px] leading-[18px] text-[#4B4242]">
          <Link to="/" className="font-normal hover:text-[#A97C72]">
            Accueil
          </Link>
          <span aria-hidden className="text-[#78716C]">
            ›
          </span>
          <span className="font-bold">Panier</span>
        </nav>

        <h1 className="mt-6 text-center font-lora text-[26px] font-medium leading-9 tracking-[-0.26px] text-[#4B4242] lg:text-left lg:text-[36px] lg:leading-tight">
          Panier
        </h1>
        <p className="mx-auto mt-2 max-w-[280px] text-center font-glacial text-[14px] leading-[18px] tracking-normal text-[#78716C] lg:mx-0 lg:max-w-none lg:text-left">
          Vérifiez vos articles avant de finaliser la commande.
        </p>

        {items.length === 0 ? (
          <div className="mt-10 border border-[#C4BBB3] bg-[#F7F2EC] px-6 py-10 text-center">
            <p className="font-lora text-[22px] font-medium leading-[34px] tracking-[-0.22px] text-[#4B4242]">
              Votre panier est vide
            </p>
            <p className="mt-2 font-glacial text-[14px] leading-[18px] text-[#78716C]">
              Découvrez nos collections digitales et imprimées.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/invitations-physique"
                className="inline-flex h-12 min-w-[200px] items-center justify-center rounded-full border border-[#A97C72] bg-white px-5 font-glacial text-[14px] font-bold text-[#A97C72]"
              >
                Invitations imprimées
              </Link>
              <Link
                to="/invitations-digital"
                className="inline-flex h-12 min-w-[200px] items-center justify-center rounded-full bg-[#A97C72] px-5 font-glacial text-[14px] font-bold text-white shadow-[0px_8px_20px_rgba(168,125,115,0.28)] hover:bg-[#966B62]"
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
                className="flex flex-col gap-4 border border-[#C4BBB3] bg-white p-5 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-glacial text-[11px] font-bold uppercase tracking-[0.16em] text-[#A97C72]">
                    {item.productType === "digital" ? "Digital" : "Imprimé"}
                  </p>
                  <h2 className="mt-1 font-lora text-[22px] font-medium leading-[34px] tracking-[-0.22px] text-[#4B4242] lg:text-[26px]">
                    {item.title}
                  </h2>
                  {(item.format || item.motif) && (
                    <p className="mt-1 font-glacial text-[14px] leading-[18px] tracking-normal text-[#78716C]">
                      {[item.format, item.motif].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  <p className="mt-2 font-glacial text-[14px] font-bold leading-6 text-[#4B4242]">
                    {item.unitPrice} DT / unité
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="inline-flex items-center rounded-[5px] border border-[#C4BBB3] bg-[#F7F2EC]">
                    <button
                      type="button"
                      className="px-3 py-2 text-[#4B4242]"
                      onClick={() => updateQty(item.lineId, item.qty - 1)}
                      aria-label="Diminuer"
                    >
                      <FiMinus />
                    </button>
                    <span className="min-w-[2rem] text-center font-glacial text-[14px] font-bold text-[#4B4242]">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      className="px-3 py-2 text-[#4B4242]"
                      onClick={() => updateQty(item.lineId, item.qty + 1)}
                      aria-label="Augmenter"
                    >
                      <FiPlus />
                    </button>
                  </div>

                  <p className="min-w-[5rem] text-right font-glacial text-[16px] font-bold leading-6 text-[#4B4242]">
                    {(item.qty * item.unitPrice).toFixed(0)} DT
                  </p>

                  <button
                    type="button"
                    onClick={() => removeItem(item.lineId)}
                    className="text-[#78716C] hover:text-red-700"
                    aria-label="Supprimer"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </article>
            ))}

            <div className="border border-[#C4BBB3] bg-[#F7F2EC] p-5 lg:p-6">
              <div className="flex items-center justify-between font-lora text-[22px] font-medium leading-[34px] tracking-[-0.22px] text-[#4B4242] lg:text-[28px]">
                <span>Sous-total</span>
                <span>{subtotal.toFixed(0)} DT</span>
              </div>
              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#A97C72] px-5 font-glacial text-[14px] font-bold text-white shadow-[0px_8px_20px_rgba(168,125,115,0.28)] hover:bg-[#966B62]"
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
