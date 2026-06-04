"use client";

interface GradientBgProps {
  children: React.ReactNode;
  className?: string;
}

export function GradientBackground({ children, className = "" }: GradientBgProps) {
  return (
    <div className={`min-h-screen w-full relative ${className}`}>
      <div
        className="fixed inset-0 z-0"
        style={{
          background: "radial-gradient(125% 125% at 50% 10%, #fff 40%, #6366f1 100%)",
        }}
      />
      <div className="relative z-10 w-full min-h-screen">
        {children}
      </div>
    </div>
  );
}
