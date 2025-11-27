import { createFileRoute } from "@tanstack/react-router";
import { SessionDetailsPage } from "@/pages/SessionDetailsPage";

export const Route = createFileRoute("/session-details/$sessionId")({
  component: () => {
    const { sessionId } = Route.useParams();
    return <SessionDetailsPage sessionId={sessionId} />;
  },
});
