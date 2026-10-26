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

const fieldClass =
  "w-full rounded-[5px] border border-[#A19A9A] bg-white px-4 py-3 font-glacial text-[14px] text-[#4B4242] outline-none transition focus:border-[#A97C72] disabled:opacity-60";

function LoginPage() {
  const { user, loading, isConfigured, isAdmin, authError, clearAuthError } = useAuth();
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
    clearAuthError();

    if (isLoginLocked()) {
      setLockMs(getLoginLockRemainingMs());
      setError(loginLockMessage());
      return;
    }

    setSubmitting(true);

    try {
      const trimmed = normalizeEmail(email);
      const cred = await signInWithEmailAndPassword(auth, trimmed, password);
      clearLoginFailures();
      const adminReady = isAdminEmail(trimmed) && Boolean(cred.user.emailVerified);
      navigate(adminReady ? "/dashboard" : "/espace-client", {
        replace: true,
        state: adminReady ? undefined : { adminRequired: isAdminEmail(trimmed) },
      });
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
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white font-glacial text-[#4B4242]">
      <DigitalHomeHeader mode="none" context="digitale" />

      <main className="flex flex-1 items-center justify-center bg-[#F7F2EC] px-4 py-12 lg:py-16">
        <section className="w-full max-w-[428px] border border-[#A19A9A] bg-white px-5 py-10 md:max-w-md md:px-10">
          <h1 className="text-center font-lora text-[22px] font-medium leading-[34px] tracking-[-0.22px] text-[#4B4242] lg:text-[26px]">
            Connexion
          </h1>
          <p className="mx-auto mt-2 max-w-[280px] text-center font-glacial text-[14px] leading-[18px] text-[#78716C]">
            Accédez à votre espace Lovely Invitations.
          </p>

          {!isConfigured ? (
            <div className="mt-8 rounded-[5px] border border-[#A19A9A] bg-[#F7F2EC] p-5 text-[14px] leading-6 text-[#78716C]">
              Firebase n&apos;est pas encore configuré.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4" autoComplete="on">
              <label className="block">
                <span className="mb-2 block font-glacial text-[14px] font-bold text-[#4B4242]">
                  Email
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="username"
                  inputMode="email"
                  required
                  disabled={submitting || locked}
                  className={fieldClass}
                />
              </label>

              <label className="block">
                <span className="mb-2 block font-glacial text-[14px] font-bold text-[#4B4242]">
                  Mot de passe
                </span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                    minLength={10}
                    disabled={submitting || locked}
                    className={`${fieldClass} pr-16`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 font-glacial text-[12px] font-bold uppercase tracking-wide text-[#78716C]"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                  >
                    {showPassword ? "Cacher" : "Voir"}
                  </button>
                </div>
              </label>

              {error || authError ? (
                <p className="font-glacial text-[14px] font-bold text-red-700">
                  {error || authError}
                </p>
              ) : null}
              {info ? (
                <p className="font-glacial text-[14px] font-bold text-[#A97C72]">{info}</p>
              ) : null}

              <button
                type="submit"
                disabled={submitting || locked}
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#A97C72] font-glacial text-[14px] font-bold text-white shadow-[0px_8px_20px_rgba(168,125,115,0.28)] transition hover:bg-[#966B62] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Connexion..." : locked ? "Verrouillé…" : "Se connecter"}
              </button>

              <button
                type="button"
                onClick={handleResetPassword}
                disabled={submitting}
                className="w-full text-center font-glacial text-[14px] font-bold text-[#78716C] underline underline-offset-2 disabled:opacity-60"
              >
                Mot de passe oublié ?
              </button>

              <p className="pt-2 text-center font-glacial text-[14px] text-[#78716C]">
                Pas encore de compte ?{" "}
                <Link
                  to="/signup"
                  className="font-bold text-[#4B4242] underline underline-offset-2"
                >
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
