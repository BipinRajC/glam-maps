import { CHECKPOINT_DEFS, type CheckpointDef } from "./checkpoints";

export type Difficulty = "Easy" | "Medium" | "Survival Mode";

export interface RouteCheckpoint {
  def: CheckpointDef;
  coords: [number, number]; // [lng, lat]
  progressPct: number; // 0–100 where along the route this sits
}

export interface GlamRoute {
  id: string;
  glamName: string;
  realName: string;
  personality: string;
  difficulty: Difficulty;
  emoji: string;
  description: string;
  integrityEnd: number; // approximate ending integrity
  polyline: [number, number][]; // [lng, lat] GeoJSON order
  startCoords: [number, number];
  endCoords: [number, number];
  checkpoints: RouteCheckpoint[];
  stats: {
    potholeCount: number;
    hazardZones: number;
    smoothCorridors: number;
    worstStretch: string;
    smoothestStretch: string;
    communityReports: number;
  };
}

// All polylines hand-traced along real Bengaluru roads (lng, lat order for MapLibre)
const INFLUENCER_POLYLINE: [number, number][] = [
  [77.5946, 12.9716], // Start: Cubbon Park area
  [77.5980, 12.9740],
  [77.6010, 12.9760],
  [77.6059, 12.9766], // MG Road flyover
  [77.6080, 12.9760],
  [77.6100, 12.9750],
  [77.6120, 12.9740],
  [77.6150, 12.9730],
  [77.6192, 12.9787], // Ulsoor smooth
  [77.6210, 12.9800],
  [77.6230, 12.9810],
];

const BRUNCH_POLYLINE: [number, number][] = [
  [77.5946, 12.9716], // Start: Cubbon Park area
  [77.5980, 12.9740],
  [77.6059, 12.9766], // MG Road flyover
  [77.6072, 12.9601], // Richmond Road
  [77.6100, 12.9650],
  [77.6192, 12.9787], // Ulsoor
  [77.6280, 12.9784],
  [77.6350, 12.9784],
  [77.6408, 12.9784], // Indiranagar
];

const SURVIVAL_POLYLINE: [number, number][] = [
  [77.5946, 12.9716], // Start: Cubbon Park
  [77.6000, 12.9660],
  [77.6072, 12.9601], // Richmond Road
  [77.6150, 12.9580],
  [77.6300, 12.9590],
  [77.6390, 12.9600], // Domlur Junction
  [77.6350, 12.9500],
  [77.6300, 12.9450],
  [77.6245, 12.9352], // Koramangala cluster
];

export const ROUTES: Record<string, GlamRoute> = {
  influencer: {
    id: "influencer",
    glamName: "MG Road Glam Strip",
    realName: "MG Road Corridor",
    personality: "The Influencer Route",
    difficulty: "Easy",
    emoji: "✨",
    description: "Bengaluru's most photogenic corridor. Flyovers keep the drama at a minimum, the highlighter at a maximum.",
    integrityEnd: 87,
    polyline: INFLUENCER_POLYLINE,
    startCoords: [77.5946, 12.9716],
    endCoords: [77.6230, 12.9810],
    checkpoints: [
      { def: CHECKPOINT_DEFS.glow_preservation, coords: [77.5980, 12.9740], progressPct: 15 },
      { def: CHECKPOINT_DEFS.highlight_haven, coords: [77.6059, 12.9766], progressPct: 35 },
      { def: CHECKPOINT_DEFS.glow_preservation, coords: [77.6120, 12.9750], progressPct: 55 },
      { def: CHECKPOINT_DEFS.lipstick_checkpoint, coords: [77.6150, 12.9730], progressPct: 75 },
      { def: CHECKPOINT_DEFS.highlight_haven, coords: [77.6192, 12.9787], progressPct: 90 },
    ],
    stats: {
      potholeCount: 1,
      hazardZones: 1,
      smoothCorridors: 3,
      worstStretch: "Indiranagar Link Road — 1 speed bump, medium severity",
      smoothestStretch: "MG Road Flyover — 0 reports, pristine",
      communityReports: 3,
    },
  },
  brunch: {
    id: "brunch",
    glamName: "Indiranagar Highlight Avenue",
    realName: "MG Road → Ulsoor → Indiranagar",
    personality: "The Brunch Route",
    difficulty: "Medium",
    emoji: "💋",
    description: "Starts glamorous, gets real. Like any brunch that lasts past 2pm.",
    integrityEnd: 68,
    polyline: BRUNCH_POLYLINE,
    startCoords: [77.5946, 12.9716],
    endCoords: [77.6408, 12.9784],
    checkpoints: [
      { def: CHECKPOINT_DEFS.glow_preservation, coords: [77.6059, 12.9766], progressPct: 15 },
      { def: CHECKPOINT_DEFS.highlight_haven, coords: [77.6080, 12.9760], progressPct: 30 },
      { def: CHECKPOINT_DEFS.mascara_meltdown, coords: [77.6072, 12.9601], progressPct: 48 },
      { def: CHECKPOINT_DEFS.foundation_risk, coords: [77.6192, 12.9787], progressPct: 65 },
      { def: CHECKPOINT_DEFS.lipstick_checkpoint, coords: [77.6350, 12.9784], progressPct: 82 },
    ],
    stats: {
      potholeCount: 5,
      hazardZones: 3,
      smoothCorridors: 1,
      worstStretch: "Richmond Road — 2 potholes, avg severity 5.1/10",
      smoothestStretch: "Ulsoor Lake Corridor — 0 reports",
      communityReports: 18,
    },
  },
  survival: {
    id: "survival",
    glamName: "Koramangala Contour District",
    realName: "Richmond → Domlur → Koramangala",
    personality: "The Survival Challenge",
    difficulty: "Survival Mode",
    emoji: "💀",
    description: "Bengaluru's ultimate makeup endurance test. Only the bold dare this route.",
    integrityEnd: 37,
    polyline: SURVIVAL_POLYLINE,
    startCoords: [77.5946, 12.9716],
    endCoords: [77.6245, 12.9352],
    checkpoints: [
      { def: CHECKPOINT_DEFS.foundation_risk, coords: [77.6072, 12.9601], progressPct: 15 },
      { def: CHECKPOINT_DEFS.mascara_meltdown, coords: [77.6150, 12.9580], progressPct: 32 },
      { def: CHECKPOINT_DEFS.contour_catastrophe, coords: [77.6390, 12.9600], progressPct: 52 },
      { def: CHECKPOINT_DEFS.lipstick_checkpoint, coords: [77.6300, 12.9500], progressPct: 70 },
      { def: CHECKPOINT_DEFS.contour_catastrophe, coords: [77.6245, 12.9352], progressPct: 88 },
    ],
    stats: {
      potholeCount: 12,
      hazardZones: 5,
      smoothCorridors: 0,
      worstStretch: "Koramangala 4th Block — 4 potholes, severity 8.5/10",
      smoothestStretch: "None. Bengaluru won this one.",
      communityReports: 41,
    },
  },
};

export const DESTINATION_CARDS = [
  { id: "mg-road", glamName: "MG Road Glam Strip", realName: "MG Road", emoji: "✨", vibe: "Flyover energy, zero pothole drama", difficulty: "Easy" as Difficulty, routeId: "influencer" },
  { id: "whitefield", glamName: "Whitefield Glow Quarter", realName: "Whitefield", emoji: "💎", vibe: "Premium roads, premium vibes", difficulty: "Easy" as Difficulty, routeId: "influencer" },
  { id: "indiranagar", glamName: "Indiranagar Highlight Avenue", realName: "Indiranagar", emoji: "💋", vibe: "Brunch vibes, road surprises", difficulty: "Medium" as Difficulty, routeId: "brunch" },
  { id: "jpnagar", glamName: "JP Nagar Blush Boulevard", realName: "JP Nagar", emoji: "🌸", vibe: "Scenic chaos. Clutch your liner.", difficulty: "Medium" as Difficulty, routeId: "brunch" },
  { id: "koramangala", glamName: "Koramangala Contour District", realName: "Koramangala", emoji: "💀", vibe: "Survival Mode. You've been warned.", difficulty: "Survival Mode" as Difficulty, routeId: "survival" },
  { id: "electronic-city", glamName: "Electronic City Foundation Zone", realName: "Electronic City", emoji: "🏗️", vibe: "Construction central. Foundation: RIP.", difficulty: "Survival Mode" as Difficulty, routeId: "survival" },
];
