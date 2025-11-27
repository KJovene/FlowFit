import { useNavigate } from "@tanstack/react-router";
import {
  User,
  LogOut,
  FolderOpen,
  Lock,
  Dumbbell,
  Heart,
  Camera,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { SessionCard } from "@/components/SessionCard";
import { useProfile } from "@/hooks/useProfile";

/**
 * Page profil utilisateur
 * Affiche les séances, exercices et favoris de l'utilisateur avec upload de photo
 */
export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const {
    mySessions,
    favoriteSessions,
    myExercises,
    loading,
    loadingFavorites,
    uploadingImage,
    fileInputRef,
    handleProfileImageClick,
    handleImageChange,
    stats,
  } = useProfile();

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  const handleSessionClick = (sessionId: string) => {
    navigate({ to: `/session-details/$sessionId`, params: { sessionId } });
  };

  if (!user) {
    navigate({ to: "/login" });
    return null;
  }

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-16 lg:pt-20 pb-10 sm:pb-16">
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="rounded-3xl border border-neutral-800/90 bg-neutral-950/90 backdrop-blur-xl p-6 sm:p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {user.profileImage ? (
                  <img
                    src={`http://localhost:4000${user.profileImage}`}
                    alt={user.username}
                    className="h-16 w-16 rounded-full object-cover border-2 border-sky-500/50 glow-sky"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-sky-500 via-blue-500 to-cyan-400 flex items-center justify-center glow-sky">
                    <User className="w-8 h-8 stroke-[1.5] text-white" />
                  </div>
                )}
                <button
                  onClick={handleProfileImageClick}
                  disabled={uploadingImage}
                  className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-sky-500 hover:bg-sky-600 flex items-center justify-center transition-colors disabled:opacity-50"
                  title="Changer la photo de profil"
                >
                  {uploadingImage ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-3 h-3 text-white" />
                  )}
                </button>
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
        </div>

        {/* Mes Séances */}
        <div className="rounded-3xl border border-neutral-800/90 bg-neutral-950/90 backdrop-blur-xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navigate({ to: "/my-sessions" })}
            >
              <FolderOpen className="w-6 h-6 text-sky-400 group-hover:text-sky-300 transition-colors" />
              <h2 className="text-xl font-semibold text-neutral-50 group-hover:text-sky-300 transition-colors">
                Mes Séances
              </h2>
            </div>
            <button
              onClick={() => navigate({ to: "/my-sessions" })}
              className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
            >
              Voir tout →
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-3 text-center">
              <p className="text-2xl font-semibold text-neutral-50">
                {mySessions.length}
              </p>
              <p className="text-xs text-neutral-400">Total</p>
            </div>
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-center">
              <p className="text-2xl font-semibold text-green-300">
                {stats.sharedSessionsCount}
              </p>
              <p className="text-xs text-neutral-400">Partagées</p>
            </div>
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-center">
              <p className="text-2xl font-semibold text-amber-300">
                {stats.privateSessionsCount}
              </p>
              <p className="text-xs text-neutral-400">Privées</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-neutral-400">
              Chargement...
            </div>
          ) : mySessions.length === 0 ? (
            <div className="text-center py-8 text-neutral-400">
              Vous n'avez pas encore créé de séance
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mySessions.slice(0, 4).map((session) => (
                  <SessionCard
                    key={session.id}
                    title={session.name}
                    exerciseCount={session.exercises?.length || 0}
                    category={session.category}
                    rating={session.rating}
                    ratingCount={session.ratingCount}
                    createdBy={session.createdBy}
                    creatorProfileImage={session.creator?.profileImage}
                    onClick={() => handleSessionClick(session.id)}
                    isPrivate={!session.isShared}
                  />
                ))}
              </div>

              {mySessions.length > 4 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => navigate({ to: "/my-sessions" })}
                    className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
                  >
                    + {mySessions.length - 4} séance
                    {mySessions.length - 4 > 1 ? "s" : ""} de plus
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Séances Favorites */}
        <div className="rounded-3xl border border-neutral-800/90 bg-neutral-950/90 backdrop-blur-xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navigate({ to: "/favorite-sessions" })}
            >
              <Heart className="w-6 h-6 text-red-400 fill-current group-hover:text-red-300 transition-colors" />
              <h2 className="text-xl font-semibold text-neutral-50 group-hover:text-red-300 transition-colors">
                Séances Favorites
              </h2>
            </div>
            <button
              onClick={() => navigate({ to: "/favorite-sessions" })}
              className="text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Voir tout →
            </button>
          </div>

          {loadingFavorites ? (
            <div className="text-center py-8 text-neutral-400">
              Chargement...
            </div>
          ) : favoriteSessions.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
              <p className="text-sm text-neutral-400 mb-4">
                Ajoutez vos séances préférées à vos favoris
              </p>
              <button
                onClick={() => navigate({ to: "/sessions" })}
                className="btn-secondary px-4 py-2 text-sm"
              >
                Découvrir des séances
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {favoriteSessions.slice(0, 4).map((session) => (
                  <SessionCard
                    key={session.id}
                    title={session.name}
                    exerciseCount={session.exercises?.length || 0}
                    category={session.category}
                    rating={session.rating}
                    ratingCount={session.ratingCount}
                    createdBy={session.createdBy}
                    creatorProfileImage={session.creator?.profileImage}
                    onClick={() => handleSessionClick(session.id)}
                  />
                ))}
              </div>

              {favoriteSessions.length > 4 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => navigate({ to: "/favorite-sessions" })}
                    className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
                  >
                    + {favoriteSessions.length - 4} séance
                    {favoriteSessions.length - 4 > 1 ? "s" : ""} de plus
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Mes Exercices */}
        <div className="rounded-3xl border border-neutral-800/90 bg-neutral-950/90 backdrop-blur-xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navigate({ to: "/my-exercises" })}
            >
              <Dumbbell className="w-6 h-6 text-sky-400 group-hover:text-sky-300 transition-colors" />
              <h2 className="text-xl font-semibold text-neutral-50 group-hover:text-sky-300 transition-colors">
                Mes Exercices
              </h2>
            </div>
            <button
              onClick={() => navigate({ to: "/my-exercises" })}
              className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
            >
              Voir tout →
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-3 text-center">
              <p className="text-2xl font-semibold text-neutral-50">
                {myExercises.length}
              </p>
              <p className="text-xs text-neutral-400">Total</p>
            </div>
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-center">
              <p className="text-2xl font-semibold text-green-300">
                {stats.sharedExercisesCount}
              </p>
              <p className="text-xs text-neutral-400">Partagés</p>
            </div>
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-center">
              <p className="text-2xl font-semibold text-amber-300">
                {stats.privateExercisesCount}
              </p>
              <p className="text-xs text-neutral-400">Privés</p>
            </div>
          </div>

          {myExercises.length === 0 ? (
            <div className="text-center py-8 text-neutral-400">
              Vous n'avez pas encore créé d'exercice
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {myExercises.slice(0, 4).map((exercise) => (
                  <div
                    key={exercise.id}
                    className="rounded-xl border border-neutral-800 bg-neutral-900/50 overflow-hidden hover:border-neutral-700 transition-colors cursor-pointer"
                    onClick={() => navigate({ to: "/my-exercises" })}
                  >
                    <div className="aspect-video bg-neutral-900 relative">
                      {exercise.image && (
                        <img
                          src={`http://localhost:4000${exercise.image}`}
                          alt={exercise.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {!exercise.isShared && (
                        <div className="absolute top-2 right-2">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs">
                            <Lock className="w-3 h-3" />
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h4 className="text-sm font-semibold text-neutral-50 line-clamp-1">
                        {exercise.name}
                      </h4>
                      <p className="text-xs text-neutral-400 mt-1">
                        {exercise.category}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {myExercises.length > 4 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => navigate({ to: "/my-exercises" })}
                    className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
                  >
                    + {myExercises.length - 4} exercice
                    {myExercises.length - 4 > 1 ? "s" : ""} de plus
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};
