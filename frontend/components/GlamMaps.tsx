"use client";

import { useReducer, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { journeyReducer, INITIAL_STATE } from "@/lib/journeyMachine";
import { ROUTES } from "@/lib/routes";
import { loadPassport, savePassport } from "@/lib/passport";
import PortalScreen from "@/components/screens/PortalScreen";
import PermissionScreen from "@/components/screens/PermissionScreen";
import DestinationScreen from "@/components/screens/DestinationScreen";
import CookingScreen from "@/components/screens/CookingScreen";
import JourneyScreen from "@/components/screens/JourneyScreen";
import ArrivalScreen from "@/components/screens/ArrivalScreen";
import DemoControls from "@/components/DemoControls";

export default function GlamMaps() {
  const [state, dispatch] = useReducer(journeyReducer, {
    ...INITIAL_STATE,
    passport: loadPassport(),
  });

  // Persist passport on change
  useEffect(() => {
    savePassport(state.passport);
  }, [state.passport]);

  // Demo keyboard shortcut: Shift+D → jump to Journey (survival route), Shift+A → jump to Arrival
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.shiftKey && e.key === "D") {
        dispatch({ type: "DEMO_JUMP_JOURNEY", routeId: "survival" });
      }
      if (e.shiftKey && e.key === "A") {
        if (state.selectedRouteId) dispatch({ type: "DEMO_JUMP_ARRIVAL" });
        else dispatch({ type: "DEMO_JUMP_JOURNEY", routeId: "influencer" });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.selectedRouteId]);

  const selectedRoute = state.selectedRouteId ? ROUTES[state.selectedRouteId] : null;

  const handleReachCheckpoint = useCallback(
    (index: number, delta: number, progress: number) => {
      dispatch({ type: "REACH_CHECKPOINT", checkpointIndex: index, integrityDelta: delta, progressPct: progress });
    },
    []
  );

  const handleDismissCheckpoint = useCallback(() => {
    dispatch({ type: "DISMISS_CHECKPOINT" });
  }, []);

  return (
    <div className="w-full min-h-dvh flex items-start justify-center" style={{ background: "#0D0D1A" }}>
      {/* Mobile-width container */}
      <div className="relative w-full max-w-[430px] min-h-dvh overflow-hidden" style={{ background: "#1A1A2E" }}>
        <AnimatePresence mode="sync">
          {state.screen === "PORTAL" && (
            <PortalScreen
              key="portal"
              passport={state.passport}
              onEnter={() => dispatch({ type: "ENTER_GLAMVERSE" })}
            />
          )}

          {state.screen === "PERMISSION" && (
            <PermissionScreen
              key="permission"
              onGrant={() => dispatch({ type: "GRANT_LOCATION" })}
              onDeny={() => dispatch({ type: "DENY_LOCATION" })}
            />
          )}

          {state.screen === "DESTINATION" && (
            <DestinationScreen
              key="destination"
              onSelect={(routeId) => dispatch({ type: "SELECT_DESTINATION", routeId })}
            />
          )}

          {state.screen === "COOKING" && selectedRoute && (
            <CookingScreen
              key="cooking"
              route={selectedRoute}
              onDone={() => dispatch({ type: "COOKING_DONE" })}
            />
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
            <ArrivalScreen
              key="arrival"
              route={selectedRoute}
              makeupIntegrity={state.makeupIntegrity}
              onRestart={() => dispatch({ type: "RESTART" })}
            />
          )}
        </AnimatePresence>

        {/* Demo safety controls — hidden overlay */}
        <DemoControls
          onJumpJourney={(routeId) => dispatch({ type: "DEMO_JUMP_JOURNEY", routeId })}
          onJumpArrival={() => {
            if (!state.selectedRouteId) dispatch({ type: "DEMO_JUMP_JOURNEY", routeId: "influencer" });
            setTimeout(() => dispatch({ type: "DEMO_JUMP_ARRIVAL" }), 100);
          }}
        />
      </div>

      {/* Ambient gutter on large screens */}
      <style>{`
        @media (min-width: 430px) {
          body { background: #0D0D1A; }
        }
      `}</style>
    </div>
  );
}
