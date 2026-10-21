import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiTrash2 } from "react-icons/fi";
import { isAbortError } from "../../lib/firebase";
import {
  deleteOrder,
  getOrderById,
  ORDER_STATUS_LABELS,
  ORDER_STATUSES,
  updateOrderStatus,
} from "../../services/orders";

function formatDate(value) {
  if (!value) return "—";
  const date = value?.toDate?.() || (value?.seconds ? new Date(value.seconds * 1000) : null);
  if (!date) return "—";
  return date.toLocaleString("fr-FR");
}

function AdminOrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getOrderById(orderId);
        if (!active) return;
        if (!data) {
          setError("Commande introuvable.");
          setOrder(null);
        } else {
          setOrder(data);
          setStatus(data.status || ORDER_STATUSES.PENDING_PAYMENT);
        }
      } catch (err) {
        if (active && !isAbortError(err)) setError("Impossible de charger la commande.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [orderId]);

  const handleSaveStatus = async () => {
    setBusy(true);
    setError("");
    try {
      await updateOrderStatus(orderId, status);
      setOrder((current) => (current ? { ...current, status } : current));
    } catch (err) {
      setError("Impossible de mettre à jour le statut.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Supprimer définitivement cette commande ?")) return;
    setBusy(true);
    try {
      await deleteOrder(orderId);
      navigate("/dashboard/orders");
    } catch (err) {
      setError("Impossible de supprimer la commande.");
      setBusy(false);
    }
  };

  if (loading) {
    return <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#7D6E66]">Chargement…</p>;
  }

  if (!order) {
    return (
      <div>
        <p className="text-sm font-semibold text-red-700">{error || "Commande introuvable."}</p>
        <Link to="/dashboard/orders" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#A97C72]">
          <FiArrowLeft /> Retour
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/dashboard/orders"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#A97C72] hover:underline"
      >
        <FiArrowLeft aria-hidden /> Commandes
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-lora text-[28px] font-medium text-[#4B4242]">Commande</h2>
          <p className="mt-1 font-mono text-xs text-[#7D6E66]">{order.id}</p>
          <p className="mt-1 text-sm text-[#7D6E66]">{formatDate(order.createdAt)}</p>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-[5px] border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-50"
        >
          <FiTrash2 aria-hidden /> Supprimer
        </button>
      </div>

      {error ? (
        <p className="mt-4 rounded-[5px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      <section className="mt-6 rounded-[8px] border border-[#E8E0D8] bg-white p-5">
        <h3 className="font-lora text-[18px] font-medium">Statut</h3>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-[5px] border border-[#E8E0D8] px-3 py-2 text-sm outline-none focus:border-[#A97C72]"
          >
            {Object.values(ORDER_STATUSES).map((s) => (
              <option key={s} value={s}>
                {ORDER_STATUS_LABELS[s] || s}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleSaveStatus}
            disabled={busy || status === order.status}
            className="rounded-[5px] bg-[#A97C72] px-4 py-2 text-sm font-bold uppercase text-white disabled:opacity-40"
          >
            Enregistrer
          </button>
        </div>
      </section>

      <section className="mt-4 rounded-[8px] border border-[#E8E0D8] bg-white p-5">
        <h3 className="font-lora text-[18px] font-medium">Client</h3>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-[#7D6E66]">Nom</dt>
            <dd className="font-semibold">{order.customer?.fullName || "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[#7D6E66]">Email</dt>
            <dd>{order.customer?.email || "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[#7D6E66]">Téléphone</dt>
            <dd>{order.customer?.phone || "—"}</dd>
          </div>
        </dl>
      </section>

      {order.shipping ? (
        <section className="mt-4 rounded-[8px] border border-[#E8E0D8] bg-white p-5">
          <h3 className="font-lora text-[18px] font-medium">Livraison</h3>
          <p className="mt-3 text-sm">{order.shipping.address}</p>
          <p className="text-sm text-[#7D6E66]">{order.shipping.city}</p>
          {order.shipping.notes ? (
            <p className="mt-2 text-sm text-[#7D6E66]">{order.shipping.notes}</p>
          ) : null}
        </section>
      ) : null}

      <section className="mt-4 rounded-[8px] border border-[#E8E0D8] bg-white p-5">
        <h3 className="font-lora text-[18px] font-medium">Articles</h3>
        <ul className="mt-3 divide-y divide-[#E8E0D8]">
          {(order.items || []).map((item, index) => (
            <li key={`${item.productId}-${index}`} className="flex items-start justify-between gap-4 py-3 text-sm">
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-[#7D6E66]">
                  {item.qty} × {item.unitPrice} DT
                  {item.format ? ` · ${item.format}` : ""}
                  {item.motif ? ` · ${item.motif}` : ""}
                </p>
              </div>
              <p className="font-semibold">{(Number(item.qty) || 0) * (Number(item.unitPrice) || 0)} DT</p>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-[#E8E0D8] pt-3 text-sm font-bold">
          <span>Total</span>
          <span>
            {order.totals?.subtotal ?? 0} {order.totals?.currency || "DT"}
          </span>
        </div>
      </section>
    </div>
  );
}

export default AdminOrderDetailPage;
