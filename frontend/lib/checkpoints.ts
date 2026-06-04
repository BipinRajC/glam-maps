export type HazardType =
  | "smooth"
  | "flyover"
  | "pothole-cluster"
  | "pothole-severe"
  | "construction"
  | "speed-bump";

export interface CheckpointDef {
  id: string;
  collectibleName: string;
  hazardType: HazardType;
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
  highlight_haven: {
    id: "highlight_haven",
    collectibleName: "Highlight Haven",
    hazardType: "flyover",
    emoji: "✨",
    markerColor: "blue",
    pulse: false,
    integrityDelta: +5,
    headline: "Your highlighter is safe here. Flyover energy only.",
    dataBadge: "Verified Road Insight",
    dataLine: "MG Road flyover — 0 pothole reports · smooth surface · OpenStreetMap verified",
    location: "MG Road Flyover",
  },
  glow_preservation: {
    id: "glow_preservation",
    collectibleName: "Glow Preservation Stretch",
    hazardType: "smooth",
    emoji: "💚",
    markerColor: "green",
    pulse: false,
    integrityDelta: +5,
    headline: "Roads this smooth are why Bengaluru women look unbothered.",
    dataBadge: "Powered by Namma Pothole",
    dataLine: "0 community reports in last 30 days · road quality: excellent",
    location: "Ulsoor Smooth Corridor",
  },
  lipstick_checkpoint: {
    id: "lipstick_checkpoint",
    collectibleName: "Lipstick Survival Checkpoint",
    hazardType: "speed-bump",
    emoji: "💄",
    markerColor: "yellow",
    pulse: true,
    integrityDelta: -8,
    headline: "Speed bump. Lipstick has left the building.",
    dataBadge: "Reported by Namma Pothole users",
    dataLine: "1 speed bump reported · 12 confirmations · avg disruption: medium",
    location: "Indiranagar Main Road",
  },
  foundation_risk: {
    id: "foundation_risk",
    collectibleName: "Foundation Risk Zone",
    hazardType: "construction",
    emoji: "🚧",
    markerColor: "orange",
    pulse: true,
    integrityDelta: -10,
    headline: "Construction zone ahead. Your foundation didn't sign up for this.",
    dataBadge: "Cluster of 6 reports within 50m · Severity: High",
    dataLine: "Active construction · 6 pothole reports · avg severity 6.8/10 · last 14 days",
    location: "Domlur Junction",
  },
  mascara_meltdown: {
    id: "mascara_meltdown",
    collectibleName: "Mascara Meltdown Corridor",
    hazardType: "pothole-cluster",
    emoji: "😭",
    markerColor: "red",
    pulse: true,
    integrityDelta: -15,
    headline: "4 potholes in 100m. Even waterproof mascara is crying.",
    dataBadge: "Reported by 7 Namma Pothole users · verified 2 days ago",
    dataLine: "4 potholes reported · avg severity 7.2/10 · last 14 days · cluster radius 80m",
    location: "Richmond Road Pothole Cluster",
  },
  contour_catastrophe: {
    id: "contour_catastrophe",
    collectibleName: "Contour Catastrophe Crossing",
    hazardType: "pothole-severe",
    emoji: "💀",
    markerColor: "red",
    pulse: true,
    integrityDelta: -15,
    headline: "Contour? What contour? Koramangala ate it for breakfast.",
    dataBadge: "Cluster of 4 reports within 50m · Severity: High",
    dataLine: "4 potholes reported · avg severity 8.5/10 · last 7 days · community-flagged danger zone",
    location: "Koramangala 4th Block",
  },
};
