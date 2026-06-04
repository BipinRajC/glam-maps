"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ROUTES } from "@/lib/routes";

interface DemoControlsProps {
  onJumpJourney: (routeId: string) => void;
  onJumpArrival: () => void;
}

// 5-tap secret to reveal the panel (touch friendly for live demos)
export default function DemoControls({ onJumpJourney, onJumpArrival }: DemoControlsProps) {
  const [tapCount, setTapCount] = useState(0);
  const [visible, setVisible] = useState(false);

  function handleSecretTap() {
    const next = tapCount + 1;
    setTapCount(next);
    if (next >= 5) {
      setVisible(true);
      setTapCount(0);
    }
  }

  return (
    <>
      {/* Invisible tap zone — top-right corner */}
      <button
        className="absolute top-0 right-0 w-12 h-12 z-50 opacity-0"
        onClick={handleSecretTap}
        aria-hidden="true"
        tabIndex={-1}
      />

      <AnimatePresence>
        {visible && (
          <motion.div
            className="absolute bottom-4 left-3 right-3 z-[999] glass-dark px-4 py-4 rounded-2xl"
            style={{ border: "1px solid rgba(249,168,37,0.4)" }}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 18 }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-inter text-xs font-bold text-gold">🎬 Demo Safety Controls</span>
              <button
                className="text-cream/40 text-xs font-inter underline"
                onClick={() => setVisible(false)}
              >
                hide
              </button>
            </div>

            <p className="font-inter text-xs text-champagne/50 mb-3">
              Keyboard: Shift+D → Journey · Shift+A → Arrival
            </p>

            <div className="flex flex-col gap-2">
              {Object.values(ROUTES).map((route) => (
                <button
                  key={route.id}
                  className="w-full py-2.5 rounded-xl font-inter text-sm font-semibold text-cream text-left px-3"
                  style={{ background: "rgba(194,24,91,0.2)", border: "1px solid rgba(194,24,91,0.3)" }}
                  onClick={() => { onJumpJourney(route.id); setVisible(false); }}
                >
                  ▶ {route.emoji} {route.glamName} ({route.difficulty})
                </button>
              ))}
              <button
                className="w-full py-2.5 rounded-xl font-inter text-sm font-semibold text-cream text-left px-3"
                style={{ background: "rgba(249,168,37,0.2)", border: "1px solid rgba(249,168,37,0.3)" }}
                onClick={() => { onJumpArrival(); setVisible(false); }}
              >
                🏆 Jump to Arrival Screen
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
