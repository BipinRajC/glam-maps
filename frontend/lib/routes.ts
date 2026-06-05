import { CHECKPOINT_DEFS, type CheckpointDef } from "./checkpoints";

export type Difficulty = "Easy" | "Medium" | "Survival Mode";

export interface RouteCheckpoint {
  def: CheckpointDef;
  coords: [number, number];
  progressPct: number;
}

export interface GlamRoute {
  id: string;
  glamName: string;
  realName: string;
  personality: string;
  difficulty: Difficulty;
  emoji: string;
  description: string;
  roadScore: number;
  integrityEnd: number;
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

export interface DestinationCard {
  id: string;
  glamName: string;
  realName: string;
  emoji: string;
  vibe: string;
  difficulty: Difficulty;
  routeId: string;
  endCoords: [number, number];
}

const CP = CHECKPOINT_DEFS;

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
    polyline: [[77.5946,12.9716],[77.5975,12.9735],[77.6010,12.9755],[77.6059,12.9766],[77.6085,12.9760],[77.6110,12.9752],[77.6140,12.9745],[77.6165,12.9760],[77.6192,12.9787],[77.6215,12.9800]],
    startCoords: [77.5946, 12.9716],
    endCoords: [77.6215, 12.9800],
    checkpoints: [
      { def: CP.glow_preservation, coords: [77.5975,12.9735], progressPct: 12 },
      { def: CP.pothole_light, coords: [77.6010,12.9755], progressPct: 28 },
      { def: CP.highlight_haven, coords: [77.6059,12.9766], progressPct: 48 },
      { def: CP.pothole_light, coords: [77.6140,12.9745], progressPct: 68 },
      { def: CP.pothole_light, coords: [77.6192,12.9787], progressPct: 88 },
    ],
    stats: { potholeCount: 3, hazardZones: 1, smoothCorridors: 2, worstStretch: "Ulsoor Link — 2 potholes, severity 4.1/10", smoothestStretch: "MG Road Flyover — 0 reports, elevated surface", communityReports: 9 },
  },

  whitefield: {
    id: "whitefield",
    glamName: "Whitefield Glow Quarter",
    realName: "Whitefield Main Road",
    personality: "The Premium Route",
    difficulty: "Easy",
    emoji: "💎",
    description: "IT corridor roads. Wide lanes, smooth surface. Your foundation stays flawless.",
    roadScore: 88,
    integrityEnd: 82,
    polyline: [[77.5946,12.9716],[77.6100,12.9720],[77.6300,12.9700],[77.6600,12.9690],[77.6900,12.9680],[77.7200,12.9670],[77.7500,12.9660]],
    startCoords: [77.5946, 12.9716],
    endCoords: [77.7500, 12.9660],
    checkpoints: [
      { def: CP.highlight_haven, coords: [77.6100,12.9720], progressPct: 15 },
      { def: CP.glow_preservation, coords: [77.6300,12.9700], progressPct: 30 },
      { def: CP.pothole_light, coords: [77.6600,12.9690], progressPct: 50 },
      { def: CP.glow_preservation, coords: [77.6900,12.9680], progressPct: 70 },
      { def: CP.pothole_light, coords: [77.7200,12.9670], progressPct: 88 },
    ],
    stats: { potholeCount: 2, hazardZones: 0, smoothCorridors: 3, worstStretch: "ITPL Road junction — 1 pothole, severity 3.5/10", smoothestStretch: "Whitefield Main — 0 reports, wide lanes", communityReports: 6 },
  },

  hebbal: {
    id: "hebbal",
    glamName: "Hebbal Halo Highway",
    realName: "Hebbal Flyover Route",
    personality: "The Flyover Queen",
    difficulty: "Easy",
    emoji: "👼",
    description: "Elevated roads all the way. Your highlighter thanks the engineers.",
    roadScore: 86,
    integrityEnd: 80,
    polyline: [[77.5946,12.9716],[77.5900,12.9800],[77.5850,12.9900],[77.5820,13.0000],[77.5780,13.0100],[77.5730,13.0200]],
    startCoords: [77.5946, 12.9716],
    endCoords: [77.5730, 13.0200],
    checkpoints: [
      { def: CP.highlight_haven, coords: [77.5900,12.9800], progressPct: 18 },
      { def: CP.glow_preservation, coords: [77.5850,12.9900], progressPct: 38 },
      { def: CP.pothole_light, coords: [77.5820,13.0000], progressPct: 58 },
      { def: CP.highlight_haven, coords: [77.5780,13.0100], progressPct: 78 },
      { def: CP.pothole_light, coords: [77.5730,13.0200], progressPct: 92 },
    ],
    stats: { potholeCount: 2, hazardZones: 0, smoothCorridors: 3, worstStretch: "Hebbal exit ramp — 1 pothole, severity 3.8/10", smoothestStretch: "Hebbal Flyover — 0 reports, elevated", communityReports: 5 },
  },

  lavelle: {
    id: "lavelle",
    glamName: "Lavelle Luxe Lane",
    realName: "Lavelle Road",
    personality: "The Boutique Route",
    difficulty: "Easy",
    emoji: "🛍️",
    description: "Boutique-lined boulevard. Smooth roads, smoother vibes.",
    roadScore: 89,
    integrityEnd: 83,
    polyline: [[77.5946,12.9716],[77.5920,12.9740],[77.5890,12.9760],[77.5860,12.9780],[77.5830,12.9790]],
    startCoords: [77.5946, 12.9716],
    endCoords: [77.5830, 12.9790],
    checkpoints: [
      { def: CP.glow_preservation, coords: [77.5920,12.9740], progressPct: 20 },
      { def: CP.pothole_light, coords: [77.5890,12.9760], progressPct: 45 },
      { def: CP.glow_preservation, coords: [77.5860,12.9780], progressPct: 70 },
      { def: CP.pothole_light, coords: [77.5830,12.9790], progressPct: 90 },
    ],
    stats: { potholeCount: 2, hazardZones: 0, smoothCorridors: 2, worstStretch: "Lavelle-Vittal junction — 1 pothole, severity 3.2/10", smoothestStretch: "Lavelle Road — 0 reports, tree-lined", communityReports: 4 },
  },

  cubbon: {
    id: "cubbon",
    glamName: "Cubbon Contour Cruise",
    realName: "Cubbon Park Ring",
    personality: "The Green Goddess",
    difficulty: "Easy",
    emoji: "🌿",
    description: "Park roads, zero drama. Just you and the canopy keeping your contour intact.",
    roadScore: 92,
    integrityEnd: 86,
    polyline: [[77.5946,12.9716],[77.5930,12.9750],[77.5900,12.9780],[77.5870,12.9800],[77.5840,12.9780],[77.5820,12.9750]],
    startCoords: [77.5946, 12.9716],
    endCoords: [77.5820, 12.9750],
    checkpoints: [
      { def: CP.glow_preservation, coords: [77.5930,12.9750], progressPct: 20 },
      { def: CP.glow_preservation, coords: [77.5900,12.9780], progressPct: 40 },
      { def: CP.highlight_haven, coords: [77.5870,12.9800], progressPct: 60 },
      { def: CP.pothole_light, coords: [77.5840,12.9780], progressPct: 80 },
    ],
    stats: { potholeCount: 1, hazardZones: 0, smoothCorridors: 3, worstStretch: "Cubbon exit — 1 pothole, severity 2.8/10", smoothestStretch: "Park ring road — 0 reports, shaded", communityReports: 3 },
  },

  sadhashiv: {
    id: "sadhashiv",
    glamName: "Sadhashivnagar Sheen",
    realName: "Sadhashivnagar",
    personality: "The VIP Route",
    difficulty: "Easy",
    emoji: "👑",
    description: "Where Bengaluru's elite live and drive. Roads as polished as their nails.",
    roadScore: 90,
    integrityEnd: 84,
    polyline: [[77.5946,12.9716],[77.5850,12.9780],[77.5780,12.9840],[77.5720,12.9900]],
    startCoords: [77.5946, 12.9716],
    endCoords: [77.5720, 12.9900],
    checkpoints: [
      { def: CP.glow_preservation, coords: [77.5850,12.9780], progressPct: 25 },
      { def: CP.highlight_haven, coords: [77.5780,12.9840], progressPct: 55 },
      { def: CP.pothole_light, coords: [77.5720,12.9900], progressPct: 85 },
    ],
    stats: { potholeCount: 1, hazardZones: 0, smoothCorridors: 2, worstStretch: "Sankey Road end — 1 pothole, severity 3.0/10", smoothestStretch: "Sadhashivnagar Main — 0 reports", communityReports: 3 },
  },

  jayanagar: {
    id: "jayanagar",
    glamName: "Jayanagar Jade Journey",
    realName: "Jayanagar 4th Block",
    personality: "The Shopping Spree",
    difficulty: "Easy",
    emoji: "🟢",
    description: "Shopping district roads. Smooth enough to check your mirror between stores.",
    roadScore: 85,
    integrityEnd: 79,
    polyline: [[77.5946,12.9716],[77.5900,12.9600],[77.5850,12.9500],[77.5820,12.9400],[77.5800,12.9350]],
    startCoords: [77.5946, 12.9716],
    endCoords: [77.5800, 12.9350],
    checkpoints: [
      { def: CP.glow_preservation, coords: [77.5900,12.9600], progressPct: 22 },
      { def: CP.pothole_light, coords: [77.5850,12.9500], progressPct: 45 },
      { def: CP.lipstick_hump, coords: [77.5820,12.9400], progressPct: 68 },
      { def: CP.pothole_light, coords: [77.5800,12.9350], progressPct: 88 },
    ],
    stats: { potholeCount: 2, hazardZones: 1, smoothCorridors: 1, worstStretch: "Jayanagar 4th Block — 2 potholes, severity 4.0/10", smoothestStretch: "Jayanagar Main — 0 reports", communityReports: 7 },
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
    polyline: [[77.5946,12.9716],[77.5980,12.9738],[77.6059,12.9766],[77.6072,12.9720],[77.6072,12.9650],[77.6072,12.9601],[77.6150,12.9610],[77.6192,12.9650],[77.6280,12.9720],[77.6350,12.9760],[77.6408,12.9784]],
    startCoords: [77.5946, 12.9716],
    endCoords: [77.6408, 12.9784],
    checkpoints: [
      { def: CP.highlight_haven, coords: [77.6059,12.9766], progressPct: 12 },
      { def: CP.pothole_light, coords: [77.6072,12.9720], progressPct: 28 },
      { def: CP.lipstick_hump, coords: [77.6072,12.9601], progressPct: 46 },
      { def: CP.pothole_light, coords: [77.6280,12.9720], progressPct: 64 },
      { def: CP.pothole_cluster, coords: [77.6350,12.9760], progressPct: 84 },
    ],
    stats: { potholeCount: 5, hazardZones: 2, smoothCorridors: 1, worstStretch: "Indiranagar 4th Cross — 4 potholes, severity 7.2/10", smoothestStretch: "MG Road Flyover — 0 reports", communityReports: 22 },
  },

  jpnagar: {
    id: "jpnagar",
    glamName: "JP Nagar Blush Boulevard",
    realName: "JP Nagar Phase 2",
    personality: "The Scenic Chaos",
    difficulty: "Medium",
    emoji: "🌸",
    description: "Scenic chaos. Clutch your liner and hope for the best.",
    roadScore: 58,
    integrityEnd: 62,
    polyline: [[77.5946,12.9716],[77.5900,12.9600],[77.5850,12.9500],[77.5800,12.9400],[77.5780,12.9300],[77.5760,12.9200],[77.5750,12.9100]],
    startCoords: [77.5946, 12.9716],
    endCoords: [77.5750, 12.9100],
    checkpoints: [
      { def: CP.pothole_light, coords: [77.5900,12.9600], progressPct: 15 },
      { def: CP.lipstick_hump, coords: [77.5850,12.9500], progressPct: 30 },
      { def: CP.pothole_cluster, coords: [77.5800,12.9400], progressPct: 48 },
      { def: CP.pothole_light, coords: [77.5780,12.9300], progressPct: 68 },
      { def: CP.lipstick_hump, coords: [77.5750,12.9100], progressPct: 88 },
    ],
    stats: { potholeCount: 6, hazardZones: 2, smoothCorridors: 0, worstStretch: "JP Nagar Phase 2 — 3 potholes, severity 6.5/10", smoothestStretch: "None worth mentioning", communityReports: 18 },
  },

  hsr: {
    id: "hsr",
    glamName: "HSR Highlight Hustle",
    realName: "HSR Layout",
    personality: "The Startup Route",
    difficulty: "Medium",
    emoji: "🚀",
    description: "Startup central. Roads are as unpredictable as your Series A.",
    roadScore: 60,
    integrityEnd: 65,
    polyline: [[77.5946,12.9716],[77.6072,12.9601],[77.6200,12.9550],[77.6350,12.9500],[77.6500,12.9450],[77.6650,12.9400]],
    startCoords: [77.5946, 12.9716],
    endCoords: [77.6650, 12.9400],
    checkpoints: [
      { def: CP.pothole_light, coords: [77.6072,12.9601], progressPct: 18 },
      { def: CP.lipstick_hump, coords: [77.6200,12.9550], progressPct: 35 },
      { def: CP.water_logging, coords: [77.6350,12.9500], progressPct: 52 },
      { def: CP.pothole_cluster, coords: [77.6500,12.9450], progressPct: 72 },
      { def: CP.pothole_light, coords: [77.6650,12.9400], progressPct: 90 },
    ],
    stats: { potholeCount: 5, hazardZones: 2, smoothCorridors: 0, worstStretch: "HSR BDA Complex — water logging + 2 potholes", smoothestStretch: "27th Main — 0 reports", communityReports: 20 },
  },

  bellandur: {
    id: "bellandur",
    glamName: "Bellandur Blush Bridge",
    realName: "Bellandur → Sarjapur",
    personality: "The Lake Route",
    difficulty: "Medium",
    emoji: "🌅",
    description: "Lake views, road surprises. Your blush matches the sunset, not the potholes.",
    roadScore: 55,
    integrityEnd: 60,
    polyline: [[77.5946,12.9716],[77.6200,12.9550],[77.6400,12.9450],[77.6600,12.9350],[77.6800,12.9250],[77.7000,12.9200]],
    startCoords: [77.5946, 12.9716],
    endCoords: [77.7000, 12.9200],
    checkpoints: [
      { def: CP.pothole_light, coords: [77.6200,12.9550], progressPct: 18 },
      { def: CP.water_logging, coords: [77.6400,12.9450], progressPct: 35 },
      { def: CP.pothole_cluster, coords: [77.6600,12.9350], progressPct: 55 },
      { def: CP.lipstick_hump, coords: [77.6800,12.9250], progressPct: 75 },
      { def: CP.pothole_light, coords: [77.7000,12.9200], progressPct: 92 },
    ],
    stats: { potholeCount: 5, hazardZones: 3, smoothCorridors: 0, worstStretch: "Bellandur lake road — water logging + potholes", smoothestStretch: "Sarjapur overpass — 0 reports", communityReports: 24 },
  },

  marathahalli: {
    id: "marathahalli",
    glamName: "Marathahalli Mascara Mile",
    realName: "Marathahalli Bridge",
    personality: "The Bridge Burner",
    difficulty: "Medium",
    emoji: "🌉",
    description: "Bridge traffic, bridge potholes. At least the view is dramatic.",
    roadScore: 52,
    integrityEnd: 58,
    polyline: [[77.5946,12.9716],[77.6300,12.9700],[77.6600,12.9680],[77.6900,12.9660],[77.7200,12.9640]],
    startCoords: [77.5946, 12.9716],
    endCoords: [77.7200, 12.9640],
    checkpoints: [
      { def: CP.pothole_light, coords: [77.6300,12.9700], progressPct: 20 },
      { def: CP.pothole_cluster, coords: [77.6600,12.9680], progressPct: 40 },
      { def: CP.road_damage_stretch, coords: [77.6900,12.9660], progressPct: 62 },
      { def: CP.pothole_light, coords: [77.7200,12.9640], progressPct: 85 },
    ],
    stats: { potholeCount: 6, hazardZones: 2, smoothCorridors: 0, worstStretch: "Marathahalli bridge approach — 3 potholes, severity 7.0/10", smoothestStretch: "None", communityReports: 28 },
  },

  rtnagar: {
    id: "rtnagar",
    glamName: "RT Nagar Radiance Run",
    realName: "RT Nagar Main Road",
    personality: "The Northern Exposure",
    difficulty: "Medium",
    emoji: "💫",
    description: "North Bengaluru's mixed bag. Some smooth, some survival. Roll the dice.",
    roadScore: 56,
    integrityEnd: 61,
    polyline: [[77.5946,12.9716],[77.5900,12.9800],[77.5850,12.9900],[77.5820,13.0000],[77.5800,13.0100],[77.5780,13.0200]],
    startCoords: [77.5946, 12.9716],
    endCoords: [77.5780, 13.0200],
    checkpoints: [
      { def: CP.glow_preservation, coords: [77.5900,12.9800], progressPct: 18 },
      { def: CP.pothole_light, coords: [77.5850,12.9900], progressPct: 35 },
      { def: CP.lipstick_hump, coords: [77.5820,13.0000], progressPct: 55 },
      { def: CP.pothole_cluster, coords: [77.5800,13.0100], progressPct: 75 },
      { def: CP.pothole_light, coords: [77.5780,13.0200], progressPct: 92 },
    ],
    stats: { potholeCount: 5, hazardZones: 2, smoothCorridors: 1, worstStretch: "RT Nagar 6th Cross — 3 potholes, severity 6.8/10", smoothestStretch: "RT Nagar Main — 0 reports", communityReports: 15 },
  },

  banashankari: {
    id: "banashankari",
    glamName: "Banashankari Blush Trail",
    realName: "Banashankari 3rd Stage",
    personality: "The Southern Slog",
    difficulty: "Medium",
    emoji: "🎭",
    description: "South Bengaluru's residential maze. Every turn is a surprise for your face.",
    roadScore: 54,
    integrityEnd: 59,
    polyline: [[77.5946,12.9716],[77.5850,12.9600],[77.5780,12.9500],[77.5720,12.9400],[77.5680,12.9300]],
    startCoords: [77.5946, 12.9716],
    endCoords: [77.5680, 12.9300],
    checkpoints: [
      { def: CP.pothole_light, coords: [77.5850,12.9600], progressPct: 20 },
      { def: CP.lipstick_hump, coords: [77.5780,12.9500], progressPct: 38 },
      { def: CP.pothole_cluster, coords: [77.5720,12.9400], progressPct: 60 },
      { def: CP.water_logging, coords: [77.5680,12.9300], progressPct: 85 },
    ],
    stats: { potholeCount: 5, hazardZones: 2, smoothCorridors: 0, worstStretch: "BSK 3rd Stage — 3 potholes + water logging", smoothestStretch: "BSK temple road — 0 reports", communityReports: 19 },
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
    polyline: [[77.5946,12.9716],[77.6000,12.9680],[77.6040,12.9640],[77.6072,12.9601],[77.6150,12.9580],[77.6250,12.9570],[77.6350,12.9580],[77.6390,12.9600],[77.6370,12.9500],[77.6310,12.9430],[77.6245,12.9352]],
    startCoords: [77.5946, 12.9716],
    endCoords: [77.6245, 12.9352],
    checkpoints: [
      { def: CP.pothole_light, coords: [77.6072,12.9601], progressPct: 14 },
      { def: CP.pothole_cluster, coords: [77.6150,12.9580], progressPct: 30 },
      { def: CP.road_damage_stretch, coords: [77.6390,12.9600], progressPct: 50 },
      { def: CP.pothole_severe, coords: [77.6310,12.9430], progressPct: 70 },
      { def: CP.lipstick_hump, coords: [77.6245,12.9352], progressPct: 88 },
    ],
    stats: { potholeCount: 11, hazardZones: 4, smoothCorridors: 0, worstStretch: "Koramangala 4th Block — 4 potholes, severity 8.5/10", smoothestStretch: "None. Bengaluru won this one.", communityReports: 41 },
  },

  ecity: {
    id: "ecity",
    glamName: "Electronic City Foundation Zone",
    realName: "Electronic City Phase 1",
    personality: "The Construction Gauntlet",
    difficulty: "Survival Mode",
    emoji: "🏗️",
    description: "Construction central. Foundation: RIP. Literally and figuratively.",
    roadScore: 28,
    integrityEnd: 34,
    polyline: [[77.5946,12.9716],[77.6000,12.9600],[77.6100,12.9450],[77.6200,12.9300],[77.6400,12.9100],[77.6600,12.8900],[77.6800,12.8700]],
    startCoords: [77.5946, 12.9716],
    endCoords: [77.6800, 12.8700],
    checkpoints: [
      { def: CP.pothole_light, coords: [77.6000,12.9600], progressPct: 12 },
      { def: CP.road_damage_stretch, coords: [77.6100,12.9450], progressPct: 25 },
      { def: CP.pothole_severe, coords: [77.6200,12.9300], progressPct: 40 },
      { def: CP.water_logging, coords: [77.6400,12.9100], progressPct: 58 },
      { def: CP.pothole_cluster, coords: [77.6600,12.8900], progressPct: 78 },
      { def: CP.road_damage_stretch, coords: [77.6800,12.8700], progressPct: 92 },
    ],
    stats: { potholeCount: 14, hazardZones: 5, smoothCorridors: 0, worstStretch: "EC Phase 1 — 5 potholes + construction, severity 9.0/10", smoothestStretch: "None", communityReports: 48 },
  },

  yelahanka: {
    id: "yelahanka",
    glamName: "Yelahanka Yellow Alert",
    realName: "Yelahanka New Town",
    personality: "The Gravel Trap",
    difficulty: "Survival Mode",
    emoji: "⚠️",
    description: "Gravel, potholes, and broken promises. Your setting spray can't save you here.",
    roadScore: 32,
    integrityEnd: 38,
    polyline: [[77.5946,12.9716],[77.5850,12.9900],[77.5780,13.0100],[77.5720,13.0300],[77.5680,13.0500],[77.5650,13.0700]],
    startCoords: [77.5946, 12.9716],
    endCoords: [77.5650, 13.0700],
    checkpoints: [
      { def: CP.pothole_light, coords: [77.5850,12.9900], progressPct: 15 },
      { def: CP.gravel_stretch, coords: [77.5780,13.0100], progressPct: 30 },
      { def: CP.pothole_severe, coords: [77.5720,13.0300], progressPct: 50 },
      { def: CP.road_damage_stretch, coords: [77.5680,13.0500], progressPct: 72 },
      { def: CP.pothole_cluster, coords: [77.5650,13.0700], progressPct: 90 },
    ],
    stats: { potholeCount: 10, hazardZones: 4, smoothCorridors: 0, worstStretch: "Yelahanka Old Town — gravel + 4 potholes, severity 8.2/10", smoothestStretch: "None", communityReports: 35 },
  },

  mysore_road: {
    id: "mysore_road",
    glamName: "Mysore Road Meltdown",
    realName: "Mysore Road Corridor",
    personality: "The Highway to Hell",
    difficulty: "Survival Mode",
    emoji: "🔥",
    description: "Highway under perpetual construction. Your makeup melts faster than the tar.",
    roadScore: 25,
    integrityEnd: 30,
    polyline: [[77.5946,12.9716],[77.5800,12.9700],[77.5600,12.9680],[77.5400,12.9660],[77.5200,12.9640],[77.5000,12.9620]],
    startCoords: [77.5946, 12.9716],
    endCoords: [77.5000, 12.9620],
    checkpoints: [
      { def: CP.road_damage_stretch, coords: [77.5800,12.9700], progressPct: 12 },
      { def: CP.pothole_severe, coords: [77.5600,12.9680], progressPct: 28 },
      { def: CP.water_logging, coords: [77.5400,12.9660], progressPct: 48 },
      { def: CP.pothole_cluster, coords: [77.5200,12.9640], progressPct: 68 },
      { def: CP.road_damage_stretch, coords: [77.5000,12.9620], progressPct: 88 },
    ],
    stats: { potholeCount: 13, hazardZones: 5, smoothCorridors: 0, worstStretch: "Mysore Road metro stretch — 5 potholes, severity 9.2/10", smoothestStretch: "None", communityReports: 52 },
  },

  bommanahalli: {
    id: "bommanahalli",
    glamName: "Bommanahalli Breakdown",
    realName: "Bommanahalli → HSR Edge",
    personality: "The Edge of Reason",
    difficulty: "Survival Mode",
    emoji: "💥",
    description: "Where the city ends and chaos begins. No contour survives this border.",
    roadScore: 30,
    integrityEnd: 35,
    polyline: [[77.5946,12.9716],[77.6200,12.9550],[77.6400,12.9400],[77.6500,12.9250],[77.6550,12.9100]],
    startCoords: [77.5946, 12.9716],
    endCoords: [77.6550, 12.9100],
    checkpoints: [
      { def: CP.pothole_light, coords: [77.6200,12.9550], progressPct: 18 },
      { def: CP.pothole_severe, coords: [77.6400,12.9400], progressPct: 38 },
      { def: CP.road_damage_stretch, coords: [77.6500,12.9250], progressPct: 60 },
      { def: CP.pothole_cluster, coords: [77.6550,12.9100], progressPct: 85 },
    ],
    stats: { potholeCount: 9, hazardZones: 4, smoothCorridors: 0, worstStretch: "Bommanahalli junction — 4 potholes, severity 8.8/10", smoothestStretch: "None", communityReports: 38 },
  },

  kr_puram: {
    id: "kr_puram",
    glamName: "KR Puram Catastrophe",
    realName: "KR Puram → Tin Factory",
    personality: "The Tin Factory Test",
    difficulty: "Survival Mode",
    emoji: "🔩",
    description: "Tin Factory isn't just a name — it's what happens to your face on this route.",
    roadScore: 27,
    integrityEnd: 32,
    polyline: [[77.5946,12.9716],[77.6200,12.9750],[77.6500,12.9780],[77.6800,12.9800],[77.7000,12.9820],[77.7200,12.9850]],
    startCoords: [77.5946, 12.9716],
    endCoords: [77.7200, 12.9850],
    checkpoints: [
      { def: CP.pothole_light, coords: [77.6200,12.9750], progressPct: 14 },
      { def: CP.road_damage_stretch, coords: [77.6500,12.9780], progressPct: 30 },
      { def: CP.pothole_severe, coords: [77.6800,12.9800], progressPct: 50 },
      { def: CP.water_logging, coords: [77.7000,12.9820], progressPct: 70 },
      { def: CP.pothole_cluster, coords: [77.7200,12.9850], progressPct: 90 },
    ],
    stats: { potholeCount: 12, hazardZones: 5, smoothCorridors: 0, worstStretch: "Tin Factory junction — 5 potholes, severity 9.0/10", smoothestStretch: "None", communityReports: 45 },
  },
};

export const DESTINATION_CARDS: DestinationCard[] = [
  { id: "mg-road", glamName: "MG Road Glam Strip", realName: "MG Road", emoji: "✨", vibe: "Flyover energy, minimal drama", difficulty: "Easy", routeId: "influencer", endCoords: [77.6215, 12.9800] },
  { id: "whitefield", glamName: "Whitefield Glow Quarter", realName: "Whitefield", emoji: "💎", vibe: "Premium roads, premium vibes", difficulty: "Easy", routeId: "whitefield", endCoords: [77.7500, 12.9660] },
  { id: "hebbal", glamName: "Hebbal Halo Highway", realName: "Hebbal", emoji: "👼", vibe: "Flyover queen, elevated confidence", difficulty: "Easy", routeId: "hebbal", endCoords: [77.5730, 13.0200] },
  { id: "lavelle", glamName: "Lavelle Luxe Lane", realName: "Lavelle Road", emoji: "🛍️", vibe: "Boutique boulevard, zero drama", difficulty: "Easy", routeId: "lavelle", endCoords: [77.5830, 12.9790] },
  { id: "cubbon", glamName: "Cubbon Contour Cruise", realName: "Cubbon Park", emoji: "🌿", vibe: "Green goddess, canopy cover", difficulty: "Easy", routeId: "cubbon", endCoords: [77.5820, 12.9750] },
  { id: "sadhashiv", glamName: "Sadhashivnagar Sheen", realName: "Sadhashivnagar", emoji: "👑", vibe: "VIP roads, VIP nails", difficulty: "Easy", routeId: "sadhashiv", endCoords: [77.5720, 12.9900] },
  { id: "jayanagar", glamName: "Jayanagar Jade Journey", realName: "Jayanagar", emoji: "🟢", vibe: "Shopping district, mirror-friendly", difficulty: "Easy", routeId: "jayanagar", endCoords: [77.5800, 12.9350] },
  { id: "indiranagar", glamName: "Indiranagar Highlight Avenue", realName: "Indiranagar", emoji: "💋", vibe: "Brunch vibes, road surprises", difficulty: "Medium", routeId: "brunch", endCoords: [77.6408, 12.9784] },
  { id: "jpnagar", glamName: "JP Nagar Blush Boulevard", realName: "JP Nagar", emoji: "🌸", vibe: "Scenic chaos. Clutch your liner.", difficulty: "Medium", routeId: "jpnagar", endCoords: [77.5750, 12.9100] },
  { id: "hsr", glamName: "HSR Highlight Hustle", realName: "HSR Layout", emoji: "🚀", vibe: "Startup roads, Series A drama", difficulty: "Medium", routeId: "hsr", endCoords: [77.6650, 12.9400] },
  { id: "bellandur", glamName: "Bellandur Blush Bridge", realName: "Bellandur", emoji: "🌅", vibe: "Lake views, road surprises", difficulty: "Medium", routeId: "bellandur", endCoords: [77.7000, 12.9200] },
  { id: "marathahalli", glamName: "Marathahalli Mascara Mile", realName: "Marathahalli", emoji: "🌉", vibe: "Bridge traffic, bridge potholes", difficulty: "Medium", routeId: "marathahalli", endCoords: [77.7200, 12.9640] },
  { id: "rtnagar", glamName: "RT Nagar Radiance Run", realName: "RT Nagar", emoji: "💫", vibe: "Northern exposure, mixed bag", difficulty: "Medium", routeId: "rtnagar", endCoords: [77.5780, 13.0200] },
  { id: "banashankari", glamName: "Banashankari Blush Trail", realName: "Banashankari", emoji: "🎭", vibe: "Southern slog, residential maze", difficulty: "Medium", routeId: "banashankari", endCoords: [77.5680, 12.9300] },
  { id: "koramangala", glamName: "Koramangala Contour District", realName: "Koramangala", emoji: "💀", vibe: "Survival Mode. You've been warned.", difficulty: "Survival Mode", routeId: "survival", endCoords: [77.6245, 12.9352] },
  { id: "electronic-city", glamName: "Electronic City Foundation Zone", realName: "Electronic City", emoji: "🏗️", vibe: "Construction central. Foundation: RIP.", difficulty: "Survival Mode", routeId: "ecity", endCoords: [77.6800, 12.8700] },
  { id: "yelahanka", glamName: "Yelahanka Yellow Alert", realName: "Yelahanka", emoji: "⚠️", vibe: "Gravel trap. Setting spray can't save you.", difficulty: "Survival Mode", routeId: "yelahanka", endCoords: [77.5650, 13.0700] },
  { id: "mysore-road", glamName: "Mysore Road Meltdown", realName: "Mysore Road", emoji: "🔥", vibe: "Highway to hell. Makeup melts faster than tar.", difficulty: "Survival Mode", routeId: "mysore_road", endCoords: [77.5000, 12.9620] },
  { id: "bommanahalli", glamName: "Bommanahalli Breakdown", realName: "Bommanahalli", emoji: "💥", vibe: "Edge of reason. No contour survives.", difficulty: "Survival Mode", routeId: "bommanahalli", endCoords: [77.6550, 12.9100] },
  { id: "kr-puram", glamName: "KR Puram Catastrophe", realName: "KR Puram", emoji: "🔩", vibe: "Tin Factory test. Face becomes tin.", difficulty: "Survival Mode", routeId: "kr_puram", endCoords: [77.7200, 12.9850] },
];
