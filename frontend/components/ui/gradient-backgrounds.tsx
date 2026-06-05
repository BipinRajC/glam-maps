"use client";

import MapCanvas from "@/components/MapCanvas";

interface GradientBgProps {
  children: React.ReactNode;
  className?: string;
  mapOpacity?: number;
}

export function GradientBackground({ children, className = "", mapOpacity = 0.12 }: GradientBgProps) {
  return (
    <div className={`min-h-dvh w-full relative overflow-hidden ${className}`}>
      {/* Static white base */}
      <div className="absolute inset-0 z-0" style={{ background: "#fff" }} />
      {/* Non-journey map backdrop */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ opacity: mapOpacity, filter: "blur(0.5px) grayscale(0.2)" }}
      >
        <MapCanvas
          className="w-full h-full"
          initialCenter={[77.5946, 12.9716]}
          initialZoom={11}
          interactive={false}
        />
      </div>
      {/* Pulsating pink radial gradient — very subtle so map shows through */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(125% 125% at 50% 90%, rgba(255,255,255,0.05) 40%, rgba(236,72,153,0.65) 100%)",
          animation: "glam-pulse 4s ease-in-out infinite",
        }}
      />
      <div className="relative z-10 w-full min-h-dvh">
        {children}
      </div>
    </div>
  );
}
