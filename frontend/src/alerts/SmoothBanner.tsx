const COPIES = [
  "Clear road for {len}m — time for that winged liner",
  "Smooth stretch ahead — go for the bold lip",
];

interface Props {
  lengthM: number;
  onDismiss: () => void;
}

export function SmoothBanner({ lengthM, onDismiss }: Props) {
  const copy = COPIES[Math.floor(Math.random() * COPIES.length)].replace(
    "{len}",
    String(Math.round(lengthM))
  );

  return (
    <div
      role="status"
      onClick={onDismiss}
      style={{
        position: "fixed",
        bottom: 80,
        left: 16,
        right: 16,
        background: "#D1FAE5",
        border: "2px solid #10B981",
        borderRadius: 16,
        padding: 16,
        zIndex: 1000,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        cursor: "pointer",
      }}
    >
      <p style={{ fontSize: 15, fontWeight: 600 }}>{copy}</p>
    </div>
  );
}
