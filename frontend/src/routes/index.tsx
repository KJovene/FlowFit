import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  Dumbbell,
  Flower2,
  StretchHorizontal,
  Plus,
  PlayCircle,
  Timer,
  Bell,
  ArrowRight,
  Play,
} from "lucide-react";
import { WorkoutCard } from "@/components/WorkoutCard";
import { SessionCard } from "@/components/SessionCard";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-16 lg:pt-20 pb-10 sm:pb-16">
      {/* Hero Section */}
      <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-10 lg:gap-14 items-center">
        {/* Left: Hero copy */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-neutral-900/70 backdrop-blur-md text-xs text-sky-100 px-2.5 py-1">
            <span className="inline-flex items-center justify-center rounded-full bg-sky-500/20 text-sky-300 h-4 w-4">
              <Activity className="w-3 h-3 stroke-[1.5]" />
            </span>
            <span>Sport à la maison • Simple & guidé</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-neutral-50">
              Vos séances maison,
              <span className="text-gradient-primary"> en 3 espaces clés.</span>
            </h1>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pt-1">
            <Link to="/sessions" className="btn-primary px-5 sm:px-6 py-2">
              <Plus className="w-4 h-4 stroke-[1.5] mr-2" />
              Créer une séance
            </Link>
            <Link to="/exercises" className="btn-primary px-5 sm:px-6 py-2">
              <Plus className="w-4 h-4 stroke-[1.5] mr-2" />
              Créer un exercice
            </Link>
          </div>

          {/* 3 spaces cards preview */}
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-7 w-7 rounded-full bg-sky-500/15 flex items-center justify-center">
                  <Dumbbell className="w-3.5 h-3.5 stroke-[1.5] text-sky-400" />
                </div>
                <h3 className="text-sm font-medium tracking-tight text-neutral-50">
                  Musculation
                </h3>
              </div>
              <p className="text-sm text-neutral-300">
                Force & cardio au poids du corps ou avec haltères.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-7 w-7 rounded-full bg-cyan-500/15 flex items-center justify-center">
                  <Flower2 className="w-3.5 h-3.5 stroke-[1.5] text-cyan-300" />
                </div>
                <h3 className="text-sm font-medium tracking-tight text-neutral-50">
                  Yoga
                </h3>
              </div>
              <p className="text-sm text-neutral-300">
                Flows doux ou dynamiques pour respirer et se recentrer.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-7 w-7 rounded-full bg-blue-500/15 flex items-center justify-center">
                  <StretchHorizontal className="w-3.5 h-3.5 stroke-[1.5] text-blue-300" />
                </div>
                <h3 className="text-sm font-medium tracking-tight text-neutral-50">
                  Mobilité
                </h3>
              </div>
              <p className="text-sm text-neutral-300">
                Routines courtes pour bouger librement et sans douleur.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Workout Spaces Section */}
      <section className="mt-10 sm:mt-14 lg:mt-16">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-50">
              Vos 3 espaces d'entraînement
            </h2>
            <p className="text-base text-neutral-300 max-w-xl">
              Passez facilement de la musculation au yoga et à la mobilité.
            </p>
          </div>
          <Link to="/programmes" className="btn-secondary px-3 sm:px-4 py-1.5">
            Voir tous les programmes
            <ArrowRight className="w-3.5 h-3.5 stroke-[1.5] ml-1.5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4 lg:gap-5">
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
      </section>
    </section>
  );
}
