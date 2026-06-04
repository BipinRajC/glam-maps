import { useState } from "react";
import type { RouteBundle } from "./api/types";
import { ScoreScreen } from "./score/ScoreScreen";
import { JourneyScreen } from "./screens/JourneyScreen";
import { RoutePicker } from "./screens/RoutePicker";

type Screen = "picker" | "journey" | "score";

export function App() {
  const [screen, setScreen] = useState<Screen>("picker");
  const [route, setRoute] = useState<RouteBundle | null>(null);

  return (
    <>
      {screen === "picker" && (
        <RoutePicker
          onSelect={(r) => {
            setRoute(r);
            setScreen("journey");
          }}
        />
      )}
      {screen === "journey" && route && (
        <JourneyScreen route={route} onComplete={() => setScreen("score")} />
      )}
      {screen === "score" && route && <ScoreScreen route={route} />}
    </>
  );
}
