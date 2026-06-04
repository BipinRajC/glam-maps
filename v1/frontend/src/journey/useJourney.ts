import { useCallback, useEffect, useRef, useState } from "react";
import type { RouteBundle } from "@/api/types";
import { config } from "@/config";
import { GpsSource } from "./GpsSource";
import type { PositionSource, PositionTick } from "./PositionSource";
import { ProximityEngine, type AlertEvent } from "./ProximityEngine";
import { SimulatedSource } from "./SimulatedSource";

function decodePolyline(encoded: string): Array<{ lat: number; lng: number }> {
  const points: Array<{ lat: number; lng: number }> = [];
  let index = 0;
  let lat = 0;
  let lng = 0;
  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte: number;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;
    shift = 0;
    result = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;
    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return points;
}

export function useJourney(route: RouteBundle, onComplete: () => void) {
  const [position, setPosition] = useState<PositionTick | null>(null);
  const [alert, setAlert] = useState<AlertEvent | null>(null);
  const [running, setRunning] = useState(false);
  const sourceRef = useRef<PositionSource | null>(null);

  const start = useCallback(() => {
    const path = decodePolyline(route.polyline);
    const source: PositionSource =
      config.journeyDefaultMode === "gps"
        ? new GpsSource(path, route.distanceM)
        : new SimulatedSource(path, route.distanceM);

    const engine = new ProximityEngine(route.zones, route.smoothStretches);
    engine.onAlert((evt) => setAlert(evt));

    source.onTick((tick) => {
      setPosition(tick);
      engine.tick(tick.distAlongM);
      if (tick.fraction >= 1) {
        source.stop();
        setRunning(false);
        onComplete();
      }
    });

    sourceRef.current = source;
    setRunning(true);
    source.start();
  }, [route, onComplete]);

  const stop = useCallback(() => {
    sourceRef.current?.stop();
    setRunning(false);
  }, []);

  const dismissAlert = useCallback(() => setAlert(null), []);

  useEffect(() => {
    return () => sourceRef.current?.stop();
  }, []);

  return { position, alert, running, start, stop, dismissAlert };
}
