import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DigitalHomeHeader from "../components/home/DigitalHomeHeader";
import DigitalHomeFooter from "../components/home/DigitalHomeFooter";
import { getOrderById } from "../services/orders";

function OrderConfirmationPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getOrderById(orderId);
        if (!mounted) return;
        if (!data) {
          setError("Commande introuvable.");
          return;
        }
        setOrder(data);
      } catch {
        if (mounted) setError("Impossible de charger la commande.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [orderId]);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white font-urbanist text-lw-text">
      <DigitalHomeHeader mode="none" />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 lg:px-8 lg:py-16">
        <p className="text-center font-urbanist text-xs font-semibold uppercase tracking-[0.22em] text-lw-accent lg:text-left">
          Confirmation
        </p>
        <h1 className="mt-3 text-center lw-h1 lg:text-left lg:text-[40px] lg:leading-tight">
          Commande reçue
        </h1>
        <p className="mx-auto mt-2 max-w-[280px] text-center text-[14px] text-lw-muted lg:mx-0 lg:max-w-none lg:text-left">
          Merci — nous avons bien enregistré votre commande.
        </p>

        {loading ? (
          <p className="mt-8 text-lw-muted">Chargement...</p>
        ) : error ? (
          <p className="mt-8 font-semibold text-red-700">{error}</p>
        ) : (
          <div className="mt-8 space-y-4 rounded-[5px] bg-[#fffaed] p-6">
            <p>
              Numéro : <span className="font-semibold">{order.id}</span>
            </p>
            <p>
              Statut :{" "}
              <span className="font-semibold">
                {order.status === "pending_payment"
                  ? "En attente de paiement"
                  : order.status}
              </span>
            </p>
            <p>
              Client : {order.customer?.fullName} ({order.customer?.email})
            </p>

            <ul className="space-y-2 border-t border-lw-line pt-4 text-sm">
              {(order.items || []).map((item, index) => (
                <li key={`${item.productId}-${index}`} className="flex justify-between gap-3">
                  <span>
                    {item.title} × {item.qty}
                  </span>
                  <span className="font-semibold">
                    {(item.qty * item.unitPrice).toFixed(0)} DT
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex justify-between border-t border-lw-line pt-4 font-abhaya text-[22px] font-medium">
              <span>Total</span>
              <span>{Number(order.totals?.subtotal || 0).toFixed(0)} DT</span>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
          <Link
            to="/"
            className="inline-flex h-[42px] items-center justify-center rounded-[5px] bg-lw-accent px-6 text-sm font-bold uppercase text-white hover:bg-lw-accentDark"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            to="/invitations-digital"
            className="inline-flex h-[42px] items-center justify-center rounded-[5px] border border-lw-accent bg-white px-6 text-sm font-bold uppercase text-lw-accent"
          >
            Continuer
          </Link>
        </div>
      </main>

      <DigitalHomeFooter />
    </div>
  );
}

export default OrderConfirmationPage;
