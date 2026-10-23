import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { sendEmailVerification } from "firebase/auth";
import { isAdminMfaRequired } from "../../lib/adminMfa";
import { useAuth } from "./AuthProvider";
import DigitalHomeHeader from "../home/DigitalHomeHeader";
import DigitalHomeFooter from "../home/DigitalHomeFooter";

function VerifyEmailGate() {
  const { user, refreshUser, logout } = useAuth();
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");

  const resend = async () => {
    if (!user) return;
    setBusy(true);
    setInfo("");
    setError("");
    try {
      await sendEmailVerification(user);
      setInfo("Email de vérification renvoyé. Vérifiez aussi les spams.");
    } catch {
      setError("Impossible d'envoyer l'email. Réessayez dans quelques minutes.");
    } finally {
      setBusy(false);
    }
  };

  const confirm = async () => {
    setBusy(true);
    setInfo("");
    setError("");
    try {
      const verified = await refreshUser();
      if (!verified) {
        setInfo("Email pas encore vérifié. Cliquez le lien reçu par email, puis réessayez.");
      }
    } catch {
      setError("Impossible de rafraîchir le statut. Reconnectez-vous.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white font-glacial text-lw-text">
      <DigitalHomeHeader mode="none" />
      <main className="flex flex-1 items-center justify-center px-4 py-12 lg:py-20">
        <section className="w-full max-w-md rounded-[5px] bg-white px-6 py-10 text-center shadow-sm lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lw-accent">Compte</p>
          <h1 className="mt-3 lw-page lg:text-[36px]">Vérifiez votre email</h1>
          <p className="mx-auto mt-3 max-w-[320px] lw-body">
            Un lien de vérification a été envoyé à <strong>{user?.email}</strong>. Ouvrez-le, puis
            cliquez sur « J&apos;ai vérifié ».
          </p>

          {info ? <p className="mt-4 text-sm font-semibold text-lw-accent">{info}</p> : null}
          {error ? <p className="mt-4 text-sm font-semibold text-red-700">{error}</p> : null}

          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={confirm}
              disabled={busy}
              className="h-[42px] w-full rounded-[5px] bg-lw-accent px-5 text-sm font-bold uppercase tracking-wide text-white hover:bg-lw-accentDark disabled:opacity-60"
            >
              J&apos;ai vérifié
            </button>
            <button
              type="button"
              onClick={resend}
              disabled={busy}
              className="h-[42px] w-full rounded-[5px] border border-lw-line bg-white px-5 text-sm font-semibold disabled:opacity-60"
            >
              Renvoyer l&apos;email
            </button>
            <button
              type="button"
              onClick={logout}
              className="w-full text-center text-sm font-semibold text-lw-muted underline"
            >
              Se déconnecter
            </button>
          </div>
        </section>
      </main>
      <DigitalHomeFooter />
    </div>
  );
}

function AdminMfaGate() {
  const { user, logout } = useAuth();
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white font-glacial text-lw-text">
      <DigitalHomeHeader mode="none" />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <section className="w-full max-w-md rounded-[5px] bg-white px-6 py-10 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lw-accent">Sécurité</p>
          <h1 className="mt-3 lw-page lg:text-[36px]">MFA admin requis</h1>
          <p className="mx-auto mt-3 max-w-[340px] lw-body">
            Activez l&apos;authentification à deux facteurs (TOTP) pour{" "}
            <strong>{user?.email}</strong> dans Firebase Authentication / Identity Platform,
            puis reconnectez-vous.
          </p>
          <button
            type="button"
            onClick={logout}
            className="mt-6 h-[42px] w-full rounded-[5px] bg-lw-accent px-5 text-sm font-bold uppercase text-white"
          >
            Se déconnecter
          </button>
        </section>
      </main>
      <DigitalHomeFooter />
    </div>
  );
}

function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading, isAdmin, emailVerified, adminMfaEnrolled } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F6F4EF] px-6 font-glacial">
        <p className="text-sm uppercase tracking-[0.18em] text-gray-500">Chargement</p>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!emailVerified) {
    return <VerifyEmailGate />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/espace-client" replace state={{ from: location }} />;
  }

  if (requireAdmin && isAdminMfaRequired() && !adminMfaEnrolled) {
    return <AdminMfaGate />;
  }

  return children;
}

export default ProtectedRoute;
