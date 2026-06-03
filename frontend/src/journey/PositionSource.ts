export interface PositionTick {
  distAlongM: number;
  lat: number;
  lng: number;
  fraction: number;
}

export interface PositionSource {
  start(): void;
  stop(): void;
  onTick(callback: (tick: PositionTick) => void): void;
}
