import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiBox, FiMail, FiShoppingBag, FiUsers } from "react-icons/fi";
import { isAbortError } from "../../lib/firebase";
import { listAllDigitalInvites } from "../../services/digitalInvites";
import { listAllOrders, ORDER_STATUSES } from "../../services/orders";
import { listAllUsers } from "../../services/users";
import { listAllCatalogProducts } from "../../services/catalogProducts";

function StatCard({ label, value, hint, to, icon: Icon }) {
  return (
    <Link
      to={to}
      className="rounded-[8px] border border-[#E8E0D8] bg-white p-5 shadow-sm transition hover:border-[#A97C72]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-glacial text-[12px] font-bold uppercase tracking-[0.14em] text-[#7D6E66]">
            {label}
          </p>
          <p className="mt-2 font-lora text-[32px] font-medium leading-none text-[#4B4242]">
            {value}
          </p>
          {hint ? <p className="mt-2 text-sm text-[#7D6E66]">{hint}</p> : null}
        </div>
        <span className="flex size-10 items-center justify-center rounded-full bg-[#F7F2EC] text-[#A97C72]">
          <Icon className="size-5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

function AdminOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    invitesPublished: 0,
    invitesDraft: 0,
    ordersPaid: 0,
    ordersPending: 0,
    clients: 0,
    productsActive: 0,
  });

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const [invites, orders, users, products] = await Promise.all([
          listAllDigitalInvites(),
          listAllOrders(),
          listAllUsers(),
          listAllCatalogProducts(),
        ]);
        if (!active) return;
        setStats({
          invitesPublished: invites.filter((i) => i.status === "published").length,
          invitesDraft: invites.filter((i) => i.status !== "published").length,
          ordersPaid: orders.filter((o) => o.status === ORDER_STATUSES.PAID || o.status === ORDER_STATUSES.FULFILLED).length,
          ordersPending: orders.filter((o) => o.status === ORDER_STATUSES.PENDING_PAYMENT).length,
          clients: users.filter((u) => u.role !== "admin").length,
          productsActive: products.filter((p) => p.active).length,
        });
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

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-lora text-[28px] font-medium text-[#4B4242] lg:text-[36px]">Overview</h2>
        <p className="mt-1 text-sm text-[#7D6E66]">Vue d&apos;ensemble de l&apos;activité Lovely Wedding.</p>
      </div>

      {error ? (
        <p className="mb-4 rounded-[5px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#7D6E66]">Chargement…</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            label="Invitations publiées"
            value={stats.invitesPublished}
            hint={`${stats.invitesDraft} brouillon(s)`}
            to="/dashboard/invitations"
            icon={FiMail}
          />
          <StatCard
            label="Commandes payées"
            value={stats.ordersPaid}
            hint={`${stats.ordersPending} en attente`}
            to="/dashboard/orders"
            icon={FiShoppingBag}
          />
          <StatCard
            label="Clients"
            value={stats.clients}
            hint="Profils Firestore"
            to="/dashboard/clients"
            icon={FiUsers}
          />
          <StatCard
            label="Produits actifs"
            value={stats.productsActive}
            hint="Catalogue Firestore"
            to="/dashboard/catalog"
            icon={FiBox}
          />
        </div>
      )}
    </div>
  );
}

export default AdminOverviewPage;
