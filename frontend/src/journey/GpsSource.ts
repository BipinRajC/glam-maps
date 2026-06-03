import type { PositionSource, PositionTick } from "./PositionSource";

interface Coord {
  lat: number;
  lng: number;
  distM: number;
}

export class GpsSource implements PositionSource {
  private callback: ((tick: PositionTick) => void) | null = null;
  private watchId: number | null = null;
  private wakeLock: WakeLockSentinel | null = null;
  private audio: HTMLAudioElement | null = null;
  private readonly coords: Coord[];
  private readonly totalDistM: number;

  constructor(
    decodedPath: Array<{ lat: number; lng: number }>,
    totalDistM: number
  ) {
    this.totalDistM = totalDistM;
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

  async start(): Promise<void> {
    try {
      this.wakeLock = await navigator.wakeLock.request("screen");
    } catch {
      // WakeLock not supported in all WebViews — silent fail, simulated is primary
    }

    // Silent audio loop to keep GPS alive in background on Android WebView
    this.audio = new Audio();
    this.audio.src =
      "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
    this.audio.loop = true;
    this.audio.volume = 0;
    this.audio.play().catch(() => {});

    this.watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const distAlong = this._project(pos.coords.latitude, pos.coords.longitude);
        this.callback?.({
          distAlongM: distAlong,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          fraction: this.totalDistM > 0 ? distAlong / this.totalDistM : 0,
        });
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 2000 }
    );
  }

  stop(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.wakeLock?.release().catch(() => {});
    this.audio?.pause();
  }

  private _project(lat: number, lng: number): number {
    let bestDist = Infinity;
    let bestAlongM = 0;
    for (const c of this.coords) {
      const d = Math.sqrt((lat - c.lat) ** 2 + (lng - c.lng) ** 2) * 111_320;
      if (d < bestDist) {
        bestDist = d;
        bestAlongM = c.distM;
      }
    }
    return bestAlongM;
  }
}
