import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, isFirebaseConfigured } from "../../lib/firebase";
import { ensureUserProfile, isAdminEmail, USER_ROLES } from "../../services/users";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return undefined;
    }

    return onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      setUser(currentUser);

      if (!currentUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const userProfile = await ensureUserProfile(currentUser);
        setProfile(userProfile);
      } catch {
        const admin = isAdminEmail(currentUser.email);
        setProfile({
          id: currentUser.uid,
          email: currentUser.email || "",
          role: admin ? USER_ROLES.ADMIN : USER_ROLES.CLIENT,
        });
      } finally {
        setLoading(false);
      }
    });
  }, []);

  // Admin UI only for allowlisted + verified email (matches firestore.rules)
  const isAdmin = Boolean(user?.emailVerified && isAdminEmail(user?.email));
  const role = isAdmin ? USER_ROLES.ADMIN : USER_ROLES.CLIENT;

  const value = useMemo(
    () => ({
      user,
      profile,
      role,
      isAdmin,
      loading,
      isConfigured: isFirebaseConfigured,
      logout: () => (auth ? signOut(auth) : Promise.resolve()),
    }),
    [user, profile, role, isAdmin, loading]
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
