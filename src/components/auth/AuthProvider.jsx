import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { hasEnrolledMfa } from "../../lib/adminMfa";
import { auth, isAbortError, isFirebaseConfigured } from "../../lib/firebase";
import { logSecurityEvent } from "../../services/securityEvents";
import { EMAIL_TAKEN_CODE, ensureUserProfile, isAdminEmail, USER_ROLES } from "../../services/users";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  // Bumped after user.reload(): same Firebase user object, so React needs a nudge.
  const [, setUserVersion] = useState(0);
  const [authError, setAuthError] = useState("");
  const loggedAdminUid = useRef(null);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return undefined;
    }

    let active = true;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!active) return;

      setLoading(true);
      setUser(currentUser);

      if (!currentUser) {
        setProfile(null);
        loggedAdminUid.current = null;
        setLoading(false);
        return;
      }

      try {
        const userProfile = await ensureUserProfile(currentUser);
        if (active) {
          setProfile(userProfile);
          setAuthError("");
        }
      } catch (error) {
        if (isAbortError(error)) return;
        if (!active) return;
        if (error?.code === EMAIL_TAKEN_CODE) {
          setAuthError(error.message);
          setProfile(null);
          logSecurityEvent("auth_email_taken", {
            email: currentUser.email || "",
            uid: currentUser.uid,
          });
          await signOut(auth).catch(() => {});
          return;
        }
        const admin = isAdminEmail(currentUser.email);
        setProfile({
          id: currentUser.uid,
          email: currentUser.email || "",
          role: admin ? USER_ROLES.ADMIN : USER_ROLES.CLIENT,
        });
      } finally {
        if (active) setLoading(false);
      }

      if (
        currentUser?.emailVerified &&
        isAdminEmail(currentUser.email) &&
        loggedAdminUid.current !== currentUser.uid
      ) {
        loggedAdminUid.current = currentUser.uid;
        const mfaOk = hasEnrolledMfa(currentUser);
        logSecurityEvent(mfaOk ? "admin_mfa_ok" : "admin_mfa_missing", {
          email: currentUser.email || "",
          uid: currentUser.uid,
        });
        logSecurityEvent("admin_login", {
          email: currentUser.email || "",
          uid: currentUser.uid,
        });
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  /** Reload the Firebase user (e.g. after clicking the verification link). */
  const refreshUser = useCallback(async () => {
    const current = auth?.currentUser;
    if (!current) return false;
    await current.reload();
    await current.getIdToken(true);
    setUserVersion((v) => v + 1);
    return Boolean(auth.currentUser?.emailVerified);
  }, []);

  const emailVerified = Boolean(user?.emailVerified);
  // Admin UI only for allowlisted + verified email (matches firestore.rules)
  const isAdmin = Boolean(emailVerified && isAdminEmail(user?.email));
  const adminMfaEnrolled = Boolean(isAdmin && hasEnrolledMfa(user));
  const role = isAdmin ? USER_ROLES.ADMIN : USER_ROLES.CLIENT;

  const value = useMemo(
    () => ({
      user,
      profile,
      role,
      isAdmin,
      adminMfaEnrolled,
      emailVerified,
      loading,
      authError,
      clearAuthError: () => setAuthError(""),
      refreshUser,
      isConfigured: isFirebaseConfigured,
      logout: () => (auth ? signOut(auth) : Promise.resolve()),
    }),
    [user, profile, role, isAdmin, adminMfaEnrolled, emailVerified, loading, authError, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
