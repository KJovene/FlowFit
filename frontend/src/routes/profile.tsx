import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { User, LogOut, Calendar, Award, Activity } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  if (!user) {
    navigate({ to: "/login" });
    return null;
  }

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 pt-10 sm:pt-16 lg:pt-20 pb-10 sm:pb-16">
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="rounded-3xl border border-neutral-800/90 bg-neutral-950/90 backdrop-blur-xl p-6 sm:p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-sky-500 via-blue-500 to-cyan-400 flex items-center justify-center glow-sky">
                <User className="w-8 h-8 stroke-[1.5] text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-neutral-50 mb-1">
                  {user.username}
                </h1>
                <p className="text-sm text-neutral-400">{user.email}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="btn-secondary px-3 py-2">
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </button>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-925/80 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-sky-300" />
                <span className="text-xs text-neutral-400">Cette semaine</span>
              </div>
              <p className="text-2xl font-semibold text-neutral-50">3</p>
              <p className="text-xs text-neutral-400">séances</p>
            </div>

            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-925/80 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-cyan-300" />
                <span className="text-xs text-neutral-400">Total</span>
              </div>
              <p className="text-2xl font-semibold text-neutral-50">120</p>
              <p className="text-xs text-neutral-400">minutes</p>
            </div>

            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-925/80 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-blue-300" />
                <span className="text-xs text-neutral-400">Badges</span>
              </div>
              <p className="text-2xl font-semibold text-neutral-50">2</p>
              <p className="text-xs text-neutral-400">débloqués</p>
            </div>
          </div>
        </div>

        {/* Activity Stats */}
        <div className="rounded-3xl border border-neutral-800/90 bg-neutral-950/90 p-6">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-50 mb-4">
            Statistiques
          </h2>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-300">Musculation</span>
                <span className="text-sm text-neutral-400">45%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-neutral-900 overflow-hidden">
                <div className="h-full w-[45%] rounded-full bg-gradient-to-r from-sky-500 to-blue-500"></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-300">Yoga</span>
                <span className="text-sm text-neutral-400">30%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-neutral-900 overflow-hidden">
                <div className="h-full w-[30%] rounded-full bg-gradient-to-r from-cyan-400 to-sky-500"></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-300">Mobilité</span>
                <span className="text-sm text-neutral-400">25%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-neutral-900 overflow-hidden">
                <div className="h-full w-[25%] rounded-full bg-gradient-to-r from-blue-400 to-cyan-400"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-3xl border border-neutral-800/90 bg-neutral-950/90 p-6">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-50 mb-4">
            Activité récente
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl border border-neutral-800/80 bg-neutral-925/80">
              <div>
                <p className="text-sm font-medium text-neutral-50">
                  Full Body maison
                </p>
                <p className="text-xs text-neutral-400">Musculation • 30 min</p>
              </div>
              <span className="text-xs text-neutral-500">Aujourd'hui</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-neutral-800/80 bg-neutral-925/80">
              <div>
                <p className="text-sm font-medium text-neutral-50">
                  Yoga réveil
                </p>
                <p className="text-xs text-neutral-400">Yoga • 15 min</p>
              </div>
              <span className="text-xs text-neutral-500">Hier</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-neutral-800/80 bg-neutral-925/80">
              <div>
                <p className="text-sm font-medium text-neutral-50">
                  Mobilité dos
                </p>
                <p className="text-xs text-neutral-400">Mobilité • 10 min</p>
              </div>
              <span className="text-xs text-neutral-500">Il y a 2 jours</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
