import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FiRefreshCw, FiSearch, FiTrash2 } from "react-icons/fi";
import { isAbortError } from "../../lib/firebase";
import {
  deleteUserDoc,
  listAllUsers,
  updateUserProfile,
  USER_ROLES,
} from "../../services/users";

function AdminClientsPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState({ fullName: "", phone: "", notes: "", role: USER_ROLES.CLIENT });
  const [busy, setBusy] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setUsers(await listAllUsers());
    } catch (err) {
      if (!isAbortError(err)) setError("Impossible de charger les clients.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return users;
    return users.filter((u) =>
      [u.email, u.fullName, u.phone, u.role, u.notes]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [users, searchTerm]);

  const startEdit = (user) => {
    setEditingId(user.id);
    setForm({
      fullName: user.fullName || "",
      phone: user.phone || "",
      notes: user.notes || "",
      role: user.role === USER_ROLES.ADMIN ? USER_ROLES.ADMIN : USER_ROLES.CLIENT,
    });
  };

  const handleSave = async () => {
    if (!editingId) return;
    setBusy(true);
    setError("");
    try {
      await updateUserProfile(editingId, form);
      setUsers((current) =>
        current.map((u) => (u.id === editingId ? { ...u, ...form } : u))
      );
      setEditingId("");
    } catch (err) {
      setError("Impossible d'enregistrer le profil.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Supprimer le profil Firestore de ${user.email || user.id} ?`)) {
      return;
    }
    setBusy(true);
    setError("");
    try {
      await deleteUserDoc(user.id);
      setUsers((current) => current.filter((u) => u.id !== user.id));
      if (editingId === user.id) setEditingId("");
    } catch (err) {
      setError("Impossible de supprimer le profil.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-lora text-[28px] font-medium text-[#4B4242] lg:text-[36px]">Clients</h2>
          <p className="mt-1 text-sm text-[#7D6E66]">
            Profils Firestore ({users.length}). La suppression Auth n&apos;est pas gérée ici.
          </p>
        </div>
        <button
          type="button"
          onClick={loadUsers}
          className="inline-flex items-center gap-2 rounded-[5px] border border-[#E8E0D8] bg-white px-4 py-3 text-sm font-semibold"
        >
          <FiRefreshCw aria-hidden /> Actualiser
        </button>
      </div>

      <label className="relative mb-4 block max-w-xl">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7D6E66]" aria-hidden />
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher email, nom…"
          className="w-full rounded-[5px] border border-[#E8E0D8] bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-[#A97C72]"
        />
      </label>

      {error ? (
        <p className="mb-4 rounded-[5px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      {editingId ? (
        <div className="mb-4 rounded-[8px] border border-[#E8E0D8] bg-white p-5">
          <h3 className="font-lora text-[18px] font-medium">Éditer le profil</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block font-semibold text-[#7D6E66]">Nom</span>
              <input
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                className="w-full rounded-[5px] border border-[#E8E0D8] px-3 py-2 outline-none focus:border-[#A97C72]"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-semibold text-[#7D6E66]">Téléphone</span>
              <input
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="w-full rounded-[5px] border border-[#E8E0D8] px-3 py-2 outline-none focus:border-[#A97C72]"
              />
            </label>
            <label className="text-sm sm:col-span-2">
              <span className="mb-1 block font-semibold text-[#7D6E66]">Notes internes</span>
              <textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                rows={3}
                className="w-full rounded-[5px] border border-[#E8E0D8] px-3 py-2 outline-none focus:border-[#A97C72]"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-semibold text-[#7D6E66]">Rôle (Firestore)</span>
              <select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                className="w-full rounded-[5px] border border-[#E8E0D8] px-3 py-2 outline-none focus:border-[#A97C72]"
              >
                <option value={USER_ROLES.CLIENT}>client</option>
                <option value={USER_ROLES.ADMIN}>admin</option>
              </select>
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={busy}
              className="rounded-[5px] bg-[#A97C72] px-4 py-2 text-sm font-bold uppercase text-white disabled:opacity-50"
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={() => setEditingId("")}
              className="rounded-[5px] border border-[#E8E0D8] px-4 py-2 text-sm font-semibold"
            >
              Annuler
            </button>
          </div>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-[8px] border border-[#E8E0D8] bg-white shadow-sm">
        {loading ? (
          <p className="px-5 py-12 text-center text-sm font-semibold uppercase tracking-[0.16em] text-[#7D6E66]">
            Chargement
          </p>
        ) : null}

        {!loading && filtered.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-[#7D6E66]">Aucun client.</p>
        ) : null}

        {!loading && filtered.length > 0 ? (
          <div className="divide-y divide-[#E8E0D8]">
            {filtered.map((user) => (
              <div
                key={user.id}
                className="flex flex-col gap-3 px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-semibold">{user.fullName || "Sans nom"}</p>
                  <p className="truncate text-[#7D6E66]">{user.email || user.id}</p>
                  <p className="mt-1 text-xs text-[#7D6E66]">
                    {user.phone || "Pas de téléphone"} · rôle {user.role || "client"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(user)}
                    className="rounded-[5px] border border-[#E8E0D8] px-3 py-2 text-sm font-semibold hover:border-[#A97C72]"
                  >
                    Éditer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(user)}
                    disabled={busy}
                    className="inline-flex items-center gap-1 rounded-[5px] border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 disabled:opacity-40"
                  >
                    <FiTrash2 aria-hidden /> Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default AdminClientsPage;
