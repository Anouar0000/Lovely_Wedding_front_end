import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import { useAuth } from "../components/auth/AuthProvider";

function LoginPage() {
  const { user, loading, isConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  if (!loading && user) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate(redirectTo, { replace: true });
    } catch (loginError) {
      setError("Email ou mot de passe incorrect.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F6F4EF] px-5 py-10 font-urbanist text-[#141414]">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md flex-col justify-center">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8A6C4D]">
            Lovely Wedding
          </p>
          <h1 className="mt-3 font-abhaya text-5xl leading-none">Dashboard</h1>
        </div>

        {!isConfigured ? (
          <div className="border border-[#D8C9B8] bg-white p-5 text-sm leading-6 text-gray-700">
            Firebase n'est pas encore configure. Ajoute les valeurs
            <span className="font-semibold"> REACT_APP_FIREBASE_*</span> dans ton fichier
            <span className="font-semibold"> .env.local</span>, puis relance le serveur.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
                className="w-full border border-[#D7CEC3] bg-white px-4 py-3 text-base outline-none focus:border-black"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Mot de passe</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
                className="w-full border border-[#D7CEC3] bg-white px-4 py-3 text-base outline-none focus:border-black"
              />
            </label>

            {error ? <p className="text-sm font-semibold text-red-700">{error}</p> : null}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-black px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {submitting ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

export default LoginPage;
