import React, { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import DigitalHomeHeader from "../components/home/DigitalHomeHeader";
import DigitalHomeFooter from "../components/home/DigitalHomeFooter";
import { useCart } from "../context/CartContext";
import { useAuth } from "../components/auth/AuthProvider";
import { createOrder } from "../services/orders";
import { createFlouciPaymentSession, isFlouciLiveMode } from "../services/payments";

const fieldClass =
  "w-full rounded-[5px] border border-lw-line bg-white px-4 py-3 outline-none focus:border-lw-accent";

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
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white font-urbanist text-lw-text">
      <DigitalHomeHeader mode="none" />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 lg:grid lg:grid-cols-[1.2fr_0.8fr] lg:gap-10 lg:px-8 lg:py-16">
        <section>
          <nav className="flex items-center gap-2 text-[14px] text-lw-text">
            <Link to="/" className="hover:text-lw-accent">
              Accueil
            </Link>
            <span aria-hidden>›</span>
            <Link to="/cart" className="hover:text-lw-accent">
              Panier
            </Link>
            <span aria-hidden>›</span>
            <span className="font-bold">Checkout</span>
          </nav>

          <h1 className="mt-6 lw-h1 lg:text-[40px] lg:leading-tight">
            Vos informations
          </h1>
          <p className="mt-2 lw-body lg:text-[16px]">
            Renseignez vos coordonnées pour finaliser la commande.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-[5px] bg-[#fffaed] p-5 lg:p-6">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Nom complet</span>
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={fieldClass}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Email</span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldClass}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Téléphone</span>
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
                  <span className="mb-2 block text-sm font-semibold">Adresse</span>
                  <input
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold">Ville</span>
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
              <span className="mb-2 block text-sm font-semibold">Notes (optionnel)</span>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={fieldClass}
              />
            </label>

            {error ? <p className="text-sm font-semibold text-red-700">{error}</p> : null}

            <button
              type="submit"
              disabled={submitting}
              className="h-[42px] w-full rounded-[5px] bg-lw-accent px-5 text-sm font-bold uppercase tracking-wide text-white hover:bg-lw-accentDark disabled:opacity-60"
            >
              {submitting
                ? "Redirection..."
                : isFlouciLiveMode()
                  ? "Payer avec Flouci"
                  : "Confirmer la commande"}
            </button>

            <p className="text-center text-sm text-lw-muted">
              {isFlouciLiveMode()
                ? "Vous serez redirigé vers Flouci pour payer."
                : "Mode local : commande créée en attente de paiement."}
            </p>
          </form>
        </section>

        <aside className="mt-8 h-fit rounded-[5px] border border-lw-line bg-white p-5 lg:mt-14 lg:p-6">
          <h2 className="lw-h2 lg:text-[28px]">Récapitulatif</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {items.map((item) => (
              <li
                key={item.lineId}
                className="flex justify-between gap-3 border-b border-lw-line pb-3"
              >
                <span>
                  {item.title} × {item.qty}
                </span>
                <span className="font-semibold">{(item.qty * item.unitPrice).toFixed(0)} DT</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between font-abhaya text-[22px] font-medium">
            <span>Total</span>
            <span>{subtotal.toFixed(0)} DT</span>
          </div>
          <Link to="/cart" className="mt-4 inline-block text-sm font-semibold text-lw-text underline">
            Retour au panier
          </Link>
        </aside>
      </main>

      <DigitalHomeFooter />
    </div>
  );
}

export default CheckoutPage;
