import { useNavigate } from "@tanstack/react-router";
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
import { useHomeSessions } from "@/hooks/useHomeSessions";

export const HomePage = () => {
  const navigate = useNavigate();
  const {
    latestSessions,
    topRatedSessions,
    topMusculation,
    topYoga,
    topMobilite,
    topMixte,
    loading,
  } = useHomeSessions();

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
      <HeroSection />

      {/* Les dernières nouveautés */}
      {latestSessions.length > 0 && (
        <SessionSection
          icon={<Sparkles className="w-6 h-6 text-sky-400" />}
          title="Les dernières nouveautés"
          subtitle="Découvrez les séances récemment ajoutées par la communauté"
          sessions={latestSessions}
          onSessionClick={handleSessionClick}
        />
      )}

      {/* Les meilleures séances */}
      {topRatedSessions.length > 0 && (
        <SessionSection
          icon={<TrendingUp className="w-6 h-6 text-cyan-400" />}
          title="Les meilleures séances"
          subtitle="Les séances les mieux notées toutes catégories confondues"
          sessions={topRatedSessions}
          onSessionClick={handleSessionClick}
        />
      )}

      {/* Top Musculation */}
      {topMusculation.length > 0 && (
        <SessionSection
          icon={<Dumbbell className="w-6 h-6 text-sky-400" />}
          title="Top Musculation"
          subtitle="Les meilleures séances de musculation"
          sessions={topMusculation}
          onSessionClick={handleSessionClick}
          gridCols="lg:grid-cols-4"
        />
      )}

      {/* Top Yoga */}
      {topYoga.length > 0 && (
        <SessionSection
          icon={<Flower2 className="w-6 h-6 text-cyan-400" />}
          title="Top Yoga"
          subtitle="Les meilleures séances de yoga"
          sessions={topYoga}
          onSessionClick={handleSessionClick}
          gridCols="lg:grid-cols-4"
        />
      )}

      {/* Top Mobilité */}
      {topMobilite.length > 0 && (
        <SessionSection
          icon={<StretchHorizontal className="w-6 h-6 text-blue-400" />}
          title="Top Mobilité"
          subtitle="Les meilleures séances de mobilité"
          sessions={topMobilite}
          onSessionClick={handleSessionClick}
          gridCols="lg:grid-cols-4"
        />
      )}

      {/* Top Mixte */}
      {topMixte.length > 0 && (
        <SessionSection
          icon={<Blend className="w-6 h-6 text-purple-400" />}
          title="Top Mixte"
          subtitle="Les meilleures séances mixtes combinant plusieurs disciplines"
          sessions={topMixte}
          onSessionClick={handleSessionClick}
          gridCols="lg:grid-cols-4"
        />
      )}
    </section>
  );
};

// Composant Hero Section
const HeroSection = () => {
  return (
    <div className="mb-12 sm:mb-16">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-neutral-900/70 backdrop-blur-md text-xs text-sky-100 px-2.5 py-1">
          <span className="inline-flex items-center justify-center rounded-full bg-sky-500/20 text-sky-300 h-4 w-4">
            <Activity className="w-3 h-3 stroke-[1.5]" />
          </span>
          <span>Sport à la maison • Simple & guidé</span>
        </div>

        <HeroLinks />
      </div>
    </div>
  );
};

// Composant Hero Links
const HeroLinks = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 max-w-2xl">
      <HeroLink
        to="/sessions"
        icon={<Activity className="w-6 h-6 stroke-[1.5]" />}
        title="Les séances"
        subtitle="Découvrir les programmes"
        colorClass="from-sky-500/10 to-sky-600/10 border-sky-500/30 hover:border-sky-400/50 hover:shadow-sky-500/20"
        iconBgClass="bg-sky-500/20 text-sky-400 group-hover:bg-sky-500/30"
        iconColor="text-sky-400"
      />
      <HeroLink
        to="/exercises"
        icon={<Dumbbell className="w-6 h-6 stroke-[1.5]" />}
        title="Les exercices"
        subtitle="Explorer les mouvements"
        colorClass="from-cyan-500/10 to-cyan-600/10 border-cyan-500/30 hover:border-cyan-400/50 hover:shadow-cyan-500/20"
        iconBgClass="bg-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500/30"
        iconColor="text-cyan-400"
      />
    </div>
  );
};

// Composant Hero Link
interface HeroLinkProps {
  to: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  colorClass: string;
  iconBgClass: string;
  iconColor: string;
}

const HeroLink = ({
  to,
  icon,
  title,
  subtitle,
  colorClass,
  iconBgClass,
  iconColor,
}: HeroLinkProps) => {
  return (
    <a
      href={to}
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br border p-6 transition-all duration-300 hover:shadow-lg ${colorClass}`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-xl transition-colors ${iconBgClass}`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
          <p className="text-sm text-neutral-400">{subtitle}</p>
        </div>
        <Plus
          className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${iconColor}`}
        />
      </div>
    </a>
  );
};

// Composant Session Section
interface SessionSectionProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  sessions: any[];
  onSessionClick: (id: string) => void;
  gridCols?: string;
}

const SessionSection = ({
  icon,
  title,
  subtitle,
  sessions,
  onSessionClick,
  gridCols = "lg:grid-cols-4",
}: SessionSectionProps) => {
  return (
    <div className="section-container">
      <div className="flex items-center gap-3 mb-6">
        {icon}
        <h2 className="section-title mb-0">{title}</h2>
      </div>
      <p className="section-subtitle">{subtitle}</p>
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols === "lg:grid-cols-4" ? "lg:grid-cols-4" : "sessions-grid"} gap-4`}
      >
        {sessions.map((session) => (
          <SessionCard
            key={session.id}
            title={session.name}
            exerciseCount={session.exercises?.length || 0}
            category={session.category}
            rating={session.rating}
            ratingCount={session.ratingCount}
            createdBy={session.creator?.username}
            creatorProfileImage={session.creator?.profileImage}
            onClick={() => onSessionClick(session.id)}
          />
        ))}
      </div>
    </div>
  );
};
