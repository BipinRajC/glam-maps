import { useState } from "react";
import type { RouteBundle } from "@/api/types";
import { AlertBanner } from "@/alerts/AlertBanner";
import { SmoothBanner } from "@/alerts/SmoothBanner";
import { useJourney } from "@/journey/useJourney";
import { MapView } from "@/map/MapView";
import { useGoogleMaps } from "@/map/useGoogleMaps";
import { WhatsAppOptIn } from "@/wa/WhatsAppOptIn";

interface Props {
  route: RouteBundle;
  onComplete: () => void;
}

export function JourneyScreen({ route, onComplete }: Props) {
  const mapsReady = useGoogleMaps();
  const { position, alert, running, start, dismissAlert } = useJourney(route, onComplete);
  const [showWaOptIn, setShowWaOptIn] = useState(false);
  const [_waSessionId, setWaSessionId] = useState<string | null>(null);

  const handleStart = () => {
    setShowWaOptIn(true);
  };

  const handleWaSubscribed = (sessionId: string) => {
    setWaSessionId(sessionId);
    setShowWaOptIn(false);
    start();
  };

  const handleWaSkip = () => {
    setShowWaOptIn(false);
    start();
  };

  if (!mapsReady) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <p style={{ color: "#6B7280" }}>Loading map…</p>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <MapView encodedPolyline={route.polyline} position={position} zones={route.zones} />

      {/* Progress bar */}
      {running && position && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "#E5E7EB",
            zIndex: 900,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${position.fraction * 100}%`,
              background: "#7C3AED",
              transition: "width 0.2s linear",
            }}
          />
        </div>
      )}

      {/* Route info pill */}
      {running && position && (
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            right: 16,
            background: "rgba(255,255,255,0.95)",
            borderRadius: 12,
            padding: "10px 16px",
            zIndex: 900,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 600 }}>{route.name}</span>
          <span style={{ fontSize: 13, color: "#6B7280" }}>
            {(position.distAlongM / 1000).toFixed(1)} / {(route.distanceM / 1000).toFixed(1)} km
          </span>
        </div>
      )}

      {/* Start button */}
      {!running && !position && !showWaOptIn && (
        <div
          style={{
            position: "absolute",
            bottom: 32,
            left: 16,
            right: 16,
            zIndex: 900,
          }}
        >
          <p style={{ fontSize: 18, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>
            {route.name}
          </p>
          {route.glamScore !== null && (
            <p style={{ fontSize: 14, color: "#7C3AED", textAlign: "center", marginBottom: 16 }}>
              Glam Score {route.glamScore} · {route.scoreBand}
            </p>
          )}
          <button
            onClick={handleStart}
            style={{
              width: "100%",
              padding: 16,
              background: "#7C3AED",
              color: "white",
              border: "none",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Start Journey
          </button>
        </div>
      )}

      {/* Zone alert */}
      {alert?.type === "zone" && alert.zone && (
        <AlertBanner
          copy={alert.zone.copy}
          intensity={alert.zone.intensity}
          photoUrl={alert.zone.representativePhotoUrl}
          distanceAhead={alert.distanceAhead ?? 0}
          onDismiss={dismissAlert}
        />
      )}

      {/* Smooth stretch */}
      {alert?.type === "smooth" && alert.smoothStretch && (
        <SmoothBanner
          lengthM={alert.smoothStretch.endDistM - alert.smoothStretch.startDistM}
          onDismiss={dismissAlert}
        />
      )}

      {/* WhatsApp opt-in */}
      {showWaOptIn && (
        <WhatsAppOptIn
          routeId={route.id}
          onSubscribed={handleWaSubscribed}
          onSkip={handleWaSkip}
        />
      )}
    </div>
  );
}
