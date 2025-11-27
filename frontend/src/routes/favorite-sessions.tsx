import { createFileRoute } from "@tanstack/react-router";
import { FavoriteSessionsPage } from "@/pages/FavoriteSessionsPage";

export const Route = createFileRoute("/favorite-sessions")({
  component: FavoriteSessionsPage,
});
