export type HazardType =
  | "smooth"
  | "flyover"
  | "pothole-light"
  | "pothole-cluster"
  | "pothole-severe"
  | "construction"
  | "speed-hump";

export type DataSource = "namma-pothole" | "osm";

export interface CheckpointDef {
  id: string;
  collectibleName: string;
  hazardType: HazardType;
  dataSource: DataSource;
  emoji: string;
  markerColor: "green" | "blue" | "yellow" | "orange" | "red";
  pulse: boolean;
  integrityDelta: number;
  headline: string;
  dataBadge: string;
  dataLine: string;
  location: string;
}

export const CHECKPOINT_DEFS: Record<string, CheckpointDef> = {
  // ── OSM-sourced (smooth/infrastructure) ──────────────────────────────
  highlight_haven: {
    id: "highlight_haven",
    collectibleName: "Highlight Haven",
    hazardType: "flyover",
    dataSource: "osm",
    emoji: "🌉",
    markerColor: "blue",
    pulse: false,
    integrityDelta: +5,
    headline: "Flyover energy. Your highlighter is perfectly safe here.",
    dataBadge: "Source: OpenStreetMap road data",
    dataLine: "MG Road flyover — elevated corridor · 0 pothole reports · surface rating: excellent",
    location: "MG Road Flyover",
  },
  glow_preservation: {
    id: "glow_preservation",
    collectibleName: "Glow Preservation Stretch",
    hazardType: "smooth",
    dataSource: "osm",
    emoji: "✨",
    markerColor: "green",
    pulse: false,
    integrityDelta: +5,
    headline: "Roads this smooth are why Bengaluru women look unbothered.",
    dataBadge: "Source: OpenStreetMap road data",
    dataLine: "Smooth corridor · 0 pothole reports in last 30 days · road quality: good",
    location: "Ulsoor Smooth Corridor",
  },

  // ── OSM-sourced (humps) ───────────────────────────────────────────────
  lipstick_hump: {
    id: "lipstick_hump",
    collectibleName: "Lipstick Survival Checkpoint",
    hazardType: "speed-hump",
    dataSource: "osm",
    emoji: "💄",
    markerColor: "yellow",
    pulse: true,
    integrityDelta: -8,
    headline: "Speed hump. Your lipstick didn't make it.",
    dataBadge: "Source: OpenStreetMap · speed hump verified",
    dataLine: "1 speed hump · mapped by OSM community · avg disruption: moderate",
    location: "Indiranagar 100ft Road",
  },
  road_damage_stretch: {
    id: "road_damage_stretch",
    collectibleName: "Foundation Fracture Zone",
    hazardType: "construction",
    dataSource: "osm",
    emoji: "🚧",
    markerColor: "orange",
    pulse: true,
    integrityDelta: -10,
    headline: "Under construction. So is your face right now.",
    dataBadge: "Source: OpenStreetMap · road condition: under repair",
    dataLine: "Active construction zone · surface broken · OSM road class: secondary under repair",
    location: "Domlur Junction",
  },

  // ── Namma Pothole sourced (pothole data) ──────────────────────────────
  pothole_light: {
    id: "pothole_light",
    collectibleName: "Mascara Wobble Zone",
    hazardType: "pothole-light",
    dataSource: "namma-pothole",
    emoji: "😬",
    markerColor: "yellow",
    pulse: true,
    integrityDelta: -8,
    headline: "A couple of potholes. Nothing your concealer can't handle. Yet.",
    dataBadge: "Reported by 3 Namma Pothole users · verified 5 days ago",
    dataLine: "2 potholes reported · avg severity 4.1/10 · last 14 days · cluster radius 40m",
    location: "Richmond Road",
  },
  pothole_cluster: {
    id: "pothole_cluster",
    collectibleName: "Mascara Meltdown Corridor",
    hazardType: "pothole-cluster",
    dataSource: "namma-pothole",
    emoji: "😭",
    markerColor: "red",
    pulse: true,
    integrityDelta: -15,
    headline: "4 potholes in 100m. Even waterproof mascara is crying.",
    dataBadge: "Reported by 7 Namma Pothole users · verified 2 days ago",
    dataLine: "4 potholes reported · avg severity 7.2/10 · last 14 days · cluster radius 80m",
    location: "Indiranagar Stretch",
  },
  pothole_severe: {
    id: "pothole_severe",
    collectibleName: "Contour Catastrophe Crossing",
    hazardType: "pothole-severe",
    dataSource: "namma-pothole",
    emoji: "💀",
    markerColor: "red",
    pulse: true,
    integrityDelta: -15,
    headline: "Koramangala ate your contour for breakfast. No survivors.",
    dataBadge: "Cluster of 4 reports within 50m · Severity: High",
    dataLine: "4 potholes reported · avg severity 8.5/10 · last 7 days · community-flagged danger zone",
    location: "Koramangala 4th Block",
  },
};
