import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiRefreshCw, FiSearch } from "react-icons/fi";
import { isAbortError } from "../../lib/firebase";
import {
  listAllOrders,
  ORDER_STATUS_LABELS,
  ORDER_STATUSES,
} from "../../services/orders";

function formatDate(value) {
  if (!value) return "—";
  const date = value?.toDate?.() || (value?.seconds ? new Date(value.seconds * 1000) : null);
  if (!date) return "—";
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusBadgeClass(status) {
  if (status === ORDER_STATUSES.PAID || status === ORDER_STATUSES.FULFILLED) {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }
  if (status === ORDER_STATUSES.CANCELLED) {
    return "border-red-200 bg-red-50 text-red-700";
  }
  return "border-amber-200 bg-amber-50 text-amber-800";
}

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setOrders(await listAllOrders());
    } catch (err) {
      if (!isAbortError(err)) setError("Impossible de charger les commandes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      if (!matchesStatus) return false;
      if (!term) return true;
      const hay = [
        order.id,
        order.customer?.fullName,
        order.customer?.email,
        order.customer?.phone,
        order.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(term);
    });
  }, [orders, searchTerm, statusFilter]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-lora text-[28px] font-medium text-[#4B4242] lg:text-[36px]">Commandes</h2>
          <p className="mt-1 text-sm text-[#7D6E66]">{orders.length} commande(s) au total.</p>
        </div>
        <button
          type="button"
          onClick={loadOrders}
          className="inline-flex items-center gap-2 rounded-[5px] border border-[#E8E0D8] bg-white px-4 py-3 text-sm font-semibold"
        >
          <FiRefreshCw aria-hidden /> Actualiser
        </button>
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto]">
        <label className="relative block">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7D6E66]" aria-hidden />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher nom, email, id…"
            className="w-full rounded-[5px] border border-[#E8E0D8] bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-[#A97C72]"
          />
        </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-[5px] border border-[#E8E0D8] bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#A97C72]"
        >
          <option value="all">Tous les statuts</option>
          {Object.values(ORDER_STATUSES).map((status) => (
            <option key={status} value={status}>
              {ORDER_STATUS_LABELS[status] || status}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <p className="mb-4 rounded-[5px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-[8px] border border-[#E8E0D8] bg-white shadow-sm">
        <div className="hidden grid-cols-[1.2fr_1fr_0.8fr_0.7fr_0.6fr] gap-4 border-b border-[#E8E0D8] bg-[#F7F2EC] px-5 py-4 text-sm font-semibold text-[#7D6E66] md:grid">
          <span>Client</span>
          <span>Email</span>
          <span>Total</span>
          <span>Statut</span>
          <span>Date</span>
        </div>

        {loading ? (
          <p className="px-5 py-12 text-center text-sm font-semibold uppercase tracking-[0.16em] text-[#7D6E66]">
            Chargement
          </p>
        ) : null}

        {!loading && filtered.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-[#7D6E66]">Aucune commande.</p>
        ) : null}

        {!loading && filtered.length > 0 ? (
          <div className="divide-y divide-[#E8E0D8]">
            {filtered.map((order) => (
              <Link
                key={order.id}
                to={`/dashboard/orders/${order.id}`}
                className="grid grid-cols-1 gap-2 px-5 py-4 text-sm hover:bg-[#FAFAF8] md:grid-cols-[1.2fr_1fr_0.8fr_0.7fr_0.6fr] md:items-center md:gap-4"
              >
                <div>
                  <p className="font-semibold">{order.customer?.fullName || "—"}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-[#7D6E66]">{order.id}</p>
                </div>
                <span className="text-[#7D6E66]">{order.customer?.email || "—"}</span>
                <span className="font-semibold">
                  {order.totals?.subtotal ?? 0} {order.totals?.currency || "DT"}
                </span>
                <span>
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusBadgeClass(
                      order.status
                    )}`}
                  >
                    {ORDER_STATUS_LABELS[order.status] || order.status}
                  </span>
                </span>
                <span className="text-[#7D6E66]">{formatDate(order.createdAt)}</span>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default AdminOrdersPage;
