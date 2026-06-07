"use client";

import {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

type MaplibreMap = InstanceType<typeof import("maplibre-gl").Map>;

export interface MapRef {
  flyTo: (options: {
    center: [number, number];
    zoom?: number;
    duration?: number;
    essential?: boolean;
  }) => void;
  easeTo: (options: {
    center: [number, number];
    zoom?: number;
    duration?: number;
    easing?: (t: number) => number;
  }) => void;
  getMap: () => MaplibreMap | null;
}

interface MapProps {
  center?: [number, number];
  zoom?: number;
  projection?: { type: string };
  className?: string;
  children?: React.ReactNode;
  style?: string;
  attributionControl?: boolean;
  interactive?: boolean;
}

export const Map = forwardRef<MapRef, MapProps>(
  (
    {
      center = [0, 0],
      zoom = 1,
      projection,
      className = "",
      children,
      style = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      attributionControl = true,
      interactive = true,
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<MaplibreMap | null>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
      if (!containerRef.current || mapRef.current) return;

      import("maplibre-gl").then((ml) => {
        const map = new ml.Map({
          container: containerRef.current!,
          style,
          center,
          zoom,
          projection,
          attributionControl,
          interactive,
        } as ConstructorParameters<typeof ml.Map>[0]);

        mapRef.current = map;
        map.on("load", () => setLoaded(true));
      });

      return () => {
        mapRef.current?.remove();
        mapRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useImperativeHandle(ref, () => ({
      flyTo(options) {
        mapRef.current?.flyTo(options);
      },
      easeTo(options) {
        mapRef.current?.easeTo(options);
      },
      getMap() {
        return mapRef.current;
      },
    }));

    return (
      <div className={`relative ${className}`}>
        <div ref={containerRef} className="absolute inset-0" />
        {loaded && children}
      </div>
    );
  },
);

Map.displayName = "Map";
