import rawWaypoints from "../../backend/seed/waypoints.json";
import { WAYPOINT_META } from "./waypointMeta";
import { haversineMeters, formatDistance } from "./routeCalc";
import type { GlamRoute, Difficulty } from "./routes";

export type Waypoint = {
  id: string;
  name: string;
  area: string;
  vibe: string;
  lat: number;
  lng: number;
};

export type WaypointView = Waypoint & {
  emoji: string;
  popularity: number;
  distanceM: number | null;
  distanceLabel: string;
};

export const WAYPOINTS: Waypoint[] = rawWaypoints as Waypoint[];

export function withMeta(w: Waypoint): Waypoint & { emoji: string; popularity: number } {
  const meta = WAYPOINT_META[w.id] ?? { emoji: "📍", popularity: 0 };
  return { ...w, emoji: meta.emoji, popularity: meta.popularity };
}

export function withDistance(
  w: Waypoint,
  origin: [number, number] | null,
): WaypointView {
  const base = withMeta(w);
  if (!origin) return { ...base, distanceM: null, distanceLabel: "" };
  const distanceM = haversineMeters(origin, [w.lng, w.lat]);
  return { ...base, distanceM, distanceLabel: formatDistance(distanceM) };
}

export function pickNearest(
  origin: [number, number] | null,
  pool: Waypoint[],
  minDistanceM = 0,
): Waypoint | null {
  if (!origin) return null;
  let best: Waypoint | null = null;
  let bestM = Infinity;
  for (const w of pool) {
    const d = haversineMeters(origin, [w.lng, w.lat]);
    if (d < minDistanceM) continue;
    if (d < bestM) { bestM = d; best = w; }
  }
  return best;
}

export function pickTrending(
  pool: Waypoint[],
  excludeId: string | null,
  count = 4,
  seed = 0,
): Waypoint[] {
  const filtered = excludeId ? pool.filter((w) => w.id !== excludeId) : pool;
  const ranked = [...filtered].sort((a, b) => {
    const pa = WAYPOINT_META[a.id]?.popularity ?? 0;
    const pb = WAYPOINT_META[b.id]?.popularity ?? 0;
    if (pb !== pa) return pb - pa;
    return a.area.localeCompare(b.area) || a.name.localeCompare(b.name);
  });
  if (ranked.length <= count) return ranked;

  const candidateCount = Math.min(ranked.length, count * 2);
  const candidates = ranked.slice(0, candidateCount);
  const offset = ((seed % candidateCount) + candidateCount) % candidateCount;
  const rotated = [...candidates.slice(offset), ...candidates.slice(0, offset)];
  return rotated.slice(0, count);
}

export function pickFallbackSpotlight(pool: Waypoint[]): Waypoint {
  const top = pickTrending(pool, null, 1);
  return top[0] ?? pool[0];
}

export const CURRENT_LOCATION: Omit<Waypoint, "lat" | "lng"> & {
  id: "__current__";
} = {
  id: "__current__",
  name: "Current Location",
  area: "Detected via GPS",
  vibe: "We'll plot from where you are.",
};

export function synthesizeRoute(
  pickup: Waypoint,
  destination: Waypoint,
  userLocation: [number, number] | null = null,
): GlamRoute {
  const pickupCoords: [number, number] =
    pickup.id === "__current__" && userLocation
      ? [userLocation[0], userLocation[1]]
      : [pickup.lng, pickup.lat];
  const destCoords: [number, number] = [destination.lng, destination.lat];

  const destinationEmoji = WAYPOINT_META[destination.id]?.emoji ?? "📍";
  const destinationPopularity = WAYPOINT_META[destination.id]?.popularity ?? 0;
  const distanceKm = haversineMeters(pickupCoords, destCoords) / 1000;

  const difficulty: Difficulty =
    distanceKm < 8 ? "Easy" : distanceKm < 20 ? "Medium" : "Survival Mode";

  return {
    id: `dynamic-${pickup.id}-${destination.id}`,
    glamName: destination.name,
    realName: destination.area,
    personality: "Your Custom Slay Route",
    difficulty,
    emoji: destinationEmoji,
    description: destination.vibe,
    roadScore: Math.min(100, Math.round(destinationPopularity * 0.9 + 10)),
    integrityEnd: difficulty === "Survival Mode" ? 60 : difficulty === "Medium" ? 78 : 90,
    polyline: [pickupCoords, destCoords],
    startCoords: pickupCoords,
    endCoords: destCoords,
    checkpoints: [],
    stats: {
      potholeCount: 0,
      hazardZones: 0,
      smoothCorridors: 0,
      worstStretch: "—",
      smoothestStretch: "—",
      communityReports: 0,
    },
  };
}
