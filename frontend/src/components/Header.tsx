import { Link } from "@tanstack/react-router";
import { Globe2, Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import Logo from "../assets/logo.png";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full border-b border-neutral-800/80 bg-neutral-950/60 backdrop-blur-md z-20 sticky top-0">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 sm:px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-500 via-blue-500 to-slate-900 flex items-center justify-center glow-sky">
            <img className="rounded-full" src={Logo} alt="Logo" />
          </div>
          <span className="text-base sm:text-lg font-semibold tracking-tight text-neutral-50">
            FlowFit
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <>
              {/* User Profile Button */}
              <Link
                to="/profile"
                className="hidden sm:inline-flex items-center gap-2 rounded-full border border-neutral-700/80 bg-neutral-900/80 hover:border-sky-500/80 text-xs sm:text-sm text-neutral-100 px-3 sm:px-4 py-1.5 transition-colors"
              >
                {user?.profileImage ? (
                  <img
                    src={`http://localhost:4000${user.profileImage}`}
                    alt={user.username}
                    className="w-3.5 h-3.5 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-3.5 h-3.5" />
                )}
                <span>{user?.username || "Profil"}</span>
              </Link>

              {/* Logout Button Desktop */}
              <button
                onClick={handleLogout}
                className="hidden sm:inline-flex items-center gap-2 rounded-full border border-neutral-700/80 bg-neutral-900/80 hover:border-red-500/80 text-xs sm:text-sm text-neutral-300 hover:text-red-300 px-3 sm:px-4 py-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>

              {/* Profile Button Mobile */}
              <Link
                to="/profile"
                className="sm:hidden inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-400 text-xs font-medium tracking-tight text-neutral-950 glow-sky px-3 py-1.5"
              >
                {user?.profileImage ? (
                  <img
                    src={`http://localhost:4000${user.profileImage}`}
                    alt={user.username}
                    className="w-3.5 h-3.5 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-3.5 h-3.5" />
                )}
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center justify-center rounded-full border border-neutral-700/80 bg-neutral-900/80 hover:border-neutral-500/80 text-xs sm:text-sm text-neutral-100 px-3 sm:px-4 py-1.5 transition-colors"
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-400 text-xs sm:text-sm font-medium tracking-tight text-neutral-950 glow-sky px-3 sm:px-4 py-1.5"
              >
                <span className="hidden sm:inline">Créer un compte</span>
                <span className="sm:hidden">S'inscrire</span>
              </Link>
            </>
          )}
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center h-8 w-8 rounded-full border border-neutral-700/80 bg-neutral-900/80 text-neutral-300"
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-800/80 bg-neutral-950/95 backdrop-blur-md">
          <nav className="flex flex-col gap-1 px-4 py-3">
            {isAuthenticated && (
              <>
                <div className="h-px bg-neutral-800/80 my-2"></div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-300 hover:text-red-200 py-2 px-3 rounded-lg hover:bg-neutral-900/50 transition-colors flex items-center gap-2 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
