"use client";

import { useReducer, useCallback, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { journeyReducer, INITIAL_STATE } from "@/lib/journeyMachine";
import { ROUTES } from "@/lib/routes";
import { synthesizeRoute } from "@/lib/waypoints";

import PortalScreen from "@/components/screens/PortalScreen";
import PermissionScreen from "@/components/screens/PermissionScreen";
import LocationSelectScreen from "@/components/screens/LocationSelectScreen";
import CookingScreen from "@/components/screens/CookingScreen";
import JourneyScreen from "@/components/screens/JourneyScreen";
import ArrivalScreen from "@/components/screens/ArrivalScreen";

export default function GlamMaps() {
  const [state, dispatch] = useReducer(journeyReducer, INITIAL_STATE);

  const selectedRoute = useMemo(() => {
    if (state.selectedPickup && state.selectedDestination) {
      return synthesizeRoute(state.selectedPickup, state.selectedDestination, state.userLocation);
    }
    return state.selectedRouteId ? ROUTES[state.selectedRouteId] : null;
  }, [state.selectedPickup, state.selectedDestination, state.selectedRouteId, state.userLocation]);

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
          <LocationSelectScreen
            key="destination"
            userLocation={state.userLocation}
            onSelect={(pickup, destination) => dispatch({ type: "SELECT_PICKUP_DESTINATION", pickup, destination })}
          />
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
