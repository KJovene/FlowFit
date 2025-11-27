import { Link } from "@tanstack/react-router";
import { Activity } from "lucide-react";
import { useRegister } from "@/hooks/useRegister";

/**
 * Page d'inscription
 * Composant pur qui utilise le hook useRegister pour la logique
 */
export const RegisterPage = () => {
  const { formData, setFormData, error, loading, handleSubmit } = useRegister();

  return (
    <section className="mx-auto max-w-md px-4 sm:px-6 pt-10 sm:pt-16 lg:pt-20 pb-10 sm:pb-16">
      <div className="rounded-3xl border border-neutral-800/90 bg-neutral-950/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/60">
        {/* Logo & Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sky-500 via-blue-500 to-slate-900 flex items-center justify-center glow-sky mb-4">
            <Activity className="w-6 h-6 stroke-[1.5] text-white" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-50 mb-2">
            Créer un compte
          </h1>
          <p className="text-sm text-neutral-400">
            Commencez votre parcours FlowFit
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl border border-red-500/50 bg-red-500/10 text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-neutral-200 mb-1.5"
            >
              Nom d'utilisateur
            </label>
            <input
              id="username"
              type="text"
              required
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-700 bg-neutral-900/50 text-neutral-50 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
              placeholder="johndoe"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-200 mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-700 bg-neutral-900/50 text-neutral-50 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-200 mb-1.5"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-700 bg-neutral-900/50 text-neutral-50 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-neutral-200 mb-1.5"
            >
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-700 bg-neutral-900/50 text-neutral-50 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Création du compte..." : "Créer mon compte"}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-neutral-400">
            Déjà un compte ?{" "}
            <Link
              to="/login"
              className="text-sky-300 hover:text-sky-200 transition-colors"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};
