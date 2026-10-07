import React, { useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import { useAuth } from "../components/auth/AuthProvider";
import {
  PASSWORD_MIN_LENGTH,
  getPasswordChecks,
  getPasswordStrength,
  normalizeEmail,
  validatePassword,
} from "../lib/authSecurity";
import { saveUserContactInfo } from "../services/users";
import DigitalHomeHeader from "../components/home/DigitalHomeHeader";
import DigitalHomeFooter from "../components/home/DigitalHomeFooter";

function getSignupErrorMessage(code) {
  switch (code) {
    case "auth/email-already-in-use":
      return "Cet email est déjà utilisé. Connectez-vous plutôt.";
    case "auth/invalid-email":
      return "Email invalide.";
    case "auth/weak-password":
      return `Mot de passe trop faible (${PASSWORD_MIN_LENGTH}+ car., majuscule, minuscule, chiffre, symbole).`;
    case "auth/operation-not-allowed":
      return "Inscription désactivée dans Firebase.";
    default:
      return "Impossible de créer le compte.";
  }
}

function isValidPhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
}

function SignUpPage() {
  const { user, loading, isConfigured, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const passwordHints = useMemo(() => getPasswordChecks(password), [password]);
  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);

  if (!loading && user) {
    return <Navigate to={isAdmin ? "/dashboard" : "/espace-client"} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const name = fullName.trim();
    if (name.length < 2) {
      setError("Indiquez votre nom complet.");
      return;
    }

    if (!isValidPhone(phone)) {
      setError("Numéro de téléphone invalide (8 à 15 chiffres).");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    const policy = validatePassword(password);
    if (!policy.ok) {
      setError(policy.message);
      return;
    }

    setSubmitting(true);

    try {
      const trimmed = normalizeEmail(email);
      const cred = await createUserWithEmailAndPassword(auth, trimmed, password);
      try {
        await updateProfile(cred.user, { displayName: name });
      } catch {
        /* non-blocking */
      }
      try {
        await saveUserContactInfo(cred.user, { fullName: name, phone: phone.trim() });
      } catch {
        /* AuthProvider may create the doc; contact can be filled later */
      }
      try {
        await sendEmailVerification(cred.user);
      } catch {
        /* non-blocking: account still created */
      }
      navigate("/espace-client", { replace: true });
    } catch (signupError) {
      setError(getSignupErrorMessage(signupError.code));
      setSubmitting(false);
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
          <h1 className="mt-3 text-center lw-page lg:text-[40px]">Inscription</h1>
          <p className="mx-auto mt-3 max-w-[280px] text-center lw-body">
            Créez votre compte pour suivre vos invitations et RSVP.
          </p>

          {!isConfigured ? (
            <div className="mt-8 rounded-[5px] border border-lw-line bg-lw-surface p-5 text-sm leading-6 text-lw-muted">
              Firebase n&apos;est pas encore configuré.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold">Nom complet</span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={120}
                  disabled={submitting}
                  className="w-full rounded-[5px] border border-lw-line bg-white px-4 py-3 text-base outline-none focus:border-lw-accent disabled:opacity-60"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold">Téléphone</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  autoComplete="tel"
                  inputMode="tel"
                  required
                  disabled={submitting}
                  placeholder="+216 …"
                  className="w-full rounded-[5px] border border-lw-line bg-white px-4 py-3 text-base outline-none focus:border-lw-accent disabled:opacity-60"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  inputMode="email"
                  required
                  disabled={submitting}
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
                    autoComplete="new-password"
                    required
                    minLength={PASSWORD_MIN_LENGTH}
                    disabled={submitting}
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
                {password ? (
                  <p
                    className={`mt-2 text-xs font-semibold ${
                      passwordStrength.level >= 3
                        ? "text-lw-accent"
                        : passwordStrength.level === 2
                          ? "text-amber-700"
                          : "text-red-700"
                    }`}
                  >
                    Force : {passwordStrength.label}
                  </p>
                ) : null}
                <ul className="mt-2 space-y-1 text-xs text-lw-muted">
                  {passwordHints.map((hint) => (
                    <li key={hint.label} className={hint.ok ? "text-lw-accent" : ""}>
                      {hint.ok ? "✓" : "○"} {hint.label}
                    </li>
                  ))}
                </ul>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold">Confirmer le mot de passe</span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  required
                  minLength={PASSWORD_MIN_LENGTH}
                  disabled={submitting}
                  className="w-full rounded-[5px] border border-lw-line bg-white px-4 py-3 text-base outline-none focus:border-lw-accent disabled:opacity-60"
                />
              </label>

              {error ? <p className="text-sm font-semibold text-red-700">{error}</p> : null}

              <button
                type="submit"
                disabled={submitting}
                className="h-[42px] w-full rounded-[5px] bg-lw-accent px-5 text-sm font-bold uppercase tracking-wide text-white hover:bg-lw-accentDark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Création..." : "Créer mon compte"}
              </button>

              <p className="pt-2 text-center text-sm text-lw-muted">
                Déjà un compte ?{" "}
                <Link to="/login" className="font-semibold text-lw-text underline">
                  Se connecter
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

export default SignUpPage;
