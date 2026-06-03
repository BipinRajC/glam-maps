import type { SmoothStretch, Zone } from "@/api/types";

const ALERT_PROXIMITY_M = 100;

export interface AlertEvent {
  type: "zone" | "smooth";
  zone?: Zone;
  smoothStretch?: SmoothStretch;
  distanceAhead?: number;
}

export class ProximityEngine {
  private readonly zones: Zone[];
  private readonly smoothStretches: SmoothStretch[];
  private firedZones = new Set<number>();
  private lastSmoothAt = -Infinity;
  private callback: ((event: AlertEvent) => void) | null = null;

  constructor(zones: Zone[], smoothStretches: SmoothStretch[]) {
    this.zones = zones;
    this.smoothStretches = smoothStretches;
  }

  onAlert(callback: (event: AlertEvent) => void): void {
    this.callback = callback;
  }

  tick(distAlongM: number): void {
    // Zone alerts: fire once per zone when within 100m ahead
    for (const zone of this.zones) {
      if (this.firedZones.has(zone.seq)) continue;
      const ahead = zone.startDistM - distAlongM;
      if (ahead > 0 && ahead <= ALERT_PROXIMITY_M) {
        this.firedZones.add(zone.seq);
        this.callback?.({ type: "zone", zone, distanceAhead: Math.round(ahead) });
        return;
      }
    }

    // Smooth stretch: throttle to once per 500m
    if (distAlongM - this.lastSmoothAt < 500) return;

    const nextZone = this.zones.find(
      (z) => !this.firedZones.has(z.seq) && z.startDistM > distAlongM
    );
    const noZoneSoon = !nextZone || nextZone.startDistM - distAlongM > 500;

    if (noZoneSoon) {
      const smooth = this.smoothStretches.find(
        (s) => distAlongM >= s.startDistM && distAlongM <= s.endDistM
      );
      if (smooth) {
        this.lastSmoothAt = distAlongM;
        this.callback?.({ type: "smooth", smoothStretch: smooth });
      }
    }
  }

  reset(): void {
    this.firedZones.clear();
    this.lastSmoothAt = -Infinity;
  }
}
