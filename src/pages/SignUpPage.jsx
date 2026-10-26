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
  hasEmailAlias,
  normalizeEmail,
  validatePassword,
} from "../lib/authSecurity";
import { claimEmail, EMAIL_TAKEN_CODE, saveUserContactInfo } from "../services/users";
import DigitalHomeHeader from "../components/home/DigitalHomeHeader";
import DigitalHomeFooter from "../components/home/DigitalHomeFooter";

const fieldClass =
  "w-full rounded-[5px] border border-[#A19A9A] bg-white px-4 py-3 font-glacial text-[14px] text-[#4B4242] outline-none transition focus:border-[#A97C72] disabled:opacity-60";

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

    if (hasEmailAlias(email)) {
      setError("Les adresses avec « + » ne sont pas acceptées. Utilisez votre email principal.");
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
        await claimEmail(cred.user);
      } catch (claimError) {
        if (claimError?.code === EMAIL_TAKEN_CODE) {
          await cred.user.delete().catch(() => {});
          setError("Cet email est déjà utilisé. Connectez-vous plutôt.");
          setSubmitting(false);
          return;
        }
      }
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
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white font-glacial text-[#4B4242]">
      <DigitalHomeHeader mode="none" context="digitale" />

      <main className="flex flex-1 items-center justify-center bg-[#F7F2EC] px-4 py-12 lg:py-16">
        <section className="w-full max-w-[428px] border border-[#A19A9A] bg-white px-5 py-10 md:max-w-md md:px-10">
          <h1 className="text-center font-lora text-[22px] font-medium leading-[34px] tracking-[-0.22px] text-[#4B4242] lg:text-[26px]">
            Inscription
          </h1>
          <p className="mx-auto mt-2 max-w-[300px] text-center font-glacial text-[14px] leading-[18px] text-[#78716C]">
            Créez votre compte pour suivre vos invitations et RSVP.
          </p>

          {!isConfigured ? (
            <div className="mt-8 rounded-[5px] border border-[#A19A9A] bg-[#F7F2EC] p-5 text-[14px] leading-6 text-[#78716C]">
              Firebase n&apos;est pas encore configuré.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <label className="block">
                <span className="mb-2 block font-glacial text-[14px] font-bold text-[#4B4242]">
                  Nom complet
                </span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={120}
                  disabled={submitting}
                  className={fieldClass}
                />
              </label>

              <label className="block">
                <span className="mb-2 block font-glacial text-[14px] font-bold text-[#4B4242]">
                  Téléphone
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  autoComplete="tel"
                  inputMode="tel"
                  required
                  disabled={submitting}
                  placeholder="+216 …"
                  className={fieldClass}
                />
              </label>

              <label className="block">
                <span className="mb-2 block font-glacial text-[14px] font-bold text-[#4B4242]">
                  Email
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  inputMode="email"
                  required
                  disabled={submitting}
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
                    autoComplete="new-password"
                    required
                    minLength={PASSWORD_MIN_LENGTH}
                    disabled={submitting}
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
                {password ? (
                  <p
                    className={`mt-2 font-glacial text-[12px] font-bold ${
                      passwordStrength.level >= 3
                        ? "text-[#A97C72]"
                        : passwordStrength.level === 2
                          ? "text-amber-700"
                          : "text-red-700"
                    }`}
                  >
                    Force : {passwordStrength.label}
                  </p>
                ) : null}
                <ul className="mt-2 space-y-1 font-glacial text-[12px] text-[#78716C]">
                  {passwordHints.map((hint) => (
                    <li
                      key={hint.label}
                      className={hint.ok ? "font-bold text-[#A97C72]" : ""}
                    >
                      {hint.ok ? "✓" : "○"} {hint.label}
                    </li>
                  ))}
                </ul>
              </label>

              <label className="block">
                <span className="mb-2 block font-glacial text-[14px] font-bold text-[#4B4242]">
                  Confirmer le mot de passe
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  required
                  minLength={PASSWORD_MIN_LENGTH}
                  disabled={submitting}
                  className={fieldClass}
                />
              </label>

              {error ? (
                <p className="font-glacial text-[14px] font-bold text-red-700">{error}</p>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#A97C72] font-glacial text-[14px] font-bold text-white shadow-[0px_8px_20px_rgba(168,125,115,0.28)] transition hover:bg-[#966B62] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Création..." : "Créer mon compte"}
              </button>

              <p className="pt-2 text-center font-glacial text-[14px] text-[#78716C]">
                Déjà un compte ?{" "}
                <Link
                  to="/login"
                  className="font-bold text-[#4B4242] underline underline-offset-2"
                >
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
