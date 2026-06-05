export function haversineMeters(from: [number, number], to: [number, number]): number {
  const R = 6371000;
  const [lng1, lat1] = from;
  const [lng2, lat2] = to;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}

export function polylineDistanceM(polyline: [number, number][]): number {
  let total = 0;
  for (let i = 1; i < polyline.length; i++) {
    total += haversineMeters(polyline[i - 1], polyline[i]);
  }
  return total;
}

export function estimateTimeMinutes(distanceM: number): number {
  const avgSpeedKmh = 22;
  return Math.round((distanceM / 1000 / avgSpeedKmh) * 60);
}

export function generateCheckpointsAlongRoute(
  start: [number, number],
  end: [number, number],
  spacingM: number = 2000
): [number, number][] {
  const dist = haversineMeters(start, end);
  const count = Math.max(1, Math.floor(dist / spacingM));
  const points: [number, number][] = [];
  for (let i = 1; i <= count; i++) {
    const t = i / (count + 1);
    const lng = start[0] + (end[0] - start[0]) * t;
    const lat = start[1] + (end[1] - start[1]) * t;
    points.push([lng, lat]);
  }
  return points;
}

export function formatDistance(distanceM: number | null): string {
  if (distanceM === null) return "--";
  if (distanceM >= 1000) return `${(distanceM / 1000).toFixed(1)} km`;
  return `${distanceM} m`;
}
