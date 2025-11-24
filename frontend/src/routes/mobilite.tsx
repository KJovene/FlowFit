import { createFileRoute } from "@tanstack/react-router";
import { StretchHorizontal, Play } from "lucide-react";
import { SessionCard } from "@/components/SessionCard";

export const Route = createFileRoute("/mobilite")({
  component: MobilitePage,
});

const sessions = [
  { title: "Mobilité dos", duration: "10 min", equipment: "Sans matériel" },
  { title: "Hanches & bassin", duration: "15 min", equipment: "Sans matériel" },
  {
    title: "Épaules & thoracique",
    duration: "10 min",
    equipment: "Sans matériel",
  },
  { title: "Routine complète", duration: "20 min", equipment: "Sans matériel" },
  {
    title: "Échauffement pré-séance",
    duration: "8 min",
    equipment: "Sans matériel",
  },
  {
    title: "Récupération post-effort",
    duration: "12 min",
    equipment: "Sans matériel",
  },
];

function MobilitePage() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-16 lg:pt-20 pb-10 sm:pb-16">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-12 w-12 rounded-2xl bg-blue-400/20 flex items-center justify-center">
            <StretchHorizontal className="w-6 h-6 stroke-[1.5] text-blue-200" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-50">
              Mobilité
            </h1>
            <p className="text-sm text-neutral-400">Articulations & posture</p>
          </div>
        </div>
        <p className="text-base text-neutral-300 max-w-2xl">
          Améliorez votre amplitude de mouvement et prévenez les douleurs avec
          des routines ciblées. Parfait avant ou après vos séances
          d'entraînement.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button className="px-3 py-1.5 text-xs rounded-full bg-blue-400 text-neutral-950 font-medium">
          Tous
        </button>
        <button className="px-3 py-1.5 text-xs rounded-full border border-neutral-700 bg-neutral-900/50 text-neutral-300 hover:border-neutral-600">
          Dos
        </button>
        <button className="px-3 py-1.5 text-xs rounded-full border border-neutral-700 bg-neutral-900/50 text-neutral-300 hover:border-neutral-600">
          Hanches
        </button>
        <button className="px-3 py-1.5 text-xs rounded-full border border-neutral-700 bg-neutral-900/50 text-neutral-300 hover:border-neutral-600">
          Épaules
        </button>
      </div>

      {/* Sessions grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sessions.map((session, index) => (
          <div key={index} className="relative group">
            <SessionCard
              title={session.title}
              duration={session.duration}
              category="Mobilité"
              equipment={session.equipment}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-2xl">
              <button className="btn-primary px-4 py-2">
                <Play className="w-4 h-4 mr-2" />
                Démarrer
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
