"use client";

import Image from "next/image";

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
  const sizeClass = size === "sm" ? "text-xs px-2.5 py-1" : "text-sm px-3 py-1.5";
  const logoSize = size === "sm" ? 14 : 18;

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${sizeClass} rounded-full font-inter font-medium border`}
      style={{
        background: "rgba(99, 102, 241, 0.08)",
        borderColor: "rgba(99, 102, 241, 0.22)",
        color: "#4c4876",
      }}
    >
      <Image
        src="/nammapothole-logo.png"
        alt="Namma Pothole"
        width={logoSize}
        height={logoSize}
        className="rounded-sm object-contain"
        style={{ opacity: 0.85 }}
      />
      {label}
    </span>
  );
}
