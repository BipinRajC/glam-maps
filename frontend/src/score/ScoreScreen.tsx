import type { RouteBundle } from "@/api/types";
import { ScoreDial } from "./ScoreDial";

interface Props {
  route: RouteBundle;
}

export function ScoreScreen({ route }: Props) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "linear-gradient(180deg, #F5F3FF 0%, #FFFFFF 100%)",
      }}
    >
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Your Glam Score</h1>
      <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 28 }}>{route.name}</p>

      <ScoreDial score={route.glamScore} />

      <p
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: "#7C3AED",
          marginTop: 20,
          marginBottom: 8,
        }}
      >
        {route.scoreBand}
      </p>

      {route.subMetrics && (
        <div
          style={{
            display: "flex",
            gap: 24,
            marginBottom: 28,
            fontSize: 13,
            color: "#6B7280",
          }}
        >
          <span>Mascara {route.subMetrics.mascaraStability}</span>
          <span>Smudge {route.subMetrics.smudgeRisk}</span>
          <span>Contour {route.subMetrics.contourConfidence}</span>
        </div>
      )}

      <p
        style={{
          fontSize: 12,
          color: "#9CA3AF",
          textAlign: "center",
          marginBottom: 32,
          maxWidth: 280,
        }}
      >
        Indicative, for fun — based on {route.zones.length} pothole zone
        {route.zones.length !== 1 ? "s" : ""} on your route
      </p>

      <button
        style={{
          width: "100%",
          maxWidth: 320,
          padding: "14px 24px",
          background: "#7C3AED",
          color: "white",
          border: "none",
          borderRadius: 12,
          fontSize: 16,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Unlock Flipkart Glam Deals
      </button>
    </div>
  );
}
