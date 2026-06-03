import { useEffect, useState } from "react";
import { fetchRouteBundle, fetchRoutes } from "@/api/client";
import type { RouteBundle, RouteListItem } from "@/api/types";

interface Props {
  onSelect: (route: RouteBundle) => void;
}

export function RoutePicker({ onSelect }: Props) {
  const [routes, setRoutes] = useState<RouteListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRoutes()
      .then((res) => setRoutes(res.routes))
      .catch(() => setError("Could not load routes. Is the API running?"))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = async (id: string) => {
    setSelecting(id);
    try {
      const bundle = await fetchRouteBundle(id);
      onSelect(bundle);
    } catch {
      setError("Could not load route. Please try again.");
      setSelecting(null);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <p style={{ color: "#6B7280" }}>Loading routes…</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 16px", maxWidth: 480, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Glam Maps</h1>
      <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 28 }}>
        Pick your route and check your Glam Score
      </p>

      {error && (
        <p style={{ color: "#DC2626", fontSize: 13, marginBottom: 16 }}>{error}</p>
      )}

      {routes.map((r) => (
        <button
          key={r.id}
          onClick={() => handleSelect(r.id)}
          disabled={selecting !== null}
          style={{
            width: "100%",
            padding: 16,
            marginBottom: 12,
            background: selecting === r.id ? "#F5F3FF" : "white",
            border: "1.5px solid #E5E7EB",
            borderRadius: 14,
            textAlign: "left",
            cursor: selecting ? "default" : "pointer",
            opacity: selecting && selecting !== r.id ? 0.5 : 1,
          }}
        >
          <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{r.name}</p>
          <p style={{ fontSize: 13, color: "#6B7280" }}>
            {(r.distanceM / 1000).toFixed(1)} km
            {r.glamScore !== null && ` · Score ${r.glamScore}`}
            {r.scoreBand && ` · ${r.scoreBand}`}
          </p>
        </button>
      ))}

      {routes.length === 0 && !error && (
        <p style={{ color: "#6B7280", fontSize: 14, textAlign: "center", marginTop: 40 }}>
          No routes available yet. Run the precompute job first.
        </p>
      )}
    </div>
  );
}
