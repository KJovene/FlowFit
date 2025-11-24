import { createFileRoute, Link } from "@tanstack/react-router";
import { Dumbbell, Flower2, StretchHorizontal, ArrowRight } from "lucide-react";
import { WorkoutCard } from "@/components/WorkoutCard";

export const Route = createFileRoute("/programmes")({
  component: ProgrammesPage,
});

function ProgrammesPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-16 lg:pt-20 pb-10 sm:pb-16">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-50 mb-3">
          Tous les programmes
        </h1>
        <p className="text-base text-neutral-300 max-w-2xl">
          Explorez nos trois espaces d'entraînement et trouvez la séance
          parfaite pour aujourd'hui.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 lg:gap-5 mb-10">
        <WorkoutCard
          title="Musculation"
          description="Force & tonification"
          category="musculation"
          icon={Dumbbell}
          sessionCount="40+ séances"
          items={[
            "Poids du corps",
            "Haltères & élastiques",
            "Formats 10–30 min",
          ]}
          onOpen={() => (window.location.href = "/musculation")}
        />

        <WorkoutCard
          title="Yoga"
          description="Calme & énergie"
          category="yoga"
          icon={Flower2}
          sessionCount="25+ flows"
          items={["Flows doux", "Séances dynamiques", "Respiration guidée"]}
          onOpen={() => (window.location.href = "/yoga")}
        />

        <WorkoutCard
          title="Mobilité"
          description="Articulations & posture"
          category="mobility"
          icon={StretchHorizontal}
          sessionCount="15 routines"
          items={[
            "Routines 5–15 min",
            "Dos, hanches, épaules",
            "Avant / après séance",
          ]}
          onOpen={() => (window.location.href = "/mobilite")}
        />
      </div>

      {/* Quick access sections */}
      <div className="space-y-6">
        <div className="rounded-3xl border border-neutral-800/90 bg-neutral-950/90 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold tracking-tight text-neutral-50">
              Recommandations du jour
            </h2>
            <span className="text-xs text-neutral-400">
              Basé sur votre historique
            </span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/musculation"
              className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-4 hover:border-neutral-700 transition-all card-hover"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-xl bg-sky-500/20 flex items-center justify-center">
                  <Dumbbell className="w-4 h-4 stroke-[1.5] text-sky-300" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium tracking-tight text-neutral-50">
                    Full Body
                  </p>
                  <p className="text-xs text-neutral-400">
                    30 min • Sans matériel
                  </p>
                </div>
              </div>
            </Link>

            <Link
              to="/yoga"
              className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-4 hover:border-neutral-700 transition-all card-hover"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-xl bg-cyan-400/20 flex items-center justify-center">
                  <Flower2 className="w-4 h-4 stroke-[1.5] text-cyan-200" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium tracking-tight text-neutral-50">
                    Yoga matinal
                  </p>
                  <p className="text-xs text-neutral-400">15 min • Tapis</p>
                </div>
              </div>
            </Link>

            <Link
              to="/mobilite"
              className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-4 hover:border-neutral-700 transition-all card-hover"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-xl bg-blue-400/20 flex items-center justify-center">
                  <StretchHorizontal className="w-4 h-4 stroke-[1.5] text-blue-200" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium tracking-tight text-neutral-50">
                    Mobilité dos
                  </p>
                  <p className="text-xs text-neutral-400">
                    10 min • Sans matériel
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
