import React, { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import DigitalHomeHeader from "../components/home/DigitalHomeHeader";
import DigitalHomeFooter from "../components/home/DigitalHomeFooter";
import { useCart } from "../context/CartContext";
import { useAuth } from "../components/auth/AuthProvider";
import { createOrder } from "../services/orders";
import { createFlouciPaymentSession, isFlouciLiveMode } from "../services/payments";

const fieldClass =
  "w-full rounded-[5px] border border-[#A19A9A] bg-white px-4 py-3 font-glacial text-[14px] leading-[18px] tracking-normal text-[#4B4242] outline-none transition focus:border-[#A97C72] disabled:opacity-60";

function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  const hasPhysical = useMemo(
    () => items.some((item) => item.productType === "physical"),
    [items]
  );

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (hasPhysical && (!address.trim() || !city.trim())) {
        throw new Error("Adresse et ville requises pour les invitations imprimées.");
      }

      const orderId = await createOrder({
        items,
        userId: user?.uid || null,
        customer: { fullName, email, phone },
        shipping: hasPhysical
          ? { address, city, notes }
          : notes.trim()
            ? { address: "", city: "", notes }
            : null,
      });

      const origin = window.location.origin;
      const successLink = `${origin}/payment/result?status=success&orderId=${encodeURIComponent(orderId)}`;
      const failLink = `${origin}/payment/result?status=fail&orderId=${encodeURIComponent(orderId)}`;

      if (isFlouciLiveMode()) {
        const payment = await createFlouciPaymentSession({
          orderId,
          successLink,
          failLink,
        });
        clearCart();
        window.location.href = payment.link;
        return;
      }

      clearCart();
      window.location.href = `/order-confirmation/${orderId}?payment=pending`;
    } catch (submitError) {
      setError(String(submitError?.message || submitError?.code || "Impossible de créer la commande."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white font-glacial text-[#4B4242]">
      <DigitalHomeHeader mode="none" />

      <main className="mx-auto w-full max-w-[428px] flex-1 px-4 pb-12 pt-6 md:max-w-3xl lg:grid lg:max-w-6xl lg:grid-cols-[1.2fr_0.8fr] lg:gap-10 lg:px-8 lg:pb-16 lg:pt-10">
        <section>
          <nav className="flex flex-wrap items-center gap-2 text-[14px] leading-[18px] text-[#4B4242]">
            <Link to="/" className="font-normal hover:text-[#A97C72]">
              Accueil
            </Link>
            <span aria-hidden className="text-[#78716C]">
              ›
            </span>
            <Link to="/cart" className="font-normal hover:text-[#A97C72]">
              Panier
            </Link>
            <span aria-hidden className="text-[#78716C]">
              ›
            </span>
            <span className="font-bold">Checkout</span>
          </nav>

          <h1 className="mt-6 font-lora text-[26px] font-medium leading-9 tracking-[-0.26px] text-[#4B4242] lg:text-[36px] lg:leading-tight">
            Vos informations
          </h1>
          <p className="mt-2 font-glacial text-[14px] leading-[18px] tracking-normal text-[#78716C]">
            Renseignez vos coordonnées pour finaliser la commande.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-4 border border-[#C4BBB3] bg-[#F7F2EC] p-5 lg:p-6"
          >
            <label className="block">
              <span className="mb-2 block font-glacial text-[14px] font-bold text-[#4B4242]">
                Nom complet
              </span>
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={fieldClass}
              />
            </label>

            <label className="block">
              <span className="mb-2 block font-glacial text-[14px] font-bold text-[#4B4242]">
                Email
              </span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldClass}
              />
            </label>

            <label className="block">
              <span className="mb-2 block font-glacial text-[14px] font-bold text-[#4B4242]">
                Téléphone
              </span>
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={fieldClass}
              />
            </label>

            {hasPhysical ? (
              <>
                <label className="block">
                  <span className="mb-2 block font-glacial text-[14px] font-bold text-[#4B4242]">
                    Adresse
                  </span>
                  <input
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block font-glacial text-[14px] font-bold text-[#4B4242]">
                    Ville
                  </span>
                  <input
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={fieldClass}
                  />
                </label>
              </>
            ) : null}

            <label className="block">
              <span className="mb-2 block font-glacial text-[14px] font-bold text-[#4B4242]">
                Notes (optionnel)
              </span>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={fieldClass}
              />
            </label>

            {error ? (
              <p className="font-glacial text-[14px] font-bold text-red-700">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#A97C72] px-5 font-glacial text-[14px] font-bold text-white shadow-[0px_8px_20px_rgba(168,125,115,0.28)] hover:bg-[#966B62] disabled:opacity-60"
            >
              {submitting
                ? "Redirection..."
                : isFlouciLiveMode()
                  ? "Payer avec Flouci"
                  : "Confirmer la commande"}
            </button>

            <p className="text-center font-glacial text-[14px] leading-[18px] tracking-normal text-[#78716C]">
              {isFlouciLiveMode()
                ? "Vous serez redirigé vers Flouci pour payer."
                : "Mode local : commande créée en attente de paiement."}
            </p>
          </form>
        </section>

        <aside className="mt-8 h-fit border border-[#C4BBB3] bg-white p-5 lg:mt-[4.5rem] lg:p-6">
          <h2 className="font-lora text-[22px] font-medium leading-[34px] tracking-[-0.22px] text-[#4B4242] lg:text-[28px]">
            Récapitulatif
          </h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li
                key={item.lineId}
                className="flex justify-between gap-3 border-b border-[#C4BBB3] pb-3 font-glacial text-[14px] leading-[18px] tracking-normal text-[#4B4242]"
              >
                <span>
                  {item.title} × {item.qty}
                </span>
                <span className="font-bold">{(item.qty * item.unitPrice).toFixed(0)} DT</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between font-lora text-[22px] font-medium leading-[34px] tracking-[-0.22px] text-[#4B4242]">
            <span>Total</span>
            <span>{subtotal.toFixed(0)} DT</span>
          </div>
          <Link
            to="/cart"
            className="mt-4 inline-block font-glacial text-[14px] font-bold text-[#A97C72] underline-offset-4 hover:underline"
          >
            Retour au panier
          </Link>
        </aside>
      </main>

      <DigitalHomeFooter />
    </div>
  );
}

export default CheckoutPage;
