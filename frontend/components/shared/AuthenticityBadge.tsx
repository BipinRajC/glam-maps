"use client";

interface AuthenticityBadgeProps {
  text?: string;
  variant?: "namma" | "verified" | "powered";
  size?: "sm" | "md";
}

export default function AuthenticityBadge({
  text,
  variant = "namma",
  size = "sm",
}: AuthenticityBadgeProps) {
  const defaultTexts = {
    namma: "Powered by Namma Pothole",
    verified: "Verified Road Insight",
    powered: "Powered by real Bengaluru road data",
  };

  const label = text ?? defaultTexts[variant];
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1 ${sizeClass} rounded-full font-inter font-medium border`}
      style={{
        background: "rgba(249, 168, 37, 0.12)",
        borderColor: "rgba(249, 168, 37, 0.35)",
        color: "#F9A825",
      }}
    >
      🗺️ {label}
    </span>
  );
}
