import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowUpRight,
  FiBox,
  FiMail,
  FiShoppingBag,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { isAbortError } from "../../lib/firebase";
import { listAllDigitalInvites } from "../../services/digitalInvites";
import {
  listAllOrders,
  ORDER_STATUS_LABELS,
  ORDER_STATUSES,
} from "../../services/orders";
import { listAllUsers } from "../../services/users";
import { listAllCatalogProducts } from "../../services/catalogProducts";

const ACCENT = "#A97C72";
const MUTED = "#C4A69C";
const LINE = "#E8E0D8";
const SUB = "#7D6E66";

const STATUS_COLORS = {
  [ORDER_STATUSES.PENDING_PAYMENT]: "#E8B84A",
  [ORDER_STATUSES.PAID]: "#5B8F6B",
  [ORDER_STATUSES.FULFILLED]: "#A97C72",
  [ORDER_STATUSES.CANCELLED]: "#C45C5C",
};

function toDate(value) {
  if (!value) return null;
  if (value?.toDate) return value.toDate();
  if (value?.seconds) return new Date(value.seconds * 1000);
  if (value instanceof Date) return value;
  return null;
}

function orderTotal(order) {
  const fromTotals = Number(order?.totals?.subtotal);
  if (Number.isFinite(fromTotals) && fromTotals > 0) return fromTotals;
  return (order?.items || []).reduce(
    (sum, item) => sum + (Number(item.qty) || 0) * (Number(item.unitPrice) || 0),
    0
  );
}

function formatDt(n) {
  return `${Number(n || 0).toLocaleString("fr-FR", { maximumFractionDigits: 0 })} DT`;
}

function weekKey(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1);
  return d.toISOString().slice(0, 10);
}

function weekLabel(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

function ChartTooltip({ active, payload, label, valueSuffix = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[6px] border border-[#E8E0D8] bg-white px-3 py-2 shadow-md">
      {label ? <p className="text-[11px] font-semibold uppercase tracking-wide text-[#7D6E66]">{label}</p> : null}
      {payload.map((entry) => (
        <p key={entry.dataKey || entry.name} className="text-sm font-semibold text-[#4B4242]">
          {entry.name}: {entry.value}
          {valueSuffix}
        </p>
      ))}
    </div>
  );
}

function StatCard({ label, value, hint, to, icon: Icon, tone = "default" }) {
  const toneClass =
    tone === "accent"
      ? "border-[#A97C72]/40 bg-gradient-to-br from-white to-[#F7F2EC]"
      : "border-[#E8E0D8] bg-white";
  return (
    <Link
      to={to}
      className={`group rounded-[10px] border p-5 shadow-sm transition hover:border-[#A97C72] hover:shadow-md ${toneClass}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-glacial text-[11px] font-bold uppercase tracking-[0.16em] text-[#7D6E66]">
            {label}
          </p>
          <p className="mt-2 font-lora text-[30px] font-medium leading-none text-[#4B4242] sm:text-[34px]">
            {value}
          </p>
          {hint ? <p className="mt-2 truncate text-sm text-[#7D6E66]">{hint}</p> : null}
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-[#F7F2EC] text-[#A97C72] transition group-hover:bg-[#A97C72] group-hover:text-white">
          <Icon className="size-5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

function Panel({ title, subtitle, action, children, className = "" }) {
  return (
    <section
      className={`rounded-[10px] border border-[#E8E0D8] bg-white p-5 shadow-sm ${className}`}
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-lora text-[18px] font-medium text-[#4B4242] sm:text-[20px]">{title}</h3>
          {subtitle ? <p className="mt-0.5 text-sm text-[#7D6E66]">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function AdminOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [invites, setInvites] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const [inv, ord, usr, prod] = await Promise.all([
          listAllDigitalInvites(),
          listAllOrders(),
          listAllUsers(),
          listAllCatalogProducts(),
        ]);
        if (!active) return;
        setInvites(inv);
        setOrders(ord);
        setUsers(usr);
        setProducts(prod);
      } catch (err) {
        if (active && !isAbortError(err)) {
          setError("Impossible de charger les indicateurs.");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const invitesPublished = invites.filter((i) => i.status === "published").length;
    const invitesDraft = invites.filter((i) => i.status !== "published").length;
    const ordersPaid = orders.filter(
      (o) => o.status === ORDER_STATUSES.PAID || o.status === ORDER_STATUSES.FULFILLED
    );
    const ordersPending = orders.filter((o) => o.status === ORDER_STATUSES.PENDING_PAYMENT);
    const revenue = ordersPaid.reduce((sum, o) => sum + orderTotal(o), 0);
    const clients = users.filter((u) => u.role !== "admin").length;
    const productsActive = products.filter((p) => p.active).length;
    const digitalProducts = products.filter((p) => p.type === "digital" && p.active).length;
    const physicalProducts = products.filter((p) => p.type === "physical" && p.active).length;
    return {
      invitesPublished,
      invitesDraft,
      ordersPaid: ordersPaid.length,
      ordersPending: ordersPending.length,
      revenue,
      clients,
      productsActive,
      digitalProducts,
      physicalProducts,
      ordersTotal: orders.length,
    };
  }, [invites, orders, users, products]);

  const revenueByWeek = useMemo(() => {
    const weeks = [];
    const now = new Date();
    for (let i = 7; i >= 0; i -= 1) {
      const d = new Date(now);
      d.setDate(d.getDate() - i * 7);
      const key = weekKey(d);
      weeks.push({ key, label: weekLabel(key), revenue: 0, orders: 0 });
    }
    const map = Object.fromEntries(weeks.map((w) => [w.key, w]));
    orders.forEach((order) => {
      if (
        order.status !== ORDER_STATUSES.PAID &&
        order.status !== ORDER_STATUSES.FULFILLED
      ) {
        return;
      }
      const date = toDate(order.createdAt);
      if (!date) return;
      const key = weekKey(date);
      if (!map[key]) return;
      map[key].revenue += orderTotal(order);
      map[key].orders += 1;
    });
    return weeks.map((w) => ({
      ...w,
      revenue: Math.round(w.revenue * 10) / 10,
    }));
  }, [orders]);

  const statusChart = useMemo(() => {
    const counts = {
      [ORDER_STATUSES.PENDING_PAYMENT]: 0,
      [ORDER_STATUSES.PAID]: 0,
      [ORDER_STATUSES.FULFILLED]: 0,
      [ORDER_STATUSES.CANCELLED]: 0,
    };
    orders.forEach((o) => {
      if (counts[o.status] !== undefined) counts[o.status] += 1;
    });
    return Object.entries(counts)
      .filter(([, value]) => value > 0)
      .map(([status, value]) => ({
        status,
        name: ORDER_STATUS_LABELS[status] || status,
        value,
      }));
  }, [orders]);

  const mixChart = useMemo(() => {
    let digital = 0;
    let physical = 0;
    orders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const qty = Number(item.qty) || 0;
        if (item.productType === "digital") digital += qty;
        else if (item.productType === "physical") physical += qty;
      });
    });
    return [
      { name: "Digital", value: digital },
      { name: "Physique", value: physical },
    ];
  }, [orders]);

  const inviteChart = useMemo(
    () => [
      { name: "Publiées", value: stats.invitesPublished },
      { name: "Brouillons", value: stats.invitesDraft },
    ],
    [stats.invitesPublished, stats.invitesDraft]
  );

  const recentOrders = useMemo(() => orders.slice(0, 6), [orders]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-glacial text-[11px] font-bold uppercase tracking-[0.2em] text-[#A97C72]">
            Console pro
          </p>
          <h2 className="mt-1 font-lora text-[28px] font-medium text-[#4B4242] lg:text-[36px]">
            Overview
          </h2>
          <p className="mt-1 text-sm text-[#7D6E66]">
            Performance, commandes et catalogue — Lovely Wedding.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-[8px] border border-[#E8E0D8] bg-white px-4 py-2.5 text-sm font-semibold text-[#7D6E66]">
          <FiTrendingUp className="text-[#A97C72]" aria-hidden />
          {loading ? "Synchronisation…" : "Données Firestore live"}
        </div>
      </div>

      {error ? (
        <p className="rounded-[5px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[118px] animate-pulse rounded-[10px] border border-[#E8E0D8] bg-white"
            />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Chiffre d'affaires"
              value={formatDt(stats.revenue)}
              hint={`${stats.ordersPaid} commande(s) payée(s)`}
              to="/dashboard/orders"
              icon={FiTrendingUp}
              tone="accent"
            />
            <StatCard
              label="Commandes"
              value={stats.ordersTotal}
              hint={`${stats.ordersPending} en attente de paiement`}
              to="/dashboard/orders"
              icon={FiShoppingBag}
            />
            <StatCard
              label="Invitations digitales"
              value={stats.invitesPublished}
              hint={`${stats.invitesDraft} brouillon(s)`}
              to="/dashboard/invitations"
              icon={FiMail}
            />
            <StatCard
              label="Clients"
              value={stats.clients}
              hint={`${stats.productsActive} produits actifs`}
              to="/dashboard/clients"
              icon={FiUsers}
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <Panel
              className="xl:col-span-2"
              title="Revenus (8 semaines)"
              subtitle="Commandes payées / traitées"
              action={
                <Link
                  to="/dashboard/orders"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[#A97C72]"
                >
                  Voir commandes <FiArrowUpRight aria-hidden />
                </Link>
              }
            >
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueByWeek} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="lwRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={ACCENT} stopOpacity={0.35} />
                        <stop offset="100%" stopColor={ACCENT} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={LINE} strokeDasharray="4 4" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: SUB, fontSize: 12 }}
                      axisLine={{ stroke: LINE }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: SUB, fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      width={48}
                    />
                    <Tooltip content={<ChartTooltip valueSuffix=" DT" />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      name="Revenu"
                      stroke={ACCENT}
                      strokeWidth={2.5}
                      fill="url(#lwRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel title="Statut commandes" subtitle="Répartition actuelle">
              <div className="h-[220px] w-full">
                {statusChart.length === 0 ? (
                  <p className="flex h-full items-center justify-center text-sm text-[#7D6E66]">
                    Aucune commande pour l’instant.
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusChart}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={58}
                        outerRadius={86}
                        paddingAngle={3}
                        stroke="#fff"
                        strokeWidth={2}
                      >
                        {statusChart.map((entry) => (
                          <Cell
                            key={entry.status}
                            fill={STATUS_COLORS[entry.status] || MUTED}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              <ul className="mt-1 space-y-1.5">
                {statusChart.map((entry) => (
                  <li
                    key={entry.status}
                    className="flex items-center justify-between text-sm text-[#4B4242]"
                  >
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="size-2.5 rounded-full"
                        style={{ background: STATUS_COLORS[entry.status] || MUTED }}
                      />
                      {entry.name}
                    </span>
                    <span className="font-semibold">{entry.value}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel title="Mix digital / physique" subtitle="Quantités commandées">
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mixChart} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke={LINE} strokeDasharray="4 4" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: SUB, fontSize: 12 }}
                      axisLine={{ stroke: LINE }}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: SUB, fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      width={32}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="value" name="Qté" radius={[6, 6, 0, 0]} maxBarSize={64}>
                      <Cell fill={ACCENT} />
                      <Cell fill={MUTED} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel title="Invitations digitales" subtitle="Publiées vs brouillons">
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={inviteChart} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke={LINE} strokeDasharray="4 4" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: SUB, fontSize: 12 }}
                      axisLine={{ stroke: LINE }}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: SUB, fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      width={32}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="value" name="Invitations" radius={[6, 6, 0, 0]} maxBarSize={64}>
                      <Cell fill="#5B8F6B" />
                      <Cell fill={MUTED} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Panel
              className="lg:col-span-2"
              title="Dernières commandes"
              subtitle="Les 6 plus récentes"
              action={
                <Link
                  to="/dashboard/orders"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[#A97C72]"
                >
                  Tout voir <FiArrowUpRight aria-hidden />
                </Link>
              }
            >
              {recentOrders.length === 0 ? (
                <p className="py-8 text-center text-sm text-[#7D6E66]">Aucune commande.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-[#E8E0D8] text-[11px] font-bold uppercase tracking-[0.12em] text-[#7D6E66]">
                        <th className="pb-2 pr-3 font-bold">Client</th>
                        <th className="pb-2 pr-3 font-bold">Statut</th>
                        <th className="pb-2 pr-3 font-bold">Total</th>
                        <th className="pb-2 font-bold"> </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-[#F0EAE3] last:border-0">
                          <td className="py-3 pr-3">
                            <p className="font-semibold text-[#4B4242]">
                              {order.customer?.fullName || "Client"}
                            </p>
                            <p className="text-xs text-[#7D6E66]">{order.customer?.email || "—"}</p>
                          </td>
                          <td className="py-3 pr-3">
                            <span className="rounded-[5px] border border-[#E8E0D8] bg-[#F7F2EC] px-2 py-1 text-xs font-semibold text-[#4B4242]">
                              {ORDER_STATUS_LABELS[order.status] || order.status}
                            </span>
                          </td>
                          <td className="py-3 pr-3 font-semibold text-[#4B4242]">
                            {formatDt(orderTotal(order))}
                          </td>
                          <td className="py-3 text-right">
                            <Link
                              to={`/dashboard/orders/${order.id}`}
                              className="font-semibold text-[#A97C72]"
                            >
                              Ouvrir
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Panel>

            <Panel title="Raccourcis" subtitle="Actions fréquentes">
              <div className="space-y-2">
                <Link
                  to="/dashboard/invitations/new"
                  className="flex items-center justify-between rounded-[8px] bg-[#A97C72] px-4 py-3 text-sm font-bold uppercase text-white hover:bg-[#966B62]"
                >
                  Nouvelle invitation
                  <FiArrowUpRight aria-hidden />
                </Link>
                <Link
                  to="/dashboard/catalog?type=digital"
                  className="flex items-center justify-between rounded-[8px] border border-[#E8E0D8] px-4 py-3 text-sm font-semibold text-[#4B4242] hover:border-[#A97C72]"
                >
                  Catalogue digital
                  <FiBox className="text-[#A97C72]" aria-hidden />
                </Link>
                <Link
                  to="/dashboard/catalog?type=physical"
                  className="flex items-center justify-between rounded-[8px] border border-[#E8E0D8] px-4 py-3 text-sm font-semibold text-[#4B4242] hover:border-[#A97C72]"
                >
                  Catalogue physique
                  <FiBox className="text-[#A97C72]" aria-hidden />
                </Link>
                <div className="mt-3 rounded-[8px] bg-[#F7F2EC] px-4 py-3 text-sm text-[#7D6E66]">
                  <p>
                    Digital actifs :{" "}
                    <span className="font-semibold text-[#4B4242]">{stats.digitalProducts}</span>
                  </p>
                  <p className="mt-1">
                    Physique actifs :{" "}
                    <span className="font-semibold text-[#4B4242]">{stats.physicalProducts}</span>
                  </p>
                </div>
              </div>
            </Panel>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminOverviewPage;
