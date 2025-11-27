import { createFileRoute } from "@tanstack/react-router";
import { MySessionsPage } from "@/pages/MySessionsPage";

export const Route = createFileRoute("/my-sessions")({
  component: MySessionsPage,
});
