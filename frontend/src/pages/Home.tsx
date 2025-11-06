import { useEffect, useState } from "react";
import { assets } from "../assets/assets.ts";
import "../index.css";
import { Link } from "react-router-dom";
import { exerciseAPI } from "../services/exerciseService";

interface CategoryCount {
  Musculation: number;
  Yoga: number;
  Mobilité: number;
}

const Home = () => {
  const [counts, setCounts] = useState<CategoryCount>({
    Musculation: 0,
    Yoga: 0,
    Mobilité: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [muscu, yoga, mobilite] = await Promise.all([
          exerciseAPI.getExercisesByCategory("Musculation"),
          exerciseAPI.getExercisesByCategory("Yoga"),
          exerciseAPI.getExercisesByCategory("Mobilité"),
        ]);

        setCounts({
          Musculation: muscu.data.exercises?.length || 0,
          Yoga: yoga.data.exercises?.length || 0,
          Mobilité: mobilite.data.exercises?.length || 0,
        });
      } catch (error) {
        console.error("Erreur lors du chargement des exercices:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl mb-10">FlowFit</h1>
      <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4 p-3 w-full">
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-4 justify-between hover:bg-gray-200 transition">
          <img
            className="w-[40px] icon-blue"
            src={assets.IconMuscu}
            alt="Icon Muscu"
          />
          <Link
            to={"/musculationExercices"}
            className="flex flex-raw gap-8 flex-1"
          >
            <div>
              <p className="flex justify-end font-semibold">Musculation</p>
              <span className="text-sm">{counts.Musculation} exercices</span>
            </div>
            <img
              className="flex w-[20px] self-start"
              src={assets.Arrow}
              alt=""
            />
          </Link>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-4 justify-between hover:bg-gray-200 transition">
          <img
            className="w-[40px] icon-blue"
            src={assets.IconYoga}
            alt="Icon Yoga"
          />
          <Link to={"/yogaExercices"} className="flex flex-raw gap-8 flex-1">
            <div>
              <p className="flex justify-end font-semibold">Yoga</p>
              <span className="text-sm">{counts.Yoga} exercices</span>
            </div>
            <img
              className="flex w-[20px] self-start"
              src={assets.Arrow}
              alt=""
            />
          </Link>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-4 justify-between hover:bg-gray-200 transition">
          <img
            className="w-[40px] icon-blue"
            src={assets.IconMobility}
            alt="Icon Mobilité"
          />
          <Link
            to={"/mobilityExercices"}
            className="flex flex-raw gap-8 flex-1"
          >
            <div>
              <p className="flex justify-end font-semibold">Mobilité</p>
              <span className="text-sm">{counts.Mobilité} exercices</span>
            </div>
            <img
              className="flex w-[20px] self-start"
              src={assets.Arrow}
              alt=""
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
