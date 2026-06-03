interface Props {
  copy: string;
  intensity: "minor" | "moderate" | "heavy";
  photoUrl: string | null;
  distanceAhead: number;
  onDismiss: () => void;
}

const COLORS = {
  minor: { bg: "#FEF3C7", border: "#F59E0B" },
  moderate: { bg: "#FED7AA", border: "#EA580C" },
  heavy: { bg: "#FECACA", border: "#DC2626" },
};

export function AlertBanner({ copy, intensity, photoUrl, distanceAhead, onDismiss }: Props) {
  const { bg, border } = COLORS[intensity];
  const text = copy.replace("{dist}", String(distanceAhead));

  return (
    <div
      role="alert"
      onClick={onDismiss}
      style={{
        position: "fixed",
        bottom: 80,
        left: 16,
        right: 16,
        background: bg,
        border: `2px solid ${border}`,
        borderRadius: 16,
        padding: 16,
        zIndex: 1000,
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {photoUrl && (
          <img
            src={photoUrl}
            alt="Pothole"
            style={{ width: 56, height: 56, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
          />
        )}
        <p style={{ fontSize: 15, fontWeight: 600, flex: 1, lineHeight: 1.4 }}>{text}</p>
      </div>
    </div>
  );
}
