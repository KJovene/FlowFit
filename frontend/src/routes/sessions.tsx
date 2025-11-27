import { createFileRoute } from "@tanstack/react-router";
import { SessionsPage } from "@/pages/SessionsPage";

export const Route = createFileRoute("/sessions")({
  component: SessionsPage,
});
