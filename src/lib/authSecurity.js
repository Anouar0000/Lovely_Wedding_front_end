/** Client-side auth hardening helpers (signup policy + login lockout). */

export const PASSWORD_MIN_LENGTH = 10;
export const LOGIN_MAX_ATTEMPTS = 5;
export const LOGIN_LOCKOUT_MS = 60_000;
const LOCK_KEY = "lw_login_lock";
const SPECIAL_RE = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/;

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function isSafeInternalPath(path) {
  if (!path || typeof path !== "string") return false;
  if (!path.startsWith("/")) return false;
  if (path.startsWith("//")) return false;
  if (path.includes("://")) return false;
  return path !== "/login" && path !== "/signup";
}

export function getPasswordChecks(password) {
  const value = String(password || "");
  return [
    { ok: value.length >= PASSWORD_MIN_LENGTH, label: `${PASSWORD_MIN_LENGTH}+ caractères` },
    { ok: /[a-z]/.test(value), label: "Une minuscule" },
    { ok: /[A-Z]/.test(value), label: "Une majuscule" },
    { ok: /[0-9]/.test(value), label: "Un chiffre" },
    { ok: SPECIAL_RE.test(value), label: "Un caractère spécial (!@#…)" },
    { ok: value.length > 0 && !/\s/.test(value), label: "Sans espaces" },
  ];
}

export function getPasswordStrength(password) {
  const passed = getPasswordChecks(password).filter((c) => c.ok).length;
  if (passed <= 2) return { label: "Faible", level: 1 };
  if (passed <= 4) return { label: "Moyen", level: 2 };
  if (passed === 5) return { label: "Fort", level: 3 };
  return { label: "Très fort", level: 4 };
}

/**
 * @returns {{ ok: true } | { ok: false, message: string }}
 */
export function validatePassword(password) {
  const failed = getPasswordChecks(password).find((c) => !c.ok);
  if (!failed) return { ok: true };

  const messages = {
    [`${PASSWORD_MIN_LENGTH}+ caractères`]: `Mot de passe trop court (${PASSWORD_MIN_LENGTH} caractères minimum).`,
    "Une minuscule": "Ajoutez au moins une lettre minuscule.",
    "Une majuscule": "Ajoutez au moins une lettre majuscule.",
    "Un chiffre": "Ajoutez au moins un chiffre.",
    "Un caractère spécial (!@#…)": "Ajoutez au moins un caractère spécial (!@#$%).",
    "Sans espaces": "Le mot de passe ne doit pas contenir d'espaces.",
  };
  return { ok: false, message: messages[failed.label] || "Mot de passe trop faible." };
}

function readLockState() {
  try {
    const raw = sessionStorage.getItem(LOCK_KEY);
    if (!raw) return { fails: 0, until: 0 };
    const parsed = JSON.parse(raw);
    return {
      fails: Number(parsed.fails) || 0,
      until: Number(parsed.until) || 0,
    };
  } catch {
    return { fails: 0, until: 0 };
  }
}

function writeLockState(state) {
  try {
    sessionStorage.setItem(LOCK_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota / private mode */
  }
}

export function getLoginLockRemainingMs() {
  const { until } = readLockState();
  return Math.max(0, until - Date.now());
}

export function isLoginLocked() {
  return getLoginLockRemainingMs() > 0;
}

export function recordLoginFailure() {
  const state = readLockState();
  const fails = state.fails + 1;
  const next = {
    fails,
    until: fails >= LOGIN_MAX_ATTEMPTS ? Date.now() + LOGIN_LOCKOUT_MS : 0,
  };
  if (fails >= LOGIN_MAX_ATTEMPTS) {
    next.fails = 0;
  }
  writeLockState(next);
  return next;
}

export function clearLoginFailures() {
  try {
    sessionStorage.removeItem(LOCK_KEY);
  } catch {
    /* ignore */
  }
}

export function loginLockMessage() {
  const ms = getLoginLockRemainingMs();
  if (ms <= 0) return "";
  const sec = Math.ceil(ms / 1000);
  return `Trop de tentatives. Réessayez dans ${sec} s.`;
}
