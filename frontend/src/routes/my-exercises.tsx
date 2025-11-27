import { createFileRoute } from "@tanstack/react-router";
import { MyExercisesPage } from "@/pages/MyExercisesPage";

export const Route = createFileRoute("/my-exercises")({
  component: MyExercisesPage,
});
