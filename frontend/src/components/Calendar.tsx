import {
  ChevronLeft,
  ChevronRight,
  Award,
  Star,
  Flame,
  Lock,
  Dumbbell,
  Flower2,
  StretchHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DayData {
  day: string;
  date: number;
  status: "completed" | "planned" | "rest" | "free";
  label: string;
}

const weekDays: DayData[] = [
  { day: "Lun", date: 12, status: "completed", label: "Séance OK" },
  { day: "Mar", date: 13, status: "planned", label: "Prévu" },
  { day: "Mer", date: 14, status: "completed", label: "Séance OK" },
  { day: "Jeu", date: 15, status: "free", label: "Libre" },
  { day: "Ven", date: 16, status: "completed", label: "Séance OK" },
  { day: "Sam", date: 17, status: "rest", label: "Repos" },
  { day: "Dim", date: 18, status: "rest", label: "Repos" },
];

const completedSessions = [
  {
    title: "Full body",
    day: "Lun",
    duration: "30 min",
    category: "Musculation",
    icon: Dumbbell,
    color: "sky",
  },
  {
    title: "Yoga soir",
    day: "Mer",
    duration: "20 min",
    category: "Yoga",
    icon: Flower2,
    color: "cyan",
  },
  {
    title: "Mobilité hanches",
    day: "Ven",
    duration: "15 min",
    category: "Mobilité",
    icon: StretchHorizontal,
    color: "blue",
  },
];

export function Calendar() {
  return (
    <div className="grid lg:grid-cols-[1.3fr,0.7fr] gap-4 lg:gap-6">
      {/* Calendar */}
      <div className="rounded-3xl border border-neutral-800/90 bg-neutral-950/90 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center justify-center h-7 w-7 rounded-full border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-neutral-50 transition-colors">
              <ChevronLeft className="w-3.5 h-3.5 stroke-[1.5]" />
            </button>
            <button className="inline-flex items-center justify-center h-7 w-7 rounded-full border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-neutral-50 transition-colors">
              <ChevronRight className="w-3.5 h-3.5 stroke-[1.5]" />
            </button>
            <span className="text-sm font-medium tracking-tight text-neutral-50 ml-1">
              Semaine du 12 au 18
            </span>
          </div>
          <span className="text-xs text-neutral-400">Objectif : 5 séances</span>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center mb-6">
          {weekDays.map((day) => (
            <div key={day.date} className="flex flex-col items-center gap-1">
              <span className="text-[0.65rem] text-neutral-500">{day.day}</span>
              <button
                className={cn(
                  "h-8 w-8 rounded-full text-xs font-medium transition-all",
                  day.status === "completed" &&
                    "bg-sky-500 text-neutral-950 hover:scale-110",
                  day.status === "planned" &&
                    "border border-sky-500/60 bg-sky-500/10 text-sky-200",
                  (day.status === "rest" || day.status === "free") &&
                    "border border-neutral-700 bg-neutral-900 text-neutral-300"
                )}
              >
                {day.date}
              </button>
              <span
                className={cn(
                  "text-[0.65rem]",
                  day.status === "completed" && "text-sky-300",
                  day.status === "planned" && "text-sky-200",
                  (day.status === "rest" || day.status === "free") &&
                    "text-neutral-500"
                )}
              >
                {day.label}
              </span>
            </div>
          ))}
        </div>

        {/* Completed sessions list */}
        <div className="space-y-2">
          <p className="text-xs text-neutral-400 mb-1">
            Séances déjà effectuées
          </p>
          {completedSessions.map((session, index) => {
            const Icon = session.icon;
            return (
              <div
                key={index}
                className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-925/80 px-3 py-2 hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-7 w-7 rounded-lg flex items-center justify-center",
                      session.color === "sky" && "bg-sky-500/20",
                      session.color === "cyan" && "bg-cyan-500/20",
                      session.color === "blue" && "bg-blue-500/20"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-3.5 h-3.5 stroke-[1.5]",
                        session.color === "sky" && "text-sky-300",
                        session.color === "cyan" && "text-cyan-300",
                        session.color === "blue" && "text-blue-300"
                      )}
                    />
                  </div>
                  <div>
                    <p className="text-xs font-medium tracking-tight text-neutral-50">
                      {session.title}
                    </p>
                    <p className="text-[0.65rem] text-neutral-400">
                      {session.day} • {session.duration}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "text-[0.65rem]",
                    session.color === "sky" && "text-sky-300",
                    session.color === "cyan" && "text-cyan-300",
                    session.color === "blue" && "text-blue-300"
                  )}
                >
                  {session.category}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rewards section */}
      <div className="space-y-4">
        {/* Weekly goal */}
        <div className="rounded-3xl border border-sky-500/40 bg-gradient-to-b from-sky-500/20 via-neutral-950 to-neutral-950 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium tracking-tight text-neutral-50">
                Objectif hebdo
              </p>
              <p className="text-xs text-neutral-200">5 séances maison</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-neutral-950/60 flex items-center justify-center">
              <Award className="w-4 h-4 stroke-[1.5] text-sky-100" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-100">Progression</span>
              <span className="text-xs text-neutral-100">3 / 5</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-neutral-900 overflow-hidden">
              <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-300"></div>
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-sky-500/40 bg-neutral-950/60 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-3.5 h-3.5 stroke-[1.5] text-sky-200" />
              <p className="text-xs font-medium tracking-tight text-neutral-50">
                Reward de la semaine
              </p>
            </div>
            <p className="text-xs text-neutral-200">
              Termine 5 séances pour débloquer le badge{" "}
              <span className="text-sky-300">"Semaine complète"</span>.
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="rounded-3xl border border-neutral-800/80 bg-neutral-950/90 p-4 sm:p-5 space-y-3">
          <p className="text-sm font-medium tracking-tight text-neutral-50">
            Badges débloqués
          </p>

          {/* Unlocked badge */}
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center">
              <Flame className="w-4 h-4 stroke-[1.5] text-sky-300" />
            </div>
            <div>
              <p className="text-xs font-medium tracking-tight text-neutral-50">
                3 jours d'affilée
              </p>
              <p className="text-[0.65rem] text-neutral-400">Streak en cours</p>
            </div>
          </div>

          {/* Locked badge */}
          <div className="flex items-center gap-2 opacity-60">
            <div className="h-9 w-9 rounded-full border border-dashed border-neutral-700 flex items-center justify-center">
              <Lock className="w-4 h-4 stroke-[1.5] text-neutral-500" />
            </div>
            <div>
              <p className="text-xs font-medium tracking-tight text-neutral-400">
                Semaine complète
              </p>
              <p className="text-[0.65rem] text-neutral-500">
                5 séances à réaliser
              </p>
            </div>
          </div>

          {/* Another locked badge */}
          <div className="flex items-center gap-2 opacity-60">
            <div className="h-9 w-9 rounded-full border border-dashed border-neutral-700 flex items-center justify-center">
              <Lock className="w-4 h-4 stroke-[1.5] text-neutral-500" />
            </div>
            <div>
              <p className="text-xs font-medium tracking-tight text-neutral-400">
                Champion du mois
              </p>
              <p className="text-[0.65rem] text-neutral-500">
                20 séances en 30 jours
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
