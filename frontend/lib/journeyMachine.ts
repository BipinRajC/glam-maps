export type Screen = "PORTAL" | "PERMISSION" | "DESTINATION" | "COOKING" | "JOURNEY" | "ARRIVAL";

export interface JourneyState {
  screen: Screen;
  selectedRouteId: string | null;
  checkpointIndex: number; // which checkpoint is currently active (-1 = none)
  makeupIntegrity: number; // 0–100
  progressPct: number; // 0–100 route progress
  locationGranted: boolean;
  activeCheckpointCard: boolean;
  userLocation: [number, number] | null;
}

export type JourneyAction =
  | { type: "ENTER_GLAMVERSE" }
  | { type: "GRANT_LOCATION"; coords: [number, number] }
  | { type: "SELECT_DESTINATION"; routeId: string }
  | { type: "COOKING_DONE" }
  | { type: "REACH_CHECKPOINT"; checkpointIndex: number; integrityDelta: number; progressPct: number }
  | { type: "DISMISS_CHECKPOINT" }
  | { type: "ARRIVE" }
  | { type: "SET_SNAPPED_START"; coords: [number, number] }
  | { type: "RESTART" };

export const INITIAL_STATE: JourneyState = {
  screen: "PORTAL",
  selectedRouteId: null,
  checkpointIndex: -1,
  makeupIntegrity: 100,
  progressPct: 0,
  locationGranted: false,
  activeCheckpointCard: false,
  userLocation: null,
};

export function journeyReducer(state: JourneyState, action: JourneyAction): JourneyState {
  switch (action.type) {
    case "ENTER_GLAMVERSE":
      return { ...state, screen: "PERMISSION" };

    case "GRANT_LOCATION":
      return { ...state, locationGranted: true, userLocation: action.coords, screen: "DESTINATION" };

    case "SELECT_DESTINATION":
      return {
        ...state,
        screen: "COOKING",
        selectedRouteId: action.routeId,
        checkpointIndex: -1,
        makeupIntegrity: 100,
        progressPct: 0,
        activeCheckpointCard: false,
      };

    case "COOKING_DONE":
      return { ...state, screen: "JOURNEY" };

    case "REACH_CHECKPOINT":
      return {
        ...state,
        checkpointIndex: action.checkpointIndex,
        makeupIntegrity: Math.max(0, Math.min(100, state.makeupIntegrity + action.integrityDelta)),
        progressPct: action.progressPct,
        activeCheckpointCard: true,
      };

    case "DISMISS_CHECKPOINT":
      return { ...state, activeCheckpointCard: false };

    case "ARRIVE":
      return {
        ...state,
        screen: "ARRIVAL",
        progressPct: 100,
      };

    case "SET_SNAPPED_START":
      return { ...state, userLocation: action.coords };

    case "RESTART":
      return INITIAL_STATE;

    default:
      return state;
  }
}
