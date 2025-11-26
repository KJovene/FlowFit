import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  Dumbbell,
  Flower2,
  StretchHorizontal,
  Plus,
  Sparkles,
  TrendingUp,
  Blend,
} from "lucide-react";
import { SessionCard } from "@/components/SessionCard";
import { sessionService, type Session } from "@/services/sessions";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const [latestSessions, setLatestSessions] = useState<Session[]>([]);
  const [topRatedSessions, setTopRatedSessions] = useState<Session[]>([]);
  const [topMusculation, setTopMusculation] = useState<Session[]>([]);
  const [topYoga, setTopYoga] = useState<Session[]>([]);
  const [topMobilite, setTopMobilite] = useState<Session[]>([]);
  const [topMixte, setTopMixte] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const allSessions = await sessionService.getAll();

        // Les 8 dernières séances créées
        const latest = [...allSessions]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 8);
        setLatestSessions(latest);

        // Top 8 séances toutes catégories
        const topRated = [...allSessions]
          .sort((a, b) => {
            if (b.rating !== a.rating) return b.rating - a.rating;
            return b.ratingCount - a.ratingCount;
          })
          .slice(0, 8);
        setTopRatedSessions(topRated);

        // Top 4 par catégorie
        const musculation = allSessions
          .filter((s) => s.category === "Musculation")
          .sort((a, b) => {
            if (b.rating !== a.rating) return b.rating - a.rating;
            return b.ratingCount - a.ratingCount;
          })
          .slice(0, 4);
        setTopMusculation(musculation);

        const yoga = allSessions
          .filter((s) => s.category === "Yoga")
          .sort((a, b) => {
            if (b.rating !== a.rating) return b.rating - a.rating;
            return b.ratingCount - a.ratingCount;
          })
          .slice(0, 4);
        setTopYoga(yoga);

        const mobilite = allSessions
          .filter((s) => s.category === "Mobilité")
          .sort((a, b) => {
            if (b.rating !== a.rating) return b.rating - a.rating;
            return b.ratingCount - a.ratingCount;
          })
          .slice(0, 4);
        setTopMobilite(mobilite);

        const mixte = allSessions
          .filter((s) => s.category === "Mixte")
          .sort((a, b) => {
            if (b.rating !== a.rating) return b.rating - a.rating;
            return b.ratingCount - a.ratingCount;
          })
          .slice(0, 4);
        setTopMixte(mixte);
      } catch (error) {
        console.error("Erreur lors du chargement des séances:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleSessionClick = (sessionId: string) => {
    navigate({ to: `/session-details/$sessionId`, params: { sessionId } });
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-10 sm:pt-16 lg:pt-20 pb-10 sm:pb-16">
        <div className="skeleton h-40 w-full mb-8"></div>
        <div className="sessions-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="skeleton h-48"></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-10 sm:pt-16 lg:pt-20 pb-10 sm:pb-16">
      {/* Hero Section */}
      <div className="mb-12 sm:mb-16">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-neutral-900/70 backdrop-blur-md text-xs text-sky-100 px-2.5 py-1">
            <span className="inline-flex items-center justify-center rounded-full bg-sky-500/20 text-sky-300 h-4 w-4">
              <Activity className="w-3 h-3 stroke-[1.5]" />
            </span>
            <span>Sport à la maison • Simple & guidé</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 max-w-2xl">
            <Link
              to="/sessions"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500/10 to-sky-600/10 border border-sky-500/30 p-6 hover:border-sky-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/20"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 group-hover:bg-sky-500/30 transition-colors">
                  <Activity className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Les séances
                  </h3>
                  <p className="text-sm text-neutral-400">
                    Découvrir les programmes
                  </p>
                </div>
                <Plus className="w-5 h-5 text-sky-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/exercises"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 border border-cyan-500/30 p-6 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500/30 transition-colors">
                  <Dumbbell className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Les exercices
                  </h3>
                  <p className="text-sm text-neutral-400">
                    Explorer les mouvements
                  </p>
                </div>
                <Plus className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Les dernières nouveautés */}
      {latestSessions.length > 0 && (
        <div className="section-container">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-sky-400" />
            <h2 className="section-title mb-0">Les dernières nouveautés</h2>
          </div>
          <p className="section-subtitle">
            Découvrez les séances récemment ajoutées par la communauté
          </p>
          <div className="sessions-grid">
            {latestSessions.map((session) => (
              <SessionCard
                key={session.id}
                title={session.name}
                exerciseCount={session.exercises?.length || 0}
                category={session.category}
                rating={session.rating}
                ratingCount={session.ratingCount}
                createdBy={session.creator?.username}
                creatorProfileImage={session.creator?.profileImage}
                onClick={() => handleSessionClick(session.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Les meilleures séances */}
      {topRatedSessions.length > 0 && (
        <div className="section-container">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-cyan-400" />
            <h2 className="section-title mb-0">Les meilleures séances</h2>
          </div>
          <p className="section-subtitle">
            Les séances les mieux notées toutes catégories confondues
          </p>
          <div className="sessions-grid">
            {topRatedSessions.map((session) => (
              <SessionCard
                key={session.id}
                title={session.name}
                exerciseCount={session.exercises?.length || 0}
                category={session.category}
                rating={session.rating}
                ratingCount={session.ratingCount}
                createdBy={session.creator?.username}
                creatorProfileImage={session.creator?.profileImage}
                onClick={() => handleSessionClick(session.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Top Musculation */}
      {topMusculation.length > 0 && (
        <div className="section-container">
          <div className="flex items-center gap-3 mb-6">
            <Dumbbell className="w-6 h-6 text-sky-400" />
            <h2 className="section-title mb-0">Top Musculation</h2>
          </div>
          <p className="section-subtitle">
            Les meilleures séances de musculation
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topMusculation.map((session) => (
              <SessionCard
                key={session.id}
                title={session.name}
                exerciseCount={session.exercises?.length || 0}
                category={session.category}
                rating={session.rating}
                ratingCount={session.ratingCount}
                createdBy={session.creator?.username}
                creatorProfileImage={session.creator?.profileImage}
                onClick={() => handleSessionClick(session.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Top Yoga */}
      {topYoga.length > 0 && (
        <div className="section-container">
          <div className="flex items-center gap-3 mb-6">
            <Flower2 className="w-6 h-6 text-cyan-400" />
            <h2 className="section-title mb-0">Top Yoga</h2>
          </div>
          <p className="section-subtitle">Les meilleures séances de yoga</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topYoga.map((session) => (
              <SessionCard
                key={session.id}
                title={session.name}
                exerciseCount={session.exercises?.length || 0}
                category={session.category}
                rating={session.rating}
                ratingCount={session.ratingCount}
                createdBy={session.creator?.username}
                creatorProfileImage={session.creator?.profileImage}
                onClick={() => handleSessionClick(session.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Top Mobilité */}
      {topMobilite.length > 0 && (
        <div className="section-container">
          <div className="flex items-center gap-3 mb-6">
            <StretchHorizontal className="w-6 h-6 text-blue-400" />
            <h2 className="section-title mb-0">Top Mobilité</h2>
          </div>
          <p className="section-subtitle">Les meilleures séances de mobilité</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topMobilite.map((session) => (
              <SessionCard
                key={session.id}
                title={session.name}
                exerciseCount={session.exercises?.length || 0}
                category={session.category}
                rating={session.rating}
                ratingCount={session.ratingCount}
                createdBy={session.creator?.username}
                creatorProfileImage={session.creator?.profileImage}
                onClick={() => handleSessionClick(session.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Top Mixte */}
      {topMixte.length > 0 && (
        <div className="section-container">
          <div className="flex items-center gap-3 mb-6">
            <Blend className="w-6 h-6 text-purple-400" />
            <h2 className="section-title mb-0">Top Mixte</h2>
          </div>
          <p className="section-subtitle">
            Les meilleures séances mixtes combinant plusieurs disciplines
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topMixte.map((session) => (
              <SessionCard
                key={session.id}
                title={session.name}
                exerciseCount={session.exercises?.length || 0}
                category={session.category}
                rating={session.rating}
                ratingCount={session.ratingCount}
                createdBy={session.creator?.username}
                creatorProfileImage={session.creator?.profileImage}
                onClick={() => handleSessionClick(session.id)}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
