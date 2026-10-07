import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import DigitalHomeHeader from "../components/home/DigitalHomeHeader";
import DigitalHomeFooter from "../components/home/DigitalHomeFooter";
import { getOrderById } from "../services/orders";
import { verifyFlouciPaymentSession } from "../services/payments";

function PaymentResultPage() {
  const [params] = useSearchParams();
  const statusParam = params.get("status") || "";
  const orderId = params.get("orderId") || "";
  const paymentId =
    params.get("payment_id") || params.get("paymentId") || params.get("id") || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);
  const [paid, setPaid] = useState(false);

  const isFail = useMemo(
    () => statusParam === "fail" || statusParam === "failed",
    [statusParam]
  );

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      if (!orderId) {
        setError("Commande introuvable (orderId manquant).");
        setLoading(false);
        return;
      }

      try {
        if (!isFail && paymentId) {
          const verify = await verifyFlouciPaymentSession({ orderId, paymentId });
          if (!mounted) return;
          setPaid(Boolean(verify?.paid));
        }

        const data = await getOrderById(orderId);
        if (!mounted) return;
        if (!data) {
          setError("Commande introuvable.");
          return;
        }
        setOrder(data);
        if (data.status === "paid") setPaid(true);
      } catch (err) {
        if (!mounted) return;
        try {
          const data = await getOrderById(orderId);
          if (mounted && data) {
            setOrder(data);
            setPaid(data.status === "paid");
          }
        } catch {
          // ignore
        }
        setError(err?.message || "Vérification paiement impossible.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [orderId, paymentId, isFail]);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white font-urbanist text-lw-text">
      <DigitalHomeHeader mode="none" />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 lg:px-8 lg:py-16">
        <p className="text-center font-urbanist text-xs font-semibold uppercase tracking-[0.22em] text-lw-accent lg:text-left">
          Paiement
        </p>
        <h1 className="mt-3 text-center lw-h1 lg:text-left lg:text-[40px] lg:leading-tight">
          {isFail ? "Paiement échoué" : paid ? "Paiement réussi" : "Paiement en cours"}
        </h1>

        {loading ? (
          <p className="mt-8 text-lw-muted">Vérification...</p>
        ) : (
          <div className="mt-8 space-y-4 rounded-[5px] bg-[#fffaed] p-6">
            {orderId ? (
              <p>
                Commande : <span className="font-semibold">{orderId}</span>
              </p>
            ) : null}
            {paymentId ? (
              <p>
                Payment ID : <span className="font-semibold">{paymentId}</span>
              </p>
            ) : null}
            {order ? (
              <p>
                Statut commande : <span className="font-semibold">{order.status}</span>
              </p>
            ) : null}
            {error ? <p className="font-semibold text-amber-700">{error}</p> : null}
            {isFail ? (
              <p className="text-sm text-lw-muted">
                Le paiement n&apos;a pas abouti. Vous pouvez réessayer depuis le panier.
              </p>
            ) : null}
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
          {orderId ? (
            <Link
              to={`/order-confirmation/${orderId}`}
              className="inline-flex h-[42px] items-center justify-center rounded-[5px] bg-lw-accent px-6 text-sm font-bold uppercase text-white hover:bg-lw-accentDark"
            >
              Voir la confirmation
            </Link>
          ) : null}
          <Link
            to="/cart"
            className="inline-flex h-[42px] items-center justify-center rounded-[5px] border border-lw-accent bg-white px-6 text-sm font-bold uppercase text-lw-accent"
          >
            Panier
          </Link>
          <Link
            to="/"
            className="inline-flex h-[42px] items-center justify-center rounded-[5px] border border-lw-line bg-white px-6 text-sm font-semibold"
          >
            Accueil
          </Link>
        </div>
      </main>

      <DigitalHomeFooter />
    </div>
  );
}

export default PaymentResultPage;
