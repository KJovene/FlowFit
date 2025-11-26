import { createFileRoute } from "@tanstack/react-router";
import { SessionPlayerPage } from "@/pages/SessionPlayerPage";

export const Route = createFileRoute("/session-player/$sessionId")({
  component: () => {
    const { sessionId } = Route.useParams();
    const searchParams = Route.useSearch() as {
      restTime?: number;
      durations?: string;
    };
    
    const durations = searchParams.durations
      ? JSON.parse(searchParams.durations)
      : {};

    return (
      <SessionPlayerPage
        sessionId={sessionId}
        restTime={searchParams.restTime}
        durations={durations}
      />
    );
  },
});
