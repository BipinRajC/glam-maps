export interface RouteListItem {
  id: string;
  name: string;
  originLabel: string;
  destLabel: string;
  distanceM: number;
  glamScore: number | null;
  scoreBand: string | null;
}

export interface RoutesResponse {
  city: string;
  routes: RouteListItem[];
}

export interface AlertPoint {
  lat: number;
  lng: number;
}

export interface Zone {
  seq: number;
  startDistM: number;
  endDistM: number;
  alertPoint: AlertPoint;
  potholeCount: number;
  intensity: "minor" | "moderate" | "heavy";
  label: string;
  copy: string;
  representativePhotoUrl: string | null;
}

export interface SmoothStretch {
  afterZoneSeq: number;
  startDistM: number;
  endDistM: number;
}

export interface RouteBundle {
  id: string;
  name: string;
  distanceM: number;
  polyline: string;
  glamScore: number;
  scoreBand: string;
  subMetrics?: {
    mascaraStability: number;
    smudgeRisk: number;
    contourConfidence: number;
  };
  zones: Zone[];
  smoothStretches: SmoothStretch[];
}
