import { CHECKPOINT_DEFS, type CheckpointDef } from "./checkpoints";

export type Difficulty = "Easy" | "Medium" | "Survival Mode";

export interface RouteCheckpoint {
  def: CheckpointDef;
  coords: [number, number]; // [lng, lat]
  progressPct: number;      // 0–100 where along route
}

export interface GlamRoute {
  id: string;
  glamName: string;
  realName: string;
  personality: string;
  difficulty: Difficulty;
  emoji: string;
  description: string;
  roadScore: number;        // 0–100 road quality score for leaderboard
  integrityEnd: number;     // approx ending integrity
  polyline: [number, number][];
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

// Hand-traced polylines along real Bengaluru roads (lng, lat — GeoJSON order)
const INFLUENCER_POLYLINE: [number, number][] = [
  [77.5946, 12.9716],
  [77.5975, 12.9735],
  [77.6010, 12.9755],
  [77.6059, 12.9766], // MG Road flyover
  [77.6085, 12.9760],
  [77.6110, 12.9752],
  [77.6140, 12.9745],
  [77.6165, 12.9760],
  [77.6192, 12.9787], // Ulsoor smooth
  [77.6215, 12.9800],
];

const BRUNCH_POLYLINE: [number, number][] = [
  [77.5946, 12.9716],
  [77.5980, 12.9738],
  [77.6059, 12.9766], // MG Road flyover
  [77.6072, 12.9720],
  [77.6072, 12.9650],
  [77.6072, 12.9601], // Richmond Road
  [77.6150, 12.9610],
  [77.6192, 12.9650],
  [77.6280, 12.9720],
  [77.6350, 12.9760],
  [77.6408, 12.9784], // Indiranagar
];

const SURVIVAL_POLYLINE: [number, number][] = [
  [77.5946, 12.9716],
  [77.6000, 12.9680],
  [77.6040, 12.9640],
  [77.6072, 12.9601], // Richmond Road
  [77.6150, 12.9580],
  [77.6250, 12.9570],
  [77.6350, 12.9580],
  [77.6390, 12.9600], // Domlur Junction
  [77.6370, 12.9500],
  [77.6310, 12.9430],
  [77.6245, 12.9352], // Koramangala cluster
];

// ─────────────────────────────────────────────────────────────
//  Routes — each has exactly 5 checkpoints: 3 pothole + 2 OSM
// ─────────────────────────────────────────────────────────────
export const ROUTES: Record<string, GlamRoute> = {
  influencer: {
    id: "influencer",
    glamName: "MG Road Glam Strip",
    realName: "MG Road Corridor",
    personality: "The Influencer Route",
    difficulty: "Easy",
    emoji: "✨",
    description: "Bengaluru's most photogenic corridor. Flyovers keep the drama at a minimum, your highlighter at a maximum.",
    roadScore: 91,
    integrityEnd: 84,
    // Integrity math: 100 -8 -8 -8 +5 +5 = 86 ≈ >80% ✓
    polyline: INFLUENCER_POLYLINE,
    startCoords: [77.5946, 12.9716],
    endCoords: [77.6215, 12.9800],
    checkpoints: [
      // OSM: smooth start
      { def: CHECKPOINT_DEFS.glow_preservation, coords: [77.5975, 12.9735], progressPct: 12 },
      // Namma Pothole: light pothole
      { def: CHECKPOINT_DEFS.pothole_light,     coords: [77.6010, 12.9755], progressPct: 28 },
      // OSM: flyover (middle highlight)
      { def: CHECKPOINT_DEFS.highlight_haven,   coords: [77.6059, 12.9766], progressPct: 48 },
      // Namma Pothole: light pothole
      { def: CHECKPOINT_DEFS.pothole_light,     coords: [77.6140, 12.9745], progressPct: 68 },
      // Namma Pothole: light pothole
      { def: CHECKPOINT_DEFS.pothole_light,     coords: [77.6192, 12.9787], progressPct: 88 },
    ],
    stats: {
      potholeCount: 3,
      hazardZones: 1,
      smoothCorridors: 2,
      worstStretch: "Ulsoor Link — 2 potholes, severity 4.1/10",
      smoothestStretch: "MG Road Flyover — 0 reports, elevated surface",
      communityReports: 9,
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
    roadScore: 64,
    integrityEnd: 69,
    // Integrity: 100 +5 -8 -8 -15 -8 = 66 ≈ ~65-75% ✓
    polyline: BRUNCH_POLYLINE,
    startCoords: [77.5946, 12.9716],
    endCoords: [77.6408, 12.9784],
    checkpoints: [
      // OSM: flyover — good start
      { def: CHECKPOINT_DEFS.highlight_haven,   coords: [77.6059, 12.9766], progressPct: 12 },
      // Namma Pothole: light
      { def: CHECKPOINT_DEFS.pothole_light,     coords: [77.6072, 12.9720], progressPct: 28 },
      // OSM: speed hump
      { def: CHECKPOINT_DEFS.lipstick_hump,     coords: [77.6072, 12.9601], progressPct: 46 },
      // Namma Pothole: light pothole
      { def: CHECKPOINT_DEFS.pothole_light,     coords: [77.6280, 12.9720], progressPct: 64 },
      // Namma Pothole: cluster (worst stretch near Indiranagar)
      { def: CHECKPOINT_DEFS.pothole_cluster,   coords: [77.6350, 12.9760], progressPct: 84 },
    ],
    stats: {
      potholeCount: 5,
      hazardZones: 2,
      smoothCorridors: 1,
      worstStretch: "Indiranagar 4th Cross — 4 potholes, severity 7.2/10",
      smoothestStretch: "MG Road Flyover — 0 reports",
      communityReports: 22,
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
    roadScore: 31,
    integrityEnd: 37,
    // Integrity: 100 -8 -15 -10 -15 -15 = 37 ✓ < 50%
    polyline: SURVIVAL_POLYLINE,
    startCoords: [77.5946, 12.9716],
    endCoords: [77.6245, 12.9352],
    checkpoints: [
      // Namma Pothole: light start
      { def: CHECKPOINT_DEFS.pothole_light,   coords: [77.6072, 12.9601], progressPct: 14 },
      // Namma Pothole: cluster
      { def: CHECKPOINT_DEFS.pothole_cluster, coords: [77.6150, 12.9580], progressPct: 30 },
      // OSM: construction zone
      { def: CHECKPOINT_DEFS.road_damage_stretch, coords: [77.6390, 12.9600], progressPct: 50 },
      // Namma Pothole: severe
      { def: CHECKPOINT_DEFS.pothole_severe,  coords: [77.6310, 12.9430], progressPct: 70 },
      // OSM: speed hump (adding insult to injury)
      { def: CHECKPOINT_DEFS.lipstick_hump,   coords: [77.6245, 12.9352], progressPct: 88 },
    ],
    stats: {
      potholeCount: 11,
      hazardZones: 4,
      smoothCorridors: 0,
      worstStretch: "Koramangala 4th Block — 4 potholes, severity 8.5/10",
      smoothestStretch: "None. Bengaluru won this one.",
      communityReports: 41,
    },
  },
};

export const DESTINATION_CARDS = [
  {
    id: "mg-road",
    glamName: "MG Road Glam Strip",
    realName: "MG Road",
    emoji: "✨",
    vibe: "Flyover energy, minimal drama",
    difficulty: "Easy" as Difficulty,
    routeId: "influencer",
  },
  {
    id: "whitefield",
    glamName: "Whitefield Glow Quarter",
    realName: "Whitefield",
    emoji: "💎",
    vibe: "Premium roads, premium vibes",
    difficulty: "Easy" as Difficulty,
    routeId: "influencer",
  },
  {
    id: "indiranagar",
    glamName: "Indiranagar Highlight Avenue",
    realName: "Indiranagar",
    emoji: "💋",
    vibe: "Brunch vibes, road surprises",
    difficulty: "Medium" as Difficulty,
    routeId: "brunch",
  },
  {
    id: "jpnagar",
    glamName: "JP Nagar Blush Boulevard",
    realName: "JP Nagar",
    emoji: "🌸",
    vibe: "Scenic chaos. Clutch your liner.",
    difficulty: "Medium" as Difficulty,
    routeId: "brunch",
  },
  {
    id: "koramangala",
    glamName: "Koramangala Contour District",
    realName: "Koramangala",
    emoji: "💀",
    vibe: "Survival Mode. You've been warned.",
    difficulty: "Survival Mode" as Difficulty,
    routeId: "survival",
  },
  {
    id: "electronic-city",
    glamName: "Electronic City Foundation Zone",
    realName: "Electronic City",
    emoji: "🏗️",
    vibe: "Construction central. Foundation: RIP.",
    difficulty: "Survival Mode" as Difficulty,
    routeId: "survival",
  },
];
