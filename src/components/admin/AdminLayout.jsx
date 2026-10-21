import React, { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  FiBox,
  FiGrid,
  FiHome,
  FiLogOut,
  FiMail,
  FiMenu,
  FiShoppingBag,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../auth/AuthProvider";

const NAV = [
  { to: "/dashboard", end: true, label: "Overview", icon: FiGrid },
  { to: "/dashboard/invitations", label: "Invitations", icon: FiMail },
  { to: "/dashboard/orders", label: "Commandes", icon: FiShoppingBag },
  { to: "/dashboard/clients", label: "Clients", icon: FiUsers },
  { to: "/dashboard/catalog", label: "Catalogue", icon: FiBox },
];

function navClass({ isActive }) {
  return `flex items-center gap-3 rounded-[5px] px-3 py-2.5 text-sm font-semibold transition-colors ${
    isActive
      ? "bg-[#A97C72] text-white"
      : "text-[#4B4242] hover:bg-[#F7F2EC]"
  }`;
}

function AdminLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="border-b border-[#E8E0D8] px-5 py-5">
        <p className="font-glacial text-[11px] font-bold uppercase tracking-[0.2em] text-[#A97C72]">
          Lovely Wedding
        </p>
        <h1 className="mt-1 font-lora text-[22px] font-medium text-[#4B4242]">Admin</h1>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map(({ to, end, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={navClass}
            onClick={() => setOpen(false)}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-2 border-t border-[#E8E0D8] px-3 py-4">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-[5px] px-3 py-2.5 text-sm font-semibold text-[#4B4242] hover:bg-[#F7F2EC]"
          onClick={() => setOpen(false)}
        >
          <FiHome className="size-4" aria-hidden /> Site
        </Link>
        <Link
          to="/espace-client"
          className="flex items-center gap-3 rounded-[5px] px-3 py-2.5 text-sm font-semibold text-[#4B4242] hover:bg-[#F7F2EC]"
          onClick={() => setOpen(false)}
        >
          <FiUsers className="size-4" aria-hidden /> Espace client
        </Link>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-[5px] px-3 py-2.5 text-left text-sm font-semibold text-[#4B4242] hover:bg-[#F7F2EC]"
        >
          <FiLogOut className="size-4" aria-hidden /> Déconnexion
        </button>
        <p className="truncate px-3 pt-1 font-glacial text-[11px] text-[#7D6E66]">
          {user?.email}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F2EC] font-glacial text-[#4B4242]">
      <div className="flex min-h-screen">
        <aside className="hidden w-[240px] shrink-0 border-r border-[#E8E0D8] bg-white lg:block">
          {sidebar}
        </aside>

        {open ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/40"
              aria-label="Fermer le menu"
              onClick={() => setOpen(false)}
            />
            <aside className="relative z-10 h-full w-[260px] bg-white shadow-xl">
              <button
                type="button"
                className="absolute right-3 top-3 rounded p-2 text-[#4B4242]"
                onClick={() => setOpen(false)}
                aria-label="Fermer"
              >
                <FiX className="size-5" />
              </button>
              {sidebar}
            </aside>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center gap-3 border-b border-[#E8E0D8] bg-white px-4 py-3 lg:px-8">
            <button
              type="button"
              className="rounded-[5px] border border-[#E8E0D8] p-2 lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Menu"
            >
              <FiMenu className="size-5" />
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#4B4242]">Console admin</p>
              <p className="truncate text-xs text-[#7D6E66]">Gestion Lovely Wedding</p>
            </div>
          </header>
          <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
