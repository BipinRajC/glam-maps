interface Props {
  score: number;
}

export function ScoreDial({ score }: Props) {
  const r = 70;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;

  return (
    <svg width={180} height={180} viewBox="0 0 180 180">
      <circle cx={90} cy={90} r={r} fill="none" stroke="#E5E7EB" strokeWidth={12} />
      <circle
        cx={90}
        cy={90}
        r={r}
        fill="none"
        stroke="#7C3AED"
        strokeWidth={12}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 90 90)"
        style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
      />
      <text x={90} y={86} textAnchor="middle" fontSize={38} fontWeight="bold" fill="#1F2937">
        {score}
      </text>
      <text x={90} y={112} textAnchor="middle" fontSize={14} fill="#6B7280">
        / 100
      </text>
    </svg>
  );
}
