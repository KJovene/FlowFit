import { createFileRoute } from "@tanstack/react-router";
import { Dumbbell, Play } from "lucide-react";
import { SessionCard } from "@/components/SessionCard";

export const Route = createFileRoute("/musculation")({
  component: MusculationPage,
});

const sessions = [
  { title: "Full Body maison", duration: "30 min", equipment: "Sans matériel" },
  { title: "Haut du corps", duration: "25 min", equipment: "Haltères" },
  {
    title: "Jambes & fessiers",
    duration: "35 min",
    equipment: "Sans matériel",
  },
  { title: "Cardio HIIT", duration: "20 min", equipment: "Sans matériel" },
  { title: "Circuit métabolique", duration: "30 min", equipment: "Haltères" },
  { title: "Dos & bras", duration: "25 min", equipment: "Élastiques" },
];

function MusculationPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-16 lg:pt-20 pb-10 sm:pb-16">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-12 w-12 rounded-2xl bg-sky-500/20 flex items-center justify-center">
            <Dumbbell className="w-6 h-6 stroke-[1.5] text-sky-300" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-50">
              Musculation
            </h1>
            <p className="text-sm text-neutral-400">Force & tonification</p>
          </div>
        </div>
        <p className="text-base text-neutral-300 max-w-2xl">
          Développez votre force et votre masse musculaire avec des séances
          adaptées à tous les niveaux. Choisissez entre des entraînements au
          poids du corps, avec haltères ou élastiques.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button className="px-3 py-1.5 text-xs rounded-full bg-sky-500 text-neutral-950 font-medium">
          Tous
        </button>
        <button className="px-3 py-1.5 text-xs rounded-full border border-neutral-700 bg-neutral-900/50 text-neutral-300 hover:border-neutral-600">
          Sans matériel
        </button>
        <button className="px-3 py-1.5 text-xs rounded-full border border-neutral-700 bg-neutral-900/50 text-neutral-300 hover:border-neutral-600">
          Haltères
        </button>
        <button className="px-3 py-1.5 text-xs rounded-full border border-neutral-700 bg-neutral-900/50 text-neutral-300 hover:border-neutral-600">
          Élastiques
        </button>
      </div>

      {/* Sessions grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sessions.map((session, index) => (
          <div key={index} className="relative group">
            <SessionCard
              title={session.title}
              duration={session.duration}
              category="Musculation"
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
