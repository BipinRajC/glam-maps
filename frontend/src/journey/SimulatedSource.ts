import type { PositionSource, PositionTick } from "./PositionSource";

interface Coord {
  lat: number;
  lng: number;
  distM: number;
}

export class SimulatedSource implements PositionSource {
  private callback: ((tick: PositionTick) => void) | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private distAlongM = 0;
  private readonly totalDistM: number;
  private readonly speedMps: number;
  private readonly intervalMs = 200;
  private readonly coords: Coord[];

  constructor(
    decodedPath: Array<{ lat: number; lng: number }>,
    totalDistM: number,
    speedKmh = 30
  ) {
    this.totalDistM = totalDistM;
    this.speedMps = (speedKmh * 1000) / 3600;

    let cumDist = 0;
    this.coords = [{ ...decodedPath[0], distM: 0 }];
    for (let i = 1; i < decodedPath.length; i++) {
      const dlat = decodedPath[i].lat - decodedPath[i - 1].lat;
      const dlng = decodedPath[i].lng - decodedPath[i - 1].lng;
      cumDist += Math.sqrt(dlat * dlat + dlng * dlng) * 111_320;
      this.coords.push({ ...decodedPath[i], distM: cumDist });
    }
  }

  onTick(callback: (tick: PositionTick) => void): void {
    this.callback = callback;
  }

  start(): void {
    this.distAlongM = 0;
    this.timer = setInterval(() => {
      this.distAlongM += this.speedMps * (this.intervalMs / 1000);
      if (this.distAlongM >= this.totalDistM) {
        this.distAlongM = this.totalDistM;
        this.stop();
      }
      const pos = this._interpolate(this.distAlongM);
      this.callback?.({
        distAlongM: this.distAlongM,
        lat: pos.lat,
        lng: pos.lng,
        fraction: this.totalDistM > 0 ? this.distAlongM / this.totalDistM : 1,
      });
    }, this.intervalMs);
  }

  stop(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private _interpolate(dist: number): { lat: number; lng: number } {
    for (let i = 1; i < this.coords.length; i++) {
      if (this.coords[i].distM >= dist) {
        const prev = this.coords[i - 1];
        const curr = this.coords[i];
        const segLen = curr.distM - prev.distM;
        const t = segLen > 0 ? (dist - prev.distM) / segLen : 0;
        return {
          lat: prev.lat + t * (curr.lat - prev.lat),
          lng: prev.lng + t * (curr.lng - prev.lng),
        };
      }
    }
    const last = this.coords[this.coords.length - 1];
    return { lat: last.lat, lng: last.lng };
  }
}
