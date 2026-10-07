import React, { useEffect, useState } from "react";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import { useAuth } from "../components/auth/AuthProvider";
import { isAdminEmail } from "../services/users";
import {
  clearLoginFailures,
  getLoginLockRemainingMs,
  isLoginLocked,
  isSafeInternalPath,
  loginLockMessage,
  normalizeEmail,
  recordLoginFailure,
} from "../lib/authSecurity";
import DigitalHomeHeader from "../components/home/DigitalHomeHeader";
import DigitalHomeFooter from "../components/home/DigitalHomeFooter";

function LoginPage() {
  const { user, loading, isConfigured, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [lockMs, setLockMs] = useState(() => getLoginLockRemainingMs());

  const defaultTarget = isAdmin ? "/dashboard" : "/espace-client";
  const fromPath = location.state?.from?.pathname;
  const redirectTo = isSafeInternalPath(fromPath) ? fromPath : defaultTarget;

  useEffect(() => {
    if (lockMs <= 0) return undefined;
    const id = window.setInterval(() => {
      const remaining = getLoginLockRemainingMs();
      setLockMs(remaining);
      if (remaining <= 0) {
        setError("");
      }
    }, 500);
    return () => window.clearInterval(id);
  }, [lockMs]);

  if (!loading && user) {
    return <Navigate to={redirectTo} replace />;
  }

  const locked = isLoginLocked() || lockMs > 0;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setInfo("");

    if (isLoginLocked()) {
      setLockMs(getLoginLockRemainingMs());
      setError(loginLockMessage());
      return;
    }

    setSubmitting(true);

    try {
      const trimmed = normalizeEmail(email);
      await signInWithEmailAndPassword(auth, trimmed, password);
      clearLoginFailures();
      navigate(isAdminEmail(trimmed) ? "/dashboard" : "/espace-client", { replace: true });
    } catch {
      recordLoginFailure();
      const remaining = getLoginLockRemainingMs();
      setLockMs(remaining);
      setError(remaining > 0 ? loginLockMessage() : "Email ou mot de passe incorrect.");
      setSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    setError("");
    setInfo("");
    const trimmed = normalizeEmail(email);
    if (!trimmed) {
      setError("Saisissez votre email pour réinitialiser le mot de passe.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, trimmed);
      setInfo("Email de réinitialisation envoyé si le compte existe.");
    } catch {
      setInfo("Email de réinitialisation envoyé si le compte existe.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white font-urbanist text-lw-text">
      <DigitalHomeHeader mode="none" />

      <main className="flex flex-1 items-center justify-center bg-[#fffaed]/px-4 py-12 lg:py-20">
        <section className="w-full max-w-md rounded-[5px] bg-white px-6 py-10 shadow-sm lg:px-10">
          <p className="text-center font-urbanist text-xs font-semibold uppercase tracking-[0.22em] text-lw-accent">
            Compte
          </p>
          <h1 className="mt-3 text-center lw-page lg:text-[40px]">Connexion</h1>
          <p className="mx-auto mt-3 max-w-[280px] text-center lw-body">
            Accédez à votre espace Lovely Invitations.
          </p>

          {!isConfigured ? (
            <div className="mt-8 rounded-[5px] border border-lw-line bg-lw-surface p-5 text-sm leading-6 text-lw-muted">
              Firebase n&apos;est pas encore configuré.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4" autoComplete="on">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="username"
                  inputMode="email"
                  required
                  disabled={submitting || locked}
                  className="w-full rounded-[5px] border border-lw-line bg-white px-4 py-3 text-base outline-none focus:border-lw-accent disabled:opacity-60"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold">Mot de passe</span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                    minLength={10}
                    disabled={submitting || locked}
                    className="w-full rounded-[5px] border border-lw-line bg-white px-4 py-3 pr-16 text-base outline-none focus:border-lw-accent disabled:opacity-60"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-wide text-lw-muted"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                  >
                    {showPassword ? "Cacher" : "Voir"}
                  </button>
                </div>
              </label>

              {error ? <p className="text-sm font-semibold text-red-700">{error}</p> : null}
              {info ? <p className="text-sm font-semibold text-lw-accent">{info}</p> : null}

              <button
                type="submit"
                disabled={submitting || locked}
                className="h-[42px] w-full rounded-[5px] bg-lw-accent px-5 text-sm font-bold uppercase tracking-wide text-white hover:bg-lw-accentDark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Connexion..." : locked ? "Verrouillé…" : "Se connecter"}
              </button>

              <button
                type="button"
                onClick={handleResetPassword}
                disabled={submitting}
                className="w-full text-center text-sm font-semibold text-lw-muted underline disabled:opacity-60"
              >
                Mot de passe oublié ?
              </button>

              <p className="pt-2 text-center text-sm text-lw-muted">
                Pas encore de compte ?{" "}
                <Link to="/signup" className="font-semibold text-lw-text underline">
                  Créer un compte
                </Link>
              </p>
            </form>
          )}
        </section>
      </main>

      <DigitalHomeFooter />
    </div>
  );
}

export default LoginPage;
