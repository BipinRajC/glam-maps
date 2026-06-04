"use client";

interface GradientBgProps {
  children: React.ReactNode;
  className?: string;
}

export function GradientBackground({ children, className = "" }: GradientBgProps) {
  return (
    <div className={`min-h-screen w-full relative ${className}`}>
      {/* Static white base */}
      <div className="fixed inset-0 z-0" style={{ background: "#fff" }} />
      {/* Pulsating pink radial gradient */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: "radial-gradient(125% 125% at 50% 90%, rgba(255,255,255,0) 40%, #ec4899 100%)",
          animation: "glam-pulse 4s ease-in-out infinite",
        }}
      />
      <div className="relative z-10 w-full min-h-screen">
        {children}
      </div>
    </div>
  );
}
