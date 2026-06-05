"use client";

import { useReducer, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { journeyReducer, INITIAL_STATE } from "@/lib/journeyMachine";
import { ROUTES } from "@/lib/routes";

import PortalScreen from "@/components/screens/PortalScreen";
import PermissionScreen from "@/components/screens/PermissionScreen";
import DestinationScreen from "@/components/screens/DestinationScreen";
import CookingScreen from "@/components/screens/CookingScreen";
import JourneyScreen from "@/components/screens/JourneyScreen";
import ArrivalScreen from "@/components/screens/ArrivalScreen";

export default function GlamMaps() {
  const [state, dispatch] = useReducer(journeyReducer, INITIAL_STATE);

  const selectedRoute = state.selectedRouteId ? ROUTES[state.selectedRouteId] : null;

  const handleReachCheckpoint = useCallback((index: number, delta: number, progress: number) => {
    dispatch({ type: "REACH_CHECKPOINT", checkpointIndex: index, integrityDelta: delta, progressPct: progress });
  }, []);

  const handleDismissCheckpoint = useCallback(() => {
    dispatch({ type: "DISMISS_CHECKPOINT" });
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[480px] min-h-dvh overflow-x-hidden" style={{ background: "#0D0D1A" }}>
      <AnimatePresence mode="sync">
        {state.screen === "PORTAL" && (
          <PortalScreen key="portal" onEnter={() => dispatch({ type: "ENTER_GLAMVERSE" })} />
        )}
        {state.screen === "PERMISSION" && (
          <PermissionScreen key="permission" onGrant={(coords) => dispatch({ type: "GRANT_LOCATION", coords })} />
        )}
        {state.screen === "DESTINATION" && (
          <DestinationScreen key="destination" userLocation={state.userLocation} onSelect={(routeId) => dispatch({ type: "SELECT_DESTINATION", routeId })} />
        )}
        {state.screen === "COOKING" && selectedRoute && (
          <CookingScreen key="cooking" route={selectedRoute} onDone={() => dispatch({ type: "COOKING_DONE" })} />
        )}
        {state.screen === "JOURNEY" && selectedRoute && (
          <JourneyScreen
            key="journey"
            route={selectedRoute}
            journeyState={state}
            onReachCheckpoint={handleReachCheckpoint}
            onDismissCheckpoint={handleDismissCheckpoint}
            onArrive={() => dispatch({ type: "ARRIVE" })}
          />
        )}
        {state.screen === "ARRIVAL" && selectedRoute && (
          <ArrivalScreen key="arrival" route={selectedRoute} makeupIntegrity={state.makeupIntegrity} onRestart={() => dispatch({ type: "RESTART" })} />
        )}
      </AnimatePresence>
    </div>
  );
}
