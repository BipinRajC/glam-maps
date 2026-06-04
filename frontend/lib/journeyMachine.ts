export type Screen = "PORTAL" | "PERMISSION" | "DESTINATION" | "COOKING" | "JOURNEY" | "ARRIVAL";

export interface JourneyState {
  screen: Screen;
  selectedRouteId: string | null;
  checkpointIndex: number; // which checkpoint is currently active (-1 = none)
  makeupIntegrity: number; // 0–100
  progressPct: number; // 0–100 route progress
  passport: string[]; // route IDs completed
  locationGranted: boolean;
  activeCheckpointCard: boolean; // is a checkpoint card shown right now
}

export type JourneyAction =
  | { type: "ENTER_GLAMVERSE" }
  | { type: "GRANT_LOCATION" }
  | { type: "DENY_LOCATION" }
  | { type: "SELECT_DESTINATION"; routeId: string }
  | { type: "COOKING_DONE" }
  | { type: "REACH_CHECKPOINT"; checkpointIndex: number; integrityDelta: number; progressPct: number }
  | { type: "DISMISS_CHECKPOINT" }
  | { type: "ARRIVE" }
  | { type: "RESTART" }
  | { type: "DEMO_JUMP_JOURNEY"; routeId: string }
  | { type: "DEMO_JUMP_ARRIVAL" };

export const INITIAL_STATE: JourneyState = {
  screen: "PORTAL",
  selectedRouteId: null,
  checkpointIndex: -1,
  makeupIntegrity: 100,
  progressPct: 0,
  passport: [],
  locationGranted: false,
  activeCheckpointCard: false,
};

export function journeyReducer(state: JourneyState, action: JourneyAction): JourneyState {
  switch (action.type) {
    case "ENTER_GLAMVERSE":
      return { ...state, screen: "PERMISSION" };

    case "GRANT_LOCATION":
      return { ...state, locationGranted: true, screen: "DESTINATION" };

    case "DENY_LOCATION":
      return { ...state, locationGranted: false, screen: "DESTINATION" };

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
        passport: state.selectedRouteId && !state.passport.includes(state.selectedRouteId)
          ? [...state.passport, state.selectedRouteId]
          : state.passport,
      };

    case "RESTART":
      return { ...INITIAL_STATE, passport: state.passport };

    case "DEMO_JUMP_JOURNEY":
      return {
        ...INITIAL_STATE,
        screen: "JOURNEY",
        selectedRouteId: action.routeId,
        passport: state.passport,
      };

    case "DEMO_JUMP_ARRIVAL":
      return {
        ...state,
        screen: "ARRIVAL",
        progressPct: 100,
        makeupIntegrity: state.makeupIntegrity,
        passport: state.selectedRouteId && !state.passport.includes(state.selectedRouteId ?? "")
          ? [...state.passport, state.selectedRouteId ?? ""]
          : state.passport,
      };

    default:
      return state;
  }
}
